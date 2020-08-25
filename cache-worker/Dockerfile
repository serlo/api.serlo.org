FROM node:12
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY src/ ./src
COPY index.ts .
RUN yarn install --frozen-lockfile
CMD ["yarn", "updatecache"]