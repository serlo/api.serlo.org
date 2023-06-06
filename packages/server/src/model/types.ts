import { Scope } from '@serlo/authorization'
import * as t from 'io-ts'

import {
  AppletDecoder,
  AppletRevisionDecoder,
  ArticleDecoder,
  ArticleRevisionDecoder,
  CheckoutRevisionNotificationEventDecoder,
  CommentDecoder,
  CourseDecoder,
  CoursePageDecoder,
  CoursePageRevisionDecoder,
  CourseRevisionDecoder,
  CreateCommentNotificationEventDecoder,
  CreateEntityLinkNotificationEventDecoder,
  CreateEntityNotificationEventDecoder,
  CreateEntityRevisionNotificationEventDecoder,
  CreateTaxonomyLinkNotificationEventDecoder,
  CreateTaxonomyTermNotificationEventDecoder,
  CreateThreadNotificationEventDecoder,
  EventDecoder,
  EventRevisionDecoder,
  ExerciseDecoder,
  ExerciseGroupDecoder,
  ExerciseGroupRevisionDecoder,
  ExerciseRevisionDecoder,
  GroupedExerciseDecoder,
  GroupedExerciseRevisionDecoder,
  NotificationDecoder,
  PageDecoder,
  PageRevisionDecoder,
  RejectRevisionNotificationEventDecoder,
  RemoveEntityLinkNotificationEventDecoder,
  RemoveTaxonomyLinkNotificationEventDecoder,
  SetLicenseNotificationEventDecoder,
  SetTaxonomyParentNotificationEventDecoder,
  SetTaxonomyTermNotificationEventDecoder,
  SetThreadStateNotificationEventDecoder,
  SetUuidStateNotificationEventDecoder,
  SolutionDecoder,
  SolutionRevisionDecoder,
  SubscriptionsDecoder,
  TaxonomyTermDecoder,
  UserDecoder,
  VideoDecoder,
  VideoRevisionDecoder,
} from './decoder'
import { Payload } from '~/internals/model'
import { Role } from '~/types'

export interface Models {
  Applet: t.TypeOf<typeof AppletDecoder>
  AppletRevision: t.TypeOf<typeof AppletRevisionDecoder>
  Article: t.TypeOf<typeof ArticleDecoder>
  ArticleRevision: t.TypeOf<typeof ArticleRevisionDecoder>
  Comment: t.TypeOf<typeof CommentDecoder>
  CoursePage: t.TypeOf<typeof CoursePageDecoder>
  CoursePageRevision: t.TypeOf<typeof CoursePageRevisionDecoder>
  Course: t.TypeOf<typeof CourseDecoder>
  CourseRevision: t.TypeOf<typeof CourseRevisionDecoder>
  Event: t.TypeOf<typeof EventDecoder>
  EventRevision: t.TypeOf<typeof EventRevisionDecoder>
  ExerciseGroup: t.TypeOf<typeof ExerciseGroupDecoder>
  ExerciseGroupRevision: t.TypeOf<typeof ExerciseGroupRevisionDecoder>
  Exercise: t.TypeOf<typeof ExerciseDecoder>
  ExerciseRevision: t.TypeOf<typeof ExerciseRevisionDecoder>
  GroupedExercise: t.TypeOf<typeof GroupedExerciseDecoder>
  GroupedExerciseRevision: t.TypeOf<typeof GroupedExerciseRevisionDecoder>
  Navigation: Payload<'serlo', 'getNavigation'>
  Page: t.TypeOf<typeof PageDecoder>
  PageRevision: t.TypeOf<typeof PageRevisionDecoder>
  Subject: { taxonomyTermId: number }
  SubscriptionInfo: t.TypeOf<
    typeof SubscriptionsDecoder
  >['subscriptions'][number]
  Solution: t.TypeOf<typeof SolutionDecoder>
  SolutionRevision: t.TypeOf<typeof SolutionRevisionDecoder>
  TaxonomyTerm: t.TypeOf<typeof TaxonomyTermDecoder>
  Thread: {
    __typename: 'Thread'
    commentPayloads: Models['Comment'][]
  }
  User: t.TypeOf<typeof UserDecoder>
  Video: t.TypeOf<typeof VideoDecoder>
  VideoRevision: t.TypeOf<typeof VideoRevisionDecoder>
  Notification: t.TypeOf<typeof NotificationDecoder>
  CheckoutRevisionNotificationEvent: t.TypeOf<
    typeof CheckoutRevisionNotificationEventDecoder
  >
  CreateCommentNotificationEvent: t.TypeOf<
    typeof CreateCommentNotificationEventDecoder
  >
  CreateEntityNotificationEvent: t.TypeOf<
    typeof CreateEntityNotificationEventDecoder
  >
  CreateEntityRevisionNotificationEvent: t.TypeOf<
    typeof CreateEntityRevisionNotificationEventDecoder
  >
  CreateEntityLinkNotificationEvent: t.TypeOf<
    typeof CreateEntityLinkNotificationEventDecoder
  >
  CreateTaxonomyTermNotificationEvent: t.TypeOf<
    typeof CreateTaxonomyTermNotificationEventDecoder
  >
  CreateTaxonomyLinkNotificationEvent: t.TypeOf<
    typeof CreateTaxonomyLinkNotificationEventDecoder
  >
  CreateThreadNotificationEvent: t.TypeOf<
    typeof CreateThreadNotificationEventDecoder
  >
  RejectRevisionNotificationEvent: t.TypeOf<
    typeof RejectRevisionNotificationEventDecoder
  >
  RemoveEntityLinkNotificationEvent: t.TypeOf<
    typeof RemoveEntityLinkNotificationEventDecoder
  >
  SetLicenseNotificationEvent: t.TypeOf<
    typeof SetLicenseNotificationEventDecoder
  >
  SetTaxonomyTermNotificationEvent: t.TypeOf<
    typeof SetTaxonomyTermNotificationEventDecoder
  >
  SetTaxonomyParentNotificationEvent: t.TypeOf<
    typeof SetTaxonomyParentNotificationEventDecoder
  >
  SetUuidStateNotificationEvent: t.TypeOf<
    typeof SetUuidStateNotificationEventDecoder
  >
  RemoveTaxonomyLinkNotificationEvent: t.TypeOf<
    typeof RemoveTaxonomyLinkNotificationEventDecoder
  >
  SetThreadStateNotificationEvent: t.TypeOf<
    typeof SetThreadStateNotificationEventDecoder
  >
  ScopedRole: { role: Role; scope: Scope }
}
