import { Instance } from '~/types'

// Source of truth for this is now the frontend.
// TODO: find another way for createEntity so we don't need this at all
export const defaultLicenseIds: Record<Instance, number> = {
  [Instance.En]: 9,
  [Instance.De]: 1,
  [Instance.Es]: 14,
  [Instance.Hi]: 13,
  [Instance.Ta]: 17,
  [Instance.Fr]: 18,
}
