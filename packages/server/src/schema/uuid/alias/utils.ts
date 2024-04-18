import { lookupCustomAlias } from '~/config'
import { isInstanceAware } from '~/schema/instance/utils'
import { AbstractUuidResolvers } from '~/types'

export function decodePath(path: string) {
  try {
    return decodeURIComponent(path)
  } catch (error) {
    if (error instanceof URIError) {
      // path is probably already decoded
      return path
    } else {
      throw error
    }
  }
}

export function encodePath(path: string) {
  return encodeURIComponent(path).replace(/%2F/g, '/')
}

export function createAliasResolvers(): Pick<AbstractUuidResolvers, 'alias'> {
  return {
    alias(entity) {
      if (isInstanceAware(entity)) {
        const customAlias = lookupCustomAlias(entity)

        if (customAlias) return encodePath(customAlias)
      }

      return encodePath(entity.alias)
    },
  }
}
