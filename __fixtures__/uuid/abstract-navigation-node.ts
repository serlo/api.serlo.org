import { Payload } from '~/internals/model'
import { Instance } from '~/types'

export const navigation: Payload<'serlo', 'getNavigationPayload'> = {
  data: [
    {
      label: 'Mathematik',
      id: 19767,
      children: [
        {
          label: 'Alle Themen',
          id: 5,
        },
      ],
    },
  ],
  instance: Instance.De,
}
