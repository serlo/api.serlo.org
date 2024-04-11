// TODO: check what we should move over

// import gql from 'graphql-tag'
// import * as R from 'ramda'

// import {
//   applet,
//   appletRevision,
//   article,
//   articleRevision,
//   course,
//   coursePage,
//   coursePageRevision,
//   courseRevision,
//   event,
//   eventRevision,
//   exercise,
//   exerciseGroup,
//   exerciseGroupRevision,
//   exerciseRevision,
//   licenseId,
//   page,
//   pageRevision,
//   user,
//   video,
//   videoRevision,
// } from '../../../__fixtures__'
// import { nextUuid, getTypenameAndId, given, Client } from '../../__utils__'
// import { Model } from '~/internals/graphql'
// import {
//   EntityRevisionType,
//   EntityType,
//   RepositoryType,
//   RevisionType,
//   DiscriminatorType,
//   castToUuid,
// } from '~/model/decoder'

// const client = new Client()

// const repositoryFixtures: Record<
//   RepositoryType,
//   {
//     repository: Model<'AbstractRepository'>
//     revision: Model<'AbstractRevision'>
//     revisionType: RevisionType
//   }
// > = {
//   [EntityType.Applet]: {
//     repository: applet,
//     revision: appletRevision,
//     revisionType: EntityRevisionType.AppletRevision,
//   },
//   [EntityType.Article]: {
//     repository: article,
//     revision: articleRevision,
//     revisionType: EntityRevisionType.ArticleRevision,
//   },
//   [EntityType.Course]: {
//     repository: course,
//     revision: courseRevision,
//     revisionType: EntityRevisionType.CourseRevision,
//   },
//   [EntityType.CoursePage]: {
//     repository: coursePage,
//     revision: coursePageRevision,
//     revisionType: EntityRevisionType.CoursePageRevision,
//   },
//   [EntityType.Event]: {
//     repository: event,
//     revision: eventRevision,
//     revisionType: EntityRevisionType.EventRevision,
//   },
//   [EntityType.Exercise]: {
//     repository: exercise,
//     revision: exerciseRevision,
//     revisionType: EntityRevisionType.ExerciseRevision,
//   },
//   [EntityType.ExerciseGroup]: {
//     repository: exerciseGroup,
//     revision: exerciseGroupRevision,
//     revisionType: EntityRevisionType.ExerciseGroupRevision,
//   },
//   [EntityType.Video]: {
//     repository: video,
//     revision: videoRevision,
//     revisionType: EntityRevisionType.VideoRevision,
//   },
//   [DiscriminatorType.Page]: {
//     repository: page,
//     revision: pageRevision,
//     revisionType: DiscriminatorType.PageRevision,
//   },
// }
// const repositoryCases = R.toPairs(repositoryFixtures)

// describe('Repository', () => {
//   const aliasQuery = client.prepareQuery({
//     query: gql`
//       query repository($alias: AliasInput!) {
//         uuid(alias: $alias) {
//           __typename
//           ... on AbstractRepository {
//             id
//           }
//         }
//       }
//     `,
//   })

//   test.each(repositoryCases)('%s by id', async (_type, { repository }) => {
//     given('UuidQuery').for(repository)

//     await client
//       .prepareQuery({
//         query: gql`
//           query repository($id: Int!) {
//             uuid(id: $id) {
//               __typename
//               ... on AbstractRepository {
//                 id
//                 trashed
//                 date
//               }
//             }
//           }
//         `,
//       })
//       .withVariables(repository)
//       .shouldReturnData({
//         uuid: R.pick(['__typename', 'id', 'trashed', 'date'], repository),
//       })
//   })

//   test.each(repositoryCases)(
//     '%s by alias (url-encoded)',
//     async (_type, { repository }) => {
//       given('UuidQuery').for(repository)
//       given('AliasQuery')
//         .withPayload({ instance: repository.instance, path: '/ü' })
//         .returns({
//           id: repository.id,
//           instance: repository.instance,
//           path: '/ü',
//         })

//       await aliasQuery
//         .withVariables({
//           alias: { instance: repository.instance, path: '/%C3%BC' },
//         })
//         .shouldReturnData({ uuid: getTypenameAndId(repository) })
//     },
//   )

//   test.each(repositoryCases)(
//     '%s by alias (/:id)',
//     async (_type, { repository }) => {
//       given('UuidQuery').for(repository)
//       given('AliasQuery')
//         .withPayload({ instance: repository.instance, path: '/path' })
//         .returns({
//           id: repository.id,
//           instance: repository.instance,
//           path: '/path',
//         })

//       await aliasQuery
//         .withVariables({
//           alias: { instance: repository.instance, path: `/${repository.id}` },
//         })
//         .shouldReturnData({ uuid: getTypenameAndId(repository) })
//     },
//   )

//   test.each(repositoryCases)(
//     '%s by id (w/ currentRevision)',
//     async (type, { repository, revision }) => {
//       given('UuidQuery').for(repository, revision)

