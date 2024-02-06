import * as mysql from 'mysql2/promise'

import { log } from '../internals/log'
import { UserInputError } from '~/errors'

const pool = mysql.createPool(process.env.MYSQL_URI)

const runSql = async (
  query: string,
  params?: unknown[] | undefined,
): Promise<any> => {
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
): Promise<{ success: boolean }> => {
  if (description.length >= 64 * 1024) {
    throw new UserInputError('description too long')
  }
  await runSql('update user set description = ? where id = ?', [
    description,
    userId,
  ])
  return { success: true }
}

export const activeAuthorsQuery = async (): Promise<{ id: number }[]> => {
  const users: { id: number }[] = await runSql(`SELECT u.id
  FROM user u
  JOIN event_log e ON u.id = e.actor_id
  WHERE e.event_id = 5 AND e.date > DATE_SUB(?, Interval 90 day)
  GROUP BY u.id
  HAVING count(e.event_id) > 10`)
  return users
}
