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
// Enmeshed Webhook payload
// https://enmeshed.eu/integrate/connector-configuration#payload

export interface EnmeshedWebhookPayload {
  messages: Message[]
  relationships: Relationship[]
}

export interface Message {
  id: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
  content: {
    '@type': string
    attributes: { name: string; value: string }[]
  }
  createdBy: string
  createdByDevice: string
  recipients: Recipient[]
  relationshipIds: string[]
  createdAt: string
  attachments: string[]
}

export interface Recipient {
  address: string
}

export interface Relationship {
  id: string
  template: RelationshipTemplate
  status: string
  peer: string
  changes: RelationshipChange[]
  lastMessageSentAt?: string
  lastMessageReceivedAt?: string
}

export interface RelationshipTemplate {
  id: string
  isOwn: boolean
  createdBy: string
  createdByDevice: string
  createdAt: string
  content: {
    attributes: { name: string; value: string }[]
    metadata: { [key: string]: string | undefined }
  }
  expiresAt?: string
  maxNumberOfRelationships?: number
}

export interface RelationshipChange {
  id: string
  request: {
    createdBy: string
    createdByDevice: string
    createdAt: string
    content?: {
      attributes?: { [key: string]: { name: string; value: string } }
    }
  }
  status: 'Pending' | 'Rejected' | 'Revoked' | 'Accepted'
  type:
    | 'Creation'
    | 'Termination'
    | 'TerminationCancellation'
    | 'RelationshipRequest'
  response?: {
    createdBy: string
    createdByDevice: string
    createdAt: string
    content: {
      attributes: { name: string; value: string }[]
    }
  }
}
