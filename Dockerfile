FROM node:12 as dev-dependencies
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=false

FROM node:12 as prod-dependencies
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile --production=true --silent

FROM dev-dependencies as build
COPY src src
COPY tsconfig.prod.json .
RUN yarn build

FROM prod-dependencies as release
COPY --from=build /usr/src/app/dist dist
ENTRYPOINT ["node", "dist"]
EXPOSE 3000
