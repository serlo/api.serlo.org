/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
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
        'Add `navigation` to `Page` and `TaxonomyTerm`.',
        'Add meta fields to `EntityRevision`.',
        'Add `content` to `VideoRevision`.',
      ],
    },
    {
      tagName: 'v0.4.1',
      name: '0.4.1',
      date: '2020-04-24',
      fixed: ['Fix build.'],
    },
    {
      tagName: 'v0.4.2',
      name: '0.4.2',
      date: '2020-04-24',
      fixed: ['Fix build.'],
    },
    {
      tagName: 'v0.4.3',
      name: '0.4.3',
      date: '2020-04-27',
      fixed: ['Fix `navigation.data`.'],
    },
    {
      tagName: 'v0.5.0',
      name: '0.5.0',
      date: '2020-04-27',
      breakingChanges: [
        'Use Redis as cache.',
        'Use MessagePack as serializer.',
      ],
    },
    {
      tagName: 'v0.5.1',
      name: '0.5.1',
      date: '2020-06-05',
      added: ['Handle user tokens.'],
      fixed: ['Output url-encoded aliases.'],
    },
    {
      tagName: 'v0.5.2',
      name: '0.5.2',
      date: '2020-06-05',
      fixed: ['Handle url-encoded alias inputs correctly.'],
    },
    {
      tagName: 'v0.5.3',
      name: '0.5.3',
      date: '2020-07-06',
      fixed: ['Fix navigation contract tests.'],
    },
    {
      tagName: 'v0.5.4',
      name: '0.5.4',
      date: '2020-07-06',
      fixed: ['Fix build.'],
    },
    {
      tagName: 'v0.5.5',
      name: '0.5.5',
      date: '2020-07-13',
      added: ['Add `notifications`.'],
    },
    {
      tagName: 'v0.5.6',
      name: '0.5.6',
      date: '2020-07-14',
      added: [
        ['notifications', 'Implement GraphQL Cursor Connection specification.'],
        ['notifications', 'Add optional `unread` filter.'],
      ],
    },
    {
      tagName: 'v0.5.7',
      name: '0.5.7',
      date: '2020-07-14',
      fixed: [['auth', 'Add X-Forwarded-Proto header to Hydra request.']],
    },
    {
      tagName: 'v0.5.8',
      name: '0.5.8',
      date: '2020-07-14',
      fixed: [['notifications', 'Process object response as an array.']],
    },
    {
      tagName: 'v0.6.0',
      name: '0.6.0',
      date: '2020-07-21',
      breakingChanges: [
        [
          'navigation',
          '`Navigation["data"]` is now returned directly as JSON.',
        ],
        ['uuid', 'Removed `UnsupportedUuid`.'],
      ],
      changed: [
        [
          'navigation',
          '`Navigation["data"]` is now returned directly as JSON.',
        ],
      ],
      added: [
        'Add `JSON` & `JSONObject` GraphQL scalars.',
        'Publish types as npm package `@serlo/api`.',
        'Add `activeDonors`.',
        ['user', 'Add `activeDonor`.'],
      ],
      removed: [['uuid', 'Removed `UnsupportedUuid`.']],
      internal: [
        'Generate TypeScript types from GraphQL schema.',
        "Previous `de.serlo.org/api/uuid/*`, `*.serlo.org/api/navigation` cache values won't work anymore.",
        [
          'uuid',
          'Consistently require `__typename` instead of `discriminator` + optional `type`.',
        ],
        [
          'cache',
          'Deprecated all `_set*` / `_remove*` mutations in favor of `_setCache` / `_removeCache`.',
        ],
      ],
    },
    {
      tagName: 'v0.7.2',
      name: '0.7.2',
      date: '2020-08-04',
      breakingChanges: [
        [
          'notification',
          'Completely new implementation. We now basically resolve the different event types in the API directly. See `AbstractNotificationEvent`.',
        ],
        [
          'uuid',
          'Rename `article` to `repository` in `ArticleRevision` (and similarly for all other types that implement `AbstractRevision`.',
        ],
      ],
      added: [
        [
          'uuid',
          `Add various base types that expose common properties. More specifically:
- Add base type \`AbstractExercise\` for \`Exercise\` and \`GroupedExercise\`.
- Add base type \`AbstractExerciseRevision\` for \`ExerciseRevision\` and \`GroupedExerciseRevision\`.
- Add base type \`AbstractNavigationChild\` for \`Page\` and \`TaxonomyTerm\`.
- Add base type \`AbstractRepository\` for \`AbstractEntity\` and \`Page\`.
- Add base type \`AbstractRepositoryRevision\` for \`AbstractEntityRevision\` and \`PageRevision\`.
- Add base type \`AbstractTaxonomyTermChild\` for entity types that appear as children of taxonomy terms.
              `,
        ],
        ['uuid', 'Add field `date` to `Page`.'],
      ],
      changed: [
        [
          'uuid',
          '`AbstractEntity`, `AbstractEntityRevision` inherit the properties of `AbstractUuid` explicitly',
        ],
      ],
    },
    {
      tagName: 'v0.7.4',
      name: '0.7.4',
      date: '2020-08-06',
      added: [
        ['notification', 'Add `UnsupportedNotificationEvent`.'],
        ['uuid', 'Add `UnsupportedUuid`.'],
      ],
      fixed: [
        [
          'uuid',
          'GraphQL no longer fails when it encounters an unsupported entity.',
        ],
      ],
    },
    {
      tagName: 'v0.8.0',
      name: '0.8.0',
      date: '2020-08-10',
      breakingChanges: [
        [
          'notification',
          'generalize actor / author / reviewer into actor and move into `AbstractNotificationEvent`',
        ],
        ['notification', 'Remove `UnsupportedNotificationEvent`.'],
        ['uuid', 'Remove `UnsupportedUuid`.'],
      ],
      changed: [
        [
          'notification',
          'generalize actor / author / reviewer into actor and move into `AbstractNotificationEvent`',
        ],
      ],
      removed: [
        ['notification', 'Remove `UnsupportedNotificationEvent`.'],
        ['uuid', 'Remove `UnsupportedUuid`.'],
      ],
      fixed: [
        [
          'uuid',
          'GraphQL no longer fails when it encounters an unsupported entity.',
        ],
      ],
    },
    {
      tagName: 'v0.8.1',
      name: '0.8.1',
      date: '2020-08-11',
      fixed: [
        [
          'notification',
          'GraphQL no longer fails when it encounters an unsupported notification event.',
        ],
      ],
      internal: ['Add Sentry.', 'Remove Playground service.'],
    },
    {
      tagName: 'v0.9.0',
      breakingChanges: [
        'Consistently name GraphQL connection types `*Connection` and `*Edge`.',
        [
          'abstract-taxonomy-term-child',
          '`AbstractTaxonomyTermChild.taxonomyTerms` now returns a GraphQL Connection.',
        ],
        ['navigation', '`Navigation.path` now returns a GraphQL connection.'],
        [
          'taxonomy-term',
          '`TaxonomyTerm.children` now returns a GraphQL connection.',
        ],
        ['user', '`activeDonors` now returns a GraphQL connection.'],
      ],
      added: [
        ['user', 'Add `activeAuthors` and `activeReviewers`.'],
        ['user', 'Add `activeAuthor` and `activeReviewer` to `User`.'],
      ],
      changed: [
        [
          'abstract-taxonomy-term-child',
          '`AbstractTaxonomyTermChild.taxonomyTerms` now returns a GraphQL connection.',
        ],
        ['navigation', '`Navigation.path` now returns a GraphQL connection.'],
        [
          'taxonomy-term',
          '`TaxonomyTerm.children` now returns a GraphQL connection.',
        ],
        ['user', '`activeDonors` now returns a GraphQL connection.'],
      ],
      internal: [
        'Sentry now expects the environment via the `ENVIRONMENT` environment variable.',
      ],
    },
  ])

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
