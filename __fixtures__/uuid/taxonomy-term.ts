import { Model } from '~/internals/graphql'
import { DiscriminatorType } from '~/model/decoder'
import { Instance, TaxonomyTermType } from '~/types'

export const taxonomyTermRoot: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 3,
  trashed: false,
  alias: '/root/3/root',
  type: TaxonomyTermType.Root,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 1,
  parentId: null,
  childrenIds: [5],
}

export const taxonomyTermSubject: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 5,
  trashed: false,
  alias: '/mathe/5/mathe',
  type: TaxonomyTermType.Subject,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 2,
  parentId: taxonomyTermRoot.id,
  childrenIds: [16048],
}

export const taxonomyTermCurriculumTopic: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 16048,
  trashed: false,
  alias: '/mathe/16048/natürliche-zahlen',
  type: 'curriculumTopic',
  instance: Instance.De,
  name: 'name',
  description: 'description',
  weight: 3,
  parentId: taxonomyTermSubject.id,
  childrenIds: [1855],
}

export const taxonomyTermTopic: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 1288,
  trashed: false,
  alias: '/mathe/1288/geometrie',
  type: TaxonomyTermType.Topic,
  instance: Instance.De,
  name: 'Geometrie',
  description: null,
  weight: 6,
  parentId: 5,
  childrenIds: [
    23453, 1454, 1394, 24518, 1380, 24410, 24422, 1381, 1383, 1300, 1413,
  ],
}

export const taxonomyTermTopicFolder: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: 23662,
  trashed: false,
  alias: '/mathe/23662/aufgaben-zu-einfachen-potenzen',
  type: 'topicFolder',
  instance: Instance.De,
  name: 'Aufgaben zu einfachen Potenzen',
  description: '',
  weight: 1,
  parentId: 1288,
  childrenIds: [10385, 6925, 6921, 6933, 6917, 7085],
}
