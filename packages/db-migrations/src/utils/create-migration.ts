import { ApiCache } from './api-cache'
import { Database } from './database'
import { isPlugin } from './serlo-editor'
import { SlackLogger } from './slack-logger'

export async function migrateSerloEditorContent({
  migrateState,
  dryRun,
  apiCache,
  db,
  migrationName = 'migration',
  // eslint-disable-next-line no-console
  log = console.log,
}: {
  migrateState: (state: unknown) => unknown
  dryRun?: boolean
  migrationName?: string
  apiCache: ApiCache
  db: Database
  log?: (message: string) => void
}) {
  const logger = new SlackLogger(migrationName)

  log('Convert entity revisions')
  await changeUuidContents({
    query: `
    SELECT
      entity_revision.id as id,
      entity_revision.id as uuid,
      entity_revision.content as content
    FROM entity_revision
    JOIN entity ON entity.id = entity_revision.repository_id
    JOIN type ON type.id = entity.type_id
    WHERE
      (type.name != "video" OR entity_revision.changes IS NOT NULL)
      AND type.name NOT IN (
        "input-expression-equal-match-challenge",
        "input-number-exact-match-challenge",
        "input-string-normalized-match-challenge",
        "math-puzzle",
        "multiple-choice-right-answer",
        "multiple-choice-wrong-answer",
        "single-choice-right-answer",
        "single-choice-wrong-answer"
      )
      AND entity_revision.id > ?
  `,
    migrateState,
    table: 'entity_revision',
    column: 'content',
    apiCache,
    dryRun,
    db,
    log,
    logger,
  })

  log('Convert page revisions')
  await changeUuidContents({
    query: `
          SELECT
            page_revision.id, page_revision.content, page_revision.id as uuid
          FROM page_revision WHERE page_revision.id > ?
        `,
    migrateState,
    table: 'page_revision',
    column: 'content',
    apiCache,
    dryRun,
    db,
    log,
    logger,
  })

  log('Convert taxonomy terms')
  await changeUuidContents({
    query: `
          SELECT id, description as content, id as uuid
          FROM taxonomy WHERE id > ?
        `,
    migrateState,
    table: 'taxonomy',
    column: 'description',
    apiCache,
    dryRun,
    db,
    log,
    logger,
  })

  log('Convert users')
  await changeUuidContents({
    query: `
          SELECT id, description as content, id as uuid
          FROM user WHERE id != 191656 and description != "NULL" and id > ?
        `,
    migrateState,
    table: 'user',
    column: 'description',
    apiCache,
    dryRun,
    db,
    log,
    logger,
  })

  await logger.closeAndSend()
}

async function changeUuidContents({
  query,
  db,
  migrateState,
  apiCache,
  dryRun,
  table,
  column,
  logger,
  log,
}: {
  query: string
  db: Database
  table: string
  column: string
  migrateState: (state: unknown) => unknown
  apiCache: ApiCache
  logger: SlackLogger
  dryRun?: boolean
  log: (message: string) => void
}) {
  const querySQL = query + ' LIMIT ?'
  let uuids: Uuid[] = []

  do {
    const lastID = uuids.at(-1)?.id ?? 0
    log(`Last ID: ${lastID}`)
    uuids = await db.runSql(querySQL, lastID, 5000)

    for (const uuid of uuids) {
      let oldState

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        oldState = JSON.parse(uuid.content)
      } catch (e) {
        // Ignore (some articles have raw text)
        continue
      }

      if (!isPlugin(oldState)) {
        // state of legacy markdown editor
        continue
      }

      const newContent = JSON.stringify(migrateState(oldState))

      if (newContent !== JSON.stringify(oldState)) {
        if (!dryRun) {
          await db.runSql(
            `UPDATE ${table} SET ${column} = ? WHERE id = ?`,
            newContent,
            uuid.id,
          )
          apiCache.markUuid(uuid.uuid)
        }

        log(`Update ${table}.${column} with ID ${uuid.uuid}`)

        await logger.logEvent('contentChanged', {
          table,
          column,
          uuid: uuid.uuid,
          tableId: uuid.id,
          oldContent: uuid.content,
          newContent,
        })
      }
    }
  } while (uuids.length > 0)
}

interface Uuid {
  id: number
  content: string
  uuid: number
}
