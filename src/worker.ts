import { GraphQLClient, gql } from 'graphql-request'

import { Service } from './graphql/schema/types'
import { Connection } from './graphql/schema'

export class CacheWorker {
  private grahQLClient: GraphQLClient

  private query = ''
  private mutation = ''

  public errLog: Error[] = []

  public constructor({
    apiEndpoint,
  }: //service,
  //secret
  // TODO: make a token out of secret and service
  {
    apiEndpoint: string
    service?: Service
    secret?: string
  }) {
    this.grahQLClient = new GraphQLClient(apiEndpoint, {
      headers: {
        authorization: `Bearer ...`,
      },
    })
  }

  public getQueryRequest(): string {
    return this.query
  }

  public getMutationRequest(): string {
    return this.mutation
  }

  private setCursorIn_cacheKeys(cursor = ''): void {
    this.query = gql`
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
    this.mutation = gql`
      mutation _updateCache {
        _updateCache(keys: [${cacheKeys}])
      }
    `
  }

  public async updateWholeCache(): Promise<void> {
    let thereIsNextPage = false
    this.setCursorIn_cacheKeys()
    do {
      await this.grahQLClient
        .request(this.query)
        .then(async (res) => {
          const { nodes, pageInfo } = (res as cacheKeysResponse).data._cacheKeys
          this.setCursorIn_cacheKeys(pageInfo.endCursor!)
          const cacheKeys = nodes.map((e) => `"${e}"`)
          this.setCacheKeysIn_updateCache(cacheKeys)
          await this.grahQLClient
            .request(this.mutation)
            .catch((err) => this.errLog.push(err))
          thereIsNextPage = pageInfo.hasNextPage
        })
        .catch((err) => this.errLog.push(err))
    } while (thereIsNextPage)
  }
}

interface cacheKeysResponse {
  data: {
    _cacheKeys: Connection<string>
  }
}
