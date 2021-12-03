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

import {
  EnmeshedWebhookPayload,
  Relationship,
  RelationshipChange,
} from './enmeshed-payload'

// Contact name which is displayed to the user when requesting a relationship
const RELATIONSHIP_NAME = 'Lenabi Demo'

export function applyEnmeshedMiddleware({ app }: { app: Express }) {
  const basePath = '/enmeshed'
  app.post(`${basePath}/init`, createEnmeshedInitMiddleware())
  app.use(bodyParser.json())
  app.post(`${basePath}/webhook`, createEnmeshedWebhookMiddleware())
  return `${basePath}/init`
}

/**
 * Endpoint for enmeshed relationship initialization.
 * Creates relationship template and returns QR for the user to scan.
 */
function createEnmeshedInitMiddleware(): RequestHandler {
  return async (req, res) => {
    const client = ConnectorClient.create({
      baseUrl: `${process.env.ENMESHED_SERVER_HOST}`,
      apiKey: `${process.env.ENMESHED_SERVER_SECRET}`,
    })
    // Create Relationship template
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)
    const createRelationshipResponse =
      await client.relationshipTemplates.createOwnRelationshipTemplate({
        maxNumberOfRelationships: 10,
        expiresAt: expiresAt.toISOString(),
        content: {
          attributes: [
            {
              name: 'Thing.name',
              value: RELATIONSHIP_NAME,
            },
          ],
          request: {
            required: [
              {
                attribute: 'Person.familyName',
              },
              {
                attribute: 'Person.givenName',
              },
            ],
            optional: [
              {
                attribute: 'Comm.email',
              },
            ],
          },
        },
      })
    if (createRelationshipResponse.isError) {
      const error = createRelationshipResponse.error
      res.statusCode = 500
      res.end(
        `Error occurred creating relationship request: ${error.code} ${error.message}`
      )
      return
    }
    // Create Token
    const createTokenResponse =
      await client.relationshipTemplates.createTokenQrCodeForOwnRelationshipTemplate(
        createRelationshipResponse.result.id
      )
    if (createTokenResponse.isError) {
      const error = createRelationshipResponse.error
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
function createEnmeshedWebhookMiddleware(): RequestHandler {
  return async (req, res, next) => {
    if (req.headers['x-api-key'] !== process.env.ENMESHED_WEBHOOK_SECRET)
      return next()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload: EnmeshedWebhookPayload = req.body
    if (!payload || !payload.relationships) return next()
    // Get relationships
    for (const relationship of payload.relationships) {
      // Check if relationship name matches
      // FIXME: To maximize security in the future this should instead check for the actual relationship template ID
      //  which could be saved within the user database when creating the QR code
      const nameAttr = relationship.template.content.attributes.find(
        (a) => a.name === 'Thing.name'
      )
      if (!nameAttr || nameAttr.value !== RELATIONSHIP_NAME) return

      // Accept all pending relationship requests
      for (const change of relationship.changes) {
        if (
          ['Creation', 'RelationshipRequest'].includes(change.type) &&
          ['Pending', 'Revoked'].includes(change.status)
        ) {
          await acceptRelationshipRequest(relationship, change)
        }
      }
    }

    res.statusCode = 200
    res.end('')
  }
}

/**
 * Accepts pending relationship request and sends a welcome message with a test file attachment to be saved within the
 * users' data wallet
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
      body: 'Hallo! Danke für deine Anfrage, wir freuen uns über dein Vertrauen.',
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
