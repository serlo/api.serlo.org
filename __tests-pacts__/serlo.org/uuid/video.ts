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
import { gql } from 'apollo-server'
import * as R from 'ramda'

import {
  license,
  taxonomyTermSubject,
  user,
  video,
  videoAlias,
  videoRevision,
} from '../../../__fixtures__'
import { assertSuccessfulGraphQLQuery } from '../../__utils__/assertions'
import {
  addAliasInteraction,
  addLicenseInteraction,
  addTaxonomyTermInteraction,
  addUserInteraction,
  addVideoInteraction,
  addVideoRevisionInteraction,
} from '../../__utils__/interactions'

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
