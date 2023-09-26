import { option as O, function as F } from 'fp-ts'
import * as t from 'io-ts'

import { UserInputError } from '~/errors'

export const UserInputDecoder = t.strict({
  subject: t.string,
  grade: t.number,
  difficulty: t.keyof({
    low: null,
    medium: null,
    high: null,
  }),
  topic: t.string,
  goal: t.string,
  subtasks: t.number,
  previous_knowledge: t.string,
  exercise_type: t.keyof({
    'multiple choice': null,
    'single choice': null,
    'single word solution': null,
    'single number solution': null,
  }),
})

export const GeneratedScMcExerciseDecoder = t.strict({
  type: t.keyof({
    multiple_choice: null,
    single_choice: null,
  }),
  question: t.string,
  options: t.array(t.string),
  correct_options: t.array(t.number),
})

export const GeneratedShortAnswerExerciseDecoder = t.strict({
  type: t.literal('short_answer'),
  question: t.string,
  correct_answer: t.string,
})

export const GeneratedContentDecoder = t.strict({
  heading: t.string,
  subtasks: t.array(
    t.strict({
      type: t.keyof({
        multiple_choice: null,
        single_choice: null,
        short_answer: null,
      }),
      question: t.string,
      options: t.union([t.array(t.string), t.null]),
      correct_options: t.union([t.array(t.number), t.null]),
      correct_answer: t.union([t.null, t.string]),
    }),
  ),
})

export async function makeRequest(payload: Payload) {
  // @ts-expect-error TS complains because payload has non-string property values, but it actually works.
  const params = new URLSearchParams(payload).toString()
  const url = `http://${process.env.CONTENT_GENERATION_SERVICE_HOST}/exercises?${params}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (response.status === 200) {
    const generationResult = (await response.json()) as string
    const parsedGenerationResult = JSON.parse(generationResult) as unknown

    console.log('parsed: ', parsedGenerationResult)

    const finalResult = {
      heading: parsedGenerationResult.heading,
      subtasks: parsedGenerationResult.subtasks.map((subtask) => ({
        type: subtask.type,
        question: subtask.question,
        options: subtask.options || null,
        correct_options: subtask.correct_options || null,
        correct_answer: subtask.correct_answer || null,
      })),
    }

    return finalResult
  } else if (response.status === 404) {
    return null
  } else if (response.status === 400) {
    const responseText = await response.text()
    const reason = F.pipe(
      O.tryCatch(() => JSON.parse(responseText) as unknown),
      O.chain(O.fromPredicate(t.type({ reason: t.string }).is)),
      O.map((json) => json.reason),
      O.getOrElse(() => 'Bad Request'),
    )

    throw new UserInputError(reason)
  } else {
    throw new Error(`${response.status}`)
  }
}

type ExerciseDifficulty = 'low' | 'medium' | 'high'

type ExerciseType =
  | 'multiple choice'
  | 'single choice'
  | 'single word solution'
  | 'single number solution'

export interface Payload {
  subject: string
  grade: number
  difficulty: ExerciseDifficulty
  topic: string
  goal: string
  subtasks: number
  previous_knowledge: string
  exercise_type: ExerciseType
}
