import gql from 'graphql-tag'
import R from 'ramda'

import { article, articleRevision } from '../../../__fixtures__'
import { given, Client } from '../../__utils__'

test('Article', async () => {
  given('UuidQuery').for(article)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on Article {
              __typename
              id
              instance
              alias
              trashed
              date
            }
          }
        }
      `,
    })
    .withVariables({ id: article.id })
    .shouldReturnData({
      uuid: R.pick(
        ['id', '__typename', 'instance', 'alias', 'trashed', 'date'],
        article,
      ),
    })
})

test('ArticleRevision', async () => {
  given('UuidQuery').for(articleRevision)

  await new Client()
    .prepareQuery({
      query: gql`
        query ($id: Int!) {
          uuid(id: $id) {
            ... on ArticleRevision {
              __typename
              id
              trashed
              alias
              title
              content
              changes
              metaTitle
              metaDescription
            }
          }
        }
      `,
    })
    .withVariables({ id: articleRevision.id })
    .shouldReturnData({
      uuid: R.pick(
        [
          'id',
          '__typename',
          'trashed',
          'alias',
          'title',
          'content',
          'changes',
          'metaTitle',
          'metaDescription',
        ],
        articleRevision,
      ),
    })
})
