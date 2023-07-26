import { gql } from 'apollo-server'

import { license } from '../../__fixtures__'
import { Client } from '../__utils__'
import { licenses } from '~/config'

const licenseQuery = new Client().prepareQuery({
  query: gql`
    query license($id: Int!) {
      license {
        license(id: $id) {
          id
          instance
          default
          title
          shortTitle
          url
          content
          agreement
        }
      }
    }
  `,
})

const licensesQuery = new Client().prepareQuery({
  query: gql`
    query licenses($instance: Instance) {
      license {
        licenses(instance: $instance) {
          id
          instance
          default
          title
          shortTitle
          url
          content
          agreement
        }
      }
    }
  `,
})

describe('endpoint "license"', () => {
  test('returns one license', async () => {
    await licenseQuery
      .withVariables({ id: license.id })
      .shouldReturnData({ license: { license } })
  })

  test('returns null when license with given id does not exist', async () => {
    await licenseQuery
      .withVariables({ id: 100 })
      .shouldReturnData({ license: { license: null } })
  })
})

test('endpoint "defaultLicense" returns the default license of an instance', async () => {
  await new Client()
    .prepareQuery({
      query: gql`
        query ($instance: Instance!) {
          license {
            defaultLicense(instance: $instance) {
              id
              instance
              default
              title
              shortTitle
              url
              content
              agreement
            }
          }
        }
      `,
      variables: { instance: 'de' },
    })
    .shouldReturnData({ license: { defaultLicense: license } })
})

describe('endpoint "licenses"', () => {
  test('returns array of licenses filtered by instance', async () => {
    await licensesQuery
      .withVariables({ instance: 'en' })
      .shouldReturnData({ license: { licenses: [licenses[9]] } })
  })

  test('returns all licenses when used without filter', async () => {
    await licensesQuery.shouldReturnData({ license: { licenses } })
  })

  test('fails when instance does not exist', async () => {
    await licensesQuery
      .withVariables({ instance: 'xx' })
      .shouldFailWithError('BAD_USER_INPUT')
  })
})
