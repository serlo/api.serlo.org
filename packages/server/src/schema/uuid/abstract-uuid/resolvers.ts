import * as auth from '@serlo/authorization'
import { option as O } from 'fp-ts'
import * as t from 'io-ts'
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
  EntityRevisionType,
  castToNonEmptyString,
} from '~/model/decoder'
import { createEvent } from '~/schema/events/event'
import { SubjectResolver } from '~/schema/subject/resolvers'
import { decodePath, encodePath } from '~/schema/uuid/alias/utils'
import { Resolvers, QueryUuidArgs, TaxonomyTermType } from '~/types'
import { isDefined } from '~/utils'

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
      const { database, userId } = context
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

          if (object.trashed !== trashed) {
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
        }

        await transaction.commit()

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

const BaseEntityRevision = t.intersection([
  BaseUuid,
  t.type({
    discriminator: t.literal('entityRevision'),
    revisionType: DBEntityType,
    revisionContent: t.union([t.string, t.null]),
    revisionDate: date,
    revisionAuthorId: t.number,
    revisionRepositoryId: t.number,
    revisionChanges: t.union([t.string, t.null]),
    revisionTitle: t.union([t.string, t.null]),
    revisionMetaTitle: t.union([t.string, t.null]),
    revisionMetaDescription: t.union([t.string, t.null]),
    revisionUrl: t.union([t.string, t.null]),
  }),
])

