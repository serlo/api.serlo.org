FROM node:20-alpine AS base_image
WORKDIR /app
COPY package.json .
RUN corepack enable
RUN yarn set version 3.x

FROM base_image AS build_migrations
COPY scripts scripts
COPY src src
RUN yarn
RUN yarn build:all

FROM base_image AS runner
RUN yarn plugin import workspace-tools
RUN yarn workspaces focus --production
COPY --from=build_migrations /app/migrations migrations
COPY migrations/package.json migrations/package.json
COPY database.json .

ENTRYPOINT ["yarn", "db-migrate"]
CMD ["up"]
