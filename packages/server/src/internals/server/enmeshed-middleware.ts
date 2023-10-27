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
import {
  ConnectorClient,
  ConnectorError,
  ConnectorRelationship,
  ConnectorRelationshipChange,
  ConnectorRelationshipChangeStatus,
  ConnectorRelationshipChangeType,
  ConnectorRequestContent,
} from '@nmshd/connector-sdk'
import express, {
  Express,
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express'
import { option as O } from 'fp-ts'
import * as t from 'io-ts'

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
  const client = ConnectorClient.create({
    baseUrl: `${process.env.ENMESHED_SERVER_HOST}`,
    apiKey: `${process.env.ENMESHED_SERVER_SECRET}`,
  })

  app.post(`${basePath}/init`, createEnmeshedInitMiddleware(client, cache))
  app.get(`${basePath}/attributes`, createGetAttributesHandler(cache))
  app.post(`${basePath}/attributes`, createSetAttributesHandler(client, cache))
  app.use(express.json())
  app.post(
    `${basePath}/webhook`,
    createEnmeshedWebhookMiddleware(client, cache),
  )
  return `${basePath}/init`
}

/**
 * Endpoint for enmeshed relationship initialization.
 * Creates relationship template and returns QR for the user to scan.
 */
function createEnmeshedInitMiddleware(
  client: ConnectorClient,
  cache: Cache,
): RequestHandler {
  async function handleRequest(req: Request, res: Response) {
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
        return handleConnectorError({
          error: createAttributeResponse.error,
          message: 'Error occurred while creating relationship attribute',
          response: res,
        })
      }

      // TODO: Handle privacy and Lernstand-Mathe See https://github.com/serlo/api.serlo.org/blob/83db29db4a98f6b32c389a0a0f89612fb9f760f8/packages/server/src/internals/server/enmeshed-middleware.ts#L460
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
        return handleConnectorError({
          error: validationResponse.error,
          message: 'Error occurred while validating attributes',
          response: res,
        })
      }

      const createRelationshipResponse =
        await client.relationshipTemplates.createOwnRelationshipTemplate({
          expiresAt: '2100-01-01T00:00:00.000Z',
          content: {
            '@type': 'RelationshipTemplateContent',
            title: 'LENABI Demo',
            onNewRelationship: attributesContent,
          },
        })
      if (createRelationshipResponse.isError) {
        return handleConnectorError({
          error: createRelationshipResponse.error,
          message: 'Error occurred while creating relationship',
          response: res,
        })
      }

      relationshipTemplateId = createRelationshipResponse.result.id

      await setSession(cache, sessionId, {
        relationshipTemplateId,
        content: createRelationshipResponse.result
          .content as Session['content'],
      })
    }

    const createTokenResponse =
      await client.relationshipTemplates.createTokenQrCodeForOwnRelationshipTemplate(
        relationshipTemplateId,
      )
    if (createTokenResponse.isError) {
      return handleConnectorError({
        error: createTokenResponse.error,
        message: 'Error occurred while creating token',
        response: res,
      })
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
    if (session.content) {
      res.status(200).end(
        JSON.stringify({
          status: 'success',
          attributes: session.content['onNewRelationship'],
        }),
      )
    } else {
      res.status(200).end(JSON.stringify({ status: 'pending' }))
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

function createSetAttributesHandler(
  client: ConnectorClient,
  cache: Cache,
): RequestHandler {
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

    const getIdentityResponse = await client.account.getIdentityInfo()
    if (getIdentityResponse.isError) {
      return handleConnectorError({
        error: getIdentityResponse.error,
        message: 'Error retrieving connector identity info',
        response: res,
      })
    }

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
    if (sendMessageResponse.isError) {
      return handleConnectorError({
        error: sendMessageResponse.error,
        message: 'Error retrieving connector identity info',
        response: res,
      })
    }
    res.status(200).end(JSON.stringify({ status: 'success' }))
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
function createEnmeshedWebhookMiddleware(
  client: ConnectorClient,
  cache: Cache,
): RequestHandler {
  async function handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (req.headers['x-api-key'] !== process.env.ENMESHED_WEBHOOK_SECRET)
      return next()

    const { result } = await client.account.sync()

    for (const relationship of result.relationships) {
      const sessionId =
        (relationship.template.content as { metadata: { sessionId: string } })
          ?.metadata?.sessionId ?? null
      // FIXME: Uncomment next line when prototype frontend has been replaced
      // if (!sessionId) return validationError(res, 'Missing required parameter: sessionId.')
      const session = await getSession(cache, sessionId)

      // FIXME: Uncomment next lines when prototype frontend has been replaced
      // if (!session) return validationError(res, 'Session not found. Please create a QR code first.')
      // if (relationship.template.id !== session.relationshipTemplateId) return validationError(res, 'Mismatching relationship template ID.')

      for (const change of relationship.changes) {
        if (
          [ConnectorRelationshipChangeType.CREATION].includes(change.type) &&
          [
            ConnectorRelationshipChangeStatus.PENDING,
            ConnectorRelationshipChangeStatus.REJECTED,
          ].includes(change.status)
        ) {
          await acceptRelationshipRequest(relationship, change, client)

          if (session) {
            await setSession(cache, sessionId, {
              ...session,
              enmeshedId: relationship.peer,
              content: {
                ...session.content,
                ...getSessionAttributes(
                  Object.values(
                    (
                      change.request.content as {
                        attributes: { name: string; value: string }[]
                      }
                    ).attributes ?? {},
                  ),
                ),
              },
            })
          } else {
            const payload = { relationship, client }
            await sendWelcomeMessage(payload)
            await sendAttributesChangeRequest(payload)
          }
        }
      }
    }

    for (const message of result.messages) {
      const content = message.content as {
        '@type': string
        attributes: { name: string; value: string }[]
      }

      // TODO: check if AttributesChangeRequest is deprecated
      if (
        content['@type'] == 'AttributesChangeRequest' ||
        content['@type'] == 'ProposeAttributeRequestItem'
      ) {
        const sessionId = await getSessionId(cache, message.createdBy)
        const session = await getSession(cache, sessionId)
        if (session) {
          await setSession(cache, sessionId, {
            ...session,
            enmeshedId: message.createdBy,
            content: {
              ...session.content,
              ...getSessionAttributes(Object.values(content.attributes ?? {})),
            },
          })
          // eslint-disable-next-line no-console
          console.log(`Received attributes`)
        }
      } else {
        // eslint-disable-next-line no-console
        console.log('Received message:', message.content)
      }
    }

    res.status(200).end('')
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
  relationship: ConnectorRelationship,
  change: ConnectorRelationshipChange,
  client: ConnectorClient,
): Promise<void> {
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
  }
}

/**
 * Sends a welcome message with a test file attachment to be saved within the users' data wallet
 */
async function sendWelcomeMessage({
  relationship,
  client,
}: {
  relationship: ConnectorRelationship
  client: ConnectorClient
}): Promise<boolean> {
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

  // TODO: update to v2
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
async function sendAttributesChangeRequest({
  relationship,
  client,
}: {
  relationship: ConnectorRelationship
  client: ConnectorClient
}): Promise<boolean> {
  const getIdentityResponse = await client.account.getIdentityInfo()
  if (getIdentityResponse.isError) {
    // eslint-disable-next-line no-console
    console.log(getIdentityResponse)
    return false
  }
  const connectorIdentity = getIdentityResponse.result.address

  // TODO: update do v2
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

function handleConnectorError({
  error,
  message,
  response,
}: {
  error: ConnectorError
  message: string
  response: Response
}) {
  return response.status(500).end(`${message}: ${error.code} ${error.message}`)
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
    content: t.UnknownRecord,
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
