import { generateChangelog } from '@inyono/changelog'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

exec()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    process.exit(1)
  })

async function exec(): Promise<void> {
  const content = generateChangelog({
    repository: {
      firstCommit: 'b6e7255d65bd11114c27c3352b99f0ee68307571',
      owner: 'serlo',
      repo: 'api.serlo.org',
    },
    releases: [
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
          [
            'notifications',
            'Implement GraphQL Cursor Connection specification.',
          ],
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
          [
            'abstract-repository',
            'Add `revisions` to `Page` and all entities.',
          ],
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
        changed: [
          ['uuid', 'Sort `threads` by `createdAt` in descending order.'],
        ],
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
          [
            'threads',
            'Remove unused `authorId` parameter from `createThread`.',
          ],
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
          [
            'thread',
            '`thread.setCommentState` now also accepts a list of ids.',
          ],
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
      {
        tagName: 'v0.19.6',
        date: '2021-02-19',
        internal: [['swr-queue-worker', 'Configurable delay between jobs.']],
      },
      {
        tagName: 'v0.19.7',
        date: '2021-02-19',
        internal: [['uuid', 'Reject invalid cache values for videos.']],
      },
      {
        tagName: 'v0.19.8',
        date: '2021-02-21',
        yanked: true,
      },
      {
        tagName: 'v0.19.9',
        date: '2021-02-21',
        internal: [
          [
            'uuid',
            'Reject invalid cache values for repositories and revisions.',
          ],
        ],
      },
      {
        tagName: 'v0.19.10',
        date: '2021-02-21',
        internal: [['uuid', 'Reject invalid cache values for threads.']],
      },
      {
        tagName: 'v0.19.11',
        date: '2021-02-21',
        internal: [
          ['uuid', 'Reject invalid cache values for various other cases.'],
        ],
      },
      {
        tagName: 'v0.19.12',
        date: '2021-02-22',
        yanked: true,
      },
      {
        tagName: 'v0.19.13',
        date: '2021-02-22',
        yanked: true,
      },
      {
        tagName: 'v0.19.14',
        date: '2021-02-22',
        internal: [['uuid', 'Disable SWR background updates.']],
      },
      {
        tagName: 'v0.20.0',
        date: '2021-03-16',
        yanked: true,
      },
      {
        tagName: 'v0.20.1',
        date: '2021-03-19',
        yanked: true,
      },
      {
        tagName: 'v0.20.2',
        date: '2021-03-21',
        internal: [
          'Various refactorings.',
          'Various changes to the build toolchain.',
        ],
      },
      {
        tagName: 'v0.20.3',
        date: '2021-03-23',
        internal: [['uuid', 'Reject aliases containing null characters.']],
      },
      {
        tagName: 'v0.20.4',
        date: '2021-03-26',
        fixed: ['Increase request body size limit.'],
      },
      {
        tagName: 'v0.20.5',
        date: '2021-03-30',
        internal: ['Improve error reporting.'],
      },
      {
        tagName: 'v0.21.0',
        date: '2021-04-09',
        added: [['authorization', 'Initial internal test release.']],
        internal: ['Add configurable `swrFrequency`.'],
      },
      {
        tagName: 'v0.21.1',
        date: '2021-04-12',
        internal: [
          'Handle cache keys for Google Spreadsheets correctly.',
          'No longer leak authorization exports in @serlo/api.',
          ['notification', 'Reject invalid cache values.'],
        ],
      },
      {
        tagName: 'v0.22.0',
        date: '2021-04-20',
        yanked: true,
      },
      {
        tagName: 'v0.22.1',
        date: '2021-04-20',
        yanked: true,
      },
      {
        tagName: 'v0.22.2',
        date: '2021-04-20',
        yanked: true,
      },
      {
        tagName: 'v0.22.3',
        date: '2021-04-20',
        yanked: true,
      },
      {
        tagName: 'v0.22.4',
        date: '2021-04-20',
        yanked: true,
      },
      {
        tagName: 'v0.22.5',
        date: '2021-04-20',
        added: [
          ['authorization', 'Add additional `Thread` permissions.'],
          ['authorization', 'Add `Uuid` permissions.'],
          ['uuid', 'Add `roles` to `User`.'],
        ],
        internal: [
          'Monorepo setup.',
          ['subscription', 'Reject invalid cache values.'],
        ],
      },
      {
        tagName: 'v0.23.0',
        date: '2021-04-26',
        added: [
          ['authorization', 'Add `Subscription.set` permission.'],
          ['authorization', 'Add `Notification.setState` permission.'],
          ['authorization', 'Add `Uuid.create` permissions.'],
        ],
        fixed: [
          ['alias', 'Resolve id aliases directly as a temporary workaround.'],
        ],
      },
      {
        tagName: 'v0.23.1',
        date: '2021-05-04',
        added: [
          ['authorization', 'Add `Entity.setLicense` permission.'],
          [
            'authorization',
            'Add `Entity.addChild`, `Entity.removeChild` and `Entity.orderChildren` permissions.',
          ],
          ['authorization', 'Add `File.create` and `File.delete` permissions.'],
          [
            'authorization',
            'Add `License.create`, `License.delete` and `License.set` permissions',
          ],
          ['authorization', 'Add `Page.set` permission.'],
          [
            'authorization',
            'Add `TaxonomyTerm.addChild`, `TaxonomyTerm.removeChild` and `TaxonomyTerm.orderChildren` permissions.',
          ],
          ['authorization', 'Add `TaxonomyTerm.set` permission.'],
          [
            'authorization',
            'Add `Thread.deleteThread` and `Thread.deleteComment` permissions.',
          ],
          ['authorization', 'Add `Uuid.delete` permission.'],

          ['subscription', 'Add `currentUserHasSubscribed`.'],
          ['threads', 'Add `trashed`.'],
        ],
        internal: [
          'Reject various invalid cache values.',
          'Improve Sentry integration.',
        ],
      },
      {
        tagName: 'v0.23.2',
        date: '2021-05-10',
        added: [
          ['events', 'Add `events` Query.'],
          ['threads', 'Add `legacyObject` to threads and comments.'],
        ],
        fixed: [['swr-queue', 'Handle stuck jobs gracefully.']],
        internal: ['Improve Sentry integration.'],
      },
      {
        tagName: 'v0.24.0',
        date: '2021-05-12',
        breakingChanges: [['cache', 'Move queries into `_cache` namespace.']],
        internal: [
          'Reject invalid values provided by listeners.',
          'Improve Sentry integration.',
        ],
      },
      {
        tagName: 'v0.24.1',
        date: '2021-05-18',
        internal: [
          ['swr-queue-worker', 'Fix Sentry integration.'],
          ['swr-queue-worker', 'Re-enable SWR for getUuid.'],
          'Report source of invalid cache values.',
          "Reject ancestors' cache values when invalid value could not be repaired.",
        ],
      },
      {
        tagName: 'v0.24.2',
        date: '2021-05-19',
        internal: ['Improve Sentry integration.'],
      },
      {
        tagName: 'v0.24.3',
        date: '2021-05-21',
        internal: ['Improve Sentry integration.'],
      },
      {
        tagName: 'v0.24.4',
        date: '2021-05-24',
        internal: ['Improve Sentry integration.'],
      },
      {
        tagName: 'v0.24.5',
        date: '2021-05-25',
        internal: [
          'Fix: `TaxonomyTerm` resolver now correctly handles `null` children.',
        ],
      },
      {
        tagName: 'v0.24.6',
        date: '2021-05-28',
        added: [
          'Add `entity.checkoutRevision` mutation.',
          'Add `entity.rejectRevision` mutation.',
        ],
        internal: ['Remove `UnsupportedComment`'],
      },
      {
        tagName: 'v0.24.7',
        date: '2021-06-08',
        fixed: [
          [
            'authentication',
            'Role `sysadmin` now correctly extends from `admin`.',
          ],
        ],
        internal: ['Remove `UnsupportedThread`.'],
      },
      {
        tagName: 'v0.24.8',
        date: '2021-06-16',
        added: [
          'sysadmin endpoints to delete bots / regular users and to update an email',
        ],
        fixed: [
          'Update cache correctly after `entity.checkoutRevision` mutation.',
          'Fix `uuid.setState`',
        ],
      },
      {
        tagName: 'v0.25.0',
        date: '2021-06-28',
        breakingChanges: [
          ['subscription', 'Move query into `subscription` namespace.'],
        ],
        added: [
          ['subscription', 'Add property `sendMail` to `SubscriptionInfo`.'],
        ],
      },
      {
        tagName: 'v0.26.0',
        date: '2021-06-30',
        breakingChanges: [
          [
            'authorization',
            'Throw `INVALID_TOKEN` error when user token is invalid (e.g. expired, malformed).',
          ],
        ],
        internal: ['Add `serlo.org-cache-worker` service.'],
      },
      {
        tagName: 'v0.26.1',
        date: '2021-07-01',
        fixed: ['Fix update of cache in mutation "setSubscriptions"'],
      },
      {
        tagName: 'v0.26.2',
        date: '2021-07-07',
        added: [
          'Add property User.activityByType',
          'config hi.serlo.org/serlo',
        ],
        breakingChanges: [
          'Add upper limit of returns for all connections (default value = 500)',
        ],
      },
      {
        tagName: 'v0.26.3',
        date: '2021-07-08',
        added: [
          'Make Solution.revisions not optional',
          'Increase upper limit of events query to 500',
        ],
      },
      {
        tagName: 'v0.26.4',
        date: '2021-07-12',
        added: [
          'Add property User.motivation',
          'Add property User.imageUrl',
          'Add property User.chatUrl',
        ],
        fixed: [
          'Fix SetTaxonomyParentNotificationEventDecoder and allow `null` as parent',
        ],
      },
      {
        tagName: 'v0.26.5',
        date: '2021-07-13',
        added: ['Allow all _cache mutations for sysadmins'],
      },
      {
        tagName: 'v0.26.6',
        date: '2021-07-13',
        fixed: ['Quickfix that updates of events cache is always saved'],
      },
      {
        tagName: 'v0.26.7',
        date: '2021-07-14',
        fixed: ['fix resolving of role StaticPagesBuilder'],
      },
      {
        tagName: 'v0.26.8',
        date: '2021-07-14',
        fixed: ['fix resolving of role StaticPagesBuilder (now really :-) )'],
      },
      {
        tagName: 'v0.26.9',
        date: '2021-07-14',
        fixed: [
          'Reverse order of events in the query `events`, `AbstractUuid.events` and `User.eventyByUser`.',
          'Extend filter of `objectId` in `events`',
          'No false report to sentry when `User.motivation` is fetched',
        ],
        internal: [
          'Improve performance of `resolveConnection()`',
          'Cached values are fetched only once per entry per request',
        ],
      },
      {
        tagName: 'v0.26.10',
        date: '2021-07-26',
        added: ['mutation `fillEventsCache`'],
      },
      {
        tagName: 'v0.26.11',
        date: '2021-07-26',
        internal: [
          'new release to rerun continuous integration due to [this bug](https://github.com/serlo/api.serlo.org/runs/3165334097)',
        ],
      },
      {
        tagName: 'v0.26.12',
        date: '2021-07-27',
        internal: [
          'new release to trigger a new build (see [this bug](https://github.com/serlo/api.serlo.org/runs/3169973634)',
        ],
      },
      {
        tagName: 'v0.26.13',
        date: '2021-07-27',
        internal: ['new release to trigger a new build'],
      },
      {
        tagName: 'v0.26.14',
        date: '2021-07-27',
        internal: ['events-query: Add maximum of 30sec for fetching events'],
      },
      {
        tagName: 'v0.26.15',
        date: '2021-07-27',
        internal: ['Fixed: Maximum execution of 30sec for fetching events'],
      },
      {
        tagName: 'v0.26.16',
        date: '2021-07-27',
        internal: ['Query `events`: Return after one update request'],
      },
      {
        tagName: 'v0.26.17',
        date: '2021-08-03',
        internal: ['Refactor implementation of `events` query'],
      },
      {
        tagName: 'v0.26.18',
        date: '2021-08-03',
        fixed: [
          'CheckoutEntityRevisionEvent supports also events for Page types',
        ],
      },
      {
        tagName: 'v0.26.19',
        date: '2021-08-08',
        added: ['endpoints for subjects and unrevised entities'],
      },
      {
        tagName: 'v0.26.20',
        date: '2021-08-10',
        added: ['property `User.isNewAuthor`'],
      },
      {
        tagName: 'v0.26.21',
        date: '2021-08-12',
        added: [
          'rename `User.activeAuthor` to `User.isActiveAuthor`',
          'rename `User.activeDonor` to `User.isActiveDonor`',
          'rename `User.activeReviewer` to `User.isActiveReviewer`',
        ],
      },
      {
        tagName: 'v0.26.22',
        date: '2021-08-17',
        internal: [
          'increase times for various cache entries until they get stale',
        ],
        fixed: ['update of events via SWR'],
        added: [
          'events + unrevised entities: will be updated directly after 1 hour',
        ],
      },
      {
        tagName: 'v0.26.23',
        date: '2021-08-30',
        fixed: [
          'after mutation for rejecting / checkout of revisions the cache of unrevised revisions is cleared',
        ],
        internal: [
          'only fetch necessary revisions for `AbstractEntity.revisions` when `unrevised == true`',
        ],
      },
      {
        tagName: 'v0.26.24',
        date: '2021-09-16',
        fixed: ['Fix cache update of `getActivityByType()` by SWR.'],
      },
      {
        tagName: 'v0.26.25',
        date: '2021-09-29',
        added: ['Add property `User.unrevisedEntities`'],
        internal: [
          'Add tests that getPayload() and getKey() are inverse to each other',
          'Remove `expectedStatusCodes` from `handleMessage()`',
        ],
      },
      {
        tagName: 'v0.26.26',
        date: '2021-10-20',
        breakingChanges: [
          'Remove legacy properties from `User` (like `User.activeAuthor`)',
          'Refactor mutation `user.deleteBots`',
        ],
      },
      {
        tagName: 'v0.26.27',
        date: '2021-11-01',
        added: [
          'Add query `user.potentialSpamUser`',
          'Add property `ExerciseGroup.cohesive`',
          'Add property `TaxonomyTerm.taxonomyId`',
        ],
        internal: [
          'Rename `yarn deploy:image` to `yarn deploy:images`',
          'Add support for deploying prereleases',
        ],
      },
      {
        tagName: 'v0.26.28',
        date: '2021-11-07',
        added: [
          '`user.deleteBots`: Also remove user from community chat and our newsletter',
        ],
      },
      {
        tagName: 'v0.27.0',
        date: '2021-12-04',
        breakingChanges: ['Move server from port 3000 to port 3001.'],
        added: ['Add endpoints for Enmeshed data wallet.'],
      },
      {
        tagName: 'v0.27.1',
        date: '2021-12-13',
        added: [
          'Add `metadata` query namespace with `publisher` and `entities`',
        ],
      },
      {
        tagName: 'v0.27.2',
        date: '2021-12-16',
        changed: ['Improve Enmeshed data wallet integration.'],
      },
      {
        tagName: 'v0.27.3',
        date: '2021-12-30',
        added: ['Add enmeshed endpoints for user-journey'],
      },
      {
        tagName: 'v0.27.4',
        date: '2022-01-03',
        changed: ['User-Journey: Set `Lernstand-Mathe` on onboarding'],
      },
      {
        tagName: 'v0.27.5',
        date: '2022-01-06',
        changed: ['User-Journey: Remove `Lernstand-Mathe` from onboarding'],
        fixed: ['Data-Wallet: Fix bug that example cannot be opened'],
      },
      {
        tagName: 'v0.28.0',
        date: '2022-01-09',
        internal: ['Node v16', 'Yarn v3'],
      },
      {
        tagName: 'v0.28.1',
        date: '2022-01-11',
        fixed: ['Create playground token on each request.'],
      },
      {
        tagName: 'v0.28.2',
        date: '2022-01-27',
        added: ['Add mutation `User.setDescription`'],
        changed: ['Change default familiy name in user-journey'],
      },
      {
        tagName: 'v0.28.3',
        date: '2022-02-11',
        fixed: ['Update cache after successful UserSetDescriptionMutation'],
      },
      {
        tagName: 'v0.29.0',
        date: '2022-03-16',
        added: [
          'Add mutation `Page.create`',
          'Add mutation `Page.addRevision`',
          'Add mutations `Entity.add*Revision` (v.g. `addAppletRevision`, `addArticleRevision`)',
        ],
      },
      {
        tagName: 'v0.29.1',
        date: '2022-03-21',
        internal: ['Publish types from v0.29.0'],
      },
      {
        tagName: 'v0.30.0',
        date: '2022-04-01',
        added: [
          'Add mutation `Entity.create`',
          'Add mutation `TaxonomyTerm.setNameAndDescription`',
        ],
        fixed: [
          'Reduced the cache time for getNotifications',
          'Reduced the cache time for chat.getUserInfo',
          'Handles correctly the parameter needsReview when adding revision',
        ],
        changed: [
          'Made some fields at Entity.add___Revision mutations optional',
        ],
      },
      {
        tagName: 'v0.30.1',
        date: '2022-04-08',
        added: ['Add query endpoint `thread.allThreads`'],
      },
      {
        tagName: 'v0.30.2',
        date: '2022-04-22',
        added: [
          'Add endpoint `taxonomy.move` #566',
          'Add endpoint `taxonomy.create` #583',
        ],
        fixed: ['Support autoreview in sandbox in add revisions #538'],
        internal: ['Refactor requests to DB layer #569'],
      },
      {
        tagName: 'v0.31.0',
        date: '2022-04-27',
        changed: ['Merge entity.create & entity.addRevision = entity.set #594'],
      },
      {
        tagName: 'v0.31.1',
        date: '2022-04-29',
        fixed: [
          'Fix entity.setSolution `InvalidCachedValue` #597',
          'mail for LENABI user journey',
        ],
      },
      {
        tagName: 'v0.31.2',
        date: '2022-05-03',
        fixed: [
          '`entity.set` also returns records when revision is added #612',
          'Add autoreview feature for `entity.set` also when entity is created #606',
        ],
        internal: ['refactor `entity.set` #600'],
      },
      {
        tagName: 'v0.32.0',
        date: '2022-05-06',
        breakingChanges: [
          'remove query `license` and replace it with the `license` namespace #616',
        ],
        added: [
          'Add `license` namespace and `license.licenses` #616',
          'Add `taxonomyTerm.createEntityLinks` #612',
          'Add `taxonomyTerm.deleteEntityLinks` #599',
        ],
        fixed: ['Fix local runs #617'],
        internal: ['Store licenses in ~/config #615'],
      },
      {
        tagName: 'v0.33.0',
        date: '2022-05-06',
        added: ['Add `entity.deletedEntities` query #605'],
      },
      {
        tagName: 'v0.33.1',
        date: '2022-05-17',
        fixed: [
          'Fixed taxonomy term creation of topic folder #629',
          'Fixed cache update of page.addRevision',
          'Use default license when repository license is not supported #632',
        ],
      },
      {
        tagName: 'v0.34.0',
        date: '2022-05-18',
        added: ['Add entity.setLicense mutation #626'],
      },
      {
        tagName: 'v0.35.0',
        date: '2022-05-19',
        added: ['Add taxonomyTerm.sort mutation #596'],
      },
      {
        tagName: 'v0.35.1',
        date: '2022-05-28',
        changed: [
          'Allow taxonomyTerm.create link to any parent #642',
          'Allow taxonomyTerm.sort to send not all children ids #643',
          'Rename entity.setLicense to entity.updateLicense #639',
          'Rename TaxomonySortInput to TaxonomyTermSortInput #641',
        ],
      },
      {
        tagName: 'v0.36.0',
        date: '2022-05-30',
        changed: [
          'Rename autorization Entity.SetLicense to Entity.UpdateLicense #639',
        ],
      },
      {
        tagName: 'v0.37.0',
        date: '2022-06-07',
        added: [
          'licenses: removed iconHref, added shortTitle #657',
          'licenses: removed extra urls #650',
        ],
        changed: ['alias is now nonnullable #640'],
      },
      {
        tagName: 'v0.38.0',
        date: '2022-06-08',
        added: ['Add Page.pages query #623'],
        changed: ['Remove TaxonomyTerm.move #662'],
      },
      {
        tagName: 'v0.39.0',
        date: '2022-06-09',
        added: [
          'Add AbstractUuid.title #627',
          'Entity.set: be sure to not accept mandatory fields with only spaces #656',
        ],
      },
      {
        tagName: 'v0.40.0',
        date: '2022-06-14',
        added: [
          'Add metadata.version #670',
          'Add entity.sort mutation for sorting exercises #668',
        ],
      },
      {
        tagName: 'v0.41.0',
        date: '2022-06-18',
        added: [
          'Thread.allThreads: add optional `instance` filter #676',
          'Entity.sort: support also sorting of coursePages #679',
        ],
        changed: [
          'Rename TaxonomyTerm.type folder to exerciseFolder #671',
          'Simplify TaxonomyTerm.type to topic, exerciseFolder, subject, root #672',
        ],
        fixed: ['Fix metadata.version #678'],
      },
      {
        tagName: 'v0.42.0',
        date: '2022-06-29',
        breakingChanges: ['Delete `Navigation.data` #684 '],
        changed: ['better cache update when adding revisions #674'],
        fixed: [
          'Fix metadata.version (for real...maybe...) #682',
          'Fix bug of missing user motivation text #683',
        ],
      },
      {
        tagName: 'v0.42.1',
        date: '2022-07-06',
        added: [
          'Add `license.defaultLicense` #691',
          'Add possibility to remove multiple cache keys #687',
        ],
      },
      {
        tagName: 'v0.43.0',
        date: '2022-07-12',
        added: [
          'Add `user.addRole` mutation #663',
          'Add `user.removeRole` mutation #663',
        ],
      },
      {
        tagName: 'v0.43.1',
        date: '2022-07-21',
        added: ['Add `media.upload` mutation #700'],
      },
      {
        tagName: 'v0.44.0',
        date: '2022-07-25',
        added: ['Add user.usersByRole query #702'],
      },
      {
        tagName: 'v0.45.0',
        date: '2022-07-25',
        breakingChanges: ['Refactor `media.upload` to `media.newUpload` #709'],
      },
      {
        tagName: 'v0.46.0',
        date: '2022-08-18',
        breakingChanges: [
          'Delete `fileExtension` and `fileNameWithoutExtension` from `media.newUpload` #713',
        ],
      },
      {
        tagName: 'v0.46.1',
        date: '2022-08-18',
        breakingChanges: [
          'Change input of `addRole`, `removeRole` and `usersByRole` from `scope` to `instance` #711',
        ],
        changed: [
          'User Role endpoints: do not throw error if role is global but instance is sent` #712',
        ],
      },
      {
        tagName: 'v0.46.2',
        date: '2022-08-26',
        fixed: [
          'static_pages_builder can be added, removed and searched for #717',
        ],
      },
      {
        tagName: 'v0.47.0',
        date: '2022-10-05',
        breakingChanges: [
          'Update input for `user.deleteRegularUsers` #730',
          'Remove enmeshed #726',
        ],
        fixed: [
          'Catch error when threads got deleted #546',
          'Update config for subject landing pages #551',
        ],
      },
      {
        tagName: 'v0.47.1',
        date: '2022-11-22',

        fixed: ['Fix sorting in `allThreads` query by last reacted #739'],
      },
      {
        tagName: 'v0.47.2',
        date: '2022-12-07',
        fixed: ['Fix pagination in `allThreads`'],
      },
      {
        tagName: 'v0.48.0',
        date: '2023-01-12',
        added: [
          'Endpoint for synchronizing users between new and old tables',
          'Oauth mutations',
        ],
        breakingChanges: ['authenticate user using cookie'],
      },
      {
        tagName: 'v0.49.0',
        date: '2023-02-01',
        added: [
          'Notification query has as params userId, emailSent and email; userId is to be used only by Notification Email Service #738',
          'User has now language field #765',
          'Add thread.editComment mutation',
        ],
      },
      {
        tagName: 'v0.49.1',
        date: '2023-02-08',
        fixed: ['Do not create kratos DB pool connection for single query'],
      },
      {
        tagName: 'v0.49.2',
        date: '2023-02-12',
        fixed: ['user: decrease db calls due to language query'],
      },
      {
        tagName: 'v0.49.3',
        date: '2023-03-02',
        added: ['Add license for Chancenwerk'],
      },
      {
        tagName: 'v0.49.4',
        date: '2023-03-02',
        changed: ['Change agreements of default and Chancenwerk license'],
      },
      {
        tagName: 'v0.49.5',
        date: '2023-03-02',
        fixed: ['Minor rewording in licenses'],
      },
      {
        tagName: 'v0.49.6',
        date: '2023-03-06',
        fixed: ['Minor rewording in license of Chancenwerk'],
      },
      {
        tagName: 'v0.49.7',
        date: '2023-03-17',
        added: ['Add `subjectId` to allThreads()'],
      },
      {
        tagName: 'v0.49.8',
        date: '2023-04-12',
        added: ['Add support for an empty cache'],
        fixed: ['Make filtering of threads more resource efficient'],
        changed: ['Update various dependencies'],
      },
      {
        tagName: 'v0.50.0',
        date: '2023-04-18',
        added: ['Implement single logout endpoint for one oidc provider'],
      },
      {
        tagName: 'v0.50.1',
        date: '2023-05-15',
        internal: ['Add logger to track use of Kratos register endpoint'],
      },
      {
        tagName: 'v0.51.0',
        date: '2023-06-13',
        added: ['Set metadata version to 1.0.0'],
        internal: ['Upgrade node to v18 and many dependencies'],
      },
      {
        tagName: 'v0.51.1',
        date: '2023-06-14',
        fixed: ['Fix missing fetch by upgrade docker base image'],
      },
      {
        tagName: 'v0.52.0',
        date: '2023-06-26',
        added: [
          'Add endpoint version for frontend repo',
          'Enable users to delete their own comments',
        ],
        internal: [
          'Update various dependencies',
          'Enable dependabot version updates',
          'Add pact tests for entity revision and page revision',
        ],
      },
      {
        tagName: 'v0.52.1',
        date: '2023-07-04',
        internal: [
          'Update various dependencies',
          'Update dependabot configuration',
        ],
      },
      {
        tagName: 'v0.53.0',
        date: '2023-07-26',
        internal: [
          'Upgrade ApolloServer to version 4',
          'Update various dependencies',
          'Refactor GitHub actions',
        ],
      },
      {
        tagName: 'v0.53.1',
        date: '2023-07-26',
        internal: ['Revert upgrade of Apollo Server to version 4'],
      },
      {
        tagName: 'v0.53.2',
        date: '2023-07-26',
        internal: ['Upgrade ApolloServer to version 4'],
      },
      {
        tagName: 'v0.53.3',
        date: '2023-07-27',
        internal: ['Add health endpoint'],
      },
      {
        tagName: 'v0.54.0',
        date: '2023-08-15',
        added: ['authorization: Allow architect to sort entities'],
      },
      {
        tagName: 'v0.55.0',
        date: '2023-08-15',
        internal: [
          'Update dependencies',
          'Update format of license texts to new editor format',
        ],
        changed: ['Update version of Metadata API'],
      },
      {
        tagName: 'v0.56.0',
        date: '2023-09-05',
        added: [
          'Add property `status` to Thread',
          'Filter AllThreads by `status`',
          'Add mutation ThreadSetStatus',
        ],
      },
      {
        tagName: 'v0.57.0',
        date: '2023-09-11',
        added: ['Reintroduce data-wallet'],
      },
      {
        tagName: 'v0.57.1',
        date: '2023-09-14',
        internal: ['Add logging to enmeshed middleware'],
      },
      {
        tagName: 'v0.57.2',
        date: '2023-09-14',
        internal: ['Fix logging in enmeshed middleware'],
      },
      {
        tagName: 'v0.57.3',
        date: '2023-10-05',
        added: ['Add namespace `ai`'],
        fixed: ['fix econnreset between connector and mongodb'],
        internal: ['Update dependencies'],
      },
    ],
  })

  await fs.promises.writeFile(
    path.join(__dirname, '..', 'CHANGELOG.md'),
    content,
  )
}
