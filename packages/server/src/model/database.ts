import * as mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

export const runSql = async (query: string, params?: any[]): Promise<any> => {
  let connection: mysql.PoolConnection | null = null;
  try {
    connection = await pool.getConnection();

    const [rows, _] = await connection.execute(query, params);

    return rows;
  } catch (error) {
    throw new Error(`Error executing SQL query: ${(error as Error).message}`);
  } finally {
    if (connection) connection.release();
  }
};
