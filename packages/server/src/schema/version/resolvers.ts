import { defaultImport } from 'default-import'

import * as PackageJson from '../../../package.json'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
  Query: {
    version: () => defaultImport(PackageJson).version,
  },
}
