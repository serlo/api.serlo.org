import * as DBMigrate from 'db-migrate'; 

export async function migrateDB() {
    const dbmigrate = DBMigrate.getInstance(true)
    await dbmigrate.up()
}
