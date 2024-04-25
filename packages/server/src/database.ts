import {
  type RowDataPacket,
  type Connection,
  type ResultSetHeader,
} from 'mysql2/promise'

export class Database {
  constructor(private connection: Connection) {}

  public async beginTransaction() {
    await this.connection.beginTransaction()
  }

  public async commitTransaction() {
    await this.connection.commit()
  }

  public async rollbackTransaction() {
    await this.connection.rollback()
  }

  public async fetchAll<T = unknown>(
    sql: string,
    params?: unknown[],
  ): Promise<T[]> {
    return this.execute<(T & RowDataPacket)[]>(sql, params)
  }

  public async fetchOne<T = unknown>(
    sql: string,
    params?: unknown[],
  ): Promise<T> {
    const [result] = await this.execute<(T & RowDataPacket)[]>(sql, params)

    return result
  }

  public async mutate(
    sql: string,
    params?: unknown[],
  ): Promise<ResultSetHeader> {
    return this.execute<ResultSetHeader>(sql, params)
  }

  private async execute<T extends RowDataPacket[] | ResultSetHeader>(
    sql: string,
    params?: unknown[],
  ): Promise<T> {
    const [rows] = await this.connection.execute<T>(sql, params)

    return rows
  }
}
