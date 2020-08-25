import { CacheWorker, Service } from './src/worker'

const apiEndpoint = process.env.SERLO_ORG_HOST
const secret = process.env.SERLO_ORG_SECRET
const service = process.env.SERLO_SERVICE as Service

const cw = new CacheWorker({ apiEndpoint, secret, service })
cw.updateWholeCache().then(() => {
  if (cw.errLog.length) {
    console.warn(
      'Cache update was run but the following errors were found',
      cw.errLog
    )
    return
  }
  console.log('Cache successfuly updated')
})
