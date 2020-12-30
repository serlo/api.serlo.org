import { Instance, InstanceAware } from '~/types'

export function isInstanceAware(object: unknown): object is InstanceAware {
  return isInstance((object as InstanceAware).instance ?? '')
}

export function isInstance(instance: string): instance is Instance {
  return Object.values(Instance).includes(instance as Instance)
}
