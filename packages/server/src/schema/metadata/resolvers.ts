import { resolveConnection } from '../connection/utils'
import { UserInputError } from '~/errors'
import { createNamespace, decodeId } from '~/internals/graphql'
import { Resolvers } from '~/types'

export const resolvers: Resolvers = {
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
        image: 'https://de.serlo.org/_assets/img/meta/community.png',
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
    /**
     * TODO: Remove when property is not used any more by WLO and Datenraum (NBP).
     *
     * @deprecated
     */
    entities(parent, args, context, info) {
      if (typeof resolvers.MetadataQuery?.resources === 'function') {
        return resolvers.MetadataQuery.resources(parent, args, context, info)
      } else {
        throw new Error('Illegal State')
      }
    },
    async resources(_parent, payload, { dataSources }) {
      const limit = 1000

      const first = payload.first ?? 100
      if (first > limit) {
        throw new UserInputError(`first cannot be higher than limit=${limit}`)
      }

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
        limit,
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
      return process.env.METADATA_API_VERSION ?? '1.3.0'
    },
  },
}
