import * as t from 'io-ts'
import { APIError, OpenAI } from 'openai'
// eslint-disable-next-line import/no-internal-modules
import { ChatCompletion } from 'openai/resources'

import { UserInputError } from '~/errors'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ExecutePromptParams {
  prompt: string
  // If we want to monitor abuse and receive more actionable feedback from
  // OpenAI, we can pass the user to the model. See
  // https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids
  user?: string
}

async function executePrompt({
  prompt,
  user,
}: ExecutePromptParams): Promise<ChatCompletion> {
  if (!prompt || prompt.trim() === '') {
    throw new UserInputError('Missing prompt parameter')
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.4,
      ...(user && { user }),
      response_format: { type: 'json_object' },
    })

    return response
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

export const PayloadDecoder = t.strict({
  prompt: t.string,
  userId: t.union([t.number, t.null]),
})

const UnknownRecord = t.UnknownRecord

type AnyJsonResponse = t.TypeOf<typeof UnknownRecord>

export const isAnyJsonResponse = (
  response: unknown,
): response is AnyJsonResponse => {
  return UnknownRecord.is(response)
}

export async function makeRequest({
  userId,
  prompt,
}: t.TypeOf<typeof PayloadDecoder>): Promise<AnyJsonResponse> {
  const response = await executePrompt({ prompt, user: String(userId) })

  // As we now have the response_format defined as json_object, we shouldn't
  // need to call JSON.parse on the stringMessage. However, right now the OpenAI
  // types seem to be broken (thinking the API is returning a string or null).
  // Instead of fighting the types, we can simply adjust this in the next
  // version.
  const stringMessage = response.choices[0].message.content
  if (!stringMessage) {
    throw new Error('No content received from LLM!')
  }

  const message = JSON.parse(stringMessage) as unknown

  if (!isAnyJsonResponse(message)) {
    throw new Error('Invalid JSON format of content-generation-service')
  }

  return message
}
