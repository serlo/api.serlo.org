# Changelog

All notable changes to this project will be documented in this file.

## [v0.34.0](https://github.com/serlo/api.serlo.org/compare/v0.33.1..v0.34.0) - May 18, 2022

### Added

- Add entity.setLicense mutation #626

## [v0.33.1](https://github.com/serlo/api.serlo.org/compare/v0.33.0..v0.33.1) - May 17, 2022

### Fixed

- Fixed taxonomy term creation of topic folder #629

- Fixed cache update of page.addRevision

- Use default license when repository license is not supported #632

## [v0.33.0](https://github.com/serlo/api.serlo.org/compare/v0.32.0..v0.33.0) - May 6, 2022

### Added

- Add `entity.deletedEntities` query #605

## [v0.32.0](https://github.com/serlo/api.serlo.org/compare/v0.31.2..v0.32.0) - May 6, 2022

### Breaking Changes

- remove query `license` and replace it with the `license` namespace #616

### Added

- Add `license` namespace and `license.licenses` #616

- Add `taxonomyTerm.createEntityLinks` #612

- Add `taxonomyTerm.deleteEntityLinks` #599

### Fixed

- Fix local runs #617

### Internal

- Store licenses in ~/config #615

## [v0.31.2](https://github.com/serlo/api.serlo.org/compare/v0.31.1..v0.31.2) - May 3, 2022

### Fixed

- `entity.set` also returns records when revision is added #612

- Add autoreview feature for `entity.set` also when entity is created #606

### Internal

- refactor `entity.set` #600

## [v0.31.1](https://github.com/serlo/api.serlo.org/compare/v0.31.0..v0.31.1) - April 29, 2022

### Fixed

- Fix entity.setSolution `InvalidCachedValue` #597

- mail for LENABI user journey

## [v0.31.0](https://github.com/serlo/api.serlo.org/compare/v0.30.2..v0.31.0) - April 27, 2022

### Changed

- Merge entity.create & entity.addRevision = entity.set #594

## [v0.30.2](https://github.com/serlo/api.serlo.org/compare/v0.30.1..v0.30.2) - April 22, 2022

### Added

- Add endpoint `taxonomy.move` #566

- Add endpoint `taxonomy.create` #583

### Fixed

- Support autoreview in sandbox in add revisions #538

### Internal

- Refactor requests to DB layer #569

## [v0.30.1](https://github.com/serlo/api.serlo.org/compare/v0.30.0..v0.30.1) - April 8, 2022

### Added

- Add query endpoint `thread.allThreads`

## [v0.30.0](https://github.com/serlo/api.serlo.org/compare/v0.29.1..v0.30.0) - April 1, 2022

### Added

- Add mutation `Entity.create`

- Add mutation `TaxonomyTerm.setNameAndDescription`

### Changed

- Made some fields at Entity.add\_\_\_Revision mutations optional

### Fixed

- Reduced the cache time for getNotifications

- Reduced the cache time for chat.getUserInfo

- Handles correctly the parameter needsReview when adding revision

## [v0.29.1](https://github.com/serlo/api.serlo.org/compare/v0.29.0..v0.29.1) - March 21, 2022

### Internal

- Publish types from v0.29.0

## [v0.29.0](https://github.com/serlo/api.serlo.org/compare/v0.28.3..v0.29.0) - March 16, 2022

### Added

- Add mutation `Page.create`

- Add mutation `Page.addRevision`

- Add mutations `Entity.add*Revision` (v.g. `addAppletRevision`, `addArticleRevision`)

## [v0.28.3](https://github.com/serlo/api.serlo.org/compare/v0.28.2..v0.28.3) - February 11, 2022

### Fixed

- Update cache after successful UserSetDescriptionMutation

## [v0.28.2](https://github.com/serlo/api.serlo.org/compare/v0.28.1..v0.28.2) - January 27, 2022

### Added

- Add mutation `User.setDescription`

### Changed

- Change default familiy name in user-journey

