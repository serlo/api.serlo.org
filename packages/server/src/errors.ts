import { GraphQLError } from 'graphql'

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    })
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    })
  }
}

export class UserInputError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    })
  }
}

/**
 * Error for the case an invalid value was returned by a data source function.
 */
export class InvalidCurrentValueError extends Error {
  constructor(
    public errorContext: {
      invalidCachedValue?: unknown
      invalidCurrentValue: unknown
      decoder: string
      type?: string
      payload: unknown
      key?: string
    }
  ) {
    super('Invalid value received from data source.')
  }
}

