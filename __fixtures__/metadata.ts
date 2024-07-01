const articleMetadata = {
  '@context': [
    'https://w3id.org/kim/amb/context.jsonld',
    {
      '@language': 'de',
      '@vocab': 'http://schema.org/',
      type: '@type',
      id: '@id',
    },
  ],
  id: 'https://serlo.org/1495',
  type: ['LearningResource', 'Article'],
  about: [
    {
      type: 'Concept',
      id: 'http://w3id.org/kim/schulfaecher/s1017',
      inScheme: {
        id: 'http://w3id.org/kim/schulfaecher/',
      },
    },
  ],
  creator: [
    {
      id: 'https://serlo.org/324',
      name: '122d486a',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
    {
      id: 'https://serlo.org/15491',
      name: '125f4a84',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
    {
      id: 'https://serlo.org/22573',
      name: '12600e93',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
    {
      id: 'https://serlo.org/1',
      name: 'admin',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
    {
      id: 'https://serlo.org/6',
      name: '12297c72',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
    {
      id: 'https://serlo.org/677',
      name: '124902c9',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
    {
      id: 'https://serlo.org/15473',
      name: '125f3e12',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
    {
      id: 'https://serlo.org/15478',
      name: '125f467c',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },

    {
      id: 'https://serlo.org/27689',
      name: '1268a3e2',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  dateCreated: '2014-03-01T20:36:44.000Z',
  dateModified: '2014-10-31T15:56:50.000Z',
  headline: 'Addition',
  identifier: {
    type: 'PropertyValue',
    propertyID: 'UUID',
    value: 1495,
  },
  isAccessibleForFree: true,
  isFamilyFriendly: true,
  image: 'https://de.serlo.org/_assets/img/meta/mathe.png',
  inLanguage: ['de'],
  learningResourceType: [
    {
      id: 'http://w3id.org/openeduhub/vocabs/new_lrt/588efe4f-976f-48eb-84aa-8bcb45679f85',
    },
  ],
  license: { id: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  mainEntityOfPage: [
    {
      id: 'https://serlo.org/metadata',
      type: 'WebContent',
      provider: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  maintainer: {
    id: 'https://serlo.org/organization',
    type: 'Organization',
    name: 'Serlo Education e.V.',
  },
  name: 'Addition',
  isPartOf: [
    { id: 'https://serlo.org/1292' },
    { id: 'https://serlo.org/16072' },
    { id: 'https://serlo.org/16174' },
    { id: 'https://serlo.org/34743' },
    { id: 'https://serlo.org/34744' },
  ],
  publisher: [
    {
      id: 'https://serlo.org/organization',
      type: 'Organization',
      name: 'Serlo Education e.V.',
    },
  ],
  version: { id: 'https://serlo.org/32614' },
}

const appletMetadata = {
  '@context': [
    'https://w3id.org/kim/amb/context.jsonld',
    {
      '@language': 'en',
      '@vocab': 'http://schema.org/',
      type: '@type',
      id: '@id',
    },
  ],
  id: 'https://serlo.org/35596',
  type: ['LearningResource', 'WebApplication'],
  about: [
    {
      type: 'Concept',
      id: 'http://w3id.org/kim/schulfaecher/s1017',
      inScheme: {
        id: 'http://w3id.org/kim/schulfaecher/',
      },
    },
  ],
  creator: [
    {
      id: 'https://serlo.org/1',
      name: 'admin',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  dateCreated: '2020-01-29T17:47:19.000Z',
  dateModified: '2020-01-29T17:48:54.000Z',
  headline: 'Example applet',
  identifier: {
    propertyID: 'UUID',
    type: 'PropertyValue',
    value: 35596,
  },
  image: 'https://de.serlo.org/_assets/img/meta/serlo.png',
  inLanguage: ['en'],
  isAccessibleForFree: true,
  isFamilyFriendly: true,
  learningResourceType: [
    {
      id: 'http://w3id.org/openeduhub/vocabs/new_lrt/4665caac-99d7-4da3-b9fb-498d8ece034f',
    },
  ],
  license: { id: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  mainEntityOfPage: [
    {
      id: 'https://serlo.org/metadata',
      type: 'WebContent',
      provider: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  maintainer: {
    id: 'https://serlo.org/organization',
    type: 'Organization',
    name: 'Serlo Education e.V.',
  },
  name: 'Example applet',
  publisher: [
    {
      id: 'https://serlo.org/organization',
      type: 'Organization',
      name: 'Serlo Education e.V.',
    },
  ],
  isPartOf: [{ id: 'https://serlo.org/35560' }],
  version: { id: 'https://serlo.org/35597' },
}

const courseMetadata = {
  '@context': [
    'https://w3id.org/kim/amb/context.jsonld',
    {
      '@language': 'de',
      '@vocab': 'http://schema.org/',
      type: '@type',
      id: '@id',
    },
  ],
  id: 'https://serlo.org/18514',
  type: ['LearningResource', 'Course'],
  about: [
    {
      type: 'Concept',
      id: 'http://w3id.org/kim/schulfaecher/s1017',
      inScheme: {
        id: 'http://w3id.org/kim/schulfaecher/',
      },
    },
  ],
  creator: [
    {
      id: 'https://serlo.org/15473',
      name: '125f3e12',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        name: 'Serlo Education e.V.',
        type: 'Organization',
      },
    },
    {
      id: 'https://serlo.org/15491',
      name: '125f4a84',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        name: 'Serlo Education e.V.',
        type: 'Organization',
      },
    },
    {
      id: 'https://serlo.org/324',
      name: '122d486a',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
    {
      id: 'https://serlo.org/1',
      name: 'admin',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  dateCreated: '2014-03-17T12:22:17.000Z',
  dateModified: '2014-09-16T07:47:55.000Z',
  headline: 'Überblick zum Satz des Pythagoras',
  identifier: {
    propertyID: 'UUID',
    type: 'PropertyValue',
    value: 18514,
  },
  image: 'https://de.serlo.org/_assets/img/meta/mathe.png',
  inLanguage: ['de'],
  isAccessibleForFree: true,
  isFamilyFriendly: true,
  learningResourceType: [
    {
      id: 'http://w3id.org/openeduhub/vocabs/new_lrt/ad9b9299-0913-40fb-8ad3-50c5fd367b6a',
    },
  ],
  license: {
    id: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  mainEntityOfPage: [
    {
      id: 'https://serlo.org/metadata',
      type: 'WebContent',
      provider: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  maintainer: {
    id: 'https://serlo.org/organization',
    type: 'Organization',
    name: 'Serlo Education e.V.',
  },
  name: 'Überblick zum Satz des Pythagoras',
  isPartOf: [
    { id: 'https://serlo.org/1381' },
    { id: 'https://serlo.org/16526' },
  ],
  publisher: [
    {
      id: 'https://serlo.org/organization',
      type: 'Organization',
      name: 'Serlo Education e.V.',
    },
  ],
  version: { id: 'https://serlo.org/30713' },
}

const exerciseMetadata = {
  about: [
    {
      type: 'Concept',
      id: 'http://w3id.org/kim/schulfaecher/s1017',
      inScheme: {
        id: 'http://w3id.org/kim/schulfaecher/',
      },
    },
  ],
  '@context': [
    'https://w3id.org/kim/amb/context.jsonld',
    {
      '@language': 'de',
      '@vocab': 'http://schema.org/',
      type: '@type',
      id: '@id',
    },
  ],
  id: 'https://serlo.org/2823',
  type: ['LearningResource', 'Quiz'],
  creator: [
    {
      id: 'https://serlo.org/6',
      name: '12297c72',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
    {
      id: 'https://serlo.org/15474',
      name: '125f3f63',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  dateCreated: '2014-03-01T21:02:56.000Z',
  dateModified: '2014-04-03T09:17:57.000Z',
  identifier: {
    propertyID: 'UUID',
    type: 'PropertyValue',
    value: 2823,
  },
  image: 'https://de.serlo.org/_assets/img/meta/mathe.png',
  inLanguage: ['de'],
  isAccessibleForFree: true,
  isFamilyFriendly: true,
  isPartOf: [{ id: 'https://serlo.org/25614' }],
  learningResourceType: [
    {
      id: 'http://w3id.org/openeduhub/vocabs/new_lrt/a33ef73d-9210-4305-97f9-7357bbf43486',
    },
  ],
  license: { id: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  mainEntityOfPage: [
    {
      id: 'https://serlo.org/metadata',
      type: 'WebContent',
      provider: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  maintainer: {
    id: 'https://serlo.org/organization',
    type: 'Organization',
    name: 'Serlo Education e.V.',
  },
  name: 'Aufgabe aus "Aufgaben zum Thema Ergebnisraum oder Ergebnismenge"',
  publisher: [
    {
      id: 'https://serlo.org/organization',
      type: 'Organization',
      name: 'Serlo Education e.V.',
    },
  ],
  version: { id: 'https://serlo.org/22454' },
}

const exerciseGroupMetadata = {
  about: [
    {
      type: 'Concept',
      id: 'http://w3id.org/kim/schulfaecher/s1017',
      inScheme: {
        id: 'http://w3id.org/kim/schulfaecher/',
      },
    },
  ],
  '@context': [
    'https://w3id.org/kim/amb/context.jsonld',
    {
      '@language': 'de',
      '@vocab': 'http://schema.org/',
      type: '@type',
      id: '@id',
    },
  ],
  id: 'https://serlo.org/2217',
  type: ['LearningResource', 'Quiz'],
  creator: [
    {
      id: 'https://serlo.org/6',
      name: '12297c72',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  dateCreated: '2014-03-01T20:54:51.000Z',
  dateModified: '2014-03-01T20:54:51.000Z',
  identifier: {
    propertyID: 'UUID',
    type: 'PropertyValue',
    value: 2217,
  },
  image: 'https://de.serlo.org/_assets/img/meta/mathe.png',
  inLanguage: ['de'],
  isAccessibleForFree: true,
  isFamilyFriendly: true,
  learningResourceType: [
    {
      id: 'http://w3id.org/openeduhub/vocabs/new_lrt/a33ef73d-9210-4305-97f9-7357bbf43486',
    },
  ],
  license: { id: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  mainEntityOfPage: [
    {
      id: 'https://serlo.org/metadata',
      type: 'WebContent',
      provider: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  maintainer: {
    id: 'https://serlo.org/organization',
    type: 'Organization',
    name: 'Serlo Education e.V.',
  },
  name: 'Aufgabe aus "Sachaufgaben"',
  isPartOf: [
    { id: 'https://serlo.org/21804' },
    { id: 'https://serlo.org/25726' },
  ],
  publisher: [
    {
      id: 'https://serlo.org/organization',
      type: 'Organization',
      name: 'Serlo Education e.V.',
    },
  ],
  version: { id: 'https://serlo.org/2218' },
}

const videoMetadata = {
  about: [
    {
      type: 'Concept',
      id: 'http://w3id.org/kim/schulfaecher/s1017',
      inScheme: {
        id: 'http://w3id.org/kim/schulfaecher/',
      },
    },
  ],
  '@context': [
    'https://w3id.org/kim/amb/context.jsonld',
    {
      '@language': 'de',
      '@vocab': 'http://schema.org/',
      type: '@type',
      id: '@id',
    },
  ],
  id: 'https://serlo.org/18865',
  type: ['LearningResource', 'VideoObject'],
  creator: [
    {
      id: 'https://serlo.org/22573',
      name: '12600e93',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
    {
      id: 'https://serlo.org/15478',
      name: '125f467c',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
    {
      id: 'https://serlo.org/15491',
      name: '125f4a84',
      type: 'Person',
      affiliation: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  dateCreated: '2014-03-17T16:18:44.000Z',
  dateModified: '2014-05-01T09:22:14.000Z',
  headline: 'Satz des Pythagoras',
  identifier: {
    propertyID: 'UUID',
    type: 'PropertyValue',
    value: 18865,
  },
  image: 'https://de.serlo.org/_assets/img/meta/mathe.png',
  inLanguage: ['de'],
  isAccessibleForFree: true,
  isFamilyFriendly: true,
  learningResourceType: [
    {
      id: 'http://w3id.org/openeduhub/vocabs/new_lrt/7a6e9608-2554-4981-95dc-47ab9ba924de',
    },
  ],
  license: { id: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  mainEntityOfPage: [
    {
      id: 'https://serlo.org/metadata',
      type: 'WebContent',
      provider: {
        id: 'https://serlo.org/organization',
        type: 'Organization',
        name: 'Serlo Education e.V.',
      },
    },
  ],
  maintainer: {
    id: 'https://serlo.org/organization',
    type: 'Organization',
    name: 'Serlo Education e.V.',
  },
  name: 'Satz des Pythagoras',
  isPartOf: [
    { id: 'https://serlo.org/1381' },
    { id: 'https://serlo.org/16214' },
  ],
  publisher: [
    {
      id: 'https://serlo.org/organization',
      type: 'Organization',
      name: 'Serlo Education e.V.',
    },
  ],
  version: { id: 'https://serlo.org/24383' },
}

export const metadataExamples = [
  articleMetadata,
  appletMetadata,
  courseMetadata,
  exerciseMetadata,
  exerciseGroupMetadata,
  videoMetadata,
]
