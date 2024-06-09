FROM node:20 as base
ARG image
WORKDIR /usr/src/app
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY scripts/build.ts scripts/build.ts
COPY tsconfig.json .
COPY packages/authorization/package.json packages/authorization/package.json
COPY packages/server/package.json packages/server/package.json
COPY package.json .
COPY lerna.json .
COPY yarn.lock .

FROM base as build_dist
RUN yarn --immutable --immutable-cache --silent
COPY packages/authorization packages/authorization
COPY packages/db-migrations packages/db-migrations
COPY packages/server packages/server
RUN yarn build:${image}

FROM base as build_node_modules
RUN yarn workspaces focus @serlo/api.serlo.org --production

FROM node:20-alpine as release
ARG image
WORKDIR /usr/src/app
COPY --from=build_dist /usr/src/app/dist dist
COPY --from=build_node_modules /usr/src/app/node_modules node_modules
RUN cp dist/${image}.cjs dist/entrypoint.cjs 2>/dev/null
ENTRYPOINT ["node", "dist/entrypoint.cjs"]
EXPOSE 3000
