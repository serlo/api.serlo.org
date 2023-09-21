import { option as O, function as F } from 'fp-ts'
import * as t from 'io-ts'

import { UserInputError } from '~/errors'

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
})

export const GeneratedContentDecoder = t.union([
  GeneratedScMcExerciseDecoder,
  GeneratedShortAnswerExerciseDecoder,
])

export async function makeRequest(payload: Payload) {
  const databaseLayerUrl = `http://${process.env.CONTENT_GENERATION_SERVICE_HOST}`
  const body = JSON.stringify(payload === undefined ? {} : { payload })
  const response = await fetch(databaseLayerUrl, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  })

  if (response.status === 200) {
    return (await response.json()) as unknown
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
    throw new Error(`${response.status}: ${body}`)
  }
}

type ExerciseDifficulty = 'leicht' | 'moderat' | 'knifflig'

type ExerciseCategory = 'eine Einzelaufgabe' | 'ein Quiz' | 'einen Test'

type ExerciseType =
  | 'Multiple Choice'
  | 'Single Choice'
  | 'Lückentext'
  | 'Wahr Falsch'
  | 'Zuordnung'
  | 'Freitext'
  | 'Sachaufgabe'
  | 'Lösung mit 1 Wort'
  | 'Lösung mit 1 Zahl'

export interface Payload {
  subject: string
  grade: number
  level: ExerciseDifficulty
  topic: string
  goal: string
  category: ExerciseCategory
  number_exercises: number
  info: string
  exercise_types: ExerciseType[]
}