## [v0.28.1](https://github.com/serlo/api.serlo.org/compare/v0.28.0..v0.28.1) - January 11, 2022

### Fixed

- Create playground token on each request.

## [v0.28.0](https://github.com/serlo/api.serlo.org/compare/v0.27.5..v0.28.0) - January 9, 2022

### Internal

- Node v16

- Yarn v3

## [v0.27.5](https://github.com/serlo/api.serlo.org/compare/v0.27.4..v0.27.5) - January 6, 2022

### Changed

- User-Journey: Remove `Lernstand-Mathe` from onboarding

### Fixed

- Data-Wallet: Fix bug that example cannot be opened

## [v0.27.4](https://github.com/serlo/api.serlo.org/compare/v0.27.3..v0.27.4) - January 3, 2022

### Changed

- User-Journey: Set `Lernstand-Mathe` on onboarding

## [v0.27.3](https://github.com/serlo/api.serlo.org/compare/v0.27.2..v0.27.3) - December 30, 2021

### Added

- Add enmeshed endpoints for user-journey

## [v0.27.2](https://github.com/serlo/api.serlo.org/compare/v0.27.1..v0.27.2) - December 16, 2021

### Changed

- Improve Enmeshed data wallet integration.

## [v0.27.1](https://github.com/serlo/api.serlo.org/compare/v0.27.0..v0.27.1) - December 13, 2021

### Added

- Add `metadata` query namespace with `publisher` and `entities`

## [v0.27.0](https://github.com/serlo/api.serlo.org/compare/v0.26.28..v0.27.0) - December 4, 2021

### Breaking Changes

- Move server from port 3000 to port 3001.

### Added

- Add endpoints for Enmeshed data wallet.

## [v0.26.28](https://github.com/serlo/api.serlo.org/compare/v0.26.27..v0.26.28) - November 7, 2021

### Added

- `user.deleteBots`: Also remove user from community chat and our newsletter

## [v0.26.27](https://github.com/serlo/api.serlo.org/compare/v0.26.26..v0.26.27) - November 1, 2021

### Added

- Add query `user.potentialSpamUser`

- Add property `ExerciseGroup.cohesive`

- Add property `TaxonomyTerm.taxonomyId`

### Internal

- Rename `yarn deploy:image` to `yarn deploy:images`

- Add support for deploying prereleases

## [v0.26.26](https://github.com/serlo/api.serlo.org/compare/v0.26.25..v0.26.26) - October 20, 2021

### Breaking Changes

- Remove legacy properties from `User` (like `User.activeAuthor`)

- Refactor mutation `user.deleteBots`

## [v0.26.25](https://github.com/serlo/api.serlo.org/compare/v0.26.24..v0.26.25) - September 29, 2021

### Added

- Add property `User.unrevisedEntities`

### Internal

- Add tests that getPayload() and getKey() are inverse to each other

- Remove `expectedStatusCodes` from `handleMessage()`

## [v0.26.24](https://github.com/serlo/api.serlo.org/compare/v0.26.23..v0.26.24) - September 16, 2021

### Fixed

- Fix cache update of `getActivityByType()` by SWR.

## [v0.26.23](https://github.com/serlo/api.serlo.org/compare/v0.26.22..v0.26.23) - August 30, 2021

### Fixed

- after mutation for rejecting / checkout of revisions the cache of unrevised revisions is cleared

### Internal

- only fetch necessary revisions for `AbstractEntity.revisions` when `unrevised == true`

## [v0.26.22](https://github.com/serlo/api.serlo.org/compare/v0.26.21..v0.26.22) - August 17, 2021

### Added

- events + unrevised entities: will be updated directly after 1 hour

### Fixed

- update of events via SWR

### Internal

- increase times for various cache entries until they get stale

## [v0.26.21](https://github.com/serlo/api.serlo.org/compare/v0.26.20..v0.26.21) - August 12, 2021

### Added

- rename `User.activeAuthor` to `User.isActiveAuthor`

