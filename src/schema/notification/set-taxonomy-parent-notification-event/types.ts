/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { Resolver } from '../../../internals/graphql'
import { SetTaxonomyParentNotificationEvent } from '../../../types'
import { TaxonomyTermPayload } from '../../uuid'
import {
  AbstractNotificationEventPayload,
  NotificationEventResolvers,
  NotificationEventType,
} from '../types'

export interface SetTaxonomyParentNotificationEventPayload
  extends AbstractNotificationEventPayload,
    Omit<
      SetTaxonomyParentNotificationEvent,
      keyof SetTaxonomyParentNotificationEventResolvers['SetTaxonomyParentNotificationEvent']
    > {
  __typename: NotificationEventType.SetTaxonomyParent
  previousParentId: number | null
  parentId: number | null
  childId: number
}

export interface SetTaxonomyParentNotificationEventResolvers {
  SetTaxonomyParentNotificationEvent: {
    previousParent: Resolver<
      SetTaxonomyParentNotificationEventPayload,
      never,
      TaxonomyTermPayload | null
    >
    parent: Resolver<
      SetTaxonomyParentNotificationEventPayload,
      never,
      TaxonomyTermPayload | null
    >
    child: Resolver<
      SetTaxonomyParentNotificationEventPayload,
      never,
      TaxonomyTermPayload | null
    >
  } & NotificationEventResolvers<SetTaxonomyParentNotificationEventPayload>
}
