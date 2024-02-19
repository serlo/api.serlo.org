import { defaultImport } from 'default-import'

import * as PackageJson from '../../../package.json'
import { LegacyQueries } from '~/internals/graphql'

export const resolvers: LegacyQueries<'version'> = {
  Query: {
    version: () => defaultImport(PackageJson).version,
  },
}
