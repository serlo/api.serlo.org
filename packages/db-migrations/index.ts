import * as DBMigrate from 'db-migrate'
import * as path from 'path'

export async function migrateDB() {
  const packagesDir = path.join(process.cwd(), 'packages')
  const migrationsDir = path.join(packagesDir, 'db-migrations')

  const dbMigrate = DBMigrate.getInstance(true, {
    cwd: migrationsDir,
  })
  await dbMigrate.up()
}