const BaseComment = t.intersection([
  BaseUuid,
  t.type({
    discriminator: t.literal('comment'),
    commentAuthorId: t.number,
    commentTitle: t.union([t.string, t.null]),
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

const BaseUser = t.intersection([
  BaseUuid,
  t.type({
    discriminator: t.literal('user'),
    userUsername: t.string,
    userDate: date,
    userDescription: t.union([t.string, t.null]),
    userRoles: t.array(t.union([t.null, t.string])),
  }),
])

async function resolveUuidFromDatabase(
  { id }: { id: number },
  context: Pick<Context, 'database' | 'timer' | 'swrQueue' | 'cache'>,
): Promise<Model<'AbstractUuid'> | null> {
  const baseUuid = await context.database.fetchOptional(
    `
    SELECT
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

      revision_type.name as revisionType,
      revision.content as revisionContent,
      revision.date as revisionDate,
      revision.author_id as revisionAuthorId,
      revision.repository_id as revisionRepositoryId,
      revision.changes as revisionChanges,
      revision.title as revisionTitle,
      revision.meta_title as revisionMetaTitle,
      revision.meta_description as revisionMetaDescription,
      revision.url as revisionUrl,

      comment.author_id AS commentAuthorId,
      comment.title AS commentTitle,
      comment.date AS commentDate,
      comment.archived AS commentArchived,
      comment.content AS commentContent,
      comment.parent_id AS commentParentCommentId,
      comment.uuid_id AS commentParentUuid,
      JSON_OBJECTAGG(
          COALESCE(comment_children.id, "__no_key"),
          comment_children.id
      ) AS commentChildrenIds,
      CASE
        WHEN comment_status.name = 'no_status' THEN 'noStatus'
        ELSE comment_status.name
      END AS commentStatus,

      taxonomy_type.name AS taxonomyType,
      taxonomy_instance.subdomain AS taxonomyInstance,
      term.name AS taxonomyName,
      term_taxonomy.description AS taxonomyDescription,
      term_taxonomy.weight AS taxonomyWeight,
      taxonomy.id AS taxonomyId,
      term_taxonomy.parent_id AS taxonomyParentId,
      JSON_OBJECTAGG(
        COALESCE(taxonomy_child.id, "__no_key"),
        taxonomy_child.weight
      ) AS taxonomyChildrenIds,
      JSON_OBJECTAGG(
        COALESCE(term_taxonomy_entity.entity_id, "__no_key"),
        term_taxonomy_entity.position
      ) AS taxonomyEntityChildrenIds,

      user.username AS userUsername,
      user.date AS userDate,
      user.description AS userDescription,
      JSON_ARRAYAGG(role.name) AS userRoles

    FROM uuid

    LEFT JOIN comment ON comment.id = uuid.id
    LEFT JOIN comment comment_children ON comment_children.parent_id = comment.id
    LEFT JOIN comment_status ON comment_status.id = comment.comment_status_id

    left join entity on entity.id = uuid.id
    left join instance entity_instance on entity_instance.id = entity.instance_id
    left join type entity_type on entity_type.id = entity.type_id
    left join entity_revision on entity_revision.repository_id = entity.id
    left join term_taxonomy_entity entity_taxonomy on entity_taxonomy.entity_id = entity.id
    left join entity_revision current_revision on current_revision.id = entity.current_revision_id
    left join entity_link entity_link_child on entity_link_child.parent_id = entity.id
    left join entity_link entity_link_parent on entity_link_parent.child_id = entity.id

    left join entity_revision revision on revision.id = uuid.id
    left join entity revision_entity on revision_entity.id = revision.repository_id
    left join type revision_type on revision_entity.type_id = revision_type.id

    LEFT JOIN term_taxonomy ON term_taxonomy.id = uuid.id
    LEFT JOIN taxonomy ON taxonomy.id = term_taxonomy.taxonomy_id
    LEFT JOIN type taxonomy_type ON taxonomy_type.id = taxonomy.type_id
    LEFT JOIN instance taxonomy_instance ON taxonomy_instance.id = taxonomy.instance_id
    LEFT JOIN term ON term.id = term_taxonomy.term_id
    LEFT JOIN term_taxonomy taxonomy_child ON taxonomy_child.parent_id = term_taxonomy.id
    LEFT JOIN term_taxonomy_entity ON term_taxonomy_entity.term_taxonomy_id = term_taxonomy.id

    LEFT JOIN user ON user.id = uuid.id
    LEFT JOIN role_user ON user.id = role_user.user_id
    LEFT JOIN role ON role.id = role_user.role_id

    WHERE uuid.id = ?
    GROUP BY uuid.id
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
    } else if (BaseEntityRevision.is(baseUuid)) {
      const defaultContent = JSON.stringify({ plugin: 'rows', state: [] })
      const content =
        baseUuid.revisionContent != null && baseUuid.revisionContent.length > 0
          ? baseUuid.revisionContent
          : defaultContent
      const revision = {
        ...base,
        alias: `/entity/repository/compare/${baseUuid.revisionRepositoryId}/${baseUuid.id}`,
        content: castToNonEmptyString(content),
        date: baseUuid.revisionDate.toISOString(),
        authorId: baseUuid.revisionAuthorId,
        changes: baseUuid.revisionChanges ?? '',
        title:
          baseUuid.revisionTitle ?? `${baseUuid.revisionType} ${baseUuid.id}`,
        metaTitle: baseUuid.revisionMetaTitle ?? '',
        metaDescription: baseUuid.revisionMetaDescription ?? '',
        repositoryId: baseUuid.revisionRepositoryId,
        url: baseUuid.revisionUrl ?? '',
      }

      switch (baseUuid.revisionType) {
        case 'applet':
          return { ...revision, __typename: EntityRevisionType.AppletRevision }
        case 'article':
          return { ...revision, __typename: EntityRevisionType.ArticleRevision }
        case 'course':
          return { ...revision, __typename: EntityRevisionType.CourseRevision }
        case 'course-page':
          return {
            ...revision,
            __typename: EntityRevisionType.CoursePageRevision,
          }
        case 'event':
          return { ...revision, __typename: EntityRevisionType.EventRevision }
        case 'text-exercise':
          return {
            ...revision,
            __typename: EntityRevisionType.ExerciseRevision,
          }
        case 'text-exercise-group':
          return {
            ...revision,
            __typename: EntityRevisionType.ExerciseGroupRevision,
          }
        default:
          return { ...revision, __typename: EntityRevisionType.VideoRevision }
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
    } else if (BaseUser.is(baseUuid)) {
      return {
        ...base,
        __typename: DiscriminatorType.User,
        alias: `/user/${base.id}/${baseUuid.userUsername}`,
        date: baseUuid.userDate.toISOString(),
        description: baseUuid.userDescription,
        roles: baseUuid.userRoles.filter(isDefined),
        username: baseUuid.userUsername,
      }
    }
  }

  const uuidFromDBLayer = await DatabaseLayer.makeRequest('UuidQuery', { id })

  return UuidDecoder.is(uuidFromDBLayer) ? uuidFromDBLayer : null
}

export async function setUuidState(
  { id, trashed }: { id: number; trashed: boolean },
  { database, cache }: Pick<Context, 'database' | 'cache'>,
) {
  await database.mutate('update uuid set trashed = ? where id = ?', [
    trashed ? 1 : 0,
    id,
  ])
  await UuidResolver.removeCacheEntries([{ id }], { cache })
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
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/ /g, '-') // replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // remove all non-word chars including _
    .replace(/--+/g, '-') // replace multiple hyphens
    .replace(/^-+/, '') // trim starting hyphen
    .replace(/-+$/, '') // trim end hyphen
}
