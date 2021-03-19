# Changelog

All notable changes to this project will be documented in this file.

## [v0.20.1](https://github.com/serlo/api.serlo.org/compare/v0.20.0..v0.20.1) - March 19, 2021

### Internal

- Various refactorings.

- Various changes to the build toolchain.

## [v0.20.0](https://github.com/serlo/api.serlo.org/compare/v0.19.14..v0.20.0) - March 16, 2021 \[YANKED]

## [v0.19.14](https://github.com/serlo/api.serlo.org/compare/v0.19.13..v0.19.14) - February 22, 2021

### Internal

- **uuid**. Disable SWR background updates.

## [v0.19.13](https://github.com/serlo/api.serlo.org/compare/v0.19.12..v0.19.13) - February 22, 2021 \[YANKED]

## [v0.19.12](https://github.com/serlo/api.serlo.org/compare/v0.19.11..v0.19.12) - February 22, 2021 \[YANKED]

## [v0.19.11](https://github.com/serlo/api.serlo.org/compare/v0.19.10..v0.19.11) - February 21, 2021

### Internal

- **uuid**. Reject invalid cache values for various other cases.

## [v0.19.10](https://github.com/serlo/api.serlo.org/compare/v0.19.9..v0.19.10) - February 21, 2021

### Internal

- **uuid**. Reject invalid cache values for threads.

## [v0.19.9](https://github.com/serlo/api.serlo.org/compare/v0.19.8..v0.19.9) - February 21, 2021

### Internal

- **uuid**. Reject invalid cache values for repositories and revisions.

## [v0.19.8](https://github.com/serlo/api.serlo.org/compare/v0.19.7..v0.19.8) - February 21, 2021 \[YANKED]

## [v0.19.7](https://github.com/serlo/api.serlo.org/compare/v0.19.6..v0.19.7) - February 19, 2021

### Internal

- **uuid**. Reject invalid cache values for videos.

## [v0.19.6](https://github.com/serlo/api.serlo.org/compare/v0.19.5..v0.19.6) - February 19, 2021

### Internal

- **swr-queue-worker**. Configurable delay between jobs.

## [v0.19.5](https://github.com/serlo/api.serlo.org/compare/v0.19.4..v0.19.5) - February 17, 2021

### Fixed

- Reject invalid cache values.

## [v0.19.4](https://github.com/serlo/api.serlo.org/compare/v0.19.3..v0.19.4) - February 17, 2021 \[YANKED]

## [v0.19.3](https://github.com/serlo/api.serlo.org/compare/v0.19.2..v0.19.3) - February 17, 2021

### Internal

- Improve error message for unexpected status codes.

## [v0.19.2](https://github.com/serlo/api.serlo.org/compare/v0.19.1..v0.19.2) - February 17, 2021

### Internal

- Improve error context.

## [v0.19.1](https://github.com/serlo/api.serlo.org/compare/v0.19.0..v0.19.1) - February 16, 2021

### Added

- **subscription**. Add `subscription.set` mutation.

- **uuid**. Add optional filters `trashed` and `hasCurrentRevision` to `Course.pages`.

### Fixed

