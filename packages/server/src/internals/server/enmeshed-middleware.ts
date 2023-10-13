/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2023 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2023 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import { ConnectorClient, ConnectorRequestContent } from '@nmshd/connector-sdk'
import express, {
  Express,
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express'
import { option as O } from 'fp-ts'
import * as t from 'io-ts'

import {
  EnmeshedWebhookPayload,
  Relationship,
  RelationshipChange,
} from './enmeshed-payload'
import { Cache } from '../cache'
import { captureErrorEvent } from '../error-event'

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
  app.get(`${basePath}/attributes`, createGetAttributesHandler(cache))
  app.post(`${basePath}/attributes`, createSetAttributesHandler(cache))
  app.use(express.json())
  app.post(`${basePath}/webhook`, createEnmeshedWebhookMiddleware(cache))
  return `${basePath}/init`
}

/**
 * Endpoint for enmeshed relationship initialization.
 * Creates relationship template and returns QR for the user to scan.
 */
function createEnmeshedInitMiddleware(cache: Cache): RequestHandler {
  async function handleRequest(req: Request, res: Response) {
    const client = ConnectorClient.create({
      baseUrl: `${process.env.ENMESHED_SERVER_HOST}`,
      apiKey: `${process.env.ENMESHED_SERVER_SECRET}`,
    })

    const sessionId = readQuery(req, 'sessionId')
    // FIXME: Uncomment next line when prototype frontend has been replaced
    // if (!sessionId) return validationError(res, 'Missing required parameter: sessionId.')

    const session = await getSession(cache, sessionId)

    let relationshipTemplateId = ''

    if (session) {
      relationshipTemplateId = session.relationshipTemplateId
    } else {
      const name = readQuery(req, 'name') ?? 'Alex Janowski'
      const nameParts = name.split(' ')

      const createAttributeResponse = await client.attributes.createAttribute({
        content: {
          '@type': 'IdentityAttribute',
          owner: (await client.account.getIdentityInfo()).result.address,
          value: {
            '@type': 'DisplayName',
            value: 'LENABI Demo 1',
          },
        },
      })

      if (createAttributeResponse.isError) {
        const error = createAttributeResponse.error
        return res
          .status(500)
          .end(
            `Error occurred while creating relationship attribute: ${error.code} ${error.message}`,
          )
      }

      const attributesContent: ConnectorRequestContent = {
        metadata: { sessionId: sessionId ?? 'session-id' },
        items: [
          {
            '@type': 'RequestItemGroup',
            mustBeAccepted: true,
            title: 'Shared Attributes',
            items: [
              {
                '@type': 'ShareAttributeRequestItem',
                mustBeAccepted: true,
                attribute: {
                  '@type': 'IdentityAttribute',
                  owner: '',
                  value: {
                    '@type': 'DisplayName',
                    value: 'LENABI Demo 1',
                  },
                },
                sourceAttributeId: createAttributeResponse.result.id,
              },
            ],
          },
          {
            '@type': 'RequestItemGroup',
            mustBeAccepted: true,
            title: 'Requested Attributes',
            items: [
              {
                '@type': 'CreateAttributeRequestItem',
                mustBeAccepted: true,
                attribute: {
                  '@type': 'IdentityAttribute',
                  owner: '',
                  value: {
                    '@type': 'GivenName',
                    value: nameParts.length > 0 ? nameParts[0] : 'Alex',
                  },
                },
              },
              {
                '@type': 'CreateAttributeRequestItem',
                mustBeAccepted: true,
                attribute: {
                  '@type': 'IdentityAttribute',
                  owner: '',
                  value: {
                    '@type': 'Surname',
                    value:
                      nameParts.length > 1
                        ? nameParts[nameParts.length - 1]
                        : 'Janowski',
                  },
                },
              },
              {
                '@type': 'CreateAttributeRequestItem',
                mustBeAccepted: true,
                attribute: {
                  '@type': 'IdentityAttribute',
                  owner: '',
                  value: {
                    '@type': 'Nationality',
                    value: 'DE',
                  },
                },
              },
            ],
          },
        ],
      }
      const validationResponse = await client.outgoingRequests.canCreateRequest(
        {
          content: attributesContent,
        },
      )
      if (validationResponse.isError) {
        const error = validationResponse.error
        return res
          .status(500)
          .end(
            `Error occurred while validating attributes: ${error.code} ${error.message}`,
          )
      }

      const createRelationshipResponse =
        await client.relationshipTemplates.createOwnRelationshipTemplate({
          maxNumberOfAllocations: 1,
          expiresAt: '2100-01-01T00:00:00.000Z',
          content: {
            '@type': 'RelationshipTemplateContent',
            title: 'Connector Demo Contact',
            onNewRelationship: attributesContent,
          },
        })

      if (createRelationshipResponse.isError) {
        const error = createRelationshipResponse.error
        return res
          .status(500)
          .end(
            `Error occurred while creating relationship request: ${error.code} ${error.message}`,
          )
      }

      relationshipTemplateId = createRelationshipResponse.result.id

      await setSession(cache, sessionId, { relationshipTemplateId })
    }

    const createTokenResponse =
      await client.relationshipTemplates.createTokenQrCodeForOwnRelationshipTemplate(
        relationshipTemplateId,
      )
    if (createTokenResponse.isError) {
      const error = createTokenResponse.error
      res.statusCode = 500
      res.end(
        `Error occurred while creating token: ${error.code} ${error.message}`,
      )
      return
    }
    res.setHeader('Content-Type', 'image/png')
    res.status(200).end(createTokenResponse.result)
  }

  return (request, response) => {
    handleRequest(request, response).catch((error: Error) => {
      captureErrorEvent({
        error,
        errorContext: { headers: request.headers },
      })
      return response.status(500).send('Internal Server Error')
    })
  }
}

