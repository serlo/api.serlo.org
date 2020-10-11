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

import { GraphQLClient, gql } from 'graphql-request'
import jwt from 'jsonwebtoken'
import { Service, cacheKeysResponse } from './lib'

export class CacheWorker {
  private grahQLClient: GraphQLClient

  private cacheKeysLiteral = ''
  private updateCacheLiteral = ''

  public okLog: { data: any; http: any }[] = []
  public errLog: Error[] = []

  public constructor({
    apiEndpoint,
    service,
    secret,
  }: {
    apiEndpoint: string
    service?: Service
    secret?: string
  }) {
    this.grahQLClient = new GraphQLClient(
      apiEndpoint,
      secret === undefined
        ? {}
        : {
            headers: {
              Authorization: `Serlo Service=${jwt.sign({}, secret, {
                expiresIn: '2h',
                audience: 'api.serlo.org',
                issuer: service,
              })}`,
            },
          }
    )
  }

  public getCacheKeysLiteral(): string {
    return this.cacheKeysLiteral
  }

  public getUpdateCacheLiteral(): string {
    return this.updateCacheLiteral
  }

  private setCursorIn_cacheKeys(cursor = ''): void {
    this.cacheKeysLiteral = gql`
      query _cacheKeys {
        _cacheKeys (first: 10, after: "${cursor}") {
          nodes
          pageInfo { 
            hasNextPage 
            endCursor 
          } 
        } 
      }
    `
  }

  private setCacheKeysIn_updateCache(cacheKeys: string[]) {
    this.updateCacheLiteral = gql`
      mutation _updateCache {
        _updateCache(keys: [${cacheKeys}])
      }
    `
  }

  private async call_updateCache(): Promise<void> {
    await this.grahQLClient
      .request(this.updateCacheLiteral)
      .then((res) => this.fillLogs(res))
      .catch((err) => this.fillLogs(err))
  }

  private fillLogs(response: any): void {
    if (response instanceof Error || response.errors) {
      this.errLog.push(response)
      return
    }
    this.okLog.push(response)
  }

  private stringifyKeys(keysArr: string[]): string[] {
    // GraphQL doesn't recognize JS strings as strings,
    // that is why it is necessary to put them
    // explicitly between double quotes
    return keysArr.map((e) => `"${e}"`)
  }

  private setRequests(response: cacheKeysResponse): boolean {
    const { nodes, pageInfo } = response.data._cacheKeys
    this.setCursorIn_cacheKeys(pageInfo.endCursor!)
    const cacheKeys = this.stringifyKeys(nodes)
    this.setCacheKeysIn_updateCache(cacheKeys)
    return pageInfo.hasNextPage
  }

  public async updateCache(keysFromEnv: string): Promise<void> {
    if (keysFromEnv == 'all') {
      let thereIsNextPage = false
      this.setCursorIn_cacheKeys()
      do {
        await this.grahQLClient
          .request(this.cacheKeysLiteral)
          .then(async (res) => {
            thereIsNextPage = this.setRequests(res)
            await this.call_updateCache()
          })
          .catch((err) => this.fillLogs(err))
      } while (thereIsNextPage)
    } else {
      let keys = keysFromEnv.split(',').map((k) => k.trim())
      keys = this.stringifyKeys(keys)
      this.setCacheKeysIn_updateCache(keys)
      await this.call_updateCache()
    }
  }
}
