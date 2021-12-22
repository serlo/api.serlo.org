/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { ConnectorClient } from '@nmshd/connector-sdk'
import bodyParser from 'body-parser'
import { Express, RequestHandler } from 'express'
import { option as O } from 'fp-ts'
import * as t from 'io-ts'

import { Cache } from '../cache'
import {
  EnmeshedWebhookPayload,
  Relationship,
  RelationshipChange,
} from './enmeshed-payload'

const Session = t.intersection([
  t.type({ relationshipTemplateId: t.string }),
  t.partial({
    enmeshedId: t.string,
    attributes: t.array(t.type({ name: t.string, value: t.string })),
  }),
])
type Session = t.TypeOf<typeof Session>

export function applyEnmeshedMiddleware({
  app,
  cache,
}: {
  app: Express
  cache: Cache
}) {
  if (process.env.ENVIRONMENT === 'production') return null

  const basePath = '/enmeshed'
  app.post(`${basePath}/init`, createEnmeshedInitMiddleware(cache))
  app.use(bodyParser.json())
  app.post(`${basePath}/webhook`, createEnmeshedWebhookMiddleware(cache))
  return `${basePath}/init`
}

/**
 * Endpoint for enmeshed relationship initialization.
 * Creates relationship template and returns QR for the user to scan.
 */
function createEnmeshedInitMiddleware(cache: Cache): RequestHandler {
  return async (req, res) => {
    const client = ConnectorClient.create({
      baseUrl: `${process.env.ENMESHED_SERVER_HOST}`,
      apiKey: `${process.env.ENMESHED_SERVER_SECRET}`,
    })

    const sessionId = readQuery(req, 'sessionId')

    // Try to get Relationship template ID from cache
    const session = await getSession(cache, sessionId)
    let relationshipTemplateId = ''
    if (session !== null) {
      relationshipTemplateId = session.relationshipTemplateId
    } else {
      // Create Relationship template
      const createRelationshipResponse =
        await client.relationshipTemplates.createOwnRelationshipTemplate(
          sessionId !== null
            ? createRelationshipTemplateForUserJourney({
                sessionId,
                familyName: readQuery(req, 'familyName') ?? 'Musterfrau',
                givenName: readQuery(req, 'givenName') ?? 'Alex',
              })
            : createRelationshipTemplateForPrototype()
        )

      if (createRelationshipResponse.isError) {
        const error = createRelationshipResponse.error
        res.statusCode = 500
        res.end(
          `Error occurred creating relationship request: ${error.code} ${error.message}`
        )
        return
      }
      relationshipTemplateId = createRelationshipResponse.result.id
      await setSession(cache, sessionId, { relationshipTemplateId })
    }
    // Create Token
    const createTokenResponse =
      await client.relationshipTemplates.createTokenQrCodeForOwnRelationshipTemplate(
        relationshipTemplateId
      )
    if (createTokenResponse.isError) {
      const error = createTokenResponse.error
      res.statusCode = 500
      res.end(
        `Error occurred while creating token: ${error.code} ${error.message}`
      )
      return
    }
    // Return QR code
    res.statusCode = 200
    res.setHeader('Content-Type', 'image/png')
    res.end(createTokenResponse.result)
  }
}

/**
 * Endpoint for Connector webhook, which receives any changes within relationships and messages
 */
