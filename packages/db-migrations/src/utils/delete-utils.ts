import { ApiCache } from './api-cache'
import { Database } from './database'
import { toSqlTuple } from './sql-utils'

export async function deleteUuids(
  db: Database,
  apiCache: ApiCache,
  uuidsToDelete: number[],
) {
  if (uuidsToDelete.length > 0) {
    const uuids = toSqlTuple(uuidsToDelete)
    const eventsToDelete: { id: number }[] = await db.runSql(`
      SELECT distinct event.id AS id
      FROM event
      WHERE
        event.uuid_id IN ${uuids}
        OR uuid_parameter IN ${uuids}
        OR uuid_parameter2 IN ${uuids}
    `)

    await db.runSql(`DELETE FROM uuid WHERE id IN ${uuids}`)

    for (const id of uuidsToDelete) {
      apiCache.markUuid(id)
    }

    await deleteEventLogs(db, apiCache, eventsToDelete)
  }
}

export async function deleteEventLogs(
  db: Database,
  apiCache: ApiCache,
  event_logs: { id: number }[],
) {
  if (event_logs.length > 0) {
    const ids = event_logs.map((event_log) => event_log.id)

    await db.runSql(`DELETE FROM event WHERE id IN ${toSqlTuple(ids)}`)

    for (const eventId of ids) {
      apiCache.markEvent(eventId)
    }
  }

  await apiCache.markAllNotifications()
}
