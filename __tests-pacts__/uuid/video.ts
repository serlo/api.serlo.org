import { gql } from 'apollo-server'
import * as R from 'ramda'

import { license } from '../../__fixtures__/license'
import {
  video,
  videoAlias,
  videoRevision,
  taxonomyTermSubject,
  user,
} from '../../__fixtures__/uuid'
import { assertSuccessfulGraphQLQuery } from '../__utils__/assertions'
import {
  addAliasInteraction,
  addVideoInteraction,
  addVideoRevisionInteraction,
  addLicenseInteraction,
  addTaxonomyTermInteraction,
  addUserInteraction,
} from '../__utils__/interactions'

describe('Video', () => {
  test('by alias', async () => {
    await addVideoInteraction(video)
    await addAliasInteraction(videoAlias)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${videoAlias.path}"
              }
            ) {
              __typename
              ... on Video {
                id
                trashed
                instance
                alias
                date
                currentRevision {
                  id
                }
                license {
                  id
                }
              }
            }
          }
        `,
      data: {
        uuid: {
          __typename: 'Video',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            video
          ),
          currentRevision: {
            id: videoRevision.id,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })

  test('by alias (w/ license)', async () => {
    await addVideoInteraction(video)
    await addAliasInteraction(videoAlias)
    await addLicenseInteraction(license)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${videoAlias.path}"
            }
          ) {
            __typename
            ... on Video {
              id
              trashed
              instance
              alias
              date
              currentRevision {
                id
              }
              license {
                id
                title
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Video',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            video
          ),
          currentRevision: {
            id: videoRevision.id,
          },
          license: {
            id: 1,
            title: 'title',
          },
        },
      },
    })
  })

  test('by alias (w/ currentRevision)', async () => {
    await addVideoInteraction(video)
    await addAliasInteraction(videoAlias)
    await addVideoRevisionInteraction(videoRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
          {
            uuid(
              alias: {
                instance: de
                path: "${videoAlias.path}"
              }
            ) {
              __typename
              ... on Video {
                id
                trashed
                instance
                alias
                date
                currentRevision {
                  id
                  title
                  url
                  changes
                }
              }
            }
          }
        `,
      data: {
        uuid: {
          __typename: 'Video',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            video
          ),
          currentRevision: {
            id: videoRevision.id,
            title: 'title',
            url: 'url',
            changes: 'changes',
          },
        },
      },
    })
  })

  test('by alias (w/ taxonomyTerms)', async () => {
    await addVideoInteraction(video)
    await addAliasInteraction(videoAlias)
    await addTaxonomyTermInteraction(taxonomyTermSubject)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(
            alias: {
              instance: de
              path: "${videoAlias.path}"
            }
          ) {
            __typename
            ... on Video {
              id
              trashed
              instance
              alias
              date
              taxonomyTerms {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Video',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            video
          ),
          taxonomyTerms: [{ id: 5 }],
        },
      },
    })
  })

  test('by id', async () => {
    await addVideoInteraction(video)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${video.id}) {
            __typename
            ... on Video {
              id
              trashed
              alias
              instance
              date
              currentRevision {
                id
              }
              license {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'Video',
          ...R.omit(
            ['currentRevisionId', 'licenseId', 'taxonomyTermIds'],
            video
          ),
          currentRevision: {
            id: videoRevision.id,
          },
          license: {
            id: 1,
          },
        },
      },
    })
  })
})

describe('VideoRevision', () => {
  test('by id', async () => {
    await addVideoRevisionInteraction(videoRevision)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${videoRevision.id}) {
            __typename
            ... on VideoRevision {
              id
              trashed
              date
              title
              content
              url
              changes
              author {
                id
              }
              video {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'VideoRevision',
          ...R.omit(['authorId', 'repositoryId'], videoRevision),
          author: {
            id: 1,
          },
          video: {
            id: video.id,
          },
        },
      },
    })
  })

  test('by id (w/ author)', async () => {
    await addVideoRevisionInteraction(videoRevision)
    await addUserInteraction(user)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${videoRevision.id}) {
            __typename
            ... on VideoRevision {
              id
              trashed
              date
              title
              content
              url
              changes
              author {
                id
                username
              }
              video {
                id
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'VideoRevision',
          ...R.omit(['authorId', 'repositoryId'], videoRevision),
          author: {
            id: 1,
            username: user.username,
          },
          video: {
            id: video.id,
          },
        },
      },
    })
  })

  test('by id (w/ video)', async () => {
    await addVideoRevisionInteraction(videoRevision)
    await addVideoInteraction(video)
    await assertSuccessfulGraphQLQuery({
      query: gql`
        {
          uuid(id: ${videoRevision.id}) {
            __typename
            ... on VideoRevision {
              id
              trashed
              date
              title
              content
              url
              changes
              author {
                id
              }
              video {
                id
                currentRevision {
                  id
                }
              }
            }
          }
        }
      `,
      data: {
        uuid: {
          __typename: 'VideoRevision',
          ...R.omit(['authorId', 'repositoryId'], videoRevision),
          author: {
            id: 1,
          },
          video: {
            id: video.id,
            currentRevision: {
              id: videoRevision.id,
            },
          },
        },
      },
    })
  })
})
