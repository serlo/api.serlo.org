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
