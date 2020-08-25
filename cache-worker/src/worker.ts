import { GraphQLClient, gql } from 'graphql-request'
import jwt from 'jsonwebtoken'

export class CacheWorker {
  private grahQLClient: GraphQLClient

  private query = ''
  private mutation = ''

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

/*
 * The following types were extracted from their original places
 * and brought to this file in order to make the the cache worker
 * independet from the repo api.serlo.org, since the cache worker
 * may go to another place afterwards.
 * The api.serlo.org were at version 0.9.0 at the time of extraction.
 */

//originally in api.serlo.org/src/graphql/schema/types.ts
export enum Service {
  Serlo = 'serlo.org',
  SerloCloudflareWorker = 'serlo.org-cloudflare-worker',
}

//originally in api.serlo.org/src/graphql/schema/connection/types.ts
interface Connection<T> {
  edges: Cursor<T>[]
  nodes: T[]
  totalCount: number
  pageInfo: PageInfo
}

//originally in api.serlo.org/src/types.ts
export type PageInfo = {
  __typename?: 'PageInfo'
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
  endCursor?: Maybe<Scalars['String']>
}

interface Cursor<T> {
  cursor: string
  node: T
}

type Maybe<T> = T | null

type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  DateTime: string
  JSON: unknown
  JSONObject: Record<string, unknown>
}
