import { aiSchema } from './ai'
import { authorizationSchema } from './authorization'
import { cacheSchema } from './cache'
import { connectionSchema } from './connection'
import { dateTimeSchema } from './date-time'
import { defaultGraphQLDefinitionsSchema } from './default-graphql-definitions'
import { instanceSchema } from './instance'
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
  aiSchema,
  authorizationSchema,
  cacheSchema,
  connectionSchema,
  dateTimeSchema,
  instanceSchema,
  defaultGraphQLDefinitionsSchema,
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
