import { getDefaultLicense, licenses } from '~/config'
import { createNamespace, Queries, TypeResolvers } from '~/internals/graphql'
import { License } from '~/types'

export const resolvers: TypeResolvers<License> & Queries<'license'> = {
  Query: {
    license: createNamespace(),
  },
  LicenseQuery: {
    license(_parent, { id }) {
      return licenses.find((license) => license.id === id) ?? null
    },
    licenses(_parent, { instance }) {
      if (!instance) return licenses
      return licenses.filter((license) => license.instance === instance)
    },
    defaultLicense(_parent, { instance }) {
      return getDefaultLicense(instance)
    },
  },
}
