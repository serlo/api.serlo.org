import { GraphQLClient, gql } from 'graphql-request'
import jwt from 'jsonwebtoken'

export class CacheWorker {
  private grahQLClient: GraphQLClient

  private query = ''
  private mutation = ''

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

  private async call_updateCache(): Promise<void> {
    await this.grahQLClient
      .request(this.mutation)
      .then((res) => this.fillLogs(res))
      .catch((err) => this.fillLogs(err))
  }

  private fillLogs(response: any): void {
    if (response instanceof Error) {
      this.errLog.push(response)
      return
    } else if (response.errors) {
      this.errLog.push(response.errors)
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

  public async updateCache(keysEnv: string): Promise<void> {
    if (keysEnv == 'all') {
      let thereIsNextPage = false
      this.setCursorIn_cacheKeys()
      do {
        await this.grahQLClient
          .request(this.query)
          .then(async (res) => {
            thereIsNextPage = this.setRequests(res)
            await this.call_updateCache()
          })
          .catch((err) => this.fillLogs(err))
      } while (thereIsNextPage)
    } else {
      let keys = keysEnv.split(',').map((k) => k.trim())
      keys = this.stringifyKeys(keys)
      this.setCacheKeysIn_updateCache(keys)
      await this.call_updateCache()
    }
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
