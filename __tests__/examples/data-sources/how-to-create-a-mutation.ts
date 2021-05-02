/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as t from 'io-ts'
import { rest } from 'msw'
import fetch from 'node-fetch'

import {
  createMutation,
  Mutation,
} from '~/internals/data-source-helper/mutation'

describe('How to create a mutation in a data source: update the content of an article', () => {
  // Lets assume we want to implement a mutation which updates the content of
  // an article. The following object simulates a database whereby the article's
  // contents are indexed by the article's id.
  let contentDatabase: Record<number, string | undefined>

  // This object simulates our dataSources object. It contains the data source
  // `database` which has the only function `updateContent`. This function is
  // a mutation which accepts two arguments (the `id` of the article and the
  // new content `newContent`), makes the mutation and returns an object containing
  // the success of the operation in the property `success`.
  let dataSources: {
    database: {
      updateContent: Mutation<
        { id: number; newContent: string },
        { success: boolean }
      >
    }
  }

  beforeEach(() => {
    // Some initial values for the database
    contentDatabase = {
      [42]: 'Hello world!',
      [100]: 'This is another article with has id 100',
    }

    // There is a REST API in front of the database which exposes a /articles/:id
    // endpoint with which the content of an API can be updated. This endpoint can
    // be accessed by the PUT operation and the JSON payload is of the form
    // `{ "newContent": "..." }` with the new content of the article. It responds
    // with a JSON of the form `{ "success": boolean }` to determine whether the
    // response was successfull or not.
    global.server.use(
      rest.put<{ newContent: string }, { success: boolean }, { id: string }>(
        'http://database-api.serlo.org/articles/:id',
        (req, res, ctx) => {
          const id = parseInt(req.params.id)

          // given id is not a number -> return with "400 Bad Request"
          if (Number.isNaN(id)) return res(ctx.status(400))

          if (contentDatabase[id] !== undefined) {
            // article with given id is in database
            contentDatabase[id] = req.body.newContent

            return res(ctx.json({ success: true as boolean }))
          } else {
            return res(ctx.json({ success: false as boolean }))
          }
        }
      )
    )

    dataSources = {
      database: {
        // Here we create the mutation with the helper function
        // `createMutation()`
        updateContent: createMutation({
          // Since the return type shall be `{ success: boolean }` we add
          // an io-ts decoder for this type. This is used during runtime to
          // check the returned value. So we can notice when the called API
          // does something weired.
          decoder: t.strict({ success: t.boolean }),

          // Function which does the actual mutation
          async mutate({ id, newContent }: { id: number; newContent: string }) {
            // Call to the API of the database to update the content of the
            // article
            const url = `http://database-api.serlo.org/articles/${id}`
            const res = await fetch(url, {
              method: 'PUT',
              body: JSON.stringify({ newContent }),
              headers: { 'content-type': 'application/json' },
            })

            // The API was designed in a way that it already returns a JSON
            // of the form `{ "success": boolean }`. Therefore we return this
            // JSON as an result of the muation. Since we will check the type of
            // the JSON afterwards with the decoder we return the parsed JSON
            // as `unknown`. This makes the code also more robust: The unknown
            // type makes sure, that we check the returned value before further
            // processing it. So we do not trust the API "blindely" to return
            // the right values.
            return (await res.json()) as unknown
          },
        }),
      },
    }
  })

  describe('via calling the created mutation function the content of an article can be updated', () => {
    test('when the article exists (mutaion was successfull)', async () => {
      // We call the mutation function to update an article
      const result = await dataSources.database.updateContent({
        id: 42,
        newContent: 'new content',
      })

      // The returned result is actually `{ success: true }`
      expect(result.success).toBe(true)

      // The content of the article is changed in the database
      expect(contentDatabase[42]).toBe('new content')
    })

    test('when the article does not exist (mutation was not successfull)', async () => {
      // Lets do a mutation for a non existing article
      const result = await dataSources.database.updateContent({
        id: 23,
        newContent: 'foo',
      })

      // The result is `{ success: false }` as expected. Now we can act on this
      // (like returning an error or passing the success value as an result of
      // the GraphQL operation so that the client can handle this case).
      expect(result.success).toBe(false)
    })
  })
})
