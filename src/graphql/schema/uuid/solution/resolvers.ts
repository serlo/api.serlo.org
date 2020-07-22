import {
  createEntityResolvers,
  createEntityRevisionResolvers,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { SolutionPreResolver, SolutionRevisionPreResolver } from './types'

export const resolvers = {
  Solution: createEntityResolvers<
    SolutionPreResolver,
    SolutionRevisionPreResolver
  >({
    entityRevisionType: EntityRevisionType.SolutionRevision,
  }),
  SolutionRevision: createEntityRevisionResolvers<
    SolutionPreResolver,
    SolutionRevisionPreResolver
  >({
    entityType: EntityType.Solution,
    repository: 'solution',
  }),
}
