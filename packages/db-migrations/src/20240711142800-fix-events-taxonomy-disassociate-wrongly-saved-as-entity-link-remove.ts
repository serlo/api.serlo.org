import { Database, SlackLogger } from './utils'

export async function up(db: Database) {
  const logger = new SlackLogger(
    '20240711142800-fix-events-taxonomy-disassociate-wrongly-saved-as-entity-link-remove',
  )
  await db.runSql(
    `UPDATE event
      JOIN (
        SELECT event.id AS eventId,
              uuid_parameter AS taxonomyId,
              uuid_id AS entityId 
        FROM event 
        JOIN event_type ON event_type_id = event_type.id
        JOIN uuid ON uuid_parameter = uuid.id 
        WHERE event_type.name = 'entity/link/remove' 
          AND discriminator = 'taxonomyTerm'
      ) AS wrongEvent
    ON event.id = wrongEvent.eventId
    SET event.event_type_id = 17,
        event.uuid_id = wrongEvent.taxonomyId,
        event.uuid_parameter = wrongEvent.entityId`,
  )

  await logger.closeAndSend()
}
