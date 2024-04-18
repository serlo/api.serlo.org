import { aiSchema } from './ai'
import { authorizationSchema } from './authorization'
import { cacheSchema } from './cache'
import { connectionSchema } from './connection'
import { defaultGraphQLDefinitionsSchema } from './default-graphql-definitions'
import { experimentSchema } from './experiment'
import { instanceSchema } from './instance'
import { mediaSchema } from './media'
import { metadataSchema } from './metadata'
import { notificationSchema } from './notification'
import { oauthSchema } from './oauth'
import { rolesSchema } from './roles'
import { subjectsSchema } from './subject'
import { subscriptionSchema } from './subscription'
import { threadSchema } from './thread'
import { uuidCachedResolvers, uuidSchema } from './uuid'
import { versionSchema } from './version'
import { mergeSchemas } from '~/internals/graphql'

export const schema = mergeSchemas(
  aiSchema,
  authorizationSchema,
  cacheSchema,
  connectionSchema,
  experimentSchema,
  instanceSchema,
  defaultGraphQLDefinitionsSchema,
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

export const cachedResolvers = [...uuidCachedResolvers]
