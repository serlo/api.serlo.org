FROM node:18 as base
WORKDIR /usr/src/app
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY scripts/build.ts scripts/build.ts
COPY tsconfig.json .
COPY tsconfig.prod.json .
COPY packages/authorization/package.json packages/authorization/package.json
COPY packages/graphql-modules/package.json packages/graphql-modules/package.json
COPY packages/server/package.json packages/server/package.json
COPY package.json .
COPY lerna.json .
COPY yarn.lock .

FROM base as build_dist
RUN yarn --immutable --immutable-cache --silent
COPY packages/authorization packages/authorization
COPY packages/server packages/server
COPY packages/graphql-modules packages/graphql-modules
RUN yarn build:server

FROM base as build_node_modules
RUN yarn workspaces focus @serlo/api.serlo.org --production

FROM node:18-alpine as release
WORKDIR /usr/src/app
COPY --from=build_dist /usr/src/app/dist dist
COPY --from=build_node_modules /usr/src/app/node_modules node_modules
ENTRYPOINT ["node", "dist/server.cjs"]
EXPOSE 3000
