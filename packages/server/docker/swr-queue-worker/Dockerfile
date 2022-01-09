FROM node:16 as dev-dependencies
WORKDIR /usr/src/app
COPY packages/authorization/package.json packages/authorization/package.json
COPY packages/graphql-modules/package.json packages/graphql-modules/package.json
COPY packages/server/package.json packages/server/package.json
COPY packages/types/package.json packages/types/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false --silent

FROM node:16 as prod-dependencies
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY packages/authorization/package.json packages/authorization/package.json
COPY packages/graphql-modules/package.json packages/graphql-modules/package.json
COPY packages/server/package.json packages/server/package.json
COPY packages/types/package.json packages/types/package.json
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=true --silent

FROM dev-dependencies as build
COPY packages/authorization packages/authorization
COPY packages/graphql-modules packages/graphql-modules
COPY packages/server packages/server
COPY packages/types packages/types
COPY lerna.json .
COPY tsconfig.json .
COPY tsconfig.prod.json .
RUN yarn lerna run --include-dependencies --scope @serlo/authorization build
RUN yarn lerna run --scope @serlo/api.serlo.org build:swr-queue-worker

FROM prod-dependencies as release
COPY --from=build /usr/src/app/packages/authorization/dist packages/authorization/dist
COPY --from=build /usr/src/app/packages/server/dist packages/server/dist
COPY --from=build /usr/src/app/packages/types/dist packages/types/dist
WORKDIR /usr/src/app/packages/server
ENTRYPOINT ["node", "dist"]
EXPOSE 3000