function createEnmeshedWebhookMiddleware(cache: Cache): RequestHandler {
  return async (req, res, next) => {
    if (req.headers['x-api-key'] !== process.env.ENMESHED_WEBHOOK_SECRET)
      return next()

    // TODO: Checking scheme of request body
    const payload = req.body as EnmeshedWebhookPayload
    if (!payload || !(payload.relationships || payload.messages)) return next()

    // Process relationships
    for (const relationship of payload.relationships) {
      // Check if relationship name matches
      const sessionId = relationship.template.content.metadata.sessionId ?? null
      const session = await getSession(cache, sessionId)

      if (
        session === null ||
        relationship.template.id !== session.relationshipTemplateId
      ) {
        // TODO: Proper error handling needed
        // eslint-disable-next-line no-console
        console.log('Error: Relationship template ID does not match')
      }

      // Accept all pending relationship requests
      for (const change of relationship.changes) {
        console.log(JSON.stringify(change))

        if (
          ['Creation', 'RelationshipRequest'].includes(change.type) &&
          ['Pending', 'Revoked'].includes(change.status)
        ) {
          await acceptRelationshipRequest(relationship, change)

          if (session === null) {
            await sendWelcomeMessage(relationship)
            await sendAttributesChangeRequest(relationship)
          } else {
            // TODO: Is the place inside the for loop is right place?
            await setSession(cache, sessionId, {
              ...session,
              enmeshedId: relationship.peer,
              attributes: change.request.content?.attributes ?? [],
            })
          }
        }
      }
    }

    // Process messages
    for (const message of payload.messages) {
      if (message.content['@type'] == 'AttributesChangeRequest') {
        const attributes = message.content.attributes.map(
          (a: { name: string; value: string }) => `${a.name}=${a.value}`
        )
        // eslint-disable-next-line no-console
        console.log(`Received attributes: ${attributes.join(', ')}`)
      } else {
        // eslint-disable-next-line no-console
        console.log('Received message:')
        // eslint-disable-next-line no-console
        console.log(message.content)
      }
    }

    res.statusCode = 200
    res.end('')
  }
}

function createRelationshipTemplateForPrototype() {
  return {
    // maxNumberOfRelationships: 0,
    expiresAt: '2100-01-01T00:00:00.000Z',
    content: {
      // Shared own attributes
      attributes: [
        {
          name: 'Thing.name',
          value: 'LENABI Demo 1',
        },
        {
          name: 'Corporation.legalName',
          value: 'Serlo Education e.V.',
        },
        // {
        //   name: 'Comm.phone',
        //   value: '',
        // },
        {
          name: 'Comm.email',
          value: 'de@serlo.org',
        },
        {
          name: 'Comm.website',
          value: 'https://de.serlo.org',
        },
      ],
      // Additional metadata that will be returned with request
      metadata: {
        sessionId: 'session-id',
      },
      // Requested user data
      request: {
        // Attributes that are stored in the users wallet when the relationship is accepted
        // See: https://enmeshed.eu/explore/schema#person-attributes
        create: [
          { attribute: 'Person.familyName', value: 'Musterfrau' },
          { attribute: 'Person.givenName', value: 'Martina' },
          { attribute: 'Person.gender', value: 'f' },
          { attribute: 'Person.birthDate', value: '01.01.1980' },
          { attribute: 'Person.nationality', value: 'Deutsch' },
          { attribute: 'Comm.email', value: 'martina@musterfrau.de' },
          {
            attribute: 'Address',
            value: JSON.stringify({
              addressName: '',
              type: 'private',
              street: 'Teststr.',
              houseNo: '1',
              zipCode: '12345',
              city: 'Berlin',
              country: 'Deutschland',
            }),
          },
        ],
        // Required attributes that must be shared (without these, no contact can be established)
        // required: [
        //   {
        //     attribute: 'Person.familyName',
        //   },
        //   {
        //     attribute: 'Person.givenName',
        //   },
        //   {
        //     attribute: 'Person.gender',
        //   },
        //   {
        //     attribute: 'Person.birthDate',
        //   },
        //   {
        //     attribute: 'Person.nationality',
        //   },
        //   {
        //     attribute: 'Address',
        //   },
        // ],
        // Optional attributes that can be shared by the user
        // optional: [
        //   {
        //     attribute: 'Comm.email',
        //   },
        //   {
        //     attribute: 'Comm.phone',
        //   },
        // ],
        // Optional questions that can be asked of the user (are not stored in the wallet)
        // questions: [
        //   { key: "certId", type: "invisible", value: "math_algebra_1" },
        //   { key: "cert", label: "Gewählter Kurs", value: "Algebra I", type: "string", readonly: true },
        //   {
        //     key: "start",
        //     label: "Start des Kurses",
        //     type: "dropdown",
        //     values: [
        //       { key: "online", label: "Online (jederzeit)" },
        //       { key: "15.06.2021", label: "Classroom: 15.06.2021" },
        //       { key: "29.06.2021", label: "Classroom: 29.06.2021" }
        //     ]
        //   }
        // ],
        // Certain authorisations requested from the user
        authorizations: [
          {
            id: 'comm',
            title: 'Direkter Nachrichtenversand (auch Push)',
            duration: 'Dauer der Versicherung',
            required: true,
          },
          {
            id: 'marketing',
            title: 'Nachrichtenversand zwecks Marketing',
            duration: 'Bis auf Widerruf',
            required: false,
          },
        ],
      },
      // Privacy policy to be accepted by user
      privacy: {
        text: 'Ja, ich habe die Datenschutzerklärung von Serlo gelesen und akzeptiere diese hiermit.',
        required: true,
        activeConsent: false,
        link: 'https://de.serlo.org/privacy',
      },
      // Sends a message with the corresponding arbitrary content if the relationship already exists,
      // so that a second reading of a template can be handled
      // ifRelationshipExists: {
      //   action: "message",
      //   content: {
      //     info: "relationshipExists"
      //   }
      // }
    },
  }
}

