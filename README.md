<img src="https://assets.serlo.org/meta/logo.png" alt="Serlo logo" title="Serlo" align="right" height="60" />

# api.serlo.org

## Development

- `yarn` to install all dependencies
- `yarn start` starts the development server (needs a running [serlo/serlo.org](https://github.com/serlo/serlo.org) dev environment to work correctly)
- `yarn test` runs the unit tests
- `yarn pacts` runs the contract tests

## Directory structure

- `__fixtures__` contains test data (used by both unit and contract tests)
- `__tests__` contains the unit tests
- `__tests-pacts__` contains the contract tests
- `src/graphql/schema` defines the GraphQL schema

## Types

- `src/types.ts` is an auto-generated mapping from GraphQL types to TypeScript types. Run `yarn regenerate-types` to regenerate them.
- Types that specify the return type of another service should be named `*Payload`. These are usually also the types that are passed to a sub resolver.
- GraphQL types for connections should be named:
  - `FooConnection` for a connection with items of type `Foo`.
  - `FooEdge` for an edge with an item of type `Foo`.
- GraphQL types that specify the return type of a query should be named `Query*Result`.
- GraphQL types that specify the type of a parameter should be named `*Input`.
- GraphQL interface types should be named `Abstract*` and have a matching union type `*`.
