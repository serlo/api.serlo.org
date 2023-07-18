import { authorizationSchema } from './authorization'
import { cacheSchema } from './cache'
import { connectionSchema } from './connection'
import { dateTimeSchema } from './date-time'
import { instanceSchema } from './instance'
import { jsonSchema } from './json'
import { licenseSchema } from './license'
import { mediaSchema } from './media'
import { metadataSchema } from './metadata'
import { notificationSchema } from './notification'
import { oauthSchema } from './oauth'
import { rolesSchema } from './roles'
import { subjectsSchema } from './subject'
import { subscriptionSchema } from './subscription'
import { threadSchema } from './thread'
import { uuidSchema } from './uuid'
import { versionSchema } from './version'
import { mergeSchemas } from '~/internals/graphql'

export const schema = mergeSchemas(
  authorizationSchema,
  connectionSchema,
  cacheSchema,
  dateTimeSchema,
  instanceSchema,
  jsonSchema,
  licenseSchema,
  mediaSchema,
  metadataSchema,
  notificationSchema,
  oauthSchema,
  rolesSchema,
  subjectsSchema,
  subscriptionSchema,
  threadSchema,
  uuidSchema,
  versionSchema,
)
