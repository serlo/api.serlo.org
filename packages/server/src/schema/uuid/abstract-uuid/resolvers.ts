import * as auth from '@serlo/authorization'
import { option as O } from 'fp-ts'
import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { date } from 'io-ts-types/lib/date'
import * as R from 'ramda'

import { createCachedResolver } from '~/cached-resolver'
import { resolveCustomId } from '~/config'
import { Context } from '~/context'
import { UserInputError } from '~/errors'
import {
  assertUserIsAuthenticated,
  assertUserIsAuthorized,
  createNamespace,
  Model,
} from '~/internals/graphql'
import { DatabaseLayer } from '~/model'
import {
  UuidDecoder,
  DiscriminatorType,
  EntityTypeDecoder,
  CommentStatusDecoder,
  InstanceDecoder,
  EntityRevisionDecoder,
  PageRevisionDecoder,
  NotificationEventType,
  EntityType,
} from '~/model/decoder'
import { createEvent } from '~/schema/events/event'
import { SubjectResolver } from '~/schema/subject/resolvers'
import { decodePath, encodePath } from '~/schema/uuid/alias/utils'
import { Resolvers, QueryUuidArgs, TaxonomyTermType } from '~/types'

export const UuidResolver = createCachedResolver<
  { id: number },
  Model<'AbstractUuid'> | null
>({
  name: 'UuidResolver',
  decoder: t.union([t.null, UuidDecoder]),
  enableSwr: true,
  staleAfter: { days: 1 },
  maxAge: { days: 7 },
  getKey: ({ id }) => {
    return `de.serlo.org/api/uuid/${id}`
  },
  getPayload: (key) => {
    if (!key.startsWith('de.serlo.org/api/uuid/')) return O.none
    const id = parseInt(key.replace('de.serlo.org/api/uuid/', ''), 10)
    return O.some({ id })
  },
  getCurrentValue: resolveUuidFromDatabase,
  examplePayload: { id: 1 },
})

export const resolvers: Resolvers = {
  AbstractUuid: {
    __resolveType(uuid) {
      return uuid.__typename
    },
  },
  Query: {
    async uuid(_parent, payload, context) {
      const { dataSources } = context
      const id = await resolveIdFromPayload(dataSources, payload)

      if (id === null) return null

      const uuid = await UuidResolver.resolve({ id }, context)

      if (
        payload.alias != null &&
        payload.alias.path.startsWith('/user/profile/') &&
        uuid?.__typename !== DiscriminatorType.User
      )
        return null

      return uuid
    },
  },
  Mutation: {
    uuid: createNamespace(),
  },
  UuidMutation: {
    async setState(_parent, payload, context) {
      const { userId } = context
      const { id, trashed } = payload.input
      const ids = id

      assertUserIsAuthenticated(userId)

      const objects = await Promise.all(
        ids.map((id) => UuidResolver.resolve({ id }, context)),
      )

      const transaction = await database.beginTransaction()

      try {
        for (const object of objects) {
          if (
            object === null ||
            object.__typename === DiscriminatorType.Comment ||
            object.__typename === DiscriminatorType.User ||
            EntityRevisionDecoder.is(object) ||
            PageRevisionDecoder.is(object)
          ) {
            throw new UserInputError(
              'One of the provided ids cannot be deleted',
            )
          }

          const scope = auth.instanceToScope(object.instance)
          const type = EntityTypeDecoder.is(object)
            ? 'Entity'
            : object.__typename === DiscriminatorType.Page
              ? 'Page'
              : 'TaxonomyTerm'

          await assertUserIsAuthorized({
            guard: auth.Uuid.setState(type)(scope),
            message:
              'You are not allowed to set the state of the provided UUID(s).',
            context,
          })

          await setUuidState({ id: object.id, trashed }, context)

          await createEvent(
            {
              __typename: NotificationEventType.SetUuidState,
              actorId: userId,
              instance: object.instance,
              objectId: object.id,
              trashed,
            },
            context,
          )
        }

        await transaction.commit()

        await UuidResolver.removeCacheEntries(
          ids.map((id) => ({ id }), context),
          context,
        )

        return { success: true, query: {} }
      } finally {
        await transaction.rollback()
      }
    },
  },
}

// TODO: Move to util file databse.ts
const Tinyint = t.union([t.literal(0), t.literal(1)])

