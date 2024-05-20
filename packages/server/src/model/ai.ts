import * as t from 'io-ts'
import { APIError, OpenAI } from 'openai'

import { UserInputError } from '~/errors'

// singleton instance so that it doesn't have to be reinitialized on every
// request
let openai: OpenAI | undefined

function getOpenAIInstance() {
  if (process.env.OPENAI_API_KEY !== undefined && openai === undefined) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  return openai
}

type OpenAIMessages = OpenAI.Chat.Completions.ChatCompletionMessageParam[]

export async function executePrompt(args: {
  // If we want to monitor abuse and receive more actionable feedback from
  // OpenAI, we can pass the user to the model. See
  // https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids
  userId: number | null
  messages: OpenAIMessages
}): Promise<Record<string, unknown>> {
  const { userId, messages } = args

  const hasEmptyMessage = messages.some(
    ({ content }) => typeof content === 'string' && content.trim() === '',
  )

  if (hasEmptyMessage) {
    throw new UserInputError('Missing prompt within a message')
  }

  try {
    const openai = getOpenAIInstance()
    if (!openai) {
      throw new Error(
        'OpenAI instance could not be created due to missing API key.',
      )
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.4,
      user: String(userId),
      response_format: { type: 'json_object' },
    })

    const stringMessage = response.choices[0].message.content

    if (!stringMessage) {
      throw new Error('No content received from LLM!')
    }

    // As we now have the response_format defined as json_object, we shouldn't
    // need to call JSON.parse on the stringMessage. However, right now the OpenAI
    // types seem to be broken (thinking the API is returning a string or null).
    // Instead of fighting the types, we can simply adjust this in the next
    // version.
    const message = JSON.parse(stringMessage) as unknown

    if (!t.UnknownRecord.is(message)) {
      throw new Error('Invalid JSON format of content-generation-service')
    }

    return message
  } catch (error) {
    if (error instanceof APIError) {
      const detailedMessage = [
        'OpenAI API error when executing prompt.',
        `Status: ${error.status}`,
        `Type: ${error.type}`,
        `Code: ${error.code}`,
        `Param: ${error.param}`,
        `Message: ${error.message}`,
      ].join('\n')

      throw new Error(detailedMessage)
    } else if (error instanceof Error) {
      throw new Error(`Error when executing prompt: ${error.message}`)
    } else {
      throw new Error('Unknown error occurred in executing prompt')
    }
  }
}
