import { option as O, function as F } from 'fp-ts'
import * as t from 'io-ts'

import { InstanceDecoder } from './decoder'
import { createQuery } from '~/internals/data-source-helper'
import { Environment } from '~/internals/environment'

export function createKratosModel({
  environment,
}: {
  environment: Environment
}) {
  const getUserLanguage = createQuery(
    {
      decoder: t.union([InstanceDecoder, t.null]),
      enableSwr: true,
      staleAfter: { days: 30 },
      maxAge: { days: 180 },
      async getCurrentValue({ userLegacyId }: { userLegacyId: number }) {
        const kratosIdentity =
          await environment.authServices.kratos.db.getIdentityByLegacyId(
            userLegacyId
          )
        const language = kratosIdentity?.traits?.language

        return InstanceDecoder.is(language) ? language : null
      },
      getKey: ({ userLegacyId }) => {
        return `kratos.serlo.org/user-language/${userLegacyId}`
      },
      getPayload: (key) => {
        if (!key.startsWith('kratos.serlo.org/user-language/')) return O.none
        const userLegacyId = parseInt(
          key.replace('kratos.serlo.org/user-language/', '')
        )
        return F.pipe(
          O.some({ userLegacyId }),
          O.filter(
            ({ userLegacyId }) => !isNaN(userLegacyId) && userLegacyId > 0
          )
        )
      },
      examplePayload: { userLegacyId: 1 },
    },
    environment
  )

  return {
    getUserLanguage,
  }
}