function createGetAttributesHandler(cache: Cache): RequestHandler {
  async function handleRequest(req: Request, res: Response) {
    const sessionId = readQuery(req, 'sessionId')
    if (!sessionId)
      return validationError(res, 'Missing required parameter: sessionId.')
    const session = await getSession(cache, sessionId)

    if (!session)
      return validationError(
        res,
        'Session not found. Please create a QR code first.',
      )
    res.setHeader('Content-Type', 'application/json')
    if (session.attributes) {
      res.statusCode = 200
      res.end(
        JSON.stringify({ status: 'success', attributes: session.attributes }),
      )
    } else {
      res.statusCode = 200
      res.end(JSON.stringify({ status: 'pending' }))
    }
  }
  return (request, response) => {
    handleRequest(request, response).catch((error: Error) => {
      captureErrorEvent({
        error,
        errorContext: { headers: request.headers },
      })
      return response.status(500).send('Internal Server Error')
    })
  }
}

function createSetAttributesHandler(cache: Cache): RequestHandler {
  async function handleRequest(req: Request, res: Response) {
    res.setHeader('Content-Type', 'application/json')

    const sessionId = readQuery(req, 'sessionId')
    if (!sessionId)
      return validationError(res, 'Missing required parameter: sessionId.')
    const session = await getSession(cache, sessionId)

    const name = readQuery(req, 'name')
    if (!name) return validationError(res, 'Missing required parameter: name.')
    const value = readQuery(req, 'value')
    if (!value)
      return validationError(res, 'Missing required parameter: value.')

    if (!session)
      return validationError(
        res,
        'Session not found. Please create a QR code first.',
      )
    if (!session.enmeshedId)
      return validationError(res, 'Relationship not accepted yet.')

    const client = ConnectorClient.create({
      baseUrl: `${process.env.ENMESHED_SERVER_HOST}`,
      apiKey: `${process.env.ENMESHED_SERVER_SECRET}`,
    })

    const getIdentityResponse = await client.account.getIdentityInfo()
    if (getIdentityResponse.isError)
      return validationError(res, 'Error retrieving connector identity info.')

    // See: https://enmeshed.eu/explore/schema#attributeschangerequest
    const sendMessageResponse = await client.messages.sendMessage({
      recipients: [session.enmeshedId],
      content: {
        '@type': 'RequestMail',
        to: [session.enmeshedId],
        cc: [],
        subject: 'Aktualisierung deines Lernstands',
        body: 'Gratulation!\nDu hast den Kurs zum logistischen Wachstum erfolgreich absolviert. Bitte speichere den aktualisierten Lernstand.\nDein Serlo-Team',
        requests: [
          {
            '@type': 'AttributesChangeRequest',
            attributes: [{ name, value }],
            applyTo: session.enmeshedId,
            reason:
              'Neuer Lernstand nach erfolgreicher Durchführung des Kurses zum logistischen Wachstum',
          },
        ],
      },
    })
    if (sendMessageResponse.isError)
      return validationError(res, JSON.stringify(sendMessageResponse.error))
    res.statusCode = 200
    res.end(JSON.stringify({ status: 'success' }))
  }
  return (request, response) => {
    handleRequest(request, response).catch((error: Error) => {
      captureErrorEvent({
        error,
        errorContext: { headers: request.headers },
      })
      return response.status(500).send('Internal Server Error')
    })
  }
}

/**
 * Endpoint for Connector webhook, which receives any changes within relationships and messages
 */
