import { entityRevisionQuery } from '../../__utils__'

test('Uuid query for an entity revision', async () => {
  await entityRevisionQuery.shouldReturnData({
    uuid: {
      __typename: 'ArticleRevision',
      id: 35296,
      author: { id: 26334 },
      trashed: false,
      alias: '/entity/repository/compare/35295/35296',
      date: '2015-02-22T20:29:03.000Z',
      repository: { id: 35295 },
      title: '"falsche Freunde"',
      content:
        '{"plugin":"rows","state":[{"plugin":"text","state":[{"type":"p","children":[{"text":"wip"}]}]}]}',
      changes: '',
      metaTitle: '',
      metaDescription: '',
      url: '',
    },
  })
})
