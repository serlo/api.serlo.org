import { Model } from '~/internals/graphql'
import { castToAlias, castToUuid, DiscriminatorType } from '~/model/decoder'
import { Instance, TaxonomyTermType } from '~/types'

export const taxonomyTermRoot: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: castToUuid(3),
  trashed: false,
  alias: castToAlias('/root/3/root'),
  type: TaxonomyTermType.Root,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 1,
  parentId: null,
  taxonomyId: castToUuid(1),
  childrenIds: [5].map(castToUuid),
}

export const taxonomyTermSubject: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: castToUuid(5),
  trashed: false,
  alias: castToAlias('/mathe/5/mathe'),
  type: TaxonomyTermType.Subject,
  instance: Instance.De,
  name: 'name',
  description: null,
  weight: 2,
  parentId: taxonomyTermRoot.id,
  taxonomyId: castToUuid(3),
  childrenIds: [16048].map(castToUuid),
}

export const taxonomyTermCurriculumTopic: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: castToUuid(16048),
  trashed: false,
  alias: castToAlias('/mathe/16048/natürliche-zahlen'),
  type: 'curriculumTopic',
  instance: Instance.De,
  name: 'name',
  description: 'description',
  weight: 3,
  taxonomyId: castToUuid(11),
  parentId: taxonomyTermSubject.id,
  childrenIds: [1855].map(castToUuid),
}

export const taxonomyTermTopic: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: castToUuid(1288),
  trashed: false,
  alias: castToAlias('/mathe/1288/geometrie'),
  type: TaxonomyTermType.Topic,
  instance: Instance.De,
  name: 'Geometrie',
  description: null,
  weight: 6,
  taxonomyId: castToUuid(4),
  parentId: castToUuid(5),
  childrenIds: [
    23453, 1454, 1394, 24518, 1380, 24410, 24422, 1381, 1383, 1300, 1413,
  ].map(castToUuid),
}

export const taxonomyTermTopicFolder: Model<'TaxonomyTerm'> = {
  __typename: DiscriminatorType.TaxonomyTerm,
  id: castToUuid(23662),
  trashed: false,
  alias: castToAlias('/mathe/23662/aufgaben-zu-einfachen-potenzen'),
  type: 'topicFolder',
  instance: Instance.De,
  name: 'Aufgaben zu einfachen Potenzen',
  description: '',
  weight: 1,
  taxonomyId: castToUuid(9),
  parentId: castToUuid(1288),
  childrenIds: [10385, 6925, 6921, 6933, 6917, 7085].map(castToUuid),
}
