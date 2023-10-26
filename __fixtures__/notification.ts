import {
  article,
  articleRevision,
  taxonomyTermCurriculumTopic,
  taxonomyTermRoot,
  taxonomyTermSubject,
  user,
  comment,
  coursePage,
  course,
} from './uuid'
import { Model } from '~/internals/graphql'
import { castToUuid, NotificationEventType } from '~/model/decoder'
import { Instance } from '~/types'

export const checkoutRevisionNotificationEvent: Model<'CheckoutRevisionNotificationEvent'> =
  {
    __typename: NotificationEventType.CheckoutRevision,
    id: castToUuid(301),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: articleRevision.id,
    repositoryId: article.id,
    revisionId: articleRevision.id,
    reason: 'reason',
  }

export const rejectRevisionNotificationEvent: Model<'RejectRevisionNotificationEvent'> =
  {
    __typename: NotificationEventType.RejectRevision,
    id: castToUuid(38035),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: articleRevision.id,
    repositoryId: article.id,
    revisionId: articleRevision.id,
    reason: 'reason',
  }

export const createCommentNotificationEvent: Model<'CreateCommentNotificationEvent'> =
  {
    __typename: NotificationEventType.CreateComment,
    id: castToUuid(37375),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: comment.id,
    threadId: comment.id,
    commentId: comment.id,
  }

export const createEntityNotificationEvent: Model<'CreateEntityNotificationEvent'> =
  {
    __typename: NotificationEventType.CreateEntity,
    id: castToUuid(298),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: article.id,
    entityId: article.id,
  }

export const createEntityLinkNotificationEvent: Model<'CreateEntityLinkNotificationEvent'> =
  {
    __typename: NotificationEventType.CreateEntityLink,
    id: castToUuid(2115),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: coursePage.id,
    parentId: course.id,
    childId: coursePage.id,
  }

export const removeEntityLinkNotificationEvent: Model<'RemoveEntityLinkNotificationEvent'> =
  {
    __typename: NotificationEventType.RemoveEntityLink,
    id: castToUuid(55273),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: coursePage.id,
    parentId: course.id,
    childId: coursePage.id,
  }

export const createEntityRevisionNotificationEvent: Model<'CreateEntityRevisionNotificationEvent'> =
  {
    __typename: NotificationEventType.CreateEntityRevision,
    id: castToUuid(300),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: articleRevision.id,
    entityId: article.id,
    entityRevisionId: articleRevision.id,
  }

export const createTaxonomyTermNotificationEvent: Model<'CreateTaxonomyTermNotificationEvent'> =
  {
    __typename: NotificationEventType.CreateTaxonomyTerm,
    id: castToUuid(90),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: taxonomyTermCurriculumTopic.id,
    taxonomyTermId: taxonomyTermCurriculumTopic.id,
  }

export const setTaxonomyTermNotificationEvent: Model<'SetTaxonomyTermNotificationEvent'> =
  {
    __typename: NotificationEventType.SetTaxonomyTerm,
    id: castToUuid(38405),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: taxonomyTermCurriculumTopic.id,
    taxonomyTermId: taxonomyTermCurriculumTopic.id,
  }

export const createTaxonomyLinkNotificationEvent: Model<'CreateTaxonomyLinkNotificationEvent'> =
  {
    __typename: NotificationEventType.CreateTaxonomyLink,
    id: castToUuid(674),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: taxonomyTermCurriculumTopic.id,
    parentId: taxonomyTermCurriculumTopic.id,
    childId: article.id,
  }

export const removeTaxonomyLinkNotificationEvent: Model<'RemoveTaxonomyLinkNotificationEvent'> =
  {
    __typename: NotificationEventType.RemoveTaxonomyLink,
    id: castToUuid(48077),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: taxonomyTermCurriculumTopic.id,
    parentId: taxonomyTermCurriculumTopic.id,
    childId: article.id,
  }

export const setTaxonomyParentNotificationEvent: Model<'SetTaxonomyParentNotificationEvent'> =
  {
    __typename: NotificationEventType.SetTaxonomyParent,
    id: castToUuid(47414),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: taxonomyTermCurriculumTopic.id,
    previousParentId: taxonomyTermRoot.id,
    parentId: taxonomyTermSubject.id,
    childId: taxonomyTermCurriculumTopic.id,
  }

export const createThreadNotificationEvent: Model<'CreateThreadNotificationEvent'> =
  {
    __typename: NotificationEventType.CreateThread,
    id: castToUuid(37374),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: article.id,
    threadId: comment.id,
  }

export const setLicenseNotificationEvent: Model<'SetLicenseNotificationEvent'> =
  {
    __typename: NotificationEventType.SetLicense,
    id: castToUuid(297),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: article.id,
    repositoryId: article.id,
  }

export const setThreadStateNotificationEvent: Model<'SetThreadStateNotificationEvent'> =
  {
    __typename: NotificationEventType.SetThreadState,
    id: castToUuid(40750),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: comment.id,
    threadId: comment.id,
    archived: true,
  }

export const setUuidStateNotificationEvent: Model<'SetUuidStateNotificationEvent'> =
  {
    __typename: NotificationEventType.SetUuidState,
    id: castToUuid(38513),
    instance: Instance.De,
    date: '2014-03-01T20:45:56Z',
    actorId: user.id,
    objectId: article.id,
    trashed: true,
  }
