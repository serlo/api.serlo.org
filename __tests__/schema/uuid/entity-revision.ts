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
        '{"plugin":"rows","state":[{"plugin":"text","state":[{"type":"p","children":[{"text":"wip"}]}],"id":"7165fed8-d729-45fd-a28c-8ea7c2622953"}],"id":"3b4326f6-88c6-4da8-9bea-f0eb4aa5407a"}',
      changes: '',
      metaTitle: '',
      metaDescription: '',
      url: '',
    },
  })
})
