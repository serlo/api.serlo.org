# api.serlo.org

## Development

- `yarn` to install all dependencies
- `yarn start` starts the development server
- `yarn test` runs the unit tests
- `yarn pacts` runs the contract tests

## Directory structure

- `__fixtures__` contains test data (used by both unit and contract tests)
- `__tests__` contains the unit tests (mostly used currently for mutations)
- `__tests-pacts__` contains the contract tests (mostly used currently for queries)
- `src/graphql/schema` defines the GraphQL schema

## Adding a new sub schema

- Add a file for the sub schema somewhere in `schema/*`:
```typescript
import { Schema } from './utils'

export const fooSchema = new Schema()
```
- This file should export a `Schema` that is merged with other in `schema/index.ts`
