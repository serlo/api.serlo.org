FROM node:12
ENV CACHE_KEYS all
ENV CACHE_KEYS_RETRIES 2
WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY src/ ./src
COPY index.ts .
RUN yarn install --frozen-lockfile
CMD ["yarn", "updatecache"]