- rename `User.activeDonor` to `User.isActiveDonor`

- rename `User.activeReviewer` to `User.isActiveReviewer`

## [v0.26.20](https://github.com/serlo/api.serlo.org/compare/v0.26.19..v0.26.20) - August 10, 2021

### Added

- property `User.isNewAuthor`

## [v0.26.19](https://github.com/serlo/api.serlo.org/compare/v0.26.18..v0.26.19) - August 8, 2021

### Added

- endpoints for subjects and unrevised entities

## [v0.26.18](https://github.com/serlo/api.serlo.org/compare/v0.26.17..v0.26.18) - August 3, 2021

### Fixed

- CheckoutEntityRevisionEvent supports also events for Page types

## [v0.26.17](https://github.com/serlo/api.serlo.org/compare/v0.26.16..v0.26.17) - August 3, 2021

### Internal

- Refactor implementation of `events` query

## [v0.26.16](https://github.com/serlo/api.serlo.org/compare/v0.26.15..v0.26.16) - July 27, 2021

### Internal

- Query `events`: Return after one update request

## [v0.26.15](https://github.com/serlo/api.serlo.org/compare/v0.26.14..v0.26.15) - July 27, 2021

### Internal

- Fixed: Maximum execution of 30sec for fetching events

## [v0.26.14](https://github.com/serlo/api.serlo.org/compare/v0.26.13..v0.26.14) - July 27, 2021

### Internal

- events-query: Add maximum of 30sec for fetching events

## [v0.26.13](https://github.com/serlo/api.serlo.org/compare/v0.26.12..v0.26.13) - July 27, 2021

### Internal

- new release to trigger a new build

## [v0.26.12](https://github.com/serlo/api.serlo.org/compare/v0.26.11..v0.26.12) - July 27, 2021

### Internal

