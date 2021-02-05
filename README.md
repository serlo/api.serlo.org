<img src="https://assets.serlo.org/meta/logo.png" alt="Serlo logo" title="Serlo" align="right" height="60" />

# api.serlo.org

[![Kanban board](https://img.shields.io/badge/Kanban-board-brightgreen.svg)](https://github.com/orgs/serlo/projects/19)

## Setup

You need [Docker](https://docs.docker.com/engine/installation/), [Node.js v14](https://nodejs.org) and [Yarn](https://yarnpkg.com) installed on your system.

Now follow the upcoming instructions.

### Clone

```sh
# Clone the project:
$ git clone https://github.com/serlo/api.serlo.org.git
$ cd api.serlo.org
```

## Development

### Install dependencies

Run `yarn` to install the dependencies of all packages.

### Start

Run `yarn start` to start Redis.

### Run tests

- `yarn test` runs the unit tests (requires `yarn start` beforehand)
- `yarn pacts` runs the contract tests (requires `yarn start` beforehand)

### Use the GraphQL playground

After `yarn start`, you can open the GraphQL playground via [http://localhost:3000/\_\_\_graphql](http://localhost:3000/___graphql). Note that most queries will need a running [serlo/serlo.org-database-layer](https://github.com/serlo/serlo.org-database-layer) dev environment. Happy coding!

### Stop

Interrupt the `yarn start` command to stop the dev server and run `yarn stop:redis` to stop Redis.

### Repository structure

- `__fixtures__` contains test data (used by both unit and contract tests).
- `__tests__` contains the unit tests.
- `__tests-pacts__` contains the contract test.
- `src/internals` contains a couple of internal data structures. In most cases, you won't need to touch this. Here we hide complexity that isn't needed for typical development tasks.
- `src/model` defines the model.
- `src/schema` defines the GraphQL schema.

We have `~` as an absolute path alias for `./src` in place, e.g. `~/internals` refers to `./src/internals`.

### Other commands

- `yarn build:server` builds the server (only needed for deployment)
- `yarn changelog` generates the changelog (only needed for deployment)
- `yarn deploy:images` deploys the docker images to our Container Registry (only needed for deployment)
- `yarn format` formats all source code
- `yarn lint` lints all source code
- `yarn license` updates license headers in source files
- `yarn pacts` runs the contract tests
- `yarn test` runs the unit tests
- `yarn regenerate-types` generates TypeScript types from GraphQL schema
- `yarn start` spins up the development environment
