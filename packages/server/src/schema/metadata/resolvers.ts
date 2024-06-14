import * as R from 'ramda'

import { UserInputError } from '~/errors'
import { createNamespace, decodeId } from '~/internals/graphql'
import { resolveConnection } from '~/schema/connection/utils'
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
    async resources(_parent, payload, { database }) {
      // Change the default value of this variable whenever you change the
      // resolver in a way that any crawler should fetch all resources again
      //
      // TODO: We use process variables to change this variable from tests
      // so that we do not need to change the test cases any time we change
      // this variable. Controlling this variable via the context should be
      // the prefered way
      const dateOfLastChangeInResolver = new Date(
        process.env.METADATA_API_LAST_CHANGES_DATE ??
          '2024-04-20T10:22:51.778Z',
      )

      const limit = 1000

      const after = payload.after
        ? decodeId({ prefix: '', textId: payload.after })
        : null
      const { first = 100, modifiedAfter = null, instance = null } = payload

      const modifiedAfterDate = modifiedAfter ? new Date(modifiedAfter) : null

      if (modifiedAfterDate !== null && isNaN(modifiedAfterDate.getTime())) {
        throw new UserInputError('`modifiedAfter` has an invalid date format')
      }

      const modifiedAfterForQuery =
        modifiedAfterDate === null ||
        modifiedAfterDate.getTime() >= dateOfLastChangeInResolver.getTime()
          ? modifiedAfter
          : null

      if (first > limit) {
        throw new UserInputError(`first cannot be higher than limit=${limit}`)
      }

      interface Row {
        id: number
        subjectIds: number[]
        resourceType: string
        title: string | null
        description: string
        dateCreated: Date
        dateModified: Date
        currentRevisionId: number | null
        licenseUrl: string
        originalAuthorUrl: string | null
        instance: string
        taxonomyTermIds: number[]
        taxonomyNames: Record<number, string | undefined>
        authors: Record<number, string | undefined>
        authorEdits: Record<number, number>
      }

      const rows = await database.fetchAll<Row>(
        `
        WITH RECURSIVE subject_mapping AS (
            SELECT
                subject.id AS taxonomy_id,
                subject.id AS subject_id,
                root.id AS root_id
            FROM taxonomy root
            JOIN taxonomy subject ON subject.parent_id = root.id
            WHERE root.parent_id IS NULL
            OR root.id IN (106081, 146728)

            UNION

            SELECT
                child.id,
                subject_mapping.subject_id,
                subject_mapping.root_id
            FROM taxonomy child
            JOIN subject_mapping ON subject_mapping.taxonomy_id = child.parent_id
            -- "Fächer im Aufbau" taxonomy is on the level of normal Serlo subjects, therefore we need a level below it.
            -- "Partner" taxonomy is below the subject "Mathematik", but we only want the entities with the specific partner as the subject.
            WHERE child.parent_id NOT IN (87993, 106081, 146728)
                -- Exclude content under "Baustelle", "Community", "Zum Testen" and "Testbereich" taxonomies
                AND child.id NOT IN (75211, 105140, 107772, 135390, 25107, 106082)
        )
        SELECT
            entity.id,
            JSON_ARRAYAGG(subject_mapping.subject_id) AS subjectIds,
            type.name AS resourceType,
            entity_revision.title AS title,
            entity_revision.meta_description AS description,
            entity.date AS dateCreated,
            entity_revision.date AS dateModified,
            entity.current_revision_id AS currentRevisionId,
            license.url AS licenseUrl,
            license.original_author_url as originalAuthorUrl,
            instance.subdomain AS instance,
            JSON_ARRAYAGG(taxonomy.id) AS taxonomyTermIds,
            JSON_OBJECTAGG(taxonomy.id, taxonomy.name) AS taxonomyNames,
            JSON_OBJECTAGG(user.id, user.username) AS authors,
            JSON_OBJECTAGG(all_revisions_of_entity.id, user.id) AS authorEdits
        FROM entity
        JOIN uuid ON uuid.id = entity.id
        JOIN instance ON entity.instance_id = instance.id
        JOIN type on entity.type_id = type.id
        JOIN license on license.id = entity.license_id
        JOIN entity_revision ON entity.current_revision_id = entity_revision.id
        JOIN term_taxonomy_entity on term_taxonomy_entity.entity_id = entity.id
        JOIN taxonomy on term_taxonomy_entity.term_taxonomy_id = taxonomy.id
        JOIN entity_revision all_revisions_of_entity ON all_revisions_of_entity.repository_id = entity.id
        JOIN user ON all_revisions_of_entity.author_id = user.id
        JOIN subject_mapping on subject_mapping.taxonomy_id = term_taxonomy_entity.term_taxonomy_id
        WHERE entity.id > ?
            AND (? is NULL OR instance.subdomain = ?)
            AND (? is NULL OR entity_revision.date > ?)
            AND uuid.trashed = 0
            AND type.name IN ("applet", "article", "course", "text-exercise",
                              "text-exercise-group", "video")
            AND NOT subject_mapping.subject_id = 146728
        GROUP BY entity.id
        ORDER BY entity.id
        LIMIT ?
        `,
        [
          after ?? 0,
          instance,
          instance,
          modifiedAfterForQuery,
          modifiedAfterForQuery,
          `${first + 1}`,
        ],
      )

      const resources = rows.map((row) => {
        const identifier = row.id
        const id = getIri(row.id)

        const editCounts: Record<number, number | undefined> = {}

        for (const userId of Object.values(row.authorEdits)) {
          editCounts[userId] = (editCounts[userId] ?? 0) + 1
        }

        const creators = [
          ...(row.originalAuthorUrl
            ? [
                {
                  type: 'Organization',
                  id: row.originalAuthorUrl,
                  name: row.originalAuthorUrl,
                },
              ]
            : []),
          ...R.sortBy(
            ([id]) => -1 * (editCounts[parseInt(id)] ?? 0),
            Object.entries(row.authors),
          ).map(([id, username]) => ({
            type: 'Person',
            id: getIri(id),
            name: username,
            affiliation: getSerloOrganizationMetadata(),
          })),
        ]

        const about = [...new Set(row.subjectIds)]
          .flatMap(getRaWSubject)
          .map(toSubject)
        const isPartOf = R.sortBy(
          (x) => x,
          [...new Set(row.taxonomyTermIds)],
        ).map((id) => ({
          id: getIri(id),
        }))

        const schemaType = getSchemaType(row.resourceType)

        const currentDate = new Date().toISOString()

        const result = {
          ['@context']: [
            'https://w3id.org/kim/amb/context.jsonld',
            {
              '@language': row.instance,
              '@vocab': 'http://schema.org/',
              type: '@type',
              id: '@id',
            },
          ],
          id: id,
          type: ['LearningResource', schemaType],
          about,
          description: row.description,
          dateCreated: row.dateCreated.toISOString(),
          dateModified: row.dateModified.toISOString(),
          headline: row.title,
          creator: creators,
          identifier: {
            type: 'PropertyValue',
            propertyID: 'UUID',
            value: identifier,
          },
          image:
            row.subjectIds.length > 0
              ? mapSerloSubjectsToThumbnail(row.subjectIds[0])
              : null,
          inLanguage: [row.instance],
          isAccessibleForFree: true,
          isFamilyFriendly: true,
          learningResourceType: getLearningResourceType(row.resourceType),
          license: { id: row.licenseUrl },
          mainEntityOfPage: [
            {
              id: 'https://serlo.org/metadata',
              type: 'WebContent',
              provider: getSerloOrganizationMetadata(),
              dateCreated: currentDate,
              dateModified: currentDate,
            },
          ],
          maintainer: getSerloOrganizationMetadata(),
          name: row.title ?? getDefaultName(),
          publisher: [getSerloOrganizationMetadata()],
          isPartOf,
          version: row.currentRevisionId
            ? { id: getIri(row.currentRevisionId) }
            : null,
        }

        return filterNullAndEmpty(result)

        function getDefaultName() {
          let schemaTypeI18n: string

          switch (row.instance) {
            case 'de':
              switch (row.resourceType) {
                case 'article':
                  schemaTypeI18n = 'Artikel'
                  break
                case 'course':
                  schemaTypeI18n = 'Kurs'
                  break
                case 'text-exercise':
                case 'text-exercise-group':
                  schemaTypeI18n = 'Aufgabe'
                  break
                case 'video':
                  schemaTypeI18n = 'Video'
                  break
                case 'applet':
                  schemaTypeI18n = 'Applet'
                  break
                default:
                  schemaTypeI18n = 'Inhalt'
              }
              break
            default:
              switch (row.resourceType) {
                case 'article':
                  schemaTypeI18n = 'Article'
                  break
                case 'course':
                  schemaTypeI18n = 'Course'
                  break
                case 'text-exercise':
                case 'text-exercise-group':
                  schemaTypeI18n = 'Exercise'
                  break
                case 'video':
                  schemaTypeI18n = 'Video'
                  break
                case 'applet':
                  schemaTypeI18n = 'Applet'
                  break
                default:
                  schemaTypeI18n = 'Content'
              }
          }
          const termName =
            R.sortBy(([id]) => parseInt(id), Object.entries(row.taxonomyNames))
              .map((x) => x[1])
              .at(0) ?? '<unknown>'
          const fromI18n: string = row.instance === 'de' ? 'aus' : 'from'
          return `${schemaTypeI18n} ${fromI18n} "${termName}"`
        }
      })

      return resolveConnection({
        nodes: resources,
        payload,
        createCursor: (node) => node.identifier.value.toString(),
        limit,
      })
    },
    version() {
      return '2.0.0'
    },
  },
}

