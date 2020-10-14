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

  public getCacheKeysRequest(): string {
    return this.cacheKeysRequest
  }

  public getUpdateCacheRequest(): string {
    return this.updateCacheRequest
  }

  private setCacheKeysRequest(cursor = ''): void {
    this.cacheKeysRequest = gql`
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
      .then((res) => this.fillLogs(res))
      .catch((err) => this.fillLogs(err))
  }

  private fillLogs(response: any): void {
    // TODO: avoid any
    if (response instanceof Error || response.errors) {
      this.errLog.push(response)
      return
    }
    this.okLog.push(response)
  }

  /**
   * Puts items of string array between double quotes
   *
   * It seems GraphQL doesn't recognize JS strings as strings,
   * that is why it is necessary to put them
   * explicitly between double quotes
   */
  private doubleQuote(arr: string[]): string[] {
    return arr.map((e) => `"${e}"`)
  }

  private setRequests(response: cacheKeysResponse): boolean {
    const { nodes, pageInfo } = response.data._cacheKeys
    this.setCacheKeysRequest(pageInfo.endCursor!)
    const cacheKeys = this.doubleQuote(nodes)
    this.setUpdateCacheRequest(cacheKeys)
    return pageInfo.hasNextPage
  }

  private splitKeysIntoBlocks(keys: string[]): string[][] {
    let blocks: string[][] = []
    while (keys.length) {
      blocks.push(keys.splice(0, 10)) // TODO: change to 100
    }
    return blocks
  }

  public async updateCache(keys: string[]): Promise<void> {
    const cacheKeys = this.doubleQuote(keys)
    this.setUpdateCacheRequest(cacheKeys)
    await this.requestUpdateCache()
  }

  /*
      let hasNextPage = true
      let endCursor: string | undefined = undefined
      let failuresOnCurrentPage = 0
      let failureCursor: string | undefined = endCursor     
      for (let page = 0; hasNextPage; page++) {
      console.log('page', page, endCursor)
      try {
        const result = await this.getNextCacheKeys(endCursor)
        const { nodes, pageInfo } = result.data._cacheKeys
        await this.updateCache(nodes)
        hasNextPage = pageInfo.hasNextPage
        endCursor = pageInfo.endCursor
      } catch (e) {
        if (failureCursor !== endCursor) {
          failuresOnCurrentPage = 0
          failureCursor = endCursor
        }
        failuresOnCurrentPage++
        page--
        if (failuresOnCurrentPage >= 10) {
          // console.log('Skipping', failureCursor, e)
          const result: cacheKeysResponse = await this.getNextCacheKeys(endCursor)
          hasNextPage = result.data._cacheKeys.pageInfo.hasNextPage
          endCursor = result.data._cacheKeys.pageInfo.endCursor
          continue
        }
        // console.log('Failure', failuresOnCurrentPage, ', retrying...')
        // await wait(1)
      }
    } */

  // this.setCacheKeysRequest()
  // do {
  //   await this.grahQLClient
  //     .request(this.cacheKeysRequest)
  //     .then(async (res) => {
  //       thereIsNextPage = this.setRequests(res)
  //       await this.requestUpdateCache()
  //     })
  //     .catch((err) => this.fillLogs(err))
  // } while (hasNextPage)

  /*   private async getNextCacheKeys(
    endCursor: string | null | undefined
  ): Promise<cacheKeysResponse> {
    let response
    this.setCacheKeysRequest(endCursor!)
    await this.grahQLClient
      .request(this.cacheKeysRequest)
      .then(async (res) => {
        response = res
      })
      .catch((err) => this.fillLogs(err))
    return (response as unknown) as cacheKeysResponse
  } */
}