//       await client
//         .prepareQuery({
//           query: gql`
//             query repository($id: Int!) {
//               uuid(id: $id) {
//                 ... on ${type} {
//                   currentRevision {
//                     __typename
//                     id
//                     trashed
//                     date
//                   }
//                 }
//               }
//             }
//           `,
//         })
//         .withVariables(repository)
//         .shouldReturnData({
//           uuid: {
//             currentRevision: R.pick(
//               ['__typename', 'id', 'trashed', 'date'],
//               revision,
//             ),
//           },
//         })
//     },
//   )

//   test.each(repositoryCases)(
//     '%s by id (w/ license)',
//     async (_type, { repository }) => {
//       given('UuidQuery').for(repository)

//       await client
//         .prepareQuery({
//           query: gql`
//             query license($id: Int!) {
//               uuid(id: $id) {
//                 ... on AbstractRepository {
//                   licenseId
//                 }
//               }
//             }
//           `,
//         })
//         .withVariables({ id: repository.id })
//         .shouldReturnData({ uuid: { licenseId } })
//     },
//   )

//   describe.each(repositoryCases)(
//     '%s by id (w/ revisions)',
//     (type, { repository, revision }) => {
//       const revisedRevision = { ...revision, id: castToUuid(revision.id - 10) }
//       const unrevisedRevision = { ...revision, id: nextUuid(revision.id) }
//       const revisionsQuery = client.prepareQuery({
//         query: gql`
//               query unrevisedRevisionsOfRepository($id: Int!, $unrevised: Boolean) {
//                 uuid(id: $id) {
//                   ... on ${type} {
//                     revisions (unrevised: $unrevised) {
//                       totalCount
//                       nodes {
//                         __typename
//                         id
//                       }
//                     }
//                   }
//                 }
//               }
//             `,
//       })

//       beforeEach(() => {
//         given('UuidQuery').for(
//           {
//             ...repository,
//             revisionIds: [
//               unrevisedRevision.id,
//               revisedRevision.id,
//               revision.id,
//             ],
//           },
//           unrevisedRevision,
//           revision,
//           revisedRevision,
//         )
//       })

//       test('returns all revisions when no arguments are given', async () => {
//         await revisionsQuery
//           .withVariables({ id: repository.id })
//           .shouldReturnData({
//             uuid: {
//               revisions: {
//                 nodes: [
//                   getTypenameAndId(unrevisedRevision),
//                   getTypenameAndId(revision),
//                   getTypenameAndId(revisedRevision),
//                 ],
//               },
//             },
//           })
//       })

//       test('returns all unrevised revisions when unrevised=true', async () => {
//         await revisionsQuery
//           .withVariables({ id: repository.id, unrevised: true })
//           .shouldReturnData({
//             uuid: {
//               revisions: {
//                 nodes: [getTypenameAndId(unrevisedRevision)],
//                 totalCount: 1,
//               },
//             },
//           })
//       })

//       test('when unrevised=true trashed revisions are not included', async () => {
//         given('UuidQuery').for({ ...unrevisedRevision, trashed: true })

//         await revisionsQuery
//           .withVariables({ id: repository.id, unrevised: true })
//           .shouldReturnData({
//             uuid: { revisions: { nodes: [], totalCount: 0 } },
//           })
//       })

//       test('returns all revised revisions when unrevised=false', async () => {
//         await revisionsQuery
//           .withVariables({ id: repository.id, unrevised: false })
//           .shouldReturnData({
//             uuid: {
//               revisions: {
//                 totalCount: 2,
//                 nodes: [
//                   getTypenameAndId(revision),
//                   getTypenameAndId(revisedRevision),
//                 ],
//               },
//             },
//           })
//       })

//       test('when unrevised=true trashed revisions are not included', async () => {
//         given('UuidQuery').for({ ...revisedRevision, trashed: true })

//         await revisionsQuery
//           .withVariables({ id: repository.id, unrevised: false })
//           .shouldReturnData({
//             uuid: {
//               revisions: {
//                 nodes: [getTypenameAndId(revision)],
//                 totalCount: 1,
//               },
//             },
//           })
//       })
//     },
//   )
// })

// describe('Revision', () => {
//   test.each(repositoryCases)(
//     '%s by id (w/ author)',
//     async (_type, { revision }) => {
//       given('UuidQuery').for({ ...revision, authorId: user.id }, user)

//       await client
//         .prepareQuery({
//           query: gql`
//             query revision($id: Int!) {
//               uuid(id: $id) {
//                 ... on AbstractRevision {
//                   author {
//                     __typename
//                     id
//                   }
//                 }
//               }
//             }
//           `,
//         })
//         .withVariables(revision)
//         .shouldReturnData({ uuid: { author: getTypenameAndId(user) } })
//     },
//   )

//   test.each(repositoryCases)(
//     '%s by id (w/ repository)',
//     async (_type, { repository, revision, revisionType }) => {
//       given('UuidQuery').for(repository, revision)

//       await client
//         .prepareQuery({
//           query: gql`
//             query revision($id: Int!) {
//               uuid(id: $id) {
//                 ... on ${revisionType} {
//                   repository {
//                     __typename
//                     id
//                   }
//                 }
//               }
//             }
//           `,
//         })
//         .withVariables(revision)
//         .shouldReturnData({
//           uuid: { repository: getTypenameAndId(repository) },
//         })
//     },
//   )
// })
