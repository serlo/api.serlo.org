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

  private cacheKeysRequest = ''
  private updateCacheRequest = ''

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

  public getUpdateCacheRequest(): string {
    return this.updateCacheRequest
  }

  public async updateCache(keys: string[]): Promise<void> {
    const cacheKeys = this.doubleQuote(keys)
    const keysBlocks = this.splitKeysIntoBlocks(cacheKeys)
    await this.updateBlocksOfKeys(keysBlocks)
  }

  /**
   * doubleQuote puts items of string array between double quotes
   *
   * It seems GraphQL doesn't recognize JS strings as strings,
   * that is why it is necessary to put them
   * explicitly between double quotes
   */
  private doubleQuote(arr: string[]): string[] {
    return arr.map((e) => `"${e}"`)
  }

  private splitKeysIntoBlocks(keys: string[]): string[][] {
    let blocks: string[][] = []
    while (keys.length) {
      const temp = keys.splice(0, 10)
      blocks.push(temp) // TODO: change to 100
    }
    return blocks
  }

  private async updateBlocksOfKeys(keysBlocks: string[][]) {
    for (let block of keysBlocks) {
      this.setUpdateCacheRequest(block)
      await this.requestUpdateCache()
    }
  }

  private setUpdateCacheRequest(cacheKeys: string[]) {
    this.updateCacheRequest = gql`
      mutation _updateCache {
        _updateCache(keys: [${cacheKeys}])
      }
    `
  }

  private async requestUpdateCache(): Promise<void> {
    await this.grahQLClient
      .request(this.updateCacheRequest)
      .then((res) => {
        this.fillLogs(res)
      })
      .catch((err) => {
        this.fillLogs(err)
      })
  }

  private fillLogs(response: any): void {
    if (response instanceof Error || response.errors) {
      this.errLog.push(response)
      return
    }
    this.okLog.push(response)
  }
}
