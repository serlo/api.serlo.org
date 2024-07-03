import { ApiCache, Database, SlackLogger, deleteUuids } from './utils'

export async function up(db: Database) {
  const apiCache = new ApiCache()
  const logger = new SlackLogger(
    '20240703115600-remove-courses-without-any-pages',
  )

  const revisions = await db.runSql<{ id: number; entityId: number }[]>(`
    SELECT id, repository_id as entityId
      FROM entity_revision 
      WHERE content LIKE '%"pages":[]%'
  `)
  const uuids = revisions.flatMap((revision) => {
    return [revision.id, revision.entityId]
  })
  await deleteUuids(db, apiCache, uuids)

  await logger.closeAndSend()
  await apiCache.deleteKeysAndQuit()
}