function createEnmeshedWebhookMiddleware(cache: Cache): RequestHandler {
  async function handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (req.headers['x-api-key'] !== process.env.ENMESHED_WEBHOOK_SECRET)
      return next()

    // TODO: Checking scheme of request body
    const payload = req.body as EnmeshedWebhookPayload
    if (!payload || !(payload.relationships || payload.messages)) return next()

    // Process relationships
    for (const relationship of payload.relationships) {
      // Check if relationship name matches
      const sessionId = relationship.template.content.metadata.sessionId ?? null
      // FIXME: Uncomment next line when prototype frontend has been replaced
      // if (!sessionId) return validationError(res, 'Missing required parameter: sessionId.')
      const session = await getSession(cache, sessionId)

      // FIXME: Uncomment next lines when prototype frontend has been replaced
      // if (!session) return validationError(res, 'Session not found. Please create a QR code first.')
      // if (relationship.template.id !== session.relationshipTemplateId) return validationError(res, 'Mismatching relationship template ID.')

      // Accept all pending relationship requests
      for (const change of relationship.changes) {
        if (
          ['Creation', 'RelationshipRequest'].includes(change.type) &&
          ['Pending', 'Revoked'].includes(change.status)
        ) {
          await acceptRelationshipRequest(relationship, change)

          if (session) {
            await setSession(cache, sessionId, {
              ...session,
              enmeshedId: relationship.peer,
              attributes: {
                ...session.attributes,
                ...getSessionAttributes(
                  Object.values(change.request.content?.attributes ?? {}),
                ),
              },
            })
          } else {
            await sendWelcomeMessage(relationship)
            await sendAttributesChangeRequest(relationship)
          }
        }
      }
    }

    // Process messages
    for (const message of payload.messages) {
      if (message.content['@type'] == 'AttributesChangeRequest') {
        const sessionId = await getSessionId(cache, message.createdBy)
        const session = await getSession(cache, sessionId)
        if (session) {
          await setSession(cache, sessionId, {
            ...session,
            enmeshedId: message.createdBy,
            attributes: {
              ...session.attributes,
              ...getSessionAttributes(message.content.attributes),
            },
          })
          // eslint-disable-next-line no-console
          console.log(`Received attributes`)
        }
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
  return (request, response, next) => {
    handleRequest(request, response, next).catch((error: Error) => {
      captureErrorEvent({
        error,
        errorContext: { headers: request.headers },
      })
      return response.status(500).send('Internal Server Error')
    })
  }
}

/**
 * Accepts pending relationship request
 */
async function acceptRelationshipRequest(
  relationship: Relationship,
  change: RelationshipChange,
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
      },
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
  relationship: Relationship,
): Promise<boolean> {
  const client = ConnectorClient.create({
    baseUrl: `${process.env.ENMESHED_SERVER_HOST}`,
    apiKey: `${process.env.ENMESHED_SERVER_SECRET}`,
  })
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1)
  const uploadFileResponse = await client.files.uploadOwnFile({
    title: 'Serlo Testdatei',
    description: 'Test file created by Serlo',
    file: Buffer.from(
      '<html><head><title>Serlo Testdatei</title></head><body><p>Hello World! – Dies ist eine Testdatei.</p></body></html>',
    ),
    filename: 'serlo-test.html',
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
  relationship: Relationship,
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

function validationError(res: Response, message: string) {
  res.statusCode = 400
  res.end(
    JSON.stringify({
      status: 'error',
      message,
    }),
  )
}

const Session = t.intersection([
  t.type({ relationshipTemplateId: t.string }),
  t.partial({
    enmeshedId: t.string,
    attributes: t.UnknownRecord,
  }),
])
type Session = t.TypeOf<typeof Session>

async function getSession(
  cache: Cache,
  sessionId: string | null,
): Promise<Session | null> {
  const cachedValue = await cache.get({ key: getSessionKey(sessionId) })

  if (!O.isNone(cachedValue)) {
    if (Session.is(cachedValue.value.value)) {
      return cachedValue.value.value
    }
  }

  return null
}

async function getSessionId(cache: Cache, id: string): Promise<string | null> {
  const cachedValue = await cache.get({ key: getIdentityKey(id) })

  if (!O.isNone(cachedValue)) {
    return cachedValue.value.value as string
  }

  return null
}

async function setSession(
  cache: Cache,
  sessionId: string | null,
  session: Session,
) {
  await cache.set({
    key: getSessionKey(sessionId),
    value: session,
    source: 'enmeshed-middleware',
  })
  if (session.enmeshedId) {
    await cache.set({
      key: getIdentityKey(session.enmeshedId),
      value: sessionId,
      source: 'enmeshed-middleware',
    })
  }
}

function getSessionKey(sessionId: string | null) {
  return sessionId
    ? `enmeshed:${sessionId}`
    : 'de.serlo.org/api/enmeshed/relationship-template-id'
}

function getIdentityKey(id: string) {
  return `enmeshed:${id}`
}

function getSessionAttributes(
  attributeList: { name: string; value: string }[],
) {
  return attributeList.reduce((al, a) => ({ ...al, [a.name]: a.value }), {})
}

function readQuery(req: ExpressRequest, key: string): string | null {
  const value = req.query[key]

  return typeof value === 'string' ? value : null
}

type ExpressRequest = Parameters<RequestHandler>[0]