const BaseUuid = t.type({
  id: t.number,
  trashed: Tinyint,
})

const WeightedNumberList = t.record(
  t.union([t.literal('__no_key'), t.string]),
  t.union([t.null, t.number]),
)

type DBEntityType = t.TypeOf<typeof DBEntityType>
const DBEntityType = t.union([
  t.literal('applet'),
  t.literal('article'),
  t.literal('course'),
  t.literal('course-page'),
  t.literal('event'),
  t.literal('text-exercise'),
  t.literal('text-exercise-group'),
  t.literal('video'),
])

const BaseEntity = t.intersection([
  BaseUuid,
  t.type({
    discriminator: t.literal('entity'),
    entityInstance: InstanceDecoder,
    entityLicenseId: t.number,
    entityCurrentRevisionId: t.union([t.null, t.number]),
    entityDate: date,
    entityType: DBEntityType,
    entityRevisionIds: WeightedNumberList,
    entityTaxonomyIds: WeightedNumberList,
    entityTitle: t.union([t.string, t.null]),
    entityChildrenIds: WeightedNumberList,
    entityParentId: t.union([t.null, t.number]),
  }),
])

const BaseComment = t.intersection([
  BaseUuid,
  t.type({
    discriminator: t.literal('comment'),
    commentAuthorId: t.number,
    commentTitle: t.string,
    commentDate: date,
    commentArchived: Tinyint,
    commentContent: t.string,
    commentParentUuid: t.union([t.number, t.null]),
    commentParentCommentId: t.union([t.number, t.null]),
    commentStatus: t.union([CommentStatusDecoder, t.null]),
    commentChildrenIds: WeightedNumberList,
  }),
])

const BaseTaxonomy = t.intersection([
  BaseUuid,
  t.type({
    discriminator: t.literal('taxonomyTerm'),
    taxonomyInstance: InstanceDecoder,
    taxonomyType: t.string,
    taxonomyName: t.string,
    taxonomyDescription: t.union([t.null, t.string]),
    taxonomyWeight: t.union([t.null, t.number]),
    taxonomyId: t.number,
    taxonomyParentId: t.union([t.null, t.number]),
    taxonomyChildrenIds: WeightedNumberList,
    taxonomyEntityChildrenIds: WeightedNumberList,
  }),
])

