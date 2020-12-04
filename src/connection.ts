import redis, { RedisClient } from 'redis'

export interface Connection {
  client: RedisClient
  quit(): Promise<void>
}

export function createConnection({ host }: { host: string }): Connection {
  const client = redis.createClient({
    host,
    port: 6379,
    return_buffers: true,
  })

  return {
    client,
    quit() {
      return new Promise((resolve) => {
        client.quit(() => {
          resolve()
        })
      })
    },
  }
}
