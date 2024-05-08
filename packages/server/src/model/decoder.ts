import * as t from 'io-ts'

import { UserInputError } from '~/errors'
import { Instance, Role, TaxonomyTermType } from '~/types'

export const InstanceDecoder: t.Type<Instance> = t.union([
  t.literal(Instance.De),
  t.literal(Instance.En),
  t.literal(Instance.Es),
  t.literal(Instance.Fr),
  t.literal(Instance.Hi),
  t.literal(Instance.Ta),
])

export const RoleDecoder: t.Type<Role> = t.union([
  t.literal(Role.Admin),
  t.literal(Role.Architect),
  t.literal(Role.Guest),
  t.literal(Role.Login),
  t.literal(Role.Moderator),
  t.literal(Role.Reviewer),
  t.literal(Role.StaticPagesBuilder),
  t.literal(Role.Sysadmin),
])

export enum DiscriminatorType {
  Comment = 'Comment',
  Page = 'Page',
  PageRevision = 'PageRevision',
  TaxonomyTerm = 'TaxonomyTerm',
  User = 'User',
}

export type UuidType = DiscriminatorType | EntityType | EntityRevisionType

export type RepositoryType = EntityType | DiscriminatorType.Page
export type RevisionType = EntityRevisionType | DiscriminatorType.PageRevision

export enum EntityType {
  Applet = 'Applet',
  Article = 'Article',
  Course = 'Course',
  CoursePage = 'CoursePage',
  Event = 'Event',
  Exercise = 'Exercise',
  ExerciseGroup = 'ExerciseGroup',
  Video = 'Video',
}

export enum EntityRevisionType {
  ArticleRevision = 'ArticleRevision',
  AppletRevision = 'AppletRevision',
  CourseRevision = 'CourseRevision',
  CoursePageRevision = 'CoursePageRevision',
  EventRevision = 'EventRevision',
  ExerciseRevision = 'ExerciseRevision',
  ExerciseGroupRevision = 'ExerciseGroupRevision',
  VideoRevision = 'VideoRevision',
}

export interface Brands {
  readonly NonEmptyString: unique symbol
}

export function castTo<A>(decoder: t.Type<A, unknown>, value: unknown): A {
  if (decoder.is(value)) {
    return value
  } else {
    throw new UserInputError(`Illegal value ${JSON.stringify(value)} given`)
  }
}

export const NonEmptyString = t.brand(
  t.string,
  (text): text is t.Branded<string, Brands> => text.length > 0,
  'NonEmptyString',
)
export type NonEmptyString = t.TypeOf<typeof NonEmptyString>

export function castToNonEmptyString(text: string): NonEmptyString {
  return castTo(NonEmptyString, text)
}

export const AbstractUuidDecoder = t.type({
  id: t.number,
  trashed: t.boolean,
  alias: t.string,
})

export const EntityTypeDecoder = t.union([
  t.literal(EntityType.Applet),
  t.literal(EntityType.Article),
  t.literal(EntityType.Course),
  t.literal(EntityType.CoursePage),
  t.literal(EntityType.Event),
  t.literal(EntityType.Exercise),
  t.literal(EntityType.ExerciseGroup),
  t.literal(EntityType.Video),
])

export const AbstractEntityDecoder = t.intersection([
  AbstractUuidDecoder,
  t.type({
    __typename: EntityTypeDecoder,
    instance: InstanceDecoder,
    date: t.string,
    licenseId: t.number,
    currentRevisionId: t.union([t.number, t.null]),
    revisionIds: t.array(t.number),
    canonicalSubjectId: t.union([t.number, t.null]),
  }),
])

export const EntityRevisionTypeDecoder = t.union([
  t.literal(EntityRevisionType.AppletRevision),
  t.literal(EntityRevisionType.ArticleRevision),
  t.literal(EntityRevisionType.CourseRevision),
  t.literal(EntityRevisionType.CoursePageRevision),
  t.literal(EntityRevisionType.EventRevision),
  t.literal(EntityRevisionType.ExerciseRevision),
  t.literal(EntityRevisionType.ExerciseGroupRevision),
  t.literal(EntityRevisionType.VideoRevision),
])

