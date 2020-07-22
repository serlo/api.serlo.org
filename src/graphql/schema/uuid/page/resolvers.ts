import { PagePayload } from '.'
import { requestsOnlyFields } from '../../utils'
import { decodePath } from '../alias'
import { UserPayload } from '../user'
import { PageResolvers, PageRevisionPayload } from './types'

export const resolvers: PageResolvers = {
  Page: {
    alias(page) {
      return Promise.resolve(page.alias ? decodePath(page.alias) : null)
    },
    async navigation(page, _args, { dataSources }) {
      return dataSources.serlo.getNavigation({
        instance: page.instance,
        id: page.id,
      })
    },
    async currentRevision(page, _args, { dataSources }, info) {
      if (!page.currentRevisionId) return null
      const partialCurrentRevision = { id: page.currentRevisionId }
      if (requestsOnlyFields('PageRevision', ['id'], info)) {
        return partialCurrentRevision
      }
      return dataSources.serlo.getUuid<PageRevisionPayload>(
        partialCurrentRevision
      )
    },
    async license(page, _args, { dataSources }, info) {
      const partialLicense = { id: page.licenseId }
      if (requestsOnlyFields('License', ['id'], info)) {
        return partialLicense
      }
      return dataSources.serlo.getLicense(partialLicense)
    },
  },
  PageRevision: {
    async author(pageRevision, _args, { dataSources }, info) {
      const partialUser = { id: pageRevision.authorId }
      if (requestsOnlyFields('User', ['id'], info)) {
        return partialUser
      }
      return dataSources.serlo.getUuid<UserPayload>(partialUser)
    },
    async page(pageRevision, _args, { dataSources }, info) {
      const partialPage = { id: pageRevision.repositoryId }
      if (requestsOnlyFields('Page', ['id'], info)) {
        return partialPage
      }
      return dataSources.serlo.getUuid<PagePayload>(partialPage)
    },
  },
}
