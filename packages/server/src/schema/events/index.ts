import { checkoutRevisionNotificationEventSchema } from './checkout-revision-notification-event'
import { createCommentNotificationEventSchema } from './create-comment-notification-event'
import { createEntityLinkNotificationSchema } from './create-entity-link-notification-event'
import { createEntityNotificationEventSchema } from './create-entity-notification-event'
import { createEntityRevisionNotificationEventSchema } from './create-entity-revision-notification-event'
import { createTaxonomyLinkNotificationSchema } from './create-taxonomy-link-notification-event'
import { createTaxonomyTermNotificationEventSchema } from './create-taxonomy-term-notification-event'
import { createThreadNotificationEventSchema } from './create-thread-notification-event'
import { rejectRevisionNotificationEventSchema } from './reject-revision-notification-event'
import { removeEntityLinkNotificationSchema } from './remove-entity-link-notification-event'
import { removeTaxonomyLinkNotificationSchema } from './remove-taxonomy-link-notification-event'
import { resolvers } from './resolvers'
import { setLicenseNotificationEventSchema } from './set-license-notification-event'
import { setTaxonomyParentNotificationSchema } from './set-taxonomy-parent-notification-event'
import { setTaxonomyTermNotificationEventSchema } from './set-taxonomy-term-notification-event'
import { setThreadStateNotificationEventSchema } from './set-thread-state-notification-event'
import { setUuidStateNotificationEventSchema } from './set-uuid-state-notification-event'
import typeDefs from './types.graphql'
import { mergeSchemas, Schema } from '~/internals/graphql'

const baseSchema: Schema = { resolvers, typeDefs: [typeDefs] }

export const eventSchema = mergeSchemas(
  baseSchema,
  checkoutRevisionNotificationEventSchema,
  createCommentNotificationEventSchema,
  createEntityNotificationEventSchema,
  createEntityLinkNotificationSchema,
  createEntityRevisionNotificationEventSchema,
  createTaxonomyTermNotificationEventSchema,
  createTaxonomyLinkNotificationSchema,
  createThreadNotificationEventSchema,
  rejectRevisionNotificationEventSchema,
  removeEntityLinkNotificationSchema,
  removeTaxonomyLinkNotificationSchema,
  setLicenseNotificationEventSchema,
  setTaxonomyParentNotificationSchema,
  setTaxonomyTermNotificationEventSchema,
  setThreadStateNotificationEventSchema,
  setUuidStateNotificationEventSchema,
)
