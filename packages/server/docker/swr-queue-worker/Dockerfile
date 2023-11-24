FROM node:18 as build
WORKDIR /usr/src/app
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY packages/authorization/package.json packages/authorization/package.json
COPY packages/graphql-modules/package.json packages/graphql-modules/package.json
COPY packages/server/package.json packages/server/package.json
COPY packages/types/package.json packages/types/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --immutable --immutable-cache --silent
COPY packages/authorization packages/authorization
COPY packages/graphql-modules packages/graphql-modules
COPY packages/server packages/server
COPY packages/types packages/types
COPY lerna.json .
COPY tsconfig.json .
COPY tsconfig.prod.json .
RUN yarn lerna run --include-dependencies --scope @serlo/authorization build
RUN yarn lerna run --scope @serlo/api.serlo.org build:swr-queue-worker

FROM node:18-alpine as release
WORKDIR /usr/src/app
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY packages/authorization/package.json packages/authorization/package.json
COPY packages/graphql-modules/package.json packages/graphql-modules/package.json
COPY packages/server/package.json packages/server/package.json
COPY packages/types/package.json packages/types/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn workspaces focus --production --all
COPY --from=build /usr/src/app/packages/authorization/dist packages/authorization/dist
COPY --from=build /usr/src/app/packages/server/dist packages/server/dist
COPY --from=build /usr/src/app/packages/types/dist packages/types/dist
WORKDIR /usr/src/app/packages/server
ENTRYPOINT ["node", "dist"]
EXPOSE 3000
