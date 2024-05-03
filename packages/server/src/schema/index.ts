import { aiSchema } from './ai'
import { authorizationSchema } from './authorization'
import { cacheSchema } from './cache'
import { connectionSchema } from './connection'
import { defaultGraphQLDefinitionsSchema } from './default-graphql-definitions'
import { eventSchema } from './events'
import { experimentSchema } from './experiment'
import { instanceSchema } from './instance'
import { mediaSchema } from './media'
import { metadataSchema } from './metadata'
import { notificationsSchema } from './notifications'
import { oauthSchema } from './oauth'
import { rolesSchema } from './roles'
import { subjectsSchema } from './subject'
import { SubjectResolver } from './subject/resolvers'
import { subscriptionSchema } from './subscription'
import { threadSchema } from './thread'
import { uuidCachedResolvers, uuidSchema } from './uuid'
import { versionSchema } from './version'
import { CachedResolver } from '~/cached-resolver'
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
  notificationsSchema,
  eventSchema,
  oauthSchema,
  rolesSchema,
  subjectsSchema,
  subscriptionSchema,
  threadSchema,
  uuidSchema,
  versionSchema,
)

// TODO: Fix the following type error
export const cachedResolvers: Array<CachedResolver<unknown, unknown>> = [
  // @ts-expect-error Unfortunately typecasting does not work here
  ...uuidCachedResolvers,
  // @ts-expect-error Unfortunately typecasting does not work here
  SubjectResolver,
]
