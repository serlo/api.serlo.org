import { ApiCache, Database, SlackLogger } from './utils'

export async function up(db: Database) {
  const apiCache = new ApiCache()
  const logger = new SlackLogger('20240708161200-add-table-for-lti-integration')

  await db.runSql(`
    CREATE TABLE lti_entity (
      id BIGINT NOT NULL AUTO_INCREMENT,
      resource_link_id VARCHAR(255),
      custom_claim_id VARCHAR(255) NOT NULL,
      content LONGTEXT NOT NULL,
      id_token_on_creation TEXT NOT NULL,
      PRIMARY KEY (id)
    )
  `)

  await db.runSql(`
    CREATE INDEX idx_lti_entity_custom_claim_id ON lti_entity (custom_claim_id);
  `)

  await logger.closeAndSend()
  // To reduce the time between deleting the keys and finishing the DB
  // transaction, this should be the last command
  await apiCache.deleteKeysAndQuit()
}
