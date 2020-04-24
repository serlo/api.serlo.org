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
      tagName: 'v0.2.0',
      name: '0.2.0',
      date: '2020-04-13',
      breakingChanges: [
        "Remove health check route `/`. Use Apollo's health check route `.well-known/apollo/server-health` instead.",
      ],
      added: ['Add descriptions to the GraphQL schema.'],
    },
    {
      tagName: 'v0.3.0',
      name: '0.3.0',
      date: '2020-04-15',
      added: [
        'Add entity types `Course` and `CoursePage`.',
        'Add entity types `ExerciseGroup`, `GroupedExercise`, `Exercise`, and `Solution`.',
        'Add entity type `Applet`.',
        'Add entity type `Event`.',
        'Add entity type `Video`.',
      ],
    },
    {
      tagName: 'v0.4.0',
      name: '0.4.0',
      date: '2020-04-24',
      breakingChanges: [
        'Remove path from `TaxonomyTerm`. Use `TaxonomyTerm.navigation.path` instead.',
      ],
      added: [
        'Add `navigation` to `Page` and `TaxonomyTerm`',
        'Add meta fields to `EntityRevision`',
        'Add `content` to `VideoRevision`',
      ],
    },
  ])

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