async function resolveUuidFromDatabase(
  { id }: { id: number },
  context: Pick<Context, 'database' | 'timer' | 'swrQueue' | 'cache'>,
): Promise<Model<'AbstractUuid'> | null> {
  const baseUuid = await context.database.fetchOptional(
    `
    select
        uuid.id as id,
        uuid.trashed,
        uuid.discriminator,

        entity_instance.subdomain as entityInstance,
        entity.license_id as entityLicenseId,
        entity.current_revision_id as entityCurrentRevisionId,
        entity.date as entityDate,
        entity_type.name as entityType,
        JSON_OBJECTAGG(
          COALESCE(entity_revision.id, "__no_key"),
          entity_revision.id
        ) as entityRevisionIds,
        JSON_OBJECTAGG(
          COALESCE(entity_taxonomy.term_taxonomy_id, "__no_key"),
          entity_taxonomy.term_taxonomy_id
        ) as entityTaxonomyIds,
        current_revision.title as entityTitle,
        JSON_OBJECTAGG(
          COALESCE(entity_link_child.child_id, "__no_key"),
          entity_link_child.order
        ) as entityChildrenIds,
        MIN(entity_link_parent.parent_id) as entityParentId,

        comment.author_id as commentAuthorId,
        comment.title as commentTitle,
        comment.date as commentDate,
        comment.archived as commentArchived,
        comment.content as commentContent,
        comment.parent_id as commentParentCommentId,
        comment.uuid_id as commentParentUuid,
        JSON_OBJECTAGG(
          COALESCE(comment_children.id, "__no_key"),
          comment_children.id
        ) as commentChildrenIds,
        comment_status.name as commentStatus,

        taxonomy_type.name as taxonomyType,
        taxonomy_instance.subdomain as taxonomyInstance,
        term.name as taxonomyName,
        term_taxonomy.description as taxonomyDescription,
        term_taxonomy.weight as taxonomyWeight,
        taxonomy.id as taxonomyId,
        term_taxonomy.parent_id as taxonomyParentId,
        JSON_OBJECTAGG(
          COALESCE(taxonomy_child.id, "__no_key"),
          taxonomy_child.weight
        ) as taxonomyChildrenIds,
        JSON_OBJECTAGG(
          COALESCE(term_taxonomy_entity.entity_id, "__no_key"),
          term_taxonomy_entity.position
        ) as taxonomyEntityChildrenIds
      from uuid

      left join entity on entity.id = uuid.id
      left join instance entity_instance on entity_instance.id = entity.instance_id
      left join type entity_type on entity_type.id = entity.type_id
      left join entity_revision on entity_revision.repository_id = entity.id
      left join term_taxonomy_entity entity_taxonomy on entity_taxonomy.entity_id = entity.id
      left join entity_revision current_revision on current_revision.id = entity.current_revision_id
      left join entity_link entity_link_child on entity_link_child.parent_id = entity.id
      left join entity_link entity_link_parent on entity_link_parent.child_id = entity.id

      left join comment on comment.id = uuid.id
      left join comment comment_children on comment_children.parent_id = comment.id
      left join comment_status on comment_status.id = comment.id

      left join term_taxonomy on term_taxonomy.id = uuid.id
      left join taxonomy on taxonomy.id = term_taxonomy.taxonomy_id
      left join type taxonomy_type on taxonomy_type.id = taxonomy.type_id
      left join instance taxonomy_instance on taxonomy_instance.id = taxonomy.instance_id
      left join term on term.id = term_taxonomy.term_id
      left join term_taxonomy taxonomy_child on taxonomy_child.parent_id = term_taxonomy.id
      left join term_taxonomy_entity on term_taxonomy_entity.term_taxonomy_id = term_taxonomy.id

      where uuid.id = ?
      group by uuid.id
    `,
    [id],
  )

  if (BaseUuid.is(baseUuid)) {
    const base = { id: baseUuid.id, trashed: Boolean(baseUuid.trashed) }

    if (BaseEntity.is(baseUuid)) {
      const taxonomyTermIds = getSortedList(baseUuid.entityTaxonomyIds)

      const subject =
        taxonomyTermIds.length > 0
          ? await SubjectResolver.resolve(
              { taxonomyId: taxonomyTermIds[0] },
              context,
            )
          : null
      const subjectName = subject != null ? '/' + toSlug(subject.name) : ''
      const slugTitle = baseUuid.entityTitle
        ? toSlug(baseUuid.entityTitle)
        : baseUuid.id

      const entity = {
        ...base,
        instance: baseUuid.entityInstance,
        date: baseUuid.entityDate.toISOString(),
        licenseId: baseUuid.entityLicenseId,
        currentRevisionId: baseUuid.entityCurrentRevisionId,
        taxonomyTermIds,
        alias: `${subjectName}/${baseUuid.id}/${slugTitle}`,
        revisionIds: getSortedList(baseUuid.entityRevisionIds),
        canonicalSubjectId: subject != null ? subject.id : null,
      }
      switch (baseUuid.entityType) {
        case 'applet':
          return { ...entity, __typename: EntityType.Applet }
        case 'article':
          return { ...entity, __typename: EntityType.Article }
        case 'course':
          return {
            ...entity,
            __typename: EntityType.Course,
            pageIds: getSortedList(baseUuid.entityChildrenIds),
          }
        case 'course-page':
          return baseUuid.entityParentId != null
            ? {
                ...entity,
                __typename: EntityType.CoursePage,
                parentId: baseUuid.entityParentId,
              }
            : null
        case 'event':
          return { ...entity, __typename: EntityType.Event }
        case 'text-exercise':
          return { ...entity, __typename: EntityType.Exercise }
        case 'text-exercise-group':
          return { ...entity, __typename: EntityType.ExerciseGroup }
        default:
          return { ...entity, __typename: EntityType.Video }
      }
    } else if (BaseComment.is(baseUuid)) {
      const parentId =
        baseUuid.commentParentUuid ?? baseUuid.commentParentCommentId ?? null

      if (parentId == null) return null

      return {
        ...base,
        __typename: DiscriminatorType.Comment,
        archived: Boolean(baseUuid.commentArchived),
        parentId,
        alias: `/${parentId}#comment-${baseUuid.id}`,
        status: baseUuid.commentStatus ?? 'noStatus',
        childrenIds: getSortedList(baseUuid.commentChildrenIds),
        date: baseUuid.commentDate.toISOString(),
        title: baseUuid.commentTitle,
        authorId: baseUuid.commentAuthorId,
        content: baseUuid.commentContent,
      }
    } else if (BaseTaxonomy.is(baseUuid)) {
      const subject = await SubjectResolver.resolve(
        { taxonomyId: baseUuid.id },
        context,
      )
      const subjectName =
        subject != null && subject.name.length > 0 ? subject.name : 'root'
      const alias = `/${toSlug(subjectName)}/${baseUuid.id}/${toSlug(baseUuid.taxonomyName)}`
      const childrenIds = [
        ...getSortedList(baseUuid.taxonomyChildrenIds),
        ...getSortedList(baseUuid.taxonomyEntityChildrenIds),
      ]

      return {
        ...base,
        __typename: DiscriminatorType.TaxonomyTerm,
        instance: baseUuid.taxonomyInstance,
        type: getTaxonomyTermType(baseUuid.taxonomyType),
        alias,
        name: baseUuid.taxonomyName,
        description: baseUuid.taxonomyDescription,
        weight: baseUuid.taxonomyWeight ?? 0,
        taxonomyId: baseUuid.taxonomyId,
        parentId: baseUuid.taxonomyParentId,
        childrenIds,
      }
    }
  }

  const uuidFromDBLayer = await DatabaseLayer.makeRequest('UuidQuery', { id })

  return UuidDecoder.is(uuidFromDBLayer) ? uuidFromDBLayer : null
}

