export const redisUrl =
  (process.env.NODE_ENV === 'test' && process.env.REDIS_URL_TEST) ||
  process.env.REDIS_URL
