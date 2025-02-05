import { v4 as uuidv4 } from 'uuid'

import {
  ApiCache,
  Database,
  migrateSerloEditorContent,
  Plugin,
  SlackLogger,
} from './utils'

export async function up(db: Database) {
  const apiCache = new ApiCache()
  const logger = new SlackLogger(
    '20250131114300-update-all-entities-to-new-editor-format',
  )

  await migrateSerloEditorContent({
    apiCache,
    db,
    migrationName: 'update-all-entities-to-new-editor-format',
    migrateState: (state) => {
      const entityRevisionContent = state as Plugin
      return wrapEntityRevisionContentInEditorMetadata(entityRevisionContent)
    },
  })

  await logger.closeAndSend()
  // To reduce the time between deleting the keys and finishing the DB
  // transaction, this should be the last command
  await apiCache.deleteKeysAndQuit()
}

function wrapEntityRevisionContentInEditorMetadata(
  content: Plugin,
): EditorStorageFormat {
  return {
    id: uuidv4(),
    type: 'https://serlo.org/editor',
    variant: 'serlo-org',
    domainOrigin: 'serlo.org',
    version: '2',
    editorVersion: '0.22.0',
    dateModified: new Date().toISOString(),
    document: content,
  }
}

interface EditorStorageFormat {
  id: string
  type: 'https://serlo.org/editor'
  variant: 'serlo-org'
  domainOrigin: 'serlo.org'
  version: '2'
  editorVersion: '0.22.0'
  dateModified: string
  document: Plugin
}