function getIri(id: number | string): string {
  return `https://serlo.org/${id}`
}

function getSchemaType(entityType: string): string {
  switch (entityType) {
    case 'article':
      return 'Article'
    case 'course':
      return 'Course'
    case 'text-exercise-group':
    case 'text-exercise':
      return 'Quiz'
    case 'video':
      return 'VideoObject'
    case 'applet':
      return 'WebApplication'
    default:
      return entityType
  }
}

function getLearningResourceType(entityType: string): { id: string }[] {
  return getOpenEduHubIds(entityType)
    .map((vocab) => `http://w3id.org/openeduhub/vocabs/new_lrt/${vocab}`)
    .map((id) => ({ id }))
}

function getOpenEduHubIds(entityType: string): string[] {
  switch (entityType) {
    case 'article':
      return ['588efe4f-976f-48eb-84aa-8bcb45679f85']
    case 'course':
      return ['ad9b9299-0913-40fb-8ad3-50c5fd367b6a']
    case 'text-exercise':
    case 'text-exercise-group':
      return ['a33ef73d-9210-4305-97f9-7357bbf43486']
    case 'video':
      return ['7a6e9608-2554-4981-95dc-47ab9ba924de']
    case 'applet':
      return ['4665caac-99d7-4da3-b9fb-498d8ece034f']
    default:
      return []
  }
}

