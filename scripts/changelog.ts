import { generateChangelog } from '@splish-me/changelog'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

const writeFile = util.promisify(fs.writeFile)

exec()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

async function exec(): Promise<void> {
  const content = await generateChangelog([
    {
      tagName: 'v0.1.0',
      name: '0.1.0',
      date: '2020-04-10',
      description: 'Initial release',
    },
    {
      tagName: 'v0.1.1',
      name: '0.1.1',
      date: '2020-04-11',
      added: ['Add health check route `/`.'],
      fixed: ['Lazily create token for GraphQL playground.'],
    },
    {
      breakingChanges: [
        "Remove health check route `/`. Use Apollo's health check route `.well-known/apollo/server-health` instead.",
      ],
      added: ['Add descriptions to the GraphQL schema.'],
    },
  ])

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
