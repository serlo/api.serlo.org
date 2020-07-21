# Changelog

All notable changes to this project will be documented in this file.

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
