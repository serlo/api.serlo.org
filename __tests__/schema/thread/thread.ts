import gql from 'graphql-tag'

import { Client } from '../../__utils__'

const query = new Client().prepareQuery({
  query: gql`
    query thread($id: Int!, $archived: Boolean) {
      uuid(id: $id) {
        ... on ThreadAware {
          threads(archived: $archived) {
            nodes {
              id
              title
              createdAt
              archived
              object {
                id
              }
              comments {
                nodes {
                  id
                  content
                  createdAt
                  archived
                  legacyObject {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
})

test('should return threads', async () => {
  await query.withVariables({ id: 1327 }).shouldReturnData({
    uuid: {
      threads: {
        nodes: [
          {
            id: 'dDMxOTMw',
            title: 'Mehrere Aufgabenordner zu linearen Funktionen bzw. Geraden',
            createdAt: '2014-09-29T21:00:45.000Z',
            archived: false,
            object: { id: 1327 },
            comments: {
              nodes: [
                {
                  id: 31930,
                  content:
                    'Nach welchen Kriterien unterscheidet ihr "Gemischte Aufgaben zu lineare Funktionen", "Aufgaben zu Geraden im Koordinatensystem" und "Aufgaben zu linearen Funktionen"?',
                  createdAt: '2014-09-29T21:00:45.000Z',
                  archived: false,
                  legacyObject: { id: 1327 },
                },
              ],
            },
          },
          {
            id: 'dDI1MTcw',
            title: 'Fehlende Lösungen',
            createdAt: '2014-05-28T12:46:38.000Z',
            archived: true,
            object: { id: 1327 },
            comments: {
              nodes: [
                {
                  id: 25170,
                  content:
                    'Hier fehlen noch einige Lösungen! Wäre super wenn sich da jemand drum kümmern will! (Richtlinien beachten!)',
                  createdAt: '2014-05-28T12:46:38.000Z',
                  archived: true,
                  legacyObject: { id: 1327 },
                },
              ],
            },
          },
        ],
      },
    },
  })
})

test('when archived is true, should return only archived threads and comments', async () => {
  await query.withVariables({ id: 1327, archived: true }).shouldReturnData({
    uuid: {
      threads: {
        nodes: [{ id: 'dDI1MTcw', title: 'Fehlende Lösungen', archived: true }],
      },
    },
  })
})

test('when archived is false, should return only non archived threads and comments', async () => {
  await query.withVariables({ id: 1327, archived: false }).shouldReturnData({
    uuid: {
      threads: {
        nodes: [{ id: 'dDMxOTMw', archived: false }],
      },
    },
  })
})