function getSerloOrganizationMetadata() {
  return {
    id: 'https://serlo.org/organization',
    type: 'Organization',
    name: 'Serlo Education e.V.',
  }
}

function toSubject(data: RawSubject): Subject {
  return {
    type: 'Concept',
    id: toIdString(data.scheme) + data.id,
    inScheme: { id: toSchemeString(data.scheme) },
  }
}

enum Scheme {
  UniversitySubject,
  SchoolSubject,
}

function getRaWSubject(id: number): RawSubject[] {
  switch (id) {
    // Mathematik (Schule)
    case 5:
    case 23593:
    case 141587:
    case 169580:
      return [{ id: '1017', scheme: Scheme.SchoolSubject }]

    // Nachhaltigkeit => Biologie, Ethik (Schule)
    case 17744:
    case 48416:
    case 242851:
      return [
        { id: '1001', scheme: Scheme.SchoolSubject },
        { id: '1008', scheme: Scheme.SchoolSubject },
      ]
    // Chemie (Schule)
    case 18230:
      return [{ id: '1002', scheme: Scheme.SchoolSubject }]
    // Biologie (Schule)
    case 23362:
      return [{ id: '1001', scheme: Scheme.SchoolSubject }]
    // Englisch (Shule)
    case 25979:
    case 107557:
    case 113127:
      return [{ id: '1007', scheme: Scheme.SchoolSubject }]
    // Latein (Schule)
    case 33894:
    case 106085:
      return [{ id: '1016', scheme: Scheme.SchoolSubject }]
    // Physik (Schule)
    case 41107:
      return [{ id: '1022', scheme: Scheme.SchoolSubject }]
    // Informatik (Schule)
    case 47899:
      return [{ id: '1013', scheme: Scheme.SchoolSubject }]

    // Politik => Politik, Sachunterricht (Schule)
    case 79159:
    case 107556:
      return [
        { id: '1023', scheme: Scheme.SchoolSubject },
        { id: '1028', scheme: Scheme.SchoolSubject },
      ]
    // Medienbildung => Medienbildung, Informatik (Schule)
    case 106083:
      return [
        { id: '1046', scheme: Scheme.SchoolSubject },
        { id: '1013', scheme: Scheme.SchoolSubject },
      ]
    // Geografie (Schule)
    case 106084:
      return [{ id: '1010', scheme: Scheme.SchoolSubject }]
    // Psychologie (Schule)
    case 106086:
      return [{ id: '1043', scheme: Scheme.SchoolSubject }]
    // Deutsch als Zweitsprache (Schule)
    case 112723:
      return [{ id: '1006', scheme: Scheme.SchoolSubject }]
    // Geschichte (Schule)
    case 136362:
    case 140528:
      return [{ id: '1011', scheme: Scheme.SchoolSubject }]
    // Wirtschaftskunde (Schule)
    case 137757:
      return [{ id: '1033', scheme: Scheme.SchoolSubject }]
    // Musik (Schule)
    case 167849:
    case 48415:
      return [{ id: '1020', scheme: Scheme.SchoolSubject }]
    // Spanisch (Schule)
    case 190109:
      return [{ id: '1030', scheme: Scheme.SchoolSubject }]
    // Italienisch (Schule)
    case 198076:
      return [{ id: '1014', scheme: Scheme.SchoolSubject }]
    // Religionen, deren Wahrnehmung und Vorurteile => Ethik, Geschichte (Schule)
    case 208736:
      return [
        { id: '1008', scheme: Scheme.SchoolSubject },
        { id: '1011', scheme: Scheme.SchoolSubject },
      ]
    // Deutsch (Schule)
    case 210462:
      return [{ id: '1005', scheme: Scheme.SchoolSubject }]
    // Französisch (Schule)
    case 227992:
      return [{ id: '1009', scheme: Scheme.SchoolSubject }]
    // Sex Education => Sexualerziehung, Biologie (Schule)
    case 78339:
      return [
        { id: '1029', scheme: Scheme.SchoolSubject },
        { id: '1001', scheme: Scheme.SchoolSubject },
      ]
    // Materialwissenschaft
    case 141607:
      return [{ id: '294', scheme: Scheme.UniversitySubject }]
    // Grammatik => Asiatische Sprachen und Kulturen/Asienwissenschaften
    case 140527:
      return [{ id: '187', scheme: Scheme.UniversitySubject }]
    // Kommunikation => Psychologie, Deutsch (Schule)
    case 173235:
      return [
        { id: '1043', scheme: Scheme.SchoolSubject },
        { id: '1005', scheme: Scheme.SchoolSubject },
      ]
    default:
      return []
  }
}

