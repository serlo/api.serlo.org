import { Instance } from '../src/graphql/schema/instance'
import { License } from '../src/graphql/schema/license'

export const license: License = {
  id: 1,
  instance: Instance.De,
  default: true,
  title: 'title',
  url: 'url',
  content: 'content',
  agreement: 'agreement',
  iconHref: 'iconHref',
}
