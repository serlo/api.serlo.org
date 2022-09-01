/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import jwt from 'jsonwebtoken'

import { handleAuthentication, Service } from '~/internals/authentication'

let requestHeaderCookie: string

describe('Service token only', () => {
  beforeEach(() => {
    requestHeaderCookie = ''
  })

  test('valid serlo.org token', async () => {
    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      audience: 'api.serlo.org',
      issuer: Service.Serlo,
    })
    const header = `Serlo Service=${token}`
    expect(await handleAuthentication(header, fakeUserAuthenticator)).toEqual({
      service: Service.Serlo,
      userId: null,
    })
  })

  test('wrong audience', async () => {
    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      audience: Service.Serlo,
      issuer: Service.Serlo,
    })
    const header = `Serlo Service=${token}`

    try {
      await handleAuthentication(header, fakeUserAuthenticator)
      throw new Error('Expected error')
    } catch (e) {
      const err = e as Error
      expect(err.message).toEqual(
        'Invalid service token: jwt audience invalid. expected: api.serlo.org'
      )
    }
  })

  test('invalid signature', async () => {
    const token = jwt.sign({}, `${process.env.SERLO_ORG_SECRET}-wrong`, {
      audience: 'api.serlo.org',
      issuer: Service.Serlo,
    })
    const header = `Serlo Service=${token}`

    try {
      await handleAuthentication(header, fakeUserAuthenticator)
      throw new Error('Expected error')
    } catch (e) {
      const err = e as Error
      expect(err.message).toEqual('Invalid service token: invalid signature')
    }
  })

  test('expired token', async () => {
    const token = jwt.sign(
      {
        iat: Math.floor(Date.now() / 1000) - 2 * 60 * 60, // 2 hours in past
      },
      process.env.SERLO_ORG_SECRET,
      {
        audience: 'api.serlo.org',
        issuer: Service.Serlo,
        expiresIn: '1h',
      }
    )
    const header = `Serlo Service=${token}`

    try {
      await handleAuthentication(header, fakeUserAuthenticator)
      throw new Error('Expected error')
    } catch (e) {
      const err = e as Error
      expect(err.message).toEqual('Invalid service token: jwt expired')
    }
  })

  test('wrong authentication type', async () => {
    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      audience: 'api.serlo.org',
      issuer: Service.Serlo,
    })
    const header = `Bearer Service=${token}`

    try {
      await handleAuthentication(header, fakeUserAuthenticator)
      throw new Error('Expected error')
    } catch (e) {
      const err = e as Error
      expect(err.message).toEqual('Invalid authorization header')
    }
  })

  test('no longer supported authentication type', async () => {
    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      audience: 'api.serlo.org',
      issuer: Service.Serlo,
    })
    const userToken =
      'Us-VibWgRSlR5sKXeRZ92-QAK3j2MOd3Dht_zBUms7g.o2O8e8VI2ZMSXTt5M_rOiGdoVipNGPrCINTVkv9rPZE'
    const header = `Serlo Service=${token};User=${userToken}`

    try {
      await handleAuthentication(header, fakeUserAuthenticator)
      throw new Error('Expected error')
    } catch (e) {
      const err = e as Error
      expect(err.message).toEqual('Invalid authorization header')
    }
  })
})

describe('Service & User token', () => {
  test('valid serlo.org token & valid cookie session', async () => {
    const serviceToken = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      audience: 'api.serlo.org',
      issuer: Service.Serlo,
    })
    requestHeaderCookie =
      'ory_kratos_session=MTY2MTg4OTA4MXxtekxPS2dhV09Ha09fdDN4RDcxNmx0Y0s2REhvWVVuUEJydmQtWWNzTWtULXNPRnBseHZHblQ5SERNWmkxcmQ1aWU1ZHU4MGZEODNFTXdnTnBXZGN1ZWhiWEdhUi01cnRRNC1aMEYyTWFUQ0IySEg1djBqaVlzRi00NE1Nd1R6NHd6OXo4dmR3blE9PXwYVBtzxUcVJgEjP2wtw0U4PrmZoYE7yfo5XPKWC6UDTg=='

    const header = `Serlo Service=${serviceToken}`
    expect(await handleAuthentication(header, fakeUserAuthenticator)).toEqual({
      service: Service.Serlo,
      userId: 1,
    })
  })

  test('valid serlo.org token & invalid cookie session', async () => {
    const serviceToken = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      audience: 'api.serlo.org',
      issuer: Service.Serlo,
    })

    requestHeaderCookie = 'ory_kratos_session=foobar'

    const header = `Serlo Service=${serviceToken}`
    expect(await handleAuthentication(header, fakeUserAuthenticator)).toEqual({
      service: Service.Serlo,
      userId: null,
    })
  })

  test('invalid service token', async () => {
    const serviceToken = 'invalid'

    const header = `Serlo Service=${serviceToken}`

    try {
      await handleAuthentication(header, fakeUserAuthenticator)
      throw new Error('Expected error')
    } catch (e) {
      const err = e as Error
      expect(err.message).toEqual('Invalid service token')
    }
  })
})

function fakeUserAuthenticator(): Promise<number | null> {
  return Promise.resolve(
    requestHeaderCookie ===
      'ory_kratos_session=MTY2MTg4OTA4MXxtekxPS2dhV09Ha09fdDN4RDcxNmx0Y0s2REhvWVVuUEJydmQtWWNzTWtULXNPRnBseHZHblQ5SERNWmkxcmQ1aWU1ZHU4MGZEODNFTXdnTnBXZGN1ZWhiWEdhUi01cnRRNC1aMEYyTWFUQ0IySEg1djBqaVlzRi00NE1Nd1R6NHd6OXo4dmR3blE9PXwYVBtzxUcVJgEjP2wtw0U4PrmZoYE7yfo5XPKWC6UDTg=='
      ? 1
      : null
  )
}
