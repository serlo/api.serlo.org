import { Model } from '~/internals/graphql'
import { DiscriminatorType } from '~/model/decoder'

export const user: Model<'User'> = {
  __typename: DiscriminatorType.User,
  id: 1,
  trashed: false,
  alias: '/user/1/admin',
  username: 'admin',
  date: '2014-03-01T20:36:21Z',
  lastLogin: '2020-03-24T09:40:55Z',
  description: null,
  roles: ['login', 'german_horizonhelper', 'sysadmin'],
}

export const user2: Model<'User'> = {
  __typename: DiscriminatorType.User,
  id: 23,
  trashed: false,
  alias: '/user/23/sandra',
  username: 'sandra',
  date: '2015-02-01T20:35:21Z',
  lastLogin: '2019-03-23T09:20:55Z',
  description: null,
  roles: ['login'],
}

export const activityByType = {
  edits: 10,
  comments: 11,
  reviews: 0,
  taxonomy: 3,
}
