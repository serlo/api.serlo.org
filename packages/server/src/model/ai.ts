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
}: ExecutePromptParams): Promise<OpenAI.ChatCompletion> {
  if (!prompt || prompt.trim() === '') {
    throw new UserInputError('Missing prompt parameter')
  }

  try {
    const openai = getOpenAIInstance()
    if (!openai) {
      throw new Error(
        'OpenAI instance could not be created due to missing API key.',
      )
    }

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

type AnyJsonResponse = t.TypeOf<typeof t.UnknownRecord>

export const isAnyJsonResponse = (
  response: unknown,
): response is AnyJsonResponse => {
  return t.UnknownRecord.is(response)
}

export async function makeRequest(args: {
  userId: number | null
  prompt: string
}): Promise<AnyJsonResponse> {
  const { userId, prompt } = args
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
