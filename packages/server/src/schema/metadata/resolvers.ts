import { version } from '../../../package.json'
import { resolveConnection } from '../connection/utils'
import { createNamespace, decodeId, Queries } from '~/internals/graphql'

export const resolvers: Queries<'metadata'> = {
  Query: {
    metadata: createNamespace(),
  },
  MetadataQuery: {
    publisher() {
      return {
        '@context': [
          'https://w3id.org/kim/amb/context.jsonld',
          { '@language': 'de' },
        ],
        id: 'https://serlo.org/organization',
        type: ['EducationalOrganization', 'NGO'],
        name: 'Serlo Education e.V.',
        alternateName: 'Serlo',
        url: 'https://de.serlo.org/',
        description:
          'Serlo.org bietet einfache Erklärungen, Kurse, Lernvideos, Übungen und Musterlösungen mit denen Schüler*innen und Studierende nach ihrem eigenen Bedarf und in ihrem eigenen Tempo lernen können. Die Lernplattform ist komplett kostenlos und werbefrei.',
        image:
          'https://assets.serlo.org/5ce4082185f5d_5df93b32a2e2cb8a0363e2e2ab3ce4f79d444d11.jpg',
        logo: 'https://de.serlo.org/_assets/img/serlo-logo.svg',
        address: {
          type: 'PostalAddress',
          streetAddress: 'Rosenheimerstraße 139',
          postalCode: '81671',
          addressLocality: 'München',
          addressRegion: 'Bayern',
          addressCountry: 'Germany',
        },
        email: 'de@serlo.org',
      }
    },
    async entities(_parent, payload, { dataSources }) {
      const first = payload.first ?? 100

      // TODO: There must be a shorter implementation
      const { entities } = await dataSources.model.serlo.getEntitiesMetadata({
        first: first + 1,
        ...(payload.after
          ? { after: decodeId({ prefix: '', textId: payload.after }) }
          : {}),
        ...(payload.modifiedAfter
          ? { modifiedAfter: payload.modifiedAfter }
          : {}),
        ...(payload.instance ? { instance: payload.instance } : {}),
      })

      const connection = resolveConnection({
        nodes: entities,
        payload,
        createCursor: (node) => node.identifier.value.toString(),
        limit: 1000,
      })

      // TODO: Find better implementation for "HasNextPageInfo"
      return {
        ...connection,
        pageInfo: {
          ...connection.pageInfo,
          __typename: 'HasNextPageInfo' as const,
        },
      }
    },
    version() {
      return version
    },
  },
}
