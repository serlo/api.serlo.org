import { V0alpha2Api } from '@ory/client'
import { NextFunction, Request, Response } from 'express'

import { given } from '../__utils__'
import { createKratosRegisterHandler } from '~/internals/server/kratos-middleware'

describe('Kratos middleware - register endpoint', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const nextFunction: NextFunction = jest.fn()

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      end: jest.fn(),
    }
  })

  const fakeKratos = {
    adminGetIdentity: async (userId: string) => {
      return Promise.resolve({
        data: {
          id: userId,
          traits: {
            username: 'user',
            email: 'user@serlo.dev',
          },
        },
      })
    },
    adminUpdateIdentity: async () => {
      return Promise.resolve()
    },
  } as unknown as V0alpha2Api

  const kratosRegisterEndpoint = createKratosRegisterHandler(fakeKratos)

  test('without secret', () => {
    mockRequest = {
      headers: {},
    }
    const expectedResponse = 'Kratos secret mismatch'

    kratosRegisterEndpoint(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(mockResponse.end).toBeCalledWith(expectedResponse)
  })

  test('without userId', () => {
    mockRequest = {
      headers: {
        'x-kratos-key': process.env.SERVER_KRATOS_SECRET,
      },
    }
    const expectedResponse = 'Valid identity id has to be provided'

    kratosRegisterEndpoint(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(mockResponse.end).toBeCalledWith(expectedResponse)
  })

  test('without valid userId', () => {
    mockRequest = {
      headers: {
        'x-kratos-key': process.env.SERVER_KRATOS_SECRET,
      },
      body: {
        // kratos identity is a uuidv4, not a number like in legacy
        userId: 1,
      },
    }
    const expectedResponse = 'Valid identity id has to be provided'

    kratosRegisterEndpoint(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(mockResponse.end).toBeCalledWith(expectedResponse)
  })

  test('with valid userId', async () => {
    given('UserCreateMutation').returns({
      userId: 1,
      success: true,
    })
    given('UserAddRoleMutation').returns({
      success: true,
    })

    mockRequest = {
      headers: {
        'x-kratos-key': process.env.SERVER_KRATOS_SECRET,
      },
      body: {
        userId: 'e4c6a348-ab17-4b82-95e9-c5354a7f58eb',
      },
    }

    const expectedResponse = JSON.stringify({
      status: 'success',
    })

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await kratosRegisterEndpoint(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(mockResponse.end).toBeCalledWith(expectedResponse)
  })
})
