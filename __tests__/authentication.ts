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
