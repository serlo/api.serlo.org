import { decodeId, encodeId } from '~/internals/graphql'

export function encodeSubjectId(id: number) {
  return encodeId({ prefix: 's', id })
}

export function decodeSubjectId(textId: string) {
  return decodeId({ prefix: 's', textId })
}
