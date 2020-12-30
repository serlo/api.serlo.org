import { TypeResolver } from '~/internals/graphql'
import { InstanceAware } from '~/types'

export interface InstanceAwarePayload extends InstanceAware {
  __typename: string
}

export interface InstanceResolvers {
  InstanceAware: {
    __resolveType: TypeResolver<InstanceAwarePayload>
  }
}
