import { ApiCache, Database, SlackLogger } from './utils'

export async function up(db: Database) {
  const apiCache = new ApiCache()
  const logger = new SlackLogger(
    '20240614163100-migrate-static-pages-into-entity-namespace',
  )

  const { insertId: staticTypeId } = await db.runSql<{ insertId: number }>(
    "insert into type (name) values ('page')",
  )

  await db.runSql('SET foreign_key_checks = 0;')
  await db.runSql(
    `
    insert into entity_revision
      (id, author_id, repository_id, date, content, title)
    select
      page_revision.id,
      page_revision.author_id,
      page_revision.page_repository_id,
      page_revision.date,
      page_revision.content,
      page_revision.title
    from page_revision
    `,
  )
  await db.runSql('SET foreign_key_checks = 1;')

  await db.runSql(
    `
    insert into entity
      (id, type_id, instance_id, license_id, date, current_revision_id)
    select
      page_repository.id,
      ?,
      page_repository.instance_id,
      page_repository.license_id,
      MIN(page_revision.date),
      page_repository.current_revision_id
    from page_repository
    join page_revision on page_revision.page_repository_id = page_repository.id
    group by page_repository.id
    `,
    staticTypeId,
  )

  await db.runSql(
    "update uuid set discriminator = 'entity' where discriminator = 'page'",
  )
  await db.runSql(
    "update uuid set discriminator = 'entityRevision' where discriminator = 'pageRevision'",
  )

  await db.runSql('DROP TABLE page_revision')
  await db.runSql('DROP TABLE page_repository')

  const instances = await db.runSql<Instance[]>(
    `select id, subdomain from instance`,
  )

  for (const instance of instances) {
    await createTaxonomyForStaticPages({ db, instance, apiCache })
  }

  await logger.closeAndSend()
  // To reduce the time between deleting the keys and finishing the DB
  // transaction, this should be the last command
  await apiCache.deleteKeysAndQuit()
}

async function createTaxonomyForStaticPages({
  db,
  instance,
  apiCache,
}: {
  db: Database
  instance: Instance
  apiCache: ApiCache
}) {
  const rootTaxonomy = await db.runSql<{ rootId: number }[]>(
    'select id as rootId from taxonomy where parent_id is null and instance_id = ?',
    instance.id,
  )

  if (rootTaxonomy.length === 0) {
    console.log('No root taxonomy found for instance', instance)
    return
  }

  const { rootId } = rootTaxonomy.at(0)!

  const taxonomyId = await createTaxonomy({
    db,
    name: 'Static Pages',
    parentId: rootId,
    instance,
    apiCache,
  })

  db.runSql(
    `
    insert into term_taxonomy_entity
      (entity_id, term_taxonomy_id, position)
    select
      entity.id,
      ?,
      ROW_NUMBER() OVER (ORDER BY entity.id)
    from entity
    join type on entity.type_id = type.id
    where type.name = 'static-page' and entity.instance_id = ?
    `,
    [taxonomyId, instance.id],
  )
}

async function createTaxonomy({
  db,
  name,
  description = null,
  parentId,
  instance,
  apiCache,
}: {
  db: Database
  name: string
  description?: string | null
  parentId: number
  instance: Instance
  apiCache: ApiCache
}) {
  const taxonomyType = 'topic'

  const { insertId: taxonomyId } = await db.runSql<{ insertId: number }>(
    'insert into uuid (trashed, discriminator) values (0, "taxonomyTerm")',
  )

  if (taxonomyId <= 0) {
    throw new Error('no uuid entry could be created')
  }

  const { currentHeaviest } = (
    await db.runSql<
      {
        currentHeaviest: number
      }[]
    >(
      `
          SELECT IFNULL(MAX(taxonomy.weight), 0) AS currentHeaviest
            FROM taxonomy
            WHERE taxonomy.parent_id = ?
          `,
      [parentId],
    )
  ).at(0)!

  await db.runSql(
    `
          insert into taxonomy
            (id, type_id, instance_id, parent_id, description, weight, name)
          select ?, type.id, instance.id, ?, ?, ?, ?
          from type, instance
          where type.name = ? and instance.subdomain = ?
          `,
    [
      taxonomyId,
      parentId,
      description,
      currentHeaviest + 1,
      name,
      taxonomyType,
      instance.subdomain,
    ],
  )

  apiCache.markUuid(parentId)
  apiCache.markUuid(taxonomyId)

  return taxonomyId
}

interface Instance {
  id: number
  subdomain: string
}