- **notification**. Use correct cache key for \`notification.setState.

## [v0.19.0](https://github.com/serlo/api.serlo.org/compare/v0.18.3..v0.19.0) - February 5, 2021

### Breaking Changes

- **thread**. `thread.createThread` requires additional fields `subscribe` and `sendEmail`.

- **thread**. `thread.createComment` requires additional fields `subscribe` and `sendEmail`.

### Internal

- serlo-org-database-layer@0.2.3

## [v0.18.3](https://github.com/serlo/api.serlo.org/compare/v0.18.2..v0.18.3) - February 2, 2021

### Fixed

- **thread**. Return threads in the correct order.

## [v0.18.2](https://github.com/serlo/api.serlo.org/compare/v0.18.1..v0.18.2) - January 29, 2021

### Changed

- **thread**. `thread.setThreadArchived` now also accepts a list of ids.

- **thread**. `thread.setThreadState` now also accepts a list of ids.

- **thread**. `thread.setCommentState` now also accepts a list of ids.

### Internal

- serlo-org-database-layer@0.2.2

## [v0.18.1](https://github.com/serlo/api.serlo.org/compare/v0.18.0..v0.18.1) - January 28, 2021

### Fixed

- **swr-queue**. Only update cache when requests succeed.

## [v0.18.0](https://github.com/serlo/api.serlo.org/compare/v0.17.7..v0.18.0) - January 26, 2021

### Breaking Changes

- **thread**. Move `createThread` mutation to `thread.createThread`.

### Added

- **uuid**. Add `archived` filter to `threads`.

- **uuid**. Add `trashed` filter to `threads`.

- **thread**. Add `thread.createComment` mutation.

- **thread**. Add `thread.setThreadArchived` mutation.

- **thread**. Add `thread.setThreadState` mutation.

- **thread**. Add `thread.setCommentState` mutation.

## [v0.17.7](https://github.com/serlo/api.serlo.org/compare/v0.17.6..v0.17.7) - January 21, 2021

### Fixed

- **swr-queue**. Fix `Time`.

## [v0.17.6](https://github.com/serlo/api.serlo.org/compare/v0.17.5..v0.17.6) - January 20, 2021

### Internal

- **cache**. Adapt `maxAge`.

## [v0.17.5](https://github.com/serlo/api.serlo.org/compare/v0.17.4..v0.17.5) - January 19, 2021

### Fixed

- **cache**. Handle cache values without timestamp correctly.

## [v0.17.4](https://github.com/serlo/api.serlo.org/compare/v0.17.3..v0.17.4) - January 16, 2021

### Internal

- serlo-org-database-layer@0.1.6

## [v0.17.3](https://github.com/serlo/api.serlo.org/compare/v0.17.2..v0.17.3) - January 15, 2021

### Internal

- serlo-org-database-layer@0.1.5

- Split contract into serlo.org and serlo.org-database-layer.

## [v0.17.2](https://github.com/serlo/api.serlo.org/compare/v0.17.1..v0.17.2) - January 14, 2021

### Internal

- serlo-org-database-layer@0.1.4

- Add health checks

## [v0.17.1](https://github.com/serlo/api.serlo.org/compare/v0.17.0..v0.17.1) - January 14, 2021

### Internal

- serlo-org-database-layer@0.1.2

## [v0.17.0](https://github.com/serlo/api.serlo.org/compare/v0.16.1..v0.17.0) - January 11, 2021

### Breaking Changes

- **uuid**. Move `threads` from `AbstractUuid` into concrete types.

### Added

- Add `ThreadAware` interface for types with `threads`.

### Internal

- Add preparations for database layer.

## [v0.16.1](https://github.com/serlo/api.serlo.org/compare/v0.16.0..v0.16.1) - January 6, 2021

### Breaking Changes

- Rename `NotificationMutationPayload` to `NotificationSetStateResponse`.

### Added

- **uuid**. Add `uuid.setState` mutation.

### Internal

- Split up `api` docker image into `api-server` and `api-swr-queue-worker`.

- Overhaul naming of environment variables.

## [v0.16.0](https://github.com/serlo/api.serlo.org/compare/v0.15.0..v0.16.0) - January 6, 2021 \[YANKED]

## [v0.15.0](https://github.com/serlo/api.serlo.org/compare/v0.14.2..v0.15.0) - January 5, 2021

### Breaking Changes

- **notifications**. Move `setNotificationState` mutation to `notification.setState`.

- **threads**. `title` is now correctly nullable.

- **threads**. Remove unused `authorId` parameter from `createThread`.

### Added

- Add `InstanceAware` interface.

- Add custom aliases.

### Changed

- Move `alias` from concrete types into `AbstractUuid`.

## [v0.14.2](https://github.com/serlo/api.serlo.org/compare/v0.14.1..v0.14.2) - December 24, 2020

### Changed

- Increase the number of parallel requests when processing SWR updates.

## [v0.14.1](https://github.com/serlo/api.serlo.org/compare/v0.14.0..v0.14.1) - December 23, 2020

### Fixed

- Remove completed jobs from SWR Queue.

## [v0.14.0](https://github.com/serlo/api.serlo.org/compare/v0.13.1..v0.14.0) - December 23, 2020

### Added

- Add `createThread` mutation.

### Internal

- Add dashboard for SWR Queue.

## [v0.13.1](https://github.com/serlo/api.serlo.org/compare/v0.13.0..v0.13.1) - December 15, 2020

### Added

- **uuid**. Resolve `/entity/view/:id` to the given uuid.

### Internal

- Restructure the repository. Please check out the updated README.

## [v0.13.0](https://github.com/serlo/api.serlo.org/compare/v0.12.2..v0.13.0) - December 15, 2020 \[YANKED]

## [v0.12.2](https://github.com/serlo/api.serlo.org/compare/v0.12.1..v0.12.2) - December 9, 2020

### Changed

- **uuid**. Sort `threads` by `createdAt` in descending order.

### Fixed

- **uuid**. Throw `UserInputError` for malformed paths.

### Internal

- Implement SWR Background updates using Bee-Queue.

- Implement Locks using Redlock.

## [v0.12.1](https://github.com/serlo/api.serlo.org/compare/v0.12.0..v0.12.1) - December 9, 2020 \[YANKED]

## [v0.12.0](https://github.com/serlo/api.serlo.org/compare/v0.11.4..v0.12.0) - December 9, 2020 \[YANKED]

## [v0.11.4](https://github.com/serlo/api.serlo.org/compare/v0.11.3..v0.11.4) - November 30, 2020

### Fixed

- **uuid**. Unify alias type.

### Internal

- **cacheable-data-source**. Use in-memory lock.

- **cacheable-data-source**. Add logs.

## [v0.11.3](https://github.com/serlo/api.serlo.org/compare/v0.11.2..v0.11.3) - November 24, 2020

### Fixed

- Tweak `max-age`s of stale-while-revalidate caching.

### Internal

- **alias**. Remove `source` and `timestamp` from `AliasPayload`.

## [v0.11.2](https://github.com/serlo/api.serlo.org/compare/v0.11.1..v0.11.2) - November 18, 2020

### Added

- We now have a stale-while-revalidate caching approach in place. This should lead to more correct behavior even when our listeners fail.

- **notification**. Add `objectId` to `AbstractNotificationEvent` which reports the ID of the object that triggered the event (and can be used to unsubscribe).

- **uuid**. Add `threads`.

## [v0.11.1](https://github.com/serlo/api.serlo.org/compare/v0.11.0..v0.11.1) - November 18, 2020 \[YANKED]

## [v0.11.0](https://github.com/serlo/api.serlo.org/compare/v0.10.1..v0.11.0) - November 18, 2020 \[YANKED]

## [v0.10.1](https://github.com/serlo/api.serlo.org/compare/v0.10.0..v0.10.1) - October 14, 2020

### Fixed

- Update dependencies.

## [v0.10.0](https://github.com/serlo/api.serlo.org/compare/v0.9.0..v0.10.0) - October 14, 2020

### Added

- Add `subscriptions`.

- **alias**. Hide certain implementation details of our alias system by adding polyfills for typical use cases:

  - Resolve `/:id` to the given UUID.
  - Users now have `/user/profile/:username` as their alias.
  - Resolve `/user/profile/:id` and `/user/profile/:username` to the given user.

- **abstract-repository**. Add `revisions` to `Page` and all entities.

### Fixed

- **alias**. Handle paths that are already URL-decoded correctly.

- **alias**. Output URL-encoded paths.

- **uuid**. Return `null` when the UUID does not exist.

## [v0.9.0](https://github.com/serlo/api.serlo.org/compare/v0.8.1..v0.9.0) - August 16, 2020

### Breaking Changes

- Consistently name GraphQL connection types `*Connection` and `*Edge`.

- **abstract-taxonomy-term-child**. `AbstractTaxonomyTermChild.taxonomyTerms` now returns a GraphQL Connection.

- **navigation**. `Navigation.path` now returns a GraphQL connection.

- **taxonomy-term**. `TaxonomyTerm.children` now returns a GraphQL connection.

- **user**. `activeDonors` now returns a GraphQL connection.

### Added

- **user**. Add `activeAuthors` and `activeReviewers`.

- **user**. Add `activeAuthor` and `activeReviewer` to `User`.

### Changed

- **abstract-taxonomy-term-child**. `AbstractTaxonomyTermChild.taxonomyTerms` now returns a GraphQL connection.

- **navigation**. `Navigation.path` now returns a GraphQL connection.

- **taxonomy-term**. `TaxonomyTerm.children` now returns a GraphQL connection.

- **user**. `activeDonors` now returns a GraphQL connection.

### Internal

- Sentry now expects the environment via the `ENVIRONMENT` environment variable.

## [0.8.1](https://github.com/serlo/api.serlo.org/compare/v0.8.0..v0.8.1) - August 11, 2020

### Fixed

- **notification**. GraphQL no longer fails when it encounters an unsupported notification event.

### Internal

- Add Sentry.

- Remove Playground service.

## [0.8.0](https://github.com/serlo/api.serlo.org/compare/v0.7.4..v0.8.0) - August 10, 2020

### Breaking Changes

- **notification**. generalize actor / author / reviewer into actor and move into `AbstractNotificationEvent`

- **notification**. Remove `UnsupportedNotificationEvent`.

- **uuid**. Remove `UnsupportedUuid`.

### Changed

- **notification**. generalize actor / author / reviewer into actor and move into `AbstractNotificationEvent`

### Removed

- **notification**. Remove `UnsupportedNotificationEvent`.

- **uuid**. Remove `UnsupportedUuid`.

### Fixed

- **uuid**. GraphQL no longer fails when it encounters an unsupported entity.

## [0.7.4](https://github.com/serlo/api.serlo.org/compare/v0.7.2..v0.7.4) - August 6, 2020

### Added

- **notification**. Add `UnsupportedNotificationEvent`.

- **uuid**. Add `UnsupportedUuid`.

### Fixed

- **uuid**. GraphQL no longer fails when it encounters an unsupported entity.

## [0.7.2](https://github.com/serlo/api.serlo.org/compare/v0.6.0..v0.7.2) - August 4, 2020

### Breaking Changes

- **notification**. Completely new implementation. We now basically resolve the different event types in the API directly. See `AbstractNotificationEvent`.

- **uuid**. Rename `article` to `repository` in `ArticleRevision` (and similarly for all other types that implement `AbstractRevision`.

### Added

- **uuid**. Add various base types that expose common properties. More specifically:

  - Add base type `AbstractExercise` for `Exercise` and `GroupedExercise`.
  - Add base type `AbstractExerciseRevision` for `ExerciseRevision` and `GroupedExerciseRevision`.
  - Add base type `AbstractNavigationChild` for `Page` and `TaxonomyTerm`.
  - Add base type `AbstractRepository` for `AbstractEntity` and `Page`.
  - Add base type `AbstractRepositoryRevision` for `AbstractEntityRevision` and `PageRevision`.
  - Add base type `AbstractTaxonomyTermChild` for entity types that appear as children of taxonomy terms.

- **uuid**. Add field `date` to `Page`.

### Changed

- **uuid**. `AbstractEntity`, `AbstractEntityRevision` inherit the properties of `AbstractUuid` explicitly

## [0.6.0](https://github.com/serlo/api.serlo.org/compare/v0.5.8..v0.6.0) - July 21, 2020

### Breaking Changes

- **navigation**. `Navigation["data"]` is now returned directly as JSON.

- **uuid**. Removed `UnsupportedUuid`.

### Added

- Add `JSON` & `JSONObject` GraphQL scalars.

- Publish types as npm package `@serlo/api`.

- Add `activeDonors`.

- **user**. Add `activeDonor`.

### Changed

- **navigation**. `Navigation["data"]` is now returned directly as JSON.

### Removed

- **uuid**. Removed `UnsupportedUuid`.

### Internal

- Generate TypeScript types from GraphQL schema.

- Previous `de.serlo.org/api/uuid/*`, `*.serlo.org/api/navigation` cache values won't work anymore.

- **uuid**. Consistently require `__typename` instead of `discriminator` + optional `type`.

- **cache**. Deprecated all `_set*` / `_remove*` mutations in favor of `_setCache` / `_removeCache`.

## [0.5.8](https://github.com/serlo/api.serlo.org/compare/v0.5.7..v0.5.8) - July 14, 2020

### Fixed

- **notifications**. Process object response as an array.

## [0.5.7](https://github.com/serlo/api.serlo.org/compare/v0.5.6..v0.5.7) - July 14, 2020

### Fixed

- **auth**. Add X-Forwarded-Proto header to Hydra request.

## [0.5.6](https://github.com/serlo/api.serlo.org/compare/v0.5.5..v0.5.6) - July 14, 2020

### Added

- **notifications**. Implement GraphQL Cursor Connection specification.

- **notifications**. Add optional `unread` filter.

## [0.5.5](https://github.com/serlo/api.serlo.org/compare/v0.5.4..v0.5.5) - July 13, 2020

### Added

- Add `notifications`.

## [0.5.4](https://github.com/serlo/api.serlo.org/compare/v0.5.3..v0.5.4) - July 6, 2020

### Fixed

- Fix build.

## [0.5.3](https://github.com/serlo/api.serlo.org/compare/v0.5.2..v0.5.3) - July 6, 2020

### Fixed

- Fix navigation contract tests.

## [0.5.2](https://github.com/serlo/api.serlo.org/compare/v0.5.1..v0.5.2) - June 5, 2020

### Fixed

- Handle url-encoded alias inputs correctly.

## [0.5.1](https://github.com/serlo/api.serlo.org/compare/v0.5.0..v0.5.1) - June 5, 2020

### Added

- Handle user tokens.

### Fixed

- Output url-encoded aliases.

## [0.5.0](https://github.com/serlo/api.serlo.org/compare/v0.4.3..v0.5.0) - April 27, 2020

### Breaking Changes

- Use Redis as cache.

- Use MessagePack as serializer.

## [0.4.3](https://github.com/serlo/api.serlo.org/compare/v0.4.2..v0.4.3) - April 27, 2020

### Fixed

- Fix `navigation.data`.

## [0.4.2](https://github.com/serlo/api.serlo.org/compare/v0.4.1..v0.4.2) - April 24, 2020

### Fixed

- Fix build.

## [0.4.1](https://github.com/serlo/api.serlo.org/compare/v0.4.0..v0.4.1) - April 24, 2020

### Fixed

- Fix build.

## [0.4.0](https://github.com/serlo/api.serlo.org/compare/v0.3.0..v0.4.0) - April 24, 2020

### Breaking Changes

- Remove path from `TaxonomyTerm`. Use `TaxonomyTerm.navigation.path` instead.

### Added

- Add `navigation` to `Page` and `TaxonomyTerm`.

- Add meta fields to `EntityRevision`.

- Add `content` to `VideoRevision`.

## [0.3.0](https://github.com/serlo/api.serlo.org/compare/v0.2.0..v0.3.0) - April 15, 2020

### Added

- Add entity types `Course` and `CoursePage`.

- Add entity types `ExerciseGroup`, `GroupedExercise`, `Exercise`, and `Solution`.

- Add entity type `Applet`.

- Add entity type `Event`.

- Add entity type `Video`.

## [0.2.0](https://github.com/serlo/api.serlo.org/compare/v0.1.1..v0.2.0) - April 13, 2020

### Breaking Changes

- Remove health check route `/`. Use Apollo's health check route `.well-known/apollo/server-health` instead.

### Added

- Add descriptions to the GraphQL schema.

## [0.1.1](https://github.com/serlo/api.serlo.org/compare/v0.1.0..v0.1.1) - April 11, 2020

### Added

- Add health check route `/`.

### Fixed

- Lazily create token for GraphQL playground.

## [0.1.0](https://github.com/serlo/api.serlo.org/compare/b6e7255d65bd11114c27c3352b99f0ee68307571..v0.1.0) - April 10, 2020

Initial release
