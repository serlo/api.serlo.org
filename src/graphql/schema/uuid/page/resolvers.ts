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
import { PagePayload, PageRevisionPayload } from '.'
import { requestsOnlyFields } from '../../utils'
import {
  createRepositoryResolvers,
  createRevisionResolvers,
} from '../abstract-repository'
import { decodePath } from '../alias'
import { PageResolvers } from './types'

export const resolvers: PageResolvers = {
  Page: {
    ...createRepositoryResolvers<PagePayload, PageRevisionPayload>(),
    alias(page) {
      return Promise.resolve(page.alias ? decodePath(page.alias) : null)
    },
    async navigation(page, _args, { dataSources }) {
      return dataSources.serlo.getNavigation({
        instance: page.instance,
        id: page.id,
      })
    },
    async license(page, _args, { dataSources }, info) {
      const partialLicense = { id: page.licenseId }
      if (requestsOnlyFields('License', ['id'], info)) {
        return partialLicense
      }
      return dataSources.serlo.getLicense(partialLicense)
    },
  },
  PageRevision: createRevisionResolvers<PagePayload, PageRevisionPayload>(),
}
