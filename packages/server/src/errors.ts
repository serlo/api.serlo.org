import { GraphQLError } from 'graphql'

export class UserInputError extends GraphQLError {
  constructor(message: string, code: string) {
    super(message, {
      extensions: {
        code: code,
      },
    })
  }
}
