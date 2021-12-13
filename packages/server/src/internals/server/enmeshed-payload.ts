// Enmeshed Webhook payload
// https://enmeshed.eu/integrate/connector-configuration#payload

export interface EnmeshedWebhookPayload {
  messages: Message[]
  relationships: Relationship[]
}

export interface Message {
  id: string
  /* eslint-disable @typescript-eslint/no-explicit-any */
  content:  {
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
    metadata: { [key: string]: string }
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
    /* eslint-disable @typescript-eslint/no-explicit-any */
    content?: any
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
