import { AuthorizationGuard } from '@serlo/authorization'
import * as R from 'ramda'

import { Context } from '~/context'
import { AuthenticationError, ForbiddenError, UserInputError } from '~/errors'
import { fetchAuthorizationPayload } from '~/schema/authorization/utils'
import { isInstance } from '~/schema/instance/utils'
import { Instance, Role } from '~/types'

export function assertUserIsAuthenticated(
  userId: number | null,
): asserts userId is number {
  if (userId === null) {
    throw new AuthenticationError('You are not logged in')
  }
}

export async function assertUserIsAuthorized({
  message,
  context,
  ...guardRequest
}: {
  message: string
  context: Context
} & GuardRequest): Promise<void> {
  const authorizationPayload = await fetchAuthorizationPayload(context)
  const guards = fromGuardRequest(guardRequest)
  guards.forEach((guard) => {
    if (!guard(authorizationPayload)) {
      throw new ForbiddenError(message)
    }
  })
}

export type GuardRequest =
  | { guard: AuthorizationGuard }
  | { guards: AuthorizationGuard[] }

function fromGuardRequest(guardRequest: GuardRequest): AuthorizationGuard[] {
  return R.has('guards', guardRequest)
    ? guardRequest.guards
    : [guardRequest.guard]
}

export function createNamespace() {
  return () => {
    return {}
  }
}

export function encodeId({ prefix, id }: { prefix: string; id: number }) {
  return encodeToBase64(`${prefix}${id}`)
}

export function decodeId({
  prefix,
  textId,
}: {
  prefix: string
  textId: string
}) {
  const decodedId = decodeFromBase64(textId)
  const id = parseInt(decodedId.substring(prefix.length))

  if (!Number.isNaN(id) && decodedId.substring(0, prefix.length) === prefix) {
    return id
  } else {
    throw new UserInputError('id `${textId}` is invalid')
  }
}

export function encodeToBase64(text: string) {
  return Buffer.from(text).toString('base64')
}

export function decodeFromBase64(text: string) {
  return Buffer.from(text, 'base64').toString('utf8')
}

export function assertStringIsNotEmpty(args: { [key: string]: unknown }) {
  const emptyArgs: string[] = Object.entries(args)
    .filter(
      ([_, value]) => typeof value === 'string' && value.trim().length === 0,
    )
    .map(([key]) => key)

  if (emptyArgs.length > 0) {
    throw new UserInputError(
      `Arguments ${emptyArgs.join(', ')} may not be empty`,
    )
  }
}

export function isGlobalRole(role: Role): boolean {
  return [Role.Guest, Role.Login, Role.Sysadmin].includes(role)
}

export function generateRole(role: Role, instance: Instance | null) {
  if (isGlobalRole(role)) return role
  if (isInstance(instance)) return `${instance}_${role}`
  else throw new UserInputError('This role needs an instance')
}
