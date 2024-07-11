import {
  ApiCache,
  Database,
  SlackLogger,
  deleteUuids,
  toSqlTuple,
} from './utils'

export async function up(db: Database) {
  const apiCache = new ApiCache()
  const logger = new SlackLogger(
    '20240703115600-remove-courses-without-any-pages',
  )

  const liveRevisions = await db.runSql<{ id: number; entityId: number }[]>(`
    SELECT entity_revision.id, entity.id AS entityId
      FROM entity_revision 
      JOIN entity ON entity.id = repository_id
      WHERE content LIKE '%"pages":[]%'
        AND entity.current_revision_id = entity_revision.id
  `)

  const oldRevisions = await db.runSql<{ id: number }[]>(`
    SELECT id
      FROM entity_revision 
      WHERE content LIKE '%"pages":[]%'
        AND id NOT IN ${toSqlTuple(liveRevisions.map((revision) => revision.id))}
  `)

  const uuids = liveRevisions.flatMap((revision) => {
    return [revision.id, revision.entityId]
  })
  uuids.concat(oldRevisions.map((revision) => revision.id))

  await deleteUuids(db, apiCache, uuids)

  await logger.closeAndSend()
  await apiCache.deleteKeysAndQuit()
}