export const AbstractEntityRevisionDecoder = t.intersection([
  AbstractUuidDecoder,
  t.type({
    __typename: EntityRevisionTypeDecoder,
    content: NonEmptyString,
    date: t.string,
    authorId: t.number,
    repositoryId: t.number,
    changes: t.string,
  }),
])

export const PageDecoder = t.exact(
  t.intersection([
    AbstractUuidDecoder,
    t.type({
      __typename: t.literal(DiscriminatorType.Page),
      instance: InstanceDecoder,
      currentRevisionId: t.union([t.number, t.null]),
      revisionIds: t.array(t.number),
      date: t.string,
      licenseId: t.number,
    }),
  ]),
)

export const PageRevisionDecoder = t.exact(
  t.intersection([
    AbstractUuidDecoder,
    t.type({
      __typename: t.literal(DiscriminatorType.PageRevision),
      title: t.string,
      content: t.string,
      date: t.string,
      authorId: t.number,
      repositoryId: t.number,
    }),
  ]),
)

export const TaxonomyTermTypeDecoder = t.union([
  t.literal('blog'),
  t.literal('curriculum'),
  t.literal('curriculumTopic'),
  t.literal('curriculumTopicFolder'),
  t.literal('forum'),
  t.literal('forumCategory'),
  t.literal('locale'),
  t.literal('topicFolder'),
  t.literal(TaxonomyTermType.Root),
  t.literal(TaxonomyTermType.Subject),
  t.literal(TaxonomyTermType.Topic),
])

export const TaxonomyTermDecoder = t.exact(
  t.intersection([
    AbstractUuidDecoder,
    t.type({
      __typename: t.literal(DiscriminatorType.TaxonomyTerm),
      type: TaxonomyTermTypeDecoder,
      instance: InstanceDecoder,
      name: t.string,
      weight: t.number,
      childrenIds: t.array(t.number),
      parentId: t.union([t.number, t.null]),
      taxonomyId: t.number,
    }),
    t.partial({
      description: t.union([t.string, t.null]),
    }),
  ]),
)

export const CommentStatusDecoder = t.union([
  t.literal('noStatus'),
  t.literal('open'),
  t.literal('done'),
])

export const CommentDecoder = t.exact(
  t.intersection([
    AbstractUuidDecoder,
    t.type({
      __typename: t.literal(DiscriminatorType.Comment),
      authorId: t.number,
      title: t.union([t.string, t.null]),
      date: t.string,
      archived: t.boolean,
      content: t.string,
      parentId: t.number,
      childrenIds: t.array(t.number),
      status: CommentStatusDecoder,
    }),
  ]),
)

export const ArticleDecoder = t.exact(
  t.intersection([
    AbstractEntityDecoder,
    t.type({
      __typename: t.literal(EntityType.Article),
      taxonomyTermIds: t.array(t.number),
    }),
  ]),
)

export const ArticleRevisionDecoder = t.exact(
  t.intersection([
    AbstractEntityRevisionDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.ArticleRevision),
      title: t.string,
      metaTitle: t.string,
      metaDescription: t.string,
    }),
  ]),
)

export const AppletDecoder = t.exact(
  t.intersection([
    AbstractEntityDecoder,
    t.type({
      __typename: t.literal(EntityType.Applet),
      taxonomyTermIds: t.array(t.number),
    }),
  ]),
)

export const AppletRevisionDecoder = t.exact(
  t.intersection([
    AbstractEntityRevisionDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.AppletRevision),
      url: t.string,
      title: t.string,
      metaTitle: t.string,
      metaDescription: t.string,
    }),
  ]),
)

export const CourseDecoder = t.exact(
  t.intersection([
    AbstractEntityDecoder,
    t.type({
      __typename: t.literal(EntityType.Course),
      taxonomyTermIds: t.array(t.number),
      pageIds: t.array(t.number),
    }),
  ]),
)

export const CourseRevisionDecoder = t.exact(
  t.intersection([
    AbstractEntityRevisionDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.CourseRevision),
      title: t.string,
      metaDescription: t.string,
    }),
  ]),
)

export const CoursePageDecoder = t.exact(
  t.intersection([
    AbstractEntityDecoder,
    t.type({
      __typename: t.literal(EntityType.CoursePage),
      parentId: t.number,
    }),
  ]),
)

