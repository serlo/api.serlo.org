import { entityQuery } from '../../__utils__'

test('UuidQuery for an entity', async () => {
  await entityQuery.shouldReturnData({
    uuid: {
      __typename: 'Article',
      id: 27801,
      instance: 'de',
      alias: '/mathe/27801/addition-und-subtraktion-von-dezimalbruechen',
      trashed: false,
      date: '2014-08-26T08:29:35.000Z',
      title: 'Addition und Subtraktion von Dezimalbrüchen',
      licenseId: 1,
      currentRevision: { id: 31072 },
      revisions: {
        nodes: [
          { id: 31072 },
          { id: 30291 },
          { id: 29601 },
          { id: 28697 },
          { id: 28300 },
          { id: 28297 },
          { id: 28292 },
          { id: 28287 },
          { id: 28284 },
          { id: 28283 },
          { id: 28103 },
          { id: 28097 },
          { id: 28094 },
          { id: 27837 },
          { id: 27816 },
        ],
      },
      taxonomyTerms: { nodes: [{ id: 1360 }] },
    },
  })
})
