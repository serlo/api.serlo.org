import { NavigationPayload } from '../../src/graphql/schema'
import { Instance } from '../../src/types'

export const navigation: NavigationPayload = {
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
