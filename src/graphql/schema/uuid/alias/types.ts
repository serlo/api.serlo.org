import { Instance, Scalars } from '../../../../types'

export interface AliasPayload {
  id: number
  instance: Instance
  path: string
  source: string
  timestamp: Scalars['DateTime']
}
