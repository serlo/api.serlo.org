import * as mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  connectionLimit: 10,
}

const pool = mysql.createPool(dbConfig)

const runSql = async (
  query: string,
  params?: unknown[] | undefined,
): Promise<unknown> => {
  let connection: mysql.PoolConnection | null = null
  try {
    connection = await pool.getConnection()

    const [rows] = await connection.execute(query, params)

    return rows
  } catch (error) {
    throw new Error('Error executing SQL query: ${(error as Error).message}')
  } finally {
    if (connection) connection.release()
  }
}

export const setUserDescription = async (
  description: string,
  userId: number,
): Promise<{ success: boolean }> => {
  if (description.length >= 64 * 1024) {
    throw new Error('Error setting description: too long')
  }
  await runSql('update user set description = ? where id = ?', [
    description,
    userId,
  ])
  return { success: true }
}
