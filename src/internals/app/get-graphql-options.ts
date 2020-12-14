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
import { ApolloServerExpressConfig } from 'apollo-server-express'
import fetch from 'node-fetch'
import { URLSearchParams } from 'url'

import { schema } from '../../schema'
import { handleAuthentication, Service } from '../auth'
import { Environment } from '../environment'
import { Context } from '../graphql'
import { ModelDataSource } from '../model'

export function getGraphQLOptions(
  environment: Environment
): ApolloServerExpressConfig {
  return {
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers,
    // Needed for playground
    introspection: true,
    // We add the playground via express middleware in src/index.ts
    playground: false,
    dataSources() {
      return {
        model: new ModelDataSource(environment),
      }
    },
    context({ req }): Promise<Pick<Context, 'service' | 'user'>> {
      const authorizationHeader = req.headers.authorization
      if (!authorizationHeader) {
        return Promise.resolve({
          service: Service.SerloCloudflareWorker,
          user: null,
        })
      }
      return handleAuthentication(authorizationHeader, async (token) => {
        if (process.env.HYDRA_HOST === undefined) return null
        const params = new URLSearchParams()
        params.append('token', token)
        const resp = await fetch(
          `${process.env.HYDRA_HOST}/oauth2/introspect`,
          {
            method: 'post',
            body: params,
            headers: {
              'X-Forwarded-Proto': 'https',
            },
          }
        )
        const { active, sub } = (await resp.json()) as {
          active: boolean
          sub: string
        }
        return active ? parseInt(sub, 10) : null
      })
    },
  }
}
