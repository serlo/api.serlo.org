import { rest } from 'msw'

import { LicensePayload } from '../../src/graphql/schema/license'
import { UuidPayload } from '../../src/graphql/schema/uuid'
import { Instance } from '../../src/types'

export function createLicenseHandler(license: LicensePayload) {
  return createJsonHandler({
    instance: license.instance,
    path: `/api/license/${license.id}`,
    body: license,
  })
}

export function createUuidHandler(uuid: UuidPayload) {
  return createJsonHandler({
    path: `/api/uuid/${uuid.id}`,
    body: uuid,
  })
}

function createJsonHandler({
  instance = Instance.De,
  path,
  body,
}: {
  instance?: Instance
  path: string
  body: unknown
}) {
  return rest.get(
    `http://${instance}.${process.env.SERLO_ORG_HOST}${path}`,
    (_req, res, ctx) => {
      return res(ctx.status(200), ctx.json(body as Record<string, unknown>))
    }
  )
}