- new release to trigger a new build (see [this bug](https://github.com/serlo/api.serlo.org/runs/3169973634)

## [v0.26.11](https://github.com/serlo/api.serlo.org/compare/v0.26.10..v0.26.11) - July 26, 2021

### Internal

- new release to rerun continuous integration due to [this bug](https://github.com/serlo/api.serlo.org/runs/3165334097)

## [v0.26.10](https://github.com/serlo/api.serlo.org/compare/v0.26.9..v0.26.10) - July 26, 2021

### Added

- mutation `fillEventsCache`

## [v0.26.9](https://github.com/serlo/api.serlo.org/compare/v0.26.8..v0.26.9) - July 14, 2021

### Fixed

- Reverse order of events in the query `events`, `AbstractUuid.events` and `User.eventyByUser`.

- Extend filter of `objectId` in `events`

- No false report to sentry when `User.motivation` is fetched

### Internal

- Improve performance of `resolveConnection()`

- Cached values are fetched only once per entry per request

## [v0.26.8](https://github.com/serlo/api.serlo.org/compare/v0.26.7..v0.26.8) - July 14, 2021

### Fixed

- fix resolving of role StaticPagesBuilder (now really :-) )

## [v0.26.7](https://github.com/serlo/api.serlo.org/compare/v0.26.6..v0.26.7) - July 14, 2021

### Fixed

- fix resolving of role StaticPagesBuilder

## [v0.26.6](https://github.com/serlo/api.serlo.org/compare/v0.26.5..v0.26.6) - July 13, 2021

### Fixed

- Quickfix that updates of events cache is always saved

## [v0.26.5](https://github.com/serlo/api.serlo.org/compare/v0.26.4..v0.26.5) - July 13, 2021

### Added

- Allow all \_cache mutations for sysadmins

## [v0.26.4](https://github.com/serlo/api.serlo.org/compare/v0.26.3..v0.26.4) - July 12, 2021

### Added

- Add property User.motivation

- Add property User.imageUrl

- Add property User.chatUrl

### Fixed

- Fix SetTaxonomyParentNotificationEventDecoder and allow `null` as parent

## [v0.26.3](https://github.com/serlo/api.serlo.org/compare/v0.26.2..v0.26.3) - July 8, 2021

### Added

- Make Solution.revisions not optional

- Increase upper limit of events query to 500

## [v0.26.2](https://github.com/serlo/api.serlo.org/compare/v0.26.1..v0.26.2) - July 7, 2021

### Breaking Changes

- Add upper limit of returns for all connections (default value = 500)

### Added

- Add property User.activityByType

- config hi.serlo.org/serlo

## [v0.26.1](https://github.com/serlo/api.serlo.org/compare/v0.26.0..v0.26.1) - July 1, 2021

### Fixed

- Fix update of cache in mutation "setSubscriptions"

## [v0.26.0](https://github.com/serlo/api.serlo.org/compare/v0.25.0..v0.26.0) - June 30, 2021

### Breaking Changes

- **authorization**. Throw `INVALID_TOKEN` error when user token is invalid (e.g. expired, malformed).

### Internal

- Add `serlo.org-cache-worker` service.

## [v0.25.0](https://github.com/serlo/api.serlo.org/compare/v0.24.8..v0.25.0) - June 28, 2021

### Breaking Changes

- **subscription**. Move query into `subscription` namespace.

### Added

- **subscription**. Add property `sendMail` to `SubscriptionInfo`.

## [v0.24.8](https://github.com/serlo/api.serlo.org/compare/v0.24.7..v0.24.8) - June 16, 2021

### Added

- sysadmin endpoints to delete bots / regular users and to update an email

### Fixed

- Update cache correctly after `entity.checkoutRevision` mutation.

- Fix `uuid.setState`

## [v0.24.7](https://github.com/serlo/api.serlo.org/compare/v0.24.6..v0.24.7) - June 8, 2021

### Fixed

- **authentication**. Role `sysadmin` now correctly extends from `admin`.

### Internal

- Remove `UnsupportedThread`.

## [v0.24.6](https://github.com/serlo/api.serlo.org/compare/v0.24.5..v0.24.6) - May 28, 2021

### Added

- Add `entity.checkoutRevision` mutation.

- Add `entity.rejectRevision` mutation.

### Internal

- Remove `UnsupportedComment`

## [v0.24.5](https://github.com/serlo/api.serlo.org/compare/v0.24.4..v0.24.5) - May 25, 2021

### Internal

- Fix: `TaxonomyTerm` resolver now correctly handles `null` children.

## [v0.24.4](https://github.com/serlo/api.serlo.org/compare/v0.24.3..v0.24.4) - May 24, 2021

### Internal

- Improve Sentry integration.

## [v0.24.3](https://github.com/serlo/api.serlo.org/compare/v0.24.2..v0.24.3) - May 21, 2021

### Internal

- Improve Sentry integration.

## [v0.24.2](https://github.com/serlo/api.serlo.org/compare/v0.24.1..v0.24.2) - May 19, 2021

### Internal

- Improve Sentry integration.

## [v0.24.1](https://github.com/serlo/api.serlo.org/compare/v0.24.0..v0.24.1) - May 18, 2021

### Internal

- **swr-queue-worker**. Fix Sentry integration.

- **swr-queue-worker**. Re-enable SWR for getUuid.

- Report source of invalid cache values.

- Reject ancestors' cache values when invalid value could not be repaired.

## [v0.24.0](https://github.com/serlo/api.serlo.org/compare/v0.23.2..v0.24.0) - May 12, 2021

### Breaking Changes

- **cache**. Move queries into `_cache` namespace.

### Internal

- Reject invalid values provided by listeners.

- Improve Sentry integration.

## [v0.23.2](https://github.com/serlo/api.serlo.org/compare/v0.23.1..v0.23.2) - May 10, 2021

### Added

- **events**. Add `events` Query.

- **threads**. Add `legacyObject` to threads and comments.

### Fixed

- **swr-queue**. Handle stuck jobs gracefully.

### Internal

- Improve Sentry integration.

## [v0.23.1](https://github.com/serlo/api.serlo.org/compare/v0.23.0..v0.23.1) - May 4, 2021

### Added

- **authorization**. Add `Entity.setLicense` permission.

- **authorization**. Add `Entity.addChild`, `Entity.removeChild` and `Entity.orderChildren` permissions.

- **authorization**. Add `File.create` and `File.delete` permissions.

- **authorization**. Add `License.create`, `License.delete` and `License.set` permissions

- **authorization**. Add `Page.set` permission.

- **authorization**. Add `TaxonomyTerm.addChild`, `TaxonomyTerm.removeChild` and `TaxonomyTerm.orderChildren` permissions.

- **authorization**. Add `TaxonomyTerm.set` permission.

- **authorization**. Add `Thread.deleteThread` and `Thread.deleteComment` permissions.

- **authorization**. Add `Uuid.delete` permission.

- **subscription**. Add `currentUserHasSubscribed`.

- **threads**. Add `trashed`.

### Internal

- Reject various invalid cache values.

- Improve Sentry integration.

## [v0.23.0](https://github.com/serlo/api.serlo.org/compare/v0.22.5..v0.23.0) - April 26, 2021

### Added

- **authorization**. Add `Subscription.set` permission.

- **authorization**. Add `Notification.setState` permission.

- **authorization**. Add `Uuid.create` permissions.

### Fixed

- **alias**. Resolve id aliases directly as a temporary workaround.

## [v0.22.5](https://github.com/serlo/api.serlo.org/compare/v0.22.4..v0.22.5) - April 20, 2021

### Added

- **authorization**. Add additional `Thread` permissions.

- **authorization**. Add `Uuid` permissions.

- **uuid**. Add `roles` to `User`.

### Internal

- Monorepo setup.

- **subscription**. Reject invalid cache values.

## [v0.22.4](https://github.com/serlo/api.serlo.org/compare/v0.22.3..v0.22.4) - April 20, 2021 \[YANKED]

## [v0.22.3](https://github.com/serlo/api.serlo.org/compare/v0.22.2..v0.22.3) - April 20, 2021 \[YANKED]

## [v0.22.2](https://github.com/serlo/api.serlo.org/compare/v0.22.1..v0.22.2) - April 20, 2021 \[YANKED]

## [v0.22.1](https://github.com/serlo/api.serlo.org/compare/v0.22.0..v0.22.1) - April 20, 2021 \[YANKED]

## [v0.22.0](https://github.com/serlo/api.serlo.org/compare/v0.21.1..v0.22.0) - April 20, 2021 \[YANKED]

## [v0.21.1](https://github.com/serlo/api.serlo.org/compare/v0.21.0..v0.21.1) - April 12, 2021

### Internal

- Handle cache keys for Google Spreadsheets correctly.

- No longer leak authorization exports in @serlo/api.

- **notification**. Reject invalid cache values.

## [v0.21.0](https://github.com/serlo/api.serlo.org/compare/v0.20.5..v0.21.0) - April 9, 2021

### Added

- **authorization**. Initial internal test release.

### Internal

- Add configurable `swrFrequency`.

## [v0.20.5](https://github.com/serlo/api.serlo.org/compare/v0.20.4..v0.20.5) - March 30, 2021

### Internal

- Improve error reporting.

## [v0.20.4](https://github.com/serlo/api.serlo.org/compare/v0.20.3..v0.20.4) - March 26, 2021

### Fixed

- Increase request body size limit.

## [v0.20.3](https://github.com/serlo/api.serlo.org/compare/v0.20.2..v0.20.3) - March 23, 2021

### Internal

- **uuid**. Reject aliases containing null characters.

## [v0.20.2](https://github.com/serlo/api.serlo.org/compare/v0.20.1..v0.20.2) - March 21, 2021

### Internal

- Various refactorings.

- Various changes to the build toolchain.

## [v0.20.1](https://github.com/serlo/api.serlo.org/compare/v0.20.0..v0.20.1) - March 19, 2021 \[YANKED]

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
