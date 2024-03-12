import { Matchers } from '@pact-foundation/pact'
import { AnyTemplate } from '@pact-foundation/pact/src/dsl/matchers'
import * as R from 'ramda'

import {
  createEntityLinkNotificationEvent,
  createEntityNotificationEvent,
  createEntityRevisionNotificationEvent,
  createTaxonomyLinkNotificationEvent,
  createTaxonomyTermNotificationEvent,
  rejectRevisionNotificationEvent,
  removeEntityLinkNotificationEvent,
  removeTaxonomyLinkNotificationEvent,
  setLicenseNotificationEvent,
  setTaxonomyParentNotificationEvent,
  setTaxonomyTermNotificationEvent,
  applet,
  appletRevision,
  article,
  articleRevision,
  articleRevision2,
  checkoutRevisionNotificationEvent,
  comment,
  comment3,
  course,
  coursePage,
  coursePageRevision,
  courseRevision,
  event,
  eventRevision,
  exercise,
  exerciseRevision,
  groupedExercise,
  groupedExerciseRevision,
  page,
  pageRevision,
  pageRevision2,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
  user,
  video,
  videoRevision,
  taxonomyTermTopic,
  taxonomyTermTopicFolder,
} from '../__fixtures__'
import { Model } from '~/internals/graphql'
import { DatabaseLayer } from '~/model'
import {
  EntityType,
  EntityRevisionType,
  DiscriminatorType,
  castToUuid,
  castToAlias,
} from '~/model/decoder'
import { Instance } from '~/types'
import { isDateString } from '~/utils'

// FIXME Some of the event in the serlo-mysql-database does not fit any more
// the data which is stored inside it. For a fast fix we have added some actual
// data from the DB here.
const events = [
  checkoutRevisionNotificationEvent,
  {
    __typename: 'CreateCommentNotificationEvent',
    id: 63807,
    instance: 'de',
    date: '2014-06-25T10:01:30+02:00',
    actorId: 10,
    objectId: 25820,
    threadId: 25357,
    commentId: 25820,
  },
  createEntityLinkNotificationEvent,
  createEntityNotificationEvent,
  createEntityRevisionNotificationEvent,
  createTaxonomyLinkNotificationEvent,
  createTaxonomyTermNotificationEvent,
  {
    __typename: 'CreateThreadNotificationEvent',
    id: 86196,
    instance: 'de',
    date: '2015-02-26T01:07:12+01:00',
    actorId: 35434,
    objectId: 19863,
    threadId: 35435,
  },
  rejectRevisionNotificationEvent,
  removeEntityLinkNotificationEvent,
  removeTaxonomyLinkNotificationEvent,
  setLicenseNotificationEvent,
  setTaxonomyParentNotificationEvent,
  setTaxonomyTermNotificationEvent,
  {
    __typename: 'SetThreadStateNotificationEvent',
    id: 43922,
    instance: 'de',
    date: '2014-03-18T08:37:41+01:00',
    actorId: 324,
    objectId: 18585,
    threadId: 18585,
    archived: true,
  },
  {
    __typename: 'SetUuidStateNotificationEvent',
    id: 38537,
    instance: 'de',
    date: '2014-03-06T13:37:08+01:00',
    actorId: 15480,
    objectId: 16128,
    trashed: true,
  },
]
const uuids = [
  applet,
  appletRevision,
  article,
  articleRevision,
  comment,
  course,
  courseRevision,
  coursePage,
  coursePageRevision,
  event,
  eventRevision,
  exercise,
  exerciseRevision,
  groupedExercise,
  groupedExerciseRevision,
  page,
  pageRevision,
  taxonomyTermRoot,
  taxonomyTermSubject,
  taxonomyTermCurriculumTopic,
  user,
  video,
  videoRevision,
]
const abstractEvent = R.pick(
  ['__typename', 'id', 'instance', 'date', 'actorId', 'objectId'],
  checkoutRevisionNotificationEvent,
) as Model<'AbstractNotificationEvent'>

