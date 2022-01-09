/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as t from 'io-ts'
import fetch from 'node-fetch'

import { createMutation } from '~/internals/data-source-helper'

export function createMailchimpModel() {
  const deleteEmailPermanently = createMutation({
    decoder: t.union([
      t.strict({ success: t.literal(true) }),
      t.strict({ success: t.literal(false), mailchimpResponse: t.unknown }),
    ]),
    async mutate({ emailHash }: { emailHash: string }) {
      const key = process.env.MAILCHIMP_API_KEY
      const dc = key.split('-')[1]
      const url =
        `https://${dc}.api.mailchimp.com/3.0/` +
        `lists/a7bb2bbc4f/members/${emailHash}/actions/delete-permanent`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' + Buffer.from(`any:${key}`).toString('base64'),
        },
      })

      if (response.status === 204 || response.status === 404) {
        return { success: true }
      } else {
        let mailchimpResponse = undefined

        try {
          mailchimpResponse = (await response.json()) as unknown
        } catch (exception) {
          mailchimpResponse = exception
        }

        return { success: false, mailchimpResponse }
      }
    },
  })

  return {
    deleteEmailPermanently,
  }
}
