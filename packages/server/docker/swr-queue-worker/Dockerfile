FROM node:18 as build
WORKDIR /usr/src/app
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY scripts/build.ts scripts/build.ts
COPY tsconfig.json .
COPY tsconfig.prod.json .
COPY packages/authorization/package.json packages/authorization/package.json
COPY packages/graphql-modules/package.json packages/graphql-modules/package.json
COPY packages/server/package.json packages/server/package.json
COPY packages/types/package.json packages/types/package.json
COPY package.json .
COPY lerna.json .
COPY yarn.lock .
RUN yarn --immutable --immutable-cache --silent
COPY packages/authorization packages/authorization
COPY packages/server packages/server
COPY packages/graphql-modules packages/graphql-modules
COPY packages/types packages/types
RUN yarn build:swr-queue-worker

FROM node:18-alpine as release
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist dist
ENTRYPOINT ["node", "dist/swr-queue-worker.cjs"]
EXPOSE 3000