const pactSpec: PactSpec = {
  ActiveAuthorsQuery: { examples: [[undefined, [user.id]]] },
  ActiveReviewersQuery: { examples: [[undefined, [user.id]]] },
  ActivityByTypeQuery: {
    examples: [
      [
        { userId: user.id },
        { edits: 10, comments: 11, reviews: 0, taxonomy: 3 },
      ],
    ],
  },
  AliasQuery: {
    examples: [
      { id: 19767, instance: Instance.De, path: '/mathe' },
      { id: 1, instance: Instance.De, path: '/user/1/admin' },
    ].map((alias) => [R.pick(['instance', 'path'], alias), alias]),
    examplePayloadForNull: { instance: Instance.En, path: '/not-existing' },
  },
  AllThreadsQuery: {
    examples: [
      [
        { first: 1, after: undefined, instance: Instance.De },
        { firstCommentIds: [35435] },
      ],
    ],
  },
  DeletedEntitiesQuery: {
    examples: [
      [
        { first: 1, after: undefined, instance: Instance.De },
        // FIXME: In `serlo-mysql-database` we should add a deleted uuid
        { deletedEntities: [] },
      ],
    ],
  },
  EntitiesMetadataQuery: {
    examples: [
      [
        { first: 1, after: undefined, instance: Instance.De },
        { entities: [{ identifier: { value: 1495 } }] },
      ],
    ],
  },
  EntityAddRevisionMutation: {
    examples: [
      [
        {
          input: {
            changes: 'changes',
            entityId: article.id,
            needsReview: true,
            subscribeThis: false,
            subscribeThisByEmail: false,
            fields: {
              title: 'title',
              content: 'content',
              metaTitle: 'metaTitle',
              metaDescription: 'metaDescription',
            },
          },
          userId: user.id,
          revisionType: EntityRevisionType.ArticleRevision,
        },
        { success: true, revisionId: 123 },
      ],
      [
        {
          input: {
            changes: 'changes',
            entityId: video.id,
            needsReview: false,
            subscribeThis: true,
            subscribeThisByEmail: true,
            fields: {
              title: 'title',
              content: 'content',
              description: 'description',
            },
          },
          userId: user.id,
          revisionType: EntityRevisionType.VideoRevision,
        },
        { success: true, revisionId: 456 },
      ],
    ],
  },
  EntityCheckoutRevisionMutation: {
    examples: [
      [
        {
          revisionId: articleRevision2.id,
          userId: user.id,
          reason: '',
        },
        {
          success: true,
        },
      ],
    ],
  },
  EntityRejectRevisionMutation: {
    examples: [
      [
        {
          revisionId: articleRevision2.id,
          userId: user.id,
          reason: '',
        },
        {
          success: true,
        },
      ],
    ],
  },
  EntityCreateMutation: {
    examples: [
      [
        {
          entityType: EntityType.Article,
          userId: user.id,
          input: {
            changes: 'changes',
            licenseId: 1,
            subscribeThis: false,
            subscribeThisByEmail: false,
            needsReview: false,
            taxonomyTermId: 5,
            fields: {
              title: 'title',
              content: 'content',
              metaTitle: 'metaTitle',
              metaDescription: 'metaDescription',
              url: 'https://url.org',
            },
          },
        },
        article,
      ],
      [
        {
          entityType: EntityType.CoursePage,
          userId: user.id,
          input: {
            changes: 'changes',
            licenseId: 1,
            subscribeThis: false,
            subscribeThisByEmail: false,
            needsReview: true,
            parentId: course.id,
            fields: {
              title: 'title',
              content: 'content',
            },
          },
        },
        { ...coursePage, currentRevisionId: null },
      ],
    ],
  },
  EntitySetLicenseMutation: {
    examples: [
      [
        {
          userId: user.id,
          licenseId: 4,
          entityId: article.id,
        },
        {
          success: true,
        },
      ],
    ],
  },
  EntitySortMutation: {
    examples: [
      [
        { entityId: 2223, childrenIds: [9911, 2233, 5075, 9907] },
        { success: true },
      ],
    ],
  },
  EventQuery: {
    examples: events.map((event) => [{ id: event.id }, event]),
    examplePayloadForNull: { id: 1_000_000 },
  },
  EventsQuery: {
    examples: [
      [{ first: 500 }, { events: [abstractEvent], hasNextPage: true }],
      [
        { first: 500, after: 100 },
        { events: [abstractEvent], hasNextPage: true },
      ],
      [
        { first: 500, objectId: 1565 },
        { events: [abstractEvent], hasNextPage: true },
      ],
      [
        { first: 500, actorId: 1 },
        { events: [abstractEvent], hasNextPage: true },
      ],
      [
        { first: 500, instance: Instance.De },
        { events: [abstractEvent], hasNextPage: true },
      ],
    ],
  },
  NotificationsQuery: {
    examples: [
      [
        { userId: user.id },
        {
          userId: user.id,
          notifications: [
            {
              id: 1,
              unread: true,
              eventId: castToUuid(301),
              email: false,
              emailSent: false,
            },
          ],
        },
      ],
    ],
  },
  NotificationSetStateMutation: {
    examples: [[{ ids: [9], userId: user.id, unread: true }, undefined]],
  },
  PageAddRevisionMutation: {
    examples: [
      [
        {
          content: 'content',
          title: 'title',
          pageId: page.id,
          userId: user.id,
        },
        { success: true, revisionId: 456 },
      ],
    ],
  },
  PageCheckoutRevisionMutation: {
    examples: [
      [
        {
          revisionId: pageRevision2.id,
          userId: user.id,
          reason: '',
        },
        {
          success: true,
        },
      ],
    ],
  },
  PageRejectRevisionMutation: {
    examples: [
      [
        {
          revisionId: pageRevision2.id,
          userId: user.id,
          reason: '',
        },
        {
          success: true,
        },
      ],
    ],
  },
  PageCreateMutation: {
    examples: [
      [
        {
          content: 'content',
          discussionsEnabled: false,
          instance: Instance.De,
          licenseId: 1,
          title: 'title',
          forumId: null,
          userId: user.id,
        },
        { ...page },
      ],
    ],
  },
  PagesQuery: {
    examples: [
      [
        {
          instance: Instance.En,
        },
        {
          pages: [
            23579, 23580, 23591, 23711, 23720, 23727, 25079, 25082, 27469,
            32840, 32966,
          ],
        },
      ],
    ],
  },
  SubjectsQuery: {
    examples: [
      [{}, { subjects: [{ instance: Instance.De, taxonomyTermId: 5 }] }],
    ],
  },
  SubscriptionsQuery: {
    examples: [
      [
        { userId: user.id },
        { subscriptions: [{ objectId: article.id, sendEmail: true }] },
      ],
    ],
  },
  SubscriptionSetMutation: {
    examples: [
      [
        {
          ids: [article.id],
          userId: user.id,
          subscribe: false,
          sendEmail: false,
        },
        undefined,
      ],
    ],
  },
  TaxonomyCreateEntityLinksMutation: {
    examples: [
      [
        {
          entityIds: [video.id, article.id],
          taxonomyTermId: taxonomyTermTopic.id,
          userId: user.id,
        },
        { success: true },
      ],
    ],
  },
  TaxonomyDeleteEntityLinksMutation: {
    examples: [
      [
        {
          entityIds: [1949],
          taxonomyTermId: 24370,
          userId: user.id,
        },
        { success: true },
      ],
    ],
  },
  TaxonomyTermCreateMutation: {
    examples: [
      [
        {
          userId: 1,
          taxonomyType: 'topic',
          parentId: 1288,
          name: 'a topic',
          description: 'a description',
        },
        { ...taxonomyTermTopic, description: 'a description', childrenIds: [] },
      ],
      [
        {
          userId: 1,
          taxonomyType: 'topic-folder',
          parentId: 1420,
          name: 'a topic folder',
          description: 'a description',
        },
        {
          ...taxonomyTermTopicFolder,
          description: 'a description',
          childrenIds: [],
        },
      ],
    ],
  },
  TaxonomyTermSetNameAndDescriptionMutation: {
    examples: [
      [
        {
          id: taxonomyTermSubject.id,
          name: 'name',
          description: 'description',
          userId: user.id,
        },
        { success: true },
      ],
      [
        {
          id: taxonomyTermCurriculumTopic.id,
          name: 'description null',
          description: null,
          userId: user.id,
        },
        { success: true },
      ],
    ],
  },
  TaxonomySortMutation: {
    examples: [
      [
        {
          taxonomyTermId: 1338,
          childrenIds: [1557, 1553, 2107, 24398, 30560],
          userId: user.id,
        },
        {
          success: true,
        },
      ],
    ],
  },
  ThreadCreateCommentMutation: {
    examples: [
      [
        {
          content: 'Hello',
          threadId: comment.id,
          userId: user.id,
          subscribe: true,
          sendEmail: false,
        },
        {
          __typename: DiscriminatorType.Comment,
          id: comment.id,
          content: 'Hello',
          authorId: user.id,
          parentId: comment.id,
          trashed: false,
          alias: castToAlias('/mathe/101/mathe'),
          date: comment.date,
          title: null,
          archived: false,
          childrenIds: [],
          status: 'noStatus',
        },
      ],
    ],
  },
  ThreadCreateThreadMutation: {
    examples: [
      [
        {
          title: 'My new thread',
          content: '🔥 brand new!',
          objectId: article.id,
          userId: user.id,
          subscribe: true,
          sendEmail: false,
        },
        {
          __typename: DiscriminatorType.Comment,
          id: castToUuid(1000),
          title: 'My new thread',
          trashed: false,
          alias: castToAlias('/mathe/1000/first'),
          authorId: user.id,
          date: article.date,
          archived: false,
          content: '🔥 brand new!',
          parentId: article.id,
          childrenIds: [],
          status: 'noStatus',
        },
      ],
    ],
  },
  ThreadEditCommentMutation: {
    examples: [
      [{ content: 'new content', commentId: 35183, userId: 266 }, undefined],
    ],
  },
  ThreadSetThreadArchivedMutation: {
    examples: [
      [{ ids: [comment3.id], userId: user.id, archived: true }, undefined],
    ],
  },
  ThreadSetThreadStatusMutation: {
    examples: [[{ ids: [comment3.id], status: 'open' }, { success: true }]],
  },
  ThreadsQuery: {
    examples: [[{ id: article.id }, { firstCommentIds: [1] }]],
  },
  UnrevisedEntitiesQuery: {
    examples: [[{}, { unrevisedEntityIds: [article.id] }]],
  },
  UserAddRoleMutation: {
    examples: [
      [
        {
          username: '1229f9c7',
          roleName: 'german_reviewer',
        },
        {
          success: true,
        },
      ],
    ],
  },
  UserPotentialSpamUsersQuery: { examples: [] },
  UserCreateMutation: {
    examples: [
      [
        {
          username: 'testUser',
          password: '123456',
          email: 'testUser@example.org',
        },
        { success: true, userId: 63216 },
      ],
    ],
  },
  UserDeleteBotsMutation: { examples: [] },
  UserDeleteRegularUsersMutation: {
    examples: [],
    // TODO: here it is named userId, in DB layer just id, adjust
    // examples: [[{ userId: user.id }, { success: true }]],
  },
  UsersByRoleQuery: {
    examples: [
      [{ roleName: 'sysadmin', first: 2, after: 1 }, { usersByRole: [2, 6] }],
    ],
  },
  UserSetDescriptionMutation: {
    examples: [[{ userId: 1, description: 'Hello World' }, { success: true }]],
  },
  UserRemoveRoleMutation: {
    examples: [
      [
        {
          username: 'admin',
          roleName: 'sysadmin',
        },
        {
          success: true,
        },
      ],
    ],
  },
  UserSetEmailMutation: {
    examples: [
      [
        { userId: user.id, email: 'test@example.org' },
        { success: true, username: user.username },
      ],
    ],
  },
  UuidSetStateMutation: {
    examples: [
      [{ ids: [article.id], userId: user.id, trashed: true }, undefined],
    ],
  },
  UuidQuery: {
    examples: uuids.map((uuid) => [{ id: uuid.id }, uuid]),
    examplePayloadForNull: { id: 1_000_000 },
  },
}

