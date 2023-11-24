import * as R from 'ramda'

import { Instance, InstanceAware } from '~/types'

export function isInstanceAware(object: unknown): object is InstanceAware {
  return R.has('instance', object) && isInstance(object.instance)
}

export function isInstance(instance: unknown): instance is Instance {
  return Object.values(Instance).includes(instance as Instance)
}
