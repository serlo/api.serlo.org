<img src="https://raw.githubusercontent.com/serlo/frontend/staging/apps/web/public/_assets/img/serlo-logo-gh.svg" alt="Serlo Logo" title="Serlo" align="right" height="75" />

# serlo.org – API

Unified GraphQL API for [Serlo](https://serlo.org).

<a href="https://github.com/orgs/serlo/projects/19"><img align="right" src="https://img.shields.io/badge/Kanban-board-brightgreen.svg" alt="Kanban board"></a>

## Setup

You need:

- [Node.js](https://nodejs.org) from [.tool-versions](.tool-versions) installed on your system. Enable `yarn` via running `corepack enable`.
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

Some other useful commands:  
`redis:empty` removes the whole cache
`redis:list` lists all cached keys

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

Interrupt the `yarn start` command to stop the dev server and run `yarn down` to remove all containers.

### Automatically check your codebase before pushing

You can use [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to automatically check the whole codebase before you push to the server. To configure it, run the following commands in the root directory:

```sh
echo "yarn check:all --no-uncommitted-changes" > .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

With `git push --no-verify` you can bypass the automatic checks.

### Other commands

- `yarn build:server` builds the server (only needed for deployment)
- `yarn format` formats all source code
- `yarn lint` lints all source code
- `yarn license` updates license headers in source files
- `yarn pacts` runs the contract tests
- `yarn test` runs the unit tests
- `yarn codegen` generates TypeScript types from GraphQL schema
- `yarn start` spins up the development environment

## Changelog

Via filtering PRs by [`base:production`](https://github.com/serlo/api.serlo.org/pulls?q=is%3Apr+base%3Aproduction+) you can access the changelog of production.

## Developing with Ory Kratos

We use Ory Kratos for our user management.
Usually you won't need it, but if you do, run first:

`yarn start:kratos`

In the folder `./kratos` you find all important configuration files.
Emails sent by Kratos are going to be found at `http://localhost:4436`.

For more info about it see its [documentation](https://www.ory.sh/docs/kratos).

### Integrating Keycloak

First of all add `nbp` and `vidis` as host  
`sudo bash -c "echo '127.0.0.1	nbp'" >> /etc/hosts`
`sudo bash -c "echo '127.0.0.1	vidis'" >> /etc/hosts`

_why do I need it? Kratos makes a request to the url of the oauth2 provider, but since it is running inside a container, it cannot easily use the host port. These DNSs are discoverable for the kratos container, so the host can also use it._

Run `yarn start:sso`.  
_Make sure you already run `yarn start:kratos` before._

Keycloak UI is available on `nbp:11111` and `vidis:11112`.  
Username: admin, pw: admin.  
There you have to configure Serlo as a client.

> Client -> Create Client
>
> ```
> id: serlo
> home and root url: http://localhost:3000
> redirect uri: http://localhost:4433/self-service/methods/oidc/callback/nbp
> // OR redirect uri: http://localhost:4433/self-service/methods/oidc/callback/vidis
> ```

Get the credentials and go to `kratos/config.yml`:

```yaml
selfservice:
  methods:
    oidc:
      enabled: true
      config:
        providers:
          - id: nbp # or vidis
            provider: generic
            client_id: serlo
            client_secret: <put secret here>
```

Run the local frontend (not forgetting to change environment in its `.env` to local) to test.

### Email templates

Kratos has to be rebuilt every time you change an email template. Use the following workflow:

1. Edit templates. See at `kratos/config.yml` where they are.
2. Run `yarn kratos:rebuild`
3. Test the verification or the recovery email at `localhost:4436`. Repeat the process.
