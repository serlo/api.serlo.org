import log, { LogLevelDesc } from 'loglevel'

log.setLevel((process.env.LOG_LEVEL as LogLevelDesc) ?? 'ERROR')

export { log }
