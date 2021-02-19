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
import { generateChangelog } from '@inyono/changelog'
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
      date: '2020-08-16',
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
    {
      tagName: 'v0.10.0',
      date: '2020-10-14',
      added: [
        'Add `subscriptions`.',
        [
          'alias',
          `Hide certain implementation details of our alias system by adding polyfills for typical use cases:
- Resolve \`/:id\` to the given UUID.
- Users now have \`/user/profile/:username\` as their alias.
- Resolve \`/user/profile/:id\` and \`/user/profile/:username\` to the given user.
          `,
        ],
        ['abstract-repository', 'Add `revisions` to `Page` and all entities.'],
      ],
      fixed: [
        ['alias', 'Handle paths that are already URL-decoded correctly.'],
        ['alias', 'Output URL-encoded paths.'],
        ['uuid', 'Return `null` when the UUID does not exist.'],
      ],
    },
    {
      tagName: 'v0.10.1',
      date: '2020-10-14',
      fixed: ['Update dependencies.'],
    },
    {
      tagName: 'v0.11.0',
      date: '2020-11-18',
      yanked: true,
    },
    {
      tagName: 'v0.11.1',
      date: '2020-11-18',
      yanked: true,
    },
    {
      tagName: 'v0.11.2',
      date: '2020-11-18',
      added: [
        'We now have a stale-while-revalidate caching approach in place. This should lead to more correct behavior even when our listeners fail.',
        [
          'notification',
          'Add `objectId` to `AbstractNotificationEvent` which reports the ID of the object that triggered the event (and can be used to unsubscribe).',
        ],
        ['uuid', 'Add `threads`.'],
      ],
    },
    {
      tagName: 'v0.11.3',
      date: '2020-11-24',
      fixed: ['Tweak `max-age`s of stale-while-revalidate caching.'],
      internal: [
        ['alias', 'Remove `source` and `timestamp` from `AliasPayload`.'],
      ],
    },
    {
      tagName: 'v0.11.4',
      date: '2020-11-30',
      fixed: [['uuid', 'Unify alias type.']],
      internal: [
        ['cacheable-data-source', 'Use in-memory lock.'],
        ['cacheable-data-source', 'Add logs.'],
      ],
    },
    {
      tagName: 'v0.12.0',
      date: '2020-12-09',
      yanked: true,
    },
    {
      tagName: 'v0.12.1',
      date: '2020-12-09',
      yanked: true,
    },
    {
      tagName: 'v0.12.2',
      date: '2020-12-09',
      fixed: [['uuid', 'Throw `UserInputError` for malformed paths.']],
      changed: [['uuid', 'Sort `threads` by `createdAt` in descending order.']],
      internal: [
        'Implement SWR Background updates using Bee-Queue.',
        'Implement Locks using Redlock.',
      ],
    },
    {
      tagName: 'v0.13.0',
      date: '2020-12-15',
      yanked: true,
    },
    {
      tagName: 'v0.13.1',
      date: '2020-12-15',
      added: [['uuid', 'Resolve `/entity/view/:id` to the given uuid.']],
      internal: [
        'Restructure the repository. Please check out the updated README.',
      ],
    },
    {
      tagName: 'v0.14.0',
      date: '2020-12-23',
      added: ['Add `createThread` mutation.'],
      internal: ['Add dashboard for SWR Queue.'],
    },
    {
      tagName: 'v0.14.1',
      date: '2020-12-23',
      fixed: ['Remove completed jobs from SWR Queue.'],
    },
    {
      tagName: 'v0.14.2',
      date: '2020-12-24',
      changed: [
        'Increase the number of parallel requests when processing SWR updates.',
      ],
    },
    {
      tagName: 'v0.15.0',
      date: '2021-01-05',
      breakingChanges: [
        [
          'notifications',
          'Move `setNotificationState` mutation to `notification.setState`.',
        ],
        ['threads', '`title` is now correctly nullable.'],
        ['threads', 'Remove unused `authorId` parameter from `createThread`.'],
      ],
      added: ['Add `InstanceAware` interface.', 'Add custom aliases.'],
      changed: ['Move `alias` from concrete types into `AbstractUuid`.'],
    },
    {
      tagName: 'v0.16.0',
      date: '2021-01-06',
      yanked: true,
    },
    {
      tagName: 'v0.16.1',
      date: '2021-01-06',
      breakingChanges: [
        'Rename `NotificationMutationPayload` to `NotificationSetStateResponse`.',
      ],
      added: [['uuid', 'Add `uuid.setState` mutation.']],
      internal: [
        'Split up `api` docker image into `api-server` and `api-swr-queue-worker`.',
        'Overhaul naming of environment variables.',
      ],
    },
    {
      tagName: 'v0.17.0',
      date: '2021-01-11',
      breakingChanges: [
        ['uuid', 'Move `threads` from `AbstractUuid` into concrete types.'],
      ],
      added: ['Add `ThreadAware` interface for types with `threads`.'],
      internal: ['Add preparations for database layer.'],
    },
    {
      tagName: 'v0.17.1',
      date: '2021-01-14',
      internal: ['serlo-org-database-layer@0.1.2'],
    },
    {
      tagName: 'v0.17.2',
      date: '2021-01-14',
      internal: ['serlo-org-database-layer@0.1.4', 'Add health checks'],
    },
    {
      tagName: 'v0.17.3',
      date: '2021-01-15',
      internal: [
        'serlo-org-database-layer@0.1.5',
        'Split contract into serlo.org and serlo.org-database-layer.',
      ],
    },
    {
      tagName: 'v0.17.4',
      date: '2021-01-16',
      internal: ['serlo-org-database-layer@0.1.6'],
    },
    {
      tagName: 'v0.17.5',
      date: '2021-01-19',
      fixed: [['cache', 'Handle cache values without timestamp correctly.']],
    },
    {
      tagName: 'v0.17.6',
      date: '2021-01-20',
      internal: [['cache', 'Adapt `maxAge`.']],
    },
    {
      tagName: 'v0.17.7',
      date: '2021-01-21',
      fixed: [['swr-queue', 'Fix `Time`.']],
    },
    {
      tagName: 'v0.18.0',
      date: '2021-01-26',
      breakingChanges: [
        ['thread', 'Move `createThread` mutation to `thread.createThread`.'],
      ],
      added: [
        ['uuid', 'Add `archived` filter to `threads`.'],
        ['uuid', 'Add `trashed` filter to `threads`.'],
        ['thread', 'Add `thread.createComment` mutation.'],
        ['thread', 'Add `thread.setThreadArchived` mutation.'],
        ['thread', 'Add `thread.setThreadState` mutation.'],
        ['thread', 'Add `thread.setCommentState` mutation.'],
      ],
    },
    {
      tagName: 'v0.18.1',
      date: '2021-01-28',
      fixed: [['swr-queue', 'Only update cache when requests succeed.']],
    },
    {
      tagName: 'v0.18.2',
      date: '2021-01-29',
      changed: [
        [
          'thread',
          '`thread.setThreadArchived` now also accepts a list of ids.',
        ],
        ['thread', '`thread.setThreadState` now also accepts a list of ids.'],
        ['thread', '`thread.setCommentState` now also accepts a list of ids.'],
      ],
      internal: ['serlo-org-database-layer@0.2.2'],
    },
    {
      tagName: 'v0.18.3',
      date: '2021-02-02',
      fixed: [['thread', 'Return threads in the correct order.']],
    },
    {
      tagName: 'v0.19.0',
      date: '2021-02-05',
      breakingChanges: [
        [
          'thread',
          '`thread.createThread` requires additional fields `subscribe` and `sendEmail`.',
        ],
        [
          'thread',
          '`thread.createComment` requires additional fields `subscribe` and `sendEmail`.',
        ],
      ],
      internal: ['serlo-org-database-layer@0.2.3'],
    },
    {
      tagName: 'v0.19.1',
      date: '2021-02-16',
      fixed: [
        ['notification', 'Use correct cache key for `notification.setState.'],
      ],
      added: [
        ['subscription', 'Add `subscription.set` mutation.'],
        [
          'uuid',
          'Add optional filters `trashed` and `hasCurrentRevision` to `Course.pages`.',
        ],
      ],
    },
    {
      tagName: 'v0.19.2',
      date: '2021-02-17',
      internal: ['Improve error context.'],
    },
    {
      tagName: 'v0.19.3',
      date: '2021-02-17',
      internal: ['Improve error message for unexpected status codes.'],
    },
    {
      tagName: 'v0.19.4',
      date: '2021-02-17',
      yanked: true,
    },
    {
      tagName: 'v0.19.5',
      date: '2021-02-17',
      fixed: ['Reject invalid cache values.'],
    },
  ])

  await writeFile(path.join(__dirname, '..', 'CHANGELOG.md'), content)
}
