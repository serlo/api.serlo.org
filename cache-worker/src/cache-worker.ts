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
import { Service, wait } from './lib'

export class CacheWorker {
  private grahQLClient: GraphQLClient

  private updateCacheRequest = ''

  public okLog: { data: any; http: any }[] = []
  public errLog: Error[] = []

  private pagination: number

  public constructor({
    apiEndpoint,
    service,
    secret,
    pagination = 100,
  }: {
    apiEndpoint: string
    service?: Service
    secret?: string
    pagination?: number
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
    this.pagination = pagination
  }

  public getUpdateCacheRequest(): string {
    return this.updateCacheRequest
  }

  public async update(keys: string[]): Promise<void> {
    const cacheKeys = this.putInDoubleQuotes(keys)
    const keysBlocks = this.splitKeysIntoBlocks(cacheKeys)
    await this.requestUpdateByBlocksOfKeys(keysBlocks)
  }

  /**
   * putInDoubleQuotes puts items of a string array between double quotes
   *
   * It seems GraphQL doesn't recognize JS strings as strings,
   * that is why it is necessary to put them
   * explicitly between double quotes
   */
  private putInDoubleQuotes(arr: string[]): string[] {
    return arr.map((e) => `"${e}"`)
  }

  private splitKeysIntoBlocks(keys: string[]): string[][] {
    let blocksOfKeys: string[][] = []
    while (keys.length) {
      const temp = keys.splice(0, this.pagination)
      blocksOfKeys.push(temp)
    }
    return blocksOfKeys
  }

  private async requestUpdateByBlocksOfKeys(keysBlocks: string[][]) {
    for (let block of keysBlocks) {
      this.setUpdateCacheRequest(block)
      const updateCachePromise = this.requestUpdateCache()
      await this.handleError(updateCachePromise)
    }
  }

  private setUpdateCacheRequest(cacheKeys: string[]) {
    this.updateCacheRequest = gql`
      mutation _updateCache {
        _updateCache(keys: [${cacheKeys}])
      }
    `
  }

  private async requestUpdateCache(): Promise<any> {
    return this.grahQLClient.request(this.updateCacheRequest)
  }

  private async handleError(updateCachePromise: Promise<any>) {
    await updateCachePromise
      .then(async (res: any) => {
        if (res.errors) {
          await this.retry()
        }
        this.fillLogs(res)
      })
      .catch(async (err: any) => {
        await this.retry()
        this.fillLogs(err)
      })
  }

  private async retry() {
    let keepTrying = true
    const MAX_RETRIES = 4
    for (let i = 0; keepTrying; i++) {
      try {
        const res = await this.requestUpdateCache()
        if (!res.errors || i === MAX_RETRIES) {
          keepTrying = false
        }
      } catch (e) {
        if (i === MAX_RETRIES) {
          keepTrying = false
        }
      }
      // TODO: uncomment when timeout of jest is configured
      // to be longer than 5000 ms for the tests of this module
      // await wait(1)
    }
  }

  private fillLogs(response: any): void {
    if (response instanceof Error || response.errors) {
      this.errLog.push(response)
      return
    }
    this.okLog.push(response)
  }
}