export const CoursePageRevisionDecoder = t.exact(
  t.intersection([
    AbstractEntityRevisionDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.CoursePageRevision),
      title: t.string,
    }),
  ]),
)

export const ExerciseDecoder = t.exact(
  t.intersection([
    AbstractEntityDecoder,
    t.type({
      __typename: t.literal(EntityType.Exercise),
      taxonomyTermIds: t.array(t.number),
    }),
  ]),
)

export const ExerciseRevisionDecoder = t.exact(
  t.intersection([
    AbstractEntityRevisionDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.ExerciseRevision),
    }),
  ]),
)

export const ExerciseGroupDecoder = t.exact(
  t.intersection([
    AbstractEntityDecoder,
    t.type({
      __typename: t.literal(EntityType.ExerciseGroup),
      taxonomyTermIds: t.array(t.number),
    }),
  ]),
)

export const ExerciseGroupRevisionDecoder = t.exact(
  t.intersection([
    AbstractEntityRevisionDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.ExerciseGroupRevision),
    }),
  ]),
)

export const EventDecoder = t.exact(
  t.intersection([
    AbstractEntityDecoder,
    t.type({
      __typename: t.literal(EntityType.Event),
      taxonomyTermIds: t.array(t.number),
    }),
  ]),
)

export const EventRevisionDecoder = t.exact(
  t.intersection([
    AbstractEntityRevisionDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.EventRevision),
      title: t.string,
      metaTitle: t.string,
      metaDescription: t.string,
    }),
  ]),
)

export const VideoDecoder = t.exact(
  t.intersection([
    AbstractEntityDecoder,
    t.type({
      __typename: t.literal(EntityType.Video),
      taxonomyTermIds: t.array(t.number),
    }),
  ]),
)

export const VideoRevisionDecoder = t.exact(
  t.intersection([
    AbstractEntityRevisionDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.VideoRevision),
      url: t.string,
      title: t.string,
    }),
  ]),
)

export const UserDecoder = t.exact(
  t.intersection([
    AbstractUuidDecoder,
    t.type({
      __typename: t.literal(DiscriminatorType.User),
      username: t.string,
      date: t.string,
      roles: t.array(t.string),
    }),
    t.partial({
      lastLogin: t.union([t.string, t.null]),
      description: t.union([t.string, t.null]),
      language: t.union([InstanceDecoder, t.null]),
    }),
  ]),
)

export const EntityDecoder = t.union([
  AppletDecoder,
  ArticleDecoder,
  CourseDecoder,
  CoursePageDecoder,
  EventDecoder,
  ExerciseDecoder,
  ExerciseGroupDecoder,
  VideoDecoder,
])

export const EntityRevisionDecoder = t.union([
  AppletRevisionDecoder,
  ArticleRevisionDecoder,
  CourseRevisionDecoder,
  CoursePageRevisionDecoder,
  EventRevisionDecoder,
  ExerciseRevisionDecoder,
  ExerciseGroupRevisionDecoder,
  VideoRevisionDecoder,
])

export const RepositoryDecoder = t.union([EntityDecoder, PageDecoder])

export const RevisionDecoder = t.union([
  EntityRevisionDecoder,
  PageRevisionDecoder,
])

export const UuidDecoder = t.union([
  CommentDecoder,
  RepositoryDecoder,
  RevisionDecoder,
  TaxonomyTermDecoder,
  UserDecoder,
])

export enum NotificationEventType {
  CheckoutRevision = 'CheckoutRevisionNotificationEvent',
  CreateComment = 'CreateCommentNotificationEvent',
  CreateEntity = 'CreateEntityNotificationEvent',
  CreateEntityRevision = 'CreateEntityRevisionNotificationEvent',
  CreateEntityLink = 'CreateEntityLinkNotificationEvent',
  CreateTaxonomyTerm = 'CreateTaxonomyTermNotificationEvent',
  CreateTaxonomyLink = 'CreateTaxonomyLinkNotificationEvent',
  CreateThread = 'CreateThreadNotificationEvent',
  RejectRevision = 'RejectRevisionNotificationEvent',
  RemoveEntityLink = 'RemoveEntityLinkNotificationEvent',
  RemoveTaxonomyLink = 'RemoveTaxonomyLinkNotificationEvent',
  SetLicense = 'SetLicenseNotificationEvent',
  SetTaxonomyTerm = 'SetTaxonomyTermNotificationEvent',
  SetTaxonomyParent = 'SetTaxonomyParentNotificationEvent',
  SetThreadState = 'SetThreadStateNotificationEvent',
  SetUuidState = 'SetUuidStateNotificationEvent',
}