describe.each(R.toPairs(pactSpec))('%s', (type, messageSpec) => {
  const examples = messageSpec.examples as Example[]

  if (examples.length === 0) return

  test.each(examples)('%s', async (payload, response) => {
    if (response == null) {
      await addInteraction({
        type,
        payload,
        responseStatus: 200,
        expectedResponse: response,
      })
    } else {
      const toSingletonList = (x: unknown) =>
        Array.isArray(x) ? x.slice(0, 1) : x
      await addInteraction({
        type,
        payload,
        responseStatus: 200,
        responseHeaders: { 'Content-Type': 'application/json; charset=utf-8' },
        responseBody: generalMap(toMatcher, response),
        expectedResponse: generalMap(toSingletonList, response),
      })
    }
  })

  if (R.has('examplePayloadForNull', messageSpec)) {
    test('404 response', async () => {
      await addInteraction({
        type,
        payload: messageSpec.examplePayloadForNull,
        responseStatus: 404,
        expectedResponse: null,
      })
    })
  }
})

async function addInteraction<M extends DatabaseLayer.MessageType>(arg: {
  type: M
  payload: DatabaseLayer.Payload<M>
  responseStatus: number
  expectedResponse: unknown
  responseHeaders?: Record<string, string>
  responseBody?: unknown
}) {
  const { type, payload } = arg
  const payloadJson = JSON.stringify(payload)

  await global.pact.addInteraction({
    uponReceiving: `Message ${arg.type} with payload ${payloadJson} (case ${arg.responseStatus}-response)`,
    state: undefined,
    withRequest: {
      method: 'POST',
      path: '/',
      // TODO: proper typing
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: { type, payload } as AnyTemplate,
      headers: { 'Content-Type': 'application/json' },
    },
    willRespondWith: {
      status: arg.responseStatus,
      headers: arg.responseHeaders ?? {},
      body: arg.responseBody as { responseBody: AnyTemplate },
    },
  })

  const result = await DatabaseLayer.makeRequest(type, payload)

  expect(result).toEqual(arg.expectedResponse)
}

function toMatcher(value: unknown): unknown {
  if (value == null) {
    return null
  } else if (Array.isArray(value)) {
    return value.length > 0
      ? Matchers.eachLike(
          typeof value[0] === 'object' ? toMatcher(value[0]) : value[0],
        )
      : []
  } else if (typeof value === 'object') {
    return R.mapObjIndexed(toMatcher, value)
  } else if (typeof value === 'string' && isDateString(value)) {
    return Matchers.iso8601DateTime(value)
  } else {
    return Matchers.like(value)
  }
}

function generalMap(
  func: (x: unknown) => unknown,
  value: Record<string, unknown> | Array<unknown>,
): unknown {
  return Array.isArray(value)
    ? func(value)
    : R.fromPairs(R.toPairs(value).map(([key, value]) => [key, func(value)]))
}

type PactSpec = {
  [M in DatabaseLayer.MessageType]: {
    examples: Example<M>[]
  } & (DatabaseLayer.Spec[M]['canBeNull'] extends true
    ? { examplePayloadForNull: DatabaseLayer.Payload<M> }
    : unknown)
}
type Example<M extends DatabaseLayer.MessageType = DatabaseLayer.MessageType> =
  [DatabaseLayer.Payload<M>, DatabaseLayer.Response<M>]
