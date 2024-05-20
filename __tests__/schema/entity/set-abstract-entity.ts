import gql from 'graphql-tag'

import { user } from '../../../__fixtures__'
import {
  Client,
  entityQuery,
  entityRevisionQuery,
  expectEvent,
} from '../../__utils__'
import { NotificationEventType } from '~/model/decoder'

const input = {
  entityType: 'Article',
  changes: 'my change',
  subscribeThis: true,
  subscribeThisByEmail: true,
  needsReview: true,
  parentId: 5,
  entityId: null,
  content: JSON.stringify({ plugin: 'rows', state: [] }),
  metaDescription: 'metaDescription',
  metaTitle: 'metaTitle',
  title: 'a title',
  url: 'url',
}

const mutation = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    mutation ($input: SetAbstractEntityInput!) {
      entity {
        setAbstractEntity(input: $input) {
          entity {
            id
          }
          revision {
            id
          }
          success
        }
      }
    }
  `,
  variables: { input },
})

beforeEach(async () => {
  // create taxonomy Term 106082
  await databaseForTests.mutate('update uuid set id = 106082 where id = 35607')
  await databaseForTests.mutate(
    'update term_taxonomy set id = 106082 where id = 35607',
  )
})

test('creates a new entity when "parentId" is set', async () => {
  const data = (await mutation.getData()) as {
    entity: {
      setAbstractEntity: { entity: { id: number }; revision: { id: number } }
    }
  }

  expect(data).toMatchObject({
    entity: { setAbstractEntity: { success: true } },
  })

  const entityId = data.entity.setAbstractEntity.entity.id
  const revisionId = data.entity.setAbstractEntity.revision.id

  await entityQuery.withVariables({ id: entityId }).shouldReturnData({
    uuid: {
      __typename: 'Article',
      instance: 'de',
      licenseId: 1,
      taxonomyTerms: { nodes: [{ id: input.parentId }] },
    },
  })

  await entityRevisionQuery.withVariables({ id: revisionId }).shouldReturnData({
    uuid: {
      content: input.content,
      url: input.url,
      metaDescription: input.metaDescription,
      title: input.title,
      metaTitle: input.metaTitle,
      changes: input.changes,
    },
  })

  await expectEvent(
    { __typename: NotificationEventType.CreateEntity, objectId: entityId },
    3,
  )
})

test('creates a new revision when "entityId" is set', async () => {
  const data = (await mutation
    .changeInput({ parentId: null, entityId: 1855 })
    .getData()) as {
    entity: {
      setAbstractEntity: { entity: { id: number }; revision: { id: number } }
    }
  }

  expect(data).toMatchObject({
    entity: { setAbstractEntity: { success: true } },
  })

  const entityId = data.entity.setAbstractEntity.entity.id
  const revisionId = data.entity.setAbstractEntity.revision.id

  await entityQuery.withVariables({ id: entityId }).shouldReturnData({
    uuid: { __typename: 'Article', id: 1855 },
  })

  await entityRevisionQuery.withVariables({ id: revisionId }).shouldReturnData({
    uuid: {
      content: input.content,
      url: input.url,
      metaDescription: input.metaDescription,
      title: input.title,
      metaTitle: input.metaTitle,
      changes: input.changes,
    },
  })

  await expectEvent({
    __typename: NotificationEventType.CreateEntityRevision,
    objectId: revisionId,
  })
})

test('check outs new revision when `needsReview` is false', async () => {
  const data = (await mutation
    .changeInput({ needsReview: false })
    .getData()) as {
    entity: {
      setAbstractEntity: { entity: { id: number }; revision: { id: number } }
    }
  }

  expect(data).toMatchObject({
    entity: { setAbstractEntity: { success: true } },
  })

  const entityId = data.entity.setAbstractEntity.entity.id
  const revisionId = data.entity.setAbstractEntity.revision.id

  await entityQuery.withVariables({ id: entityId }).shouldReturnData({
    uuid: { currentRevision: { id: revisionId } },
  })
})

test('fails on review when author has no review roles', async () => {
  await mutation
    .forLoginUser()
    .changeInput({ needsReview: false })
    .shouldFailWithError('FORBIDDEN')
})

test('check outs new revision for entities in autoreview taxonomies for login users', async () => {
  await databaseForTests.mutate(
    'update term_taxonomy_entity set term_taxonomy_id = 106082 where entity_id = 35554',
  )

  const data = (await mutation
    .forLoginUser()
    .changeInput({ entityId: 35554, parentId: null })
    .getData()) as {
    entity: {
      setAbstractEntity: { entity: { id: number }; revision: { id: number } }
    }
  }

  expect(data).toMatchObject({
    entity: { setAbstractEntity: { success: true } },
  })

  const entityId = data.entity.setAbstractEntity.entity.id
  const revisionId = data.entity.setAbstractEntity.revision.id

  await entityQuery.withVariables({ id: entityId }).shouldReturnData({
    uuid: { currentRevision: { id: revisionId } },
  })
})

test('does not check out new revision for entities being in autoreview and non-autoreview taxonomies', async () => {
  await databaseForTests.mutate(
    'insert into term_taxonomy_entity (term_taxonomy_id, entity_id) values (106082, 1855)',
  )

  const data = (await mutation
    .changeInput({ entityId: 1855, parentId: null })
    .getData()) as {
    entity: {
      setAbstractEntity: { entity: { id: number }; revision: { id: number } }
    }
  }

  expect(data).toMatchObject({
    entity: { setAbstractEntity: { success: true } },
  })

  const entityId = data.entity.setAbstractEntity.entity.id

  await entityQuery.withVariables({ id: entityId }).shouldReturnData({
    uuid: { currentRevision: { id: 30674 } },
  })
})

test('fails when both "entityId" and "parentId" are defined', async () => {
  await mutation
    .changeInput({ entityId: null, parentId: null })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when both "entityId" and "parentId" is null', async () => {
  await mutation
    .changeInput({ entityId: null, parentId: null })
    .shouldFailWithError('BAD_USER_INPUT')
})

describe('fails when a mandatory field is missing', () => {
  test('case "url" for an applet', async () => {
    await mutation
      .changeInput({ entityType: 'Applet', url: '' })
      .shouldFailWithError('BAD_USER_INPUT')
  })

  test('case "title" for an article', async () => {
    await mutation
      .changeInput({ entityType: 'Article', title: null })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})

test('fails when entityType is not valid', async () => {
  await mutation
    .changeInput({ entityType: 'foo' })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when changes is empty', async () => {
  await mutation
    .changeInput({ change: '   ' })
    .shouldFailWithError('BAD_USER_INPUT')
})

test('fails when user is not authenticated', async () => {
  await mutation.forUnauthenticatedUser().shouldFailWithError('UNAUTHENTICATED')
})