export const AbstractNotificationEventDecoder = t.type({
  id: t.number,
  instance: InstanceDecoder,
  date: t.string,
  actorId: t.number,
  objectId: t.number,
})

export const SetThreadStateNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.SetThreadState),
      threadId: t.number,
      archived: t.boolean,
    }),
  ]),
)

export const RemoveTaxonomyLinkNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.RemoveTaxonomyLink),
      parentId: t.number,
      childId: t.number,
    }),
  ]),
)

export const CheckoutRevisionNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.CheckoutRevision),
      repositoryId: t.number,
      revisionId: t.number,
      reason: t.string,
    }),
  ]),
)

export const RejectRevisionNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.RejectRevision),
      repositoryId: t.number,
      revisionId: t.number,
      reason: t.string,
    }),
  ]),
)

export const CreateCommentNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.CreateComment),
      threadId: t.number,
      commentId: t.number,
    }),
  ]),
)

export const CreateEntityNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.CreateEntity),
      entityId: t.number,
    }),
  ]),
)

export const CreateEntityLinkNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.CreateEntityLink),
      parentId: t.number,
      childId: t.number,
    }),
  ]),
)

export const RemoveEntityLinkNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.RemoveEntityLink),
      parentId: t.number,
      childId: t.number,
    }),
  ]),
)

export const CreateEntityRevisionNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.CreateEntityRevision),
      entityId: t.number,
      entityRevisionId: t.number,
    }),
  ]),
)

export const CreateTaxonomyTermNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.CreateTaxonomyTerm),
      taxonomyTermId: t.number,
    }),
  ]),
)

export const SetTaxonomyTermNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.SetTaxonomyTerm),
      taxonomyTermId: t.number,
    }),
  ]),
)

export const CreateTaxonomyLinkNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.CreateTaxonomyLink),
      parentId: t.number,
      childId: t.number,
    }),
  ]),
)

export const SetTaxonomyParentNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.SetTaxonomyParent),
      previousParentId: t.union([t.number, t.null]),
      parentId: t.union([t.number, t.null]),
      childId: t.number,
    }),
  ]),
)

export const CreateThreadNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.CreateThread),
      threadId: t.number,
    }),
  ]),
)

export const SetLicenseNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.SetLicense),
      repositoryId: t.number,
    }),
  ]),
)

export const SetUuidStateNotificationEventDecoder = t.exact(
  t.intersection([
    AbstractNotificationEventDecoder,
    t.type({
      __typename: t.literal(NotificationEventType.SetUuidState),
      trashed: t.boolean,
    }),
  ]),
)

export const NotificationEventDecoder = t.union([
  CheckoutRevisionNotificationEventDecoder,
  CreateCommentNotificationEventDecoder,
  CreateEntityNotificationEventDecoder,
  CreateEntityRevisionNotificationEventDecoder,
  CreateEntityLinkNotificationEventDecoder,
  CreateTaxonomyTermNotificationEventDecoder,
  CreateTaxonomyLinkNotificationEventDecoder,
  CreateThreadNotificationEventDecoder,
  RejectRevisionNotificationEventDecoder,
  RemoveEntityLinkNotificationEventDecoder,
  RemoveTaxonomyLinkNotificationEventDecoder,
  SetLicenseNotificationEventDecoder,
  SetTaxonomyTermNotificationEventDecoder,
  SetTaxonomyParentNotificationEventDecoder,
  SetThreadStateNotificationEventDecoder,
  SetUuidStateNotificationEventDecoder,
])

export const NotificationDecoder = t.exact(
  t.type({
    id: t.number,
    unread: t.boolean,
    email: t.boolean,
    emailSent: t.boolean,
    event: NotificationEventDecoder,
  }),
)

export const SubscriptionsDecoder = t.strict({
  subscriptions: t.array(t.type({ objectId: t.number, sendEmail: t.boolean })),
})

export const SubjectDecoder = t.strict({
  instance: InstanceDecoder,
  taxonomyTermId: t.number,
})
