/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
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
  _cacheMutation: Record<string, never>
  Comment: t.TypeOf<typeof CommentDecoder>
  CoursePage: t.TypeOf<typeof CoursePageDecoder>
  CoursePageRevision: t.TypeOf<typeof CoursePageRevisionDecoder>
  Course: t.TypeOf<typeof CourseDecoder>
  CourseRevision: t.TypeOf<typeof CourseRevisionDecoder>
  EntityMutation: Record<string, never>
  Event: t.TypeOf<typeof EventDecoder>
  EventRevision: t.TypeOf<typeof EventRevisionDecoder>
  ExerciseGroup: t.TypeOf<typeof ExerciseGroupDecoder>
  ExerciseGroupRevision: t.TypeOf<typeof ExerciseGroupRevisionDecoder>
  Exercise: t.TypeOf<typeof ExerciseDecoder>
  ExerciseRevision: t.TypeOf<typeof ExerciseRevisionDecoder>
  GroupedExercise: t.TypeOf<typeof GroupedExerciseDecoder>
  GroupedExerciseRevision: t.TypeOf<typeof GroupedExerciseRevisionDecoder>
  Mutation: Record<string, never>
  Navigation: Payload<'serlo', 'getNavigation'>
  License: Payload<'serlo', 'getLicense'>
  Page: t.TypeOf<typeof PageDecoder>
  PageRevision: t.TypeOf<typeof PageRevisionDecoder>
  Query: Record<string, never>
  SubscriptionQuery: Record<string, never>
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