function createRelationshipTemplateForUserJourney({
  sessionId,
  familyName,
  givenName,
}: {
  sessionId: string
  familyName: string
  givenName: string
}) {
  return {
    expiresAt: '2100-01-01T00:00:00.000Z',
    content: {
      attributes: [
        {
          name: 'Thing.name',
          value: 'Serlo Education e.V.',
        },
        {
          name: 'Corporation.legalName',
          value: 'Serlo Education e.V.',
        },
        {
          name: 'Comm.email',
          value: 'de@serlo.org',
        },
        {
          name: 'Comm.website',
          value: 'https://de.serlo.org',
        },
      ],
      metadata: { sessionId },
      request: {
        create: [
          { attribute: 'Person.familyName', value: familyName },
          { attribute: 'Person.givenName', value: givenName },
        ],
        required: [{ attribute: 'Lernstand-Mathe' }],
        authorizations: [
          {
            id: 'comm',
            title: 'Laden und Speichern von Lernstände',
            duration: 'Dauer der Nutzung von serlo.org',
            required: true,
          },
        ],
      },
      privacy: {
        text: 'Ja, ich habe die Datenschutzerklärung von Serlo gelesen und akzeptiere diese hiermit.',
        required: true,
        activeConsent: false,
        link: 'https://de.serlo.org/privacy',
      },
    },
  }
}

/**
 * Accepts pending relationship request
 */
async function acceptRelationshipRequest(
  relationship: Relationship,
  change: RelationshipChange
): Promise<boolean> {
  const client = ConnectorClient.create({
    baseUrl: `${process.env.ENMESHED_SERVER_HOST}`,
    apiKey: `${process.env.ENMESHED_SERVER_SECRET}`,
  })
  // Accept relationship request
  const acceptRelationshipResponse =
    await client.relationships.acceptRelationshipChange(
      relationship.id,
      change.id,
      {
        content: {
          // FIXME: The documentation is unclear on what should be submitted here
          prop1: 'value',
          prop2: 1,
        },
      }
    )
  if (acceptRelationshipResponse.isError) {
    // eslint-disable-next-line no-console
    console.log(acceptRelationshipResponse)
    return false
  }
  return true
}

/**
 * Sends a welcome message with a test file attachment to be saved within the users' data wallet
 */
