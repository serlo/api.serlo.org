import * as t from 'io-ts'

import { createMutation } from '~/internals/data-source-helper'

export function createMailchimpModel() {
  const deleteEmailPermanently = createMutation({
    type: 'mailchimp/delete-user',
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
          mailchimpResponse = await response.json()
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
