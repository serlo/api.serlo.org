import { GraphQLClient, gql } from 'graphql-request'
import { Service } from './graphql/schema/types'
import { ApolloServer } from 'apollo-server-express'
import { graphql, rest } from 'msw'
import { GraphQLRequest } from 'apollo-server-types'

export default class CacheWorker {
  private grahQLClient: GraphQLClient

  private cursor = ''

  public queryLiteral = `{ _cacheKeys (first: 5, after: "${this.cursor}") { edges { cursor node } nodes totalCount  pageInfo { hasNextPage hasPreviousPage startCursor endCursor } } }`

  private query = gql`
    ${this.queryLiteral}
  `

  public constructor({
    apiEndpoint,
    service,
    secret,
  }: {
    apiEndpoint: string
    service: Service
    secret: string
  }) {
    this.grahQLClient = new GraphQLClient(apiEndpoint, {
      headers: {
        authorization: `Bearer`, // ${}`,
      },
    })
  }

  public async updateWholeCache(): Promise<void> {
    let thereIsNextPage: boolean = false
    do {
      await this.grahQLClient.request(this.query).then(async (data) => {
        this.cursor = data._cacheKeys.pageInfo.endCursor
        this.queryLiteral = `{ _cacheKeys (first: 5, after: "${this.cursor}") { edges { cursor node } nodes totalCount  pageInfo { hasNextPage hasPreviousPage startCursor endCursor } } }`
        thereIsNextPage = data._cacheKeys.pageInfo.hasNextPage
        console.log('data: ', data) //data._cacheKeys.nodes
        let mutation = gql`
          mutation {
            _updateCache(keys: ["de.serlo.org/api/uuid"]) { }
          }
        `
        await this.grahQLClient.request(mutation)
      })
    } while (thereIsNextPage)
  }
}
