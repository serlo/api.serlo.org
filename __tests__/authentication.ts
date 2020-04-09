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
import * as jwt from 'jsonwebtoken'

import { handleAuthentication } from '../src/graphql'

test('valid serlo.org token', () => {
  const token = jwt.sign({}, process.env.SERLO_ORG_SECRET!, {
    audience: 'api.serlo.org',
    issuer: 'serlo.org',
  })
  const header = `Serlo Service=${token}`
  expect(handleAuthentication(header)).toEqual({ service: 'serlo.org' })
})

test('wrong audience', () => {
  const token = jwt.sign({}, process.env.SERLO_ORG_SECRET!, {
    audience: 'serlo.org',
    issuer: 'serlo.org',
  })
  const header = `Serlo Service=${token}`
  expect(() => {
    handleAuthentication(header)
  }).toThrow('Invalid token: jwt audience invalid')
})

test('invalid signature', () => {
  const token = jwt.sign({}, `${process.env.SERLO_ORG_SECRET!}-wrong`, {
    audience: 'api.serlo.org',
    issuer: 'serlo.org',
  })
  const header = `Serlo Service=${token}`
  expect(() => {
    handleAuthentication(header)
  }).toThrow('Invalid token: invalid signature')
})

test('expired token', () => {
  const token = jwt.sign(
    {
      iat: Math.floor(Date.now() / 1000) - 2 * 60 * 60, // 2 hours in past
    },
    process.env.SERLO_ORG_SECRET!,
    {
      audience: 'api.serlo.org',
      issuer: 'serlo.org',
      expiresIn: '1h',
    }
  )
  const header = `Serlo Service=${token}`
  expect(() => {
    handleAuthentication(header)
  }).toThrow('Invalid token: jwt expired')
})

test('wrong authentication type', () => {
  const token = jwt.sign({}, process.env.SERLO_ORG_SECRET!, {
    audience: 'api.serlo.org',
    issuer: 'serlo.org',
  })
  const header = `Bearer Service=${token}`
  expect(() => {
    handleAuthentication(header)
  }).toThrow('Invalid authorization header')
})