function toSchemeString(scheme: Scheme): string {
  switch (scheme) {
    case Scheme.UniversitySubject:
      return 'https://w3id.org/kim/hochschulfaechersystematik/scheme'
    case Scheme.SchoolSubject:
      return 'http://w3id.org/kim/schulfaecher/'
  }
}

function toIdString(scheme: Scheme): string {
  switch (scheme) {
    case Scheme.UniversitySubject:
      return 'https://w3id.org/kim/hochschulfaechersystematik/n'
    case Scheme.SchoolSubject:
      return 'http://w3id.org/kim/schulfaecher/s'
  }
}

interface Subject {
  type: 'Concept'
  id: string
  inScheme: { id: string }
}

interface RawSubject {
  id: string
  scheme: Scheme
}

function mapSerloSubjectsToThumbnail(id: number | undefined): string {
  let thumbnailImage

  switch (id) {
    case 23362:
      thumbnailImage = 'biologie.png'
      break
    case 18230:
      thumbnailImage = 'chemie.png'
      break
    case 47899:
      thumbnailImage = 'informatik.png'
      break
    case 5:
      thumbnailImage = 'mathe.png'
      break
    case 17744:
      thumbnailImage = 'nachhaltigkeit.png'
      break
    default:
      thumbnailImage = 'serlo.png'
  }

  return `https://de.serlo.org/_assets/img/meta/${thumbnailImage}`
}

function filterNullAndEmpty<A extends object>(result: A): A {
  return Object.fromEntries(
    Object.entries(result).filter(
      ([_, value]) =>
        value != null && (typeof value != 'string' || value.length > 0),
    ),
  ) as unknown as A
}
