<img src="https://raw.githubusercontent.com/serlo/frontend/staging/apps/web/public/_assets/img/serlo-logo-gh.svg" alt="Serlo Logo" title="Serlo" align="right" height="75" />

# serlo.org – API

Unified GraphQL API for [Serlo](https://serlo.org).

<a href="https://github.com/orgs/serlo/projects/19"><img align="right" src="https://img.shields.io/badge/Kanban-board-brightgreen.svg" alt="Kanban board"></a>

## Setup

You need:

- [Node.js](https://nodejs.org) and [yarn cli](https://yarnpkg.com/cli/) from [.tool-versions](.tool-versions) installed on your system.
  - You may use [asdf](https://asdf-vm.com/) for the installation.
- [Docker](https://docs.docker.com/engine/installation/)

Now follow the upcoming instructions.

### Clone

```sh
# Clone the project:
$ git clone https://github.com/serlo/api.serlo.org.git
$ cd api.serlo.org
```

## Development

### Initial setup

Run `yarn` to install the dependencies of all packages.

### Start

Make sure Docker is running and then run `yarn start` to start Redis.

#### Setup NODE_OPTIONS

If in the `/etc/hosts` file of your host you have the `::1` (IPv6) mapped to `localhost`, you will additionally need
to set: `--dns-result-order=ipv4first` in the `NODE_OPTIONS` environment variable:

```bash
export NODE_OPTIONS=--dns-result-order=ipv4first
```

### Caching

By default, while developing, the caching won't work. If you want to have caching, change the value `CACHE_TYPE` in `.env` to any other
value besides 'empty'.  
To check the cache locally, run `yarn cache:cli`.  
With `GET <key>` you get the cache value of the key that is defined in [serlo.ts](https://github.com/serlo/api.serlo.org/blob/staging/packages/server/src/model/serlo.ts).  
See in `package.json` for other scripts regarding cache.

### Run tests

- `yarn test` runs the unit tests (requires `yarn start:containers` beforehand)
- `yarn pacts` runs the contract tests (requires `yarn start:containers` beforehand)
- `yarn check:all` runs all checks (like the linter and tests) to check whether your codebase is ready to be merged into main

### Run specific test

You can pass the name of your test as an argument. For example to only run the tests of the metadata.

`yarn test -- metadata`

### Use the GraphQL playground

After `yarn start`, you can open the GraphQL playground via [http://localhost:3000/\_\_\_graphql](http://localhost:3000/___graphql).
Note that most queries will need a running [serlo/serlo.org-database-layer](https://github.com/serlo/serlo.org-database-layer) dev environment.

If you need to run requests authenticated/authorized, use `yarn auth` to be authenticated as user with id 1 or `yarn auth <id>` to choose a specific user.

Happy coding!

### Stop

Interrupt the `yarn start` command to stop the dev server and run `yarn stop:redis` to stop Redis.

### Automatically check your codebase before pushing

You can use [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to automatically check the whole codebase before you push to the server. To configure it, run the following commands in the root directory:

```sh
echo "yarn check:all --no-uncommitted-changes" > .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

With `git push --no-verify` you can bypass the automatic checks.

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
- `yarn deploy:images` deploys the docker images to our Container Registry (only needed for deployment)
- `yarn format` formats all source code
- `yarn lint` lints all source code
- `yarn license` updates license headers in source files
- `yarn pacts` runs the contract tests
- `yarn test` runs the unit tests
- `yarn codegen` generates TypeScript types from GraphQL schema
- `yarn start` spins up the development environment
- `yarn update-version` starts the process for adding a new version (only needed for deployment)

## Changelog

Via filtering PRs by [`base:production`](https://github.com/serlo/api.serlo.org/pulls?q=is%3Apr+base%3Aproduction+) you can access the changelog of production.
