import { GraphQLError } from 'graphql'

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'UNAUTHENTICATED' } })
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'FORBIDDEN' } })
  }
}

export class UserInputError extends GraphQLError {
  constructor(message: string) {
    super(message, { extensions: { code: 'BAD_USER_INPUT' } })
  }
}

export class InternalServerError extends GraphQLError {
  constructor(message = '') {
    super(message, { extensions: { code: 'INTERNAL_SERVER_ERROR' } })
  }
}

export class InvalidCurrentValueError extends GraphQLError {
  constructor(
    public errorContext: {
      invalidCachedValue?: unknown
      invalidCurrentValue: unknown
      decoder: string
      type?: string
      payload: unknown
      key?: string
    },
  ) {
    super('Invalid value received from data source.', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    })
  }
}
