import * as R from 'ramda'

import {
  DiscriminatorType,
  TaxonomyTermPayload,
} from '../../src/graphql/schema'
import { Instance, TaxonomyTermType } from '../../src/types'

export const taxonomyTermRoot: TaxonomyTermPayload = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 3,
  trashed: false,
  alias: null,
  type: TaxonomyTermType.Root,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 1,
  parentId: null,
  childrenIds: [5],
}

export const taxonomyTermSubject: TaxonomyTermPayload = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 5,
  trashed: false,
  alias: 'alias',
  type: TaxonomyTermType.Subject,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 2,
  parentId: taxonomyTermRoot.id,
  childrenIds: [16048],
}

export const taxonomyTermCurriculumTopic: TaxonomyTermPayload = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 16048,
  trashed: false,
  alias: 'alias',
  type: TaxonomyTermType.CurriculumTopic,
  instance: Instance.De,
  name: 'name',
  description: 'description',
  weight: 3,
  parentId: taxonomyTermSubject.id,
  childrenIds: [1855],
}

export function getTaxonomyTermDataWithoutSubResolvers(
  taxonomyTerm: TaxonomyTermPayload
) {
  return R.omit(['parentId', 'childrenIds'], taxonomyTerm)
}
