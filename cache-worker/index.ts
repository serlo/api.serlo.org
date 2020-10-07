import { CacheWorker, Service } from './src/cache-worker'

const apiEndpoint = process.env.SERLO_ORG_HOST
const secret = process.env.SERLO_ORG_SECRET
const service = process.env.SERLO_SERVICE as Service

const cacheKeys = process.env.CACHE_KEYS

const cw = new CacheWorker({ apiEndpoint, secret, service })
cw.updateCache(cacheKeys!).then(() => {
  if (cw.errLog.length) {
    console.warn(
      'Cache update was run but the following errors were found',
      cw.errLog
    )
    return
  }
  console.log('Cache successfully updated')
})
