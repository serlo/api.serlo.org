import jwt from 'jsonwebtoken'

import { handleAuthentication, Service } from '~/internals/authentication'

describe('Service token only', () => {
  test('valid serlo.org token', async () => {
    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      audience: 'api.serlo.org',
      issuer: Service.Serlo,
    })
    const header = `Serlo Service=${token}`

    expect(
      await handleAuthentication(
        header,
        createFakeUserAuthenticator({ userId: null }),
      ),
    ).toEqual({
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

    await expect(
      handleAuthentication(header, createFakeUserAuthenticator({ userId: 1 })),
    ).rejects.toThrow(
      'Invalid service token: jwt audience invalid. expected: api.serlo.org',
    )
  })

  test('invalid signature', async () => {
    const token = jwt.sign({}, `${process.env.SERLO_ORG_SECRET}-wrong`, {
      audience: 'api.serlo.org',
      issuer: Service.Serlo,
    })
    const header = `Serlo Service=${token}`

    await expect(
      handleAuthentication(header, createFakeUserAuthenticator({ userId: 1 })),
    ).rejects.toThrow('Invalid service token: invalid signature')
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
      },
    )
    const header = `Serlo Service=${token}`

    await expect(
      handleAuthentication(header, createFakeUserAuthenticator({ userId: 1 })),
    ).rejects.toThrow('Invalid service token: jwt expired')
  })

  test('wrong authentication type', async () => {
    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      audience: 'api.serlo.org',
      issuer: Service.Serlo,
    })
    const header = `Bearer Service=${token}`

    await expect(
      handleAuthentication(header, createFakeUserAuthenticator({ userId: 1 })),
    ).rejects.toThrow('Invalid authorization header')
  })

  test('no longer supported authentication type', async () => {
    const token = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      audience: 'api.serlo.org',
      issuer: Service.Serlo,
    })
    const userToken =
      'Us-VibWgRSlR5sKXeRZ92-QAK3j2MOd3Dht_zBUms7g.o2O8e8VI2ZMSXTt5M_rOiGdoVipNGPrCINTVkv9rPZE'
    const header = `Serlo Service=${token};User=${userToken}`

    await expect(
      handleAuthentication(header, createFakeUserAuthenticator({ userId: 1 })),
    ).rejects.toThrow('Invalid authorization header')
  })
})

describe('Service & User', () => {
  test('valid serlo.org token', async () => {
    const serviceToken = jwt.sign({}, process.env.SERLO_ORG_SECRET, {
      audience: 'api.serlo.org',
      issuer: Service.Serlo,
    })
    const header = `Serlo Service=${serviceToken}`

    expect(
      await handleAuthentication(
        header,
        createFakeUserAuthenticator({ userId: 1 }),
      ),
    ).toEqual({
      service: Service.Serlo,
      userId: 1,
    })
  })

  test('invalid service token', async () => {
    const serviceToken = 'invalid'

    const header = `Serlo Service=${serviceToken}`

    await expect(
      handleAuthentication(header, createFakeUserAuthenticator({ userId: 1 })),
    ).rejects.toThrow('Invalid service token')
  })
})

function createFakeUserAuthenticator({ userId }: { userId: number | null }) {
  return () => Promise.resolve(userId)
}
