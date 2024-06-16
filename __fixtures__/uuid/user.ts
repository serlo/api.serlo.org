import { Model } from '~/internals/graphql'
import { DiscriminatorType } from '~/model/decoder'

export const user: Model<'User'> = {
  __typename: DiscriminatorType.User,
  id: 1,
  trashed: false,
  alias: '/user/1/admin',
  username: 'admin',
  date: '2014-03-01T20:36:21.000Z',
  lastLogin: '2020-03-24T09:40:55Z',
  description: null,
  roles: ['login', 'german_horizonhelper', 'sysadmin'],
}

export const user2: Model<'User'> = {
  __typename: DiscriminatorType.User,
  id: 23,
  trashed: false,
  alias: '/user/23/1229902f',
  username: '1229902f',
  date: '2014-03-01T20:36:32.000Z',
  description: null,
  roles: ['login'],
}

export const activityByType = {
  edits: 162,
  comments: 55,
  reviews: 164,
  taxonomy: 715,
}
