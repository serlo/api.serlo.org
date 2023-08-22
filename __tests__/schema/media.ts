import fs from 'fs'
import gql from 'graphql-tag'
import path from 'path'
// import { fileURLToPath } from 'url'

import { user } from '../../__fixtures__'
import { Client } from '../__utils__'

const imageQuery = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    query {
      media {
        newUpload(mediaType: IMAGE_PNG) {
          uploadUrl
          urlAfterUpload
        }
      }
    }
  `,
})

const audioQuery = new Client({ userId: user.id }).prepareQuery({
  query: gql`
    query {
      media {
        newUpload(mediaType: AUDIO_WAV) {
          uploadUrl
          urlAfterUpload
        }
      }
    }
  `,
})

interface MediaNewUpload {
  uploadUrl: string
  urlAfterUpload: string
}

interface Media {
  newUpload: MediaNewUpload
}

interface SingleResult {
  data: {
    media: Media
  }
}

interface ResponseBody {
  kind: string
  singleResult: SingleResult
}

interface QueryResponse {
  http: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers: Record<string, any>
  }
  body: ResponseBody
}

async function logResponse(response: Response) {
  const { status, statusText, headers } = response

  let body = ''
  try {
    // Try to parse as JSON first
    body = JSON.stringify(await response.json(), null, 2)
  } catch (e) {
    // If not JSON, try to read as text
    // body = await response.text()
  }

  // eslint-disable-next-line no-console
  console.log(`Response Status: ${status} ${statusText}`)
  // eslint-disable-next-line no-console
  console.log('Headers:', [...headers.entries()])
  // eslint-disable-next-line no-console
  console.log('Body:', body)
}

describe('media.upload', () => {
  test('returns url for uploading image file', async () => {
    await imageQuery.shouldReturnData({
      media: {
        newUpload: {
          uploadUrl: 'http://google.com/upload',
          urlAfterUpload: expect.stringMatching(
            /https:\/\/assets.serlo.org\/[\d\-a-f]+\/image.png/,
          ) as unknown,
        },
      },
    })
  })

  test('returns url for uploading audio file', async () => {
    await audioQuery.shouldReturnData({
      media: {
        newUpload: {
          uploadUrl: 'http://google.com/upload',
          urlAfterUpload: expect.stringMatching(
            /https:\/\/assets.serlo.org\/[\d\-a-f]+\/audio.wav/,
          ) as unknown,
        },
      },
    })
  })

  test('can upload an audio file', async () => {
    const apiResponse: QueryResponse =
      (await audioQuery.execute()) as unknown as QueryResponse

    // eslint-disable-next-line no-console
    console.log('ApiResponse: ' + JSON.stringify(apiResponse))
    const { uploadUrl } = apiResponse.body.singleResult.data.media.newUpload
    // const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const filePath = path.join(__dirname, 'test.wav')
    const fileData: Buffer = await fs.promises.readFile(filePath)

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'audio/wav',
      },
      body: fileData,
    })

    await logResponse(response)

    expect(response.status).toBe(200)
    const data = (await response.json()) as unknown

    // eslint-disable-next-line no-console
    console.log('Response data: ' + JSON.stringify(data))
  })

  test('fails for unauthenticated user', async () => {
    await imageQuery
      .forUnauthenticatedUser()
      .shouldFailWithError('UNAUTHENTICATED')
  })
})
