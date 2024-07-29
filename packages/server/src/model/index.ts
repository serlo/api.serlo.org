import { createChatModel } from './chat'
import { createKratosModel } from './kratos'
import { createMailchimpModel } from './mailchimp'

export * from './chat'

export const modelFactories = {
  chat: createChatModel,
  mailChimp: createMailchimpModel,
  kratos: createKratosModel,
}
