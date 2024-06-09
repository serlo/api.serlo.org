import Redis from 'ioredis'

export class ApiCache {
  private keys: Set<string>
  private redis: Redis

  constructor() {
    this.keys = new Set()

    if (typeof process.env.REDIS_URL === 'string') {
      this.redis = new Redis(process.env.REDIS_URL)

      this.redis.on('error', (err) => {
        console.error(err)

        // In a local environment we sometimes want to run a migration
        // without redis beeing set up => in this situation we close the
        // connection
        if (
          err.message.includes('ECONNREFUSED') &&
          process.env.ENVIRONMENT === 'local'
        ) {
          console.log('INFO: Close redis connection in local environment')

          this.redis.quit()
        }
      })
    } else {
      throw new Error('Env `REDIS_URL` is not defined')
    }
  }

  public deleteUnrevisedRevisions() {
    this.markKey('serlo.org/unrevised')
  }

  public deleteThreadIds(uuid: number) {
    this.markKey(`de.serlo.org/api/threads/${uuid}`)
  }

  public markEvent(eventId: number) {
    this.markKey(`de.serlo.org/api/event/${eventId}`)
  }

  public async markAllNotifications() {
    const keys = await this.redis.keys('de.serlo.org/api/notifications/*')

    for (const key of keys) {
      this.keys.add(key)
    }
  }

  public markUuid(uuid: number) {
    this.markKey(`de.serlo.org/api/uuid/${uuid}`)
  }

  public markSubscription(userId: number) {
    this.markKey(`de.serlo.org/api/subscriptions/${userId}`)
  }

  public async deleteKeysAndQuit() {
    if (process.env.ENVIRONMENT !== 'local' || this.redis.status === 'ready') {
      if (this.keys.size > 0) {
        await this.redis.del(Array.from(this.keys))
      }
      await this.redis.quit()
    }
  }

  private markKey(key: string) {
    this.keys.add(key)
  }
}