async function sendWelcomeMessage(
  relationship: Relationship
): Promise<boolean> {
  const client = ConnectorClient.create({
    baseUrl: `${process.env.ENMESHED_SERVER_HOST}`,
    apiKey: `${process.env.ENMESHED_SERVER_SECRET}`,
  })
  // Upload test file
  const testData = {
    level: 1,
  }
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1)
  const uploadFileResponse = await client.files.uploadOwnFile({
    title: 'Serlo test file',
    description: 'Test file created by Serlo',
    file: Buffer.from(JSON.stringify(testData)),
    filename: 'serlo-test-file.json',
    expiresAt: expiresAt.toISOString(),
  })
  if (uploadFileResponse.isError) {
    // eslint-disable-next-line no-console
    console.log(uploadFileResponse)
    return false
  }

  // Send message with file attachment
  const sendMessageResponse = await client.messages.sendMessage({
    recipients: [relationship.peer],
    content: {
      '@type': 'Mail',
      to: [relationship.peer],
      subject: 'Danke für dein Vertrauen.',
      body: 'Hallo!\nDanke für deine Anfrage, wir freuen uns über dein Vertrauen.\nDein Serlo-Team',
    },
    attachments: [uploadFileResponse.result.id],
  })
  if (sendMessageResponse.isError) {
    // eslint-disable-next-line no-console
    console.log(sendMessageResponse)
    return false
  }
  return true
}

/**
 * Requests user to change and share attributes in data wallet
 * Attributes will be sent to connector webhook after confirmation
 */
async function sendAttributesChangeRequest(
  relationship: Relationship
): Promise<boolean> {
  const client = ConnectorClient.create({
    baseUrl: `${process.env.ENMESHED_SERVER_HOST}`,
    apiKey: `${process.env.ENMESHED_SERVER_SECRET}`,
  })

  // Get own Identity
  const getIdentityResponse = await client.account.getIdentityInfo()
  if (getIdentityResponse.isError) {
    // eslint-disable-next-line no-console
    console.log(getIdentityResponse)
    return false
  }
  const connectorIdentity = getIdentityResponse.result.address

  // Send message to create/change attribute
  // See: https://enmeshed.eu/explore/schema#attributeschangerequest
  const sendMessageResponse = await client.messages.sendMessage({
    recipients: [relationship.peer],
    content: {
      '@type': 'RequestMail',
      to: [relationship.peer],
      cc: [],
      subject: 'Dein Lernstand',
      body: 'Hallo!\nBitte speichere deinen aktuellen Lernstand und teile ihn mit uns.\nDein Serlo-Team',
      requests: [
        {
          '@type': 'AttributesChangeRequest',
          attributes: [
            {
              name: 'lenabi.level',
              value: '42',
            },
          ],
          applyTo: relationship.peer,
          reason: 'Lernstand',
        },
        {
          '@type': 'AttributesShareRequest',
          attributes: ['lenabi.level'],
          recipients: [connectorIdentity],
          reason: 'Lernstand',
        },
      ],
    },
  })
  if (sendMessageResponse.isError) {
    // eslint-disable-next-line no-console
    console.log(sendMessageResponse)
    return false
  }
  return true
}

async function getSession(
  cache: Cache,
  sessionId: string | null
): Promise<Session | null> {
  const cachedValue = await cache.get({ key: getSessionKey(sessionId) })

  if (!O.isNone(cachedValue)) {
    if (Session.is(cachedValue.value.value)) {
      return cachedValue.value.value
    }
  }

  return null
}

async function setSession(
  cache: Cache,
  sessionId: string | null,
  session: Session
) {
  await cache.set({
    key: getSessionKey(sessionId),
    value: session,
    source: 'enmeshed-middleware',
  })
}

function getSessionKey(sessionId: string | null) {
  return sessionId !== null
    ? `enmeshed:${sessionId}`
    : 'de.serlo.org/api/enmeshed/relationship-template-id'
}

function readQuery(req: ExpressRequest, key: string): string | null {
  const value = req.query[key]

  return typeof value === 'string' ? value : null
}

type ExpressRequest = Parameters<RequestHandler>[0]
