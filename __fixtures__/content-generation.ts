import { Model } from '~/internals/graphql'

export const contentGenerationResponse: Model<'ContentGenerationQueryResponse'> =
  {
    success: true,
    generatedContent: JSON.stringify({
      heading: 'Math for 7th grade',
    }),
  }