export async function setUuidState(
  { id, trashed }: { id: number; trashed: boolean },
  { database }: Pick<Context, 'database'>,
) {
  await database.mutate('update uuid set trashed = ? where id = ?', [
    trashed ? 1 : 0,
    id,
  ])
}

function getSortedList(listAsDict: t.TypeOf<typeof WeightedNumberList>) {
  const ids = Object.keys(listAsDict)
    .map((x) => parseInt(x))
    .filter((x) => !isNaN(x))

  return R.sortBy((x) => listAsDict[x] ?? 0, ids)
}

function getTaxonomyTermType(type: string) {
  switch (type) {
    case 'subject':
      return TaxonomyTermType.Subject
    case 'root':
      return TaxonomyTermType.Root
    case 'topic-folder':
      return 'topicFolder'
    default:
      return TaxonomyTermType.Topic
  }
}

async function resolveIdFromPayload(
  dataSources: Context['dataSources'],
  payload: QueryUuidArgs,
) {
  if (payload.alias) {
    return await resolveIdFromAlias(dataSources, payload.alias)
  } else if (payload.id) {
    return payload.id
  } else {
    throw new UserInputError('you need to provide an id or an alias')
  }
}

async function resolveIdFromAlias(
  dataSources: Context['dataSources'],
  alias: NonNullable<QueryUuidArgs['alias']>,
): Promise<number | null> {
  const cleanPath = encodePath(decodePath(alias.path))

  if (!cleanPath.startsWith('/')) {
    throw new UserInputError(
      "First is the worst, please add a '/' at the beginning of your path",
    )
  }

  for (const regex of [
    /^\/(?<id>\d+)$/,
    /^\/entity\/view\/(?<id>\d+)$/,
    /^\/(?<instance>[^/]+\/)(?<subject>[^/]+\/)?(?<id>\d+)\/(?<title>[^/]*)$/,
    /^\/entity\/repository\/compare\/\d+\/(?<id>\d+)$/,
    /^\/user\/profile\/(?<id>\d+)$/,
  ]) {
    const match = regex.exec(cleanPath)

    if (match && match.groups !== undefined) return parseInt(match.groups.id)
  }

  const customId = resolveCustomId({
    path: cleanPath,
    instance: alias.instance,
  })
  if (customId) return customId

  return (await dataSources.model.serlo.getAlias(alias))?.id ?? null
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/ /g, '-') // replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // remove all non-word chars including _
    .replace(/--+/g, '-') // replace multiple hyphens
    .replace(/^-+/, '') // trim starting hyphen
    .replace(/-+$/, '') // trim end hyphen
}
