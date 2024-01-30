import * as mysql from 'mysql2/promise'

import { log } from '../internals/log'
import { UserInputError } from '~/errors'

const pool = mysql.createPool(process.env.MYSQL_URI)

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
    const errorMessage = `Error executing SQL query: ${
      (error as Error).message
    }`
    log.error(errorMessage)
    throw new Error(errorMessage)
  } finally {
    if (connection) connection.release()
  }
}

export const setUserDescription = async (
  description: string,
  userId: number,
): Promise<unknown> => {
  if (description.length >= 64 * 1024) {
    throw new UserInputError('description too long')
  }
  await runSql('update user set description = ? where id = ?', [
    description,
    userId,
  ])
  return { success: true }
}
