export interface Database {
  runSql: <T = void>(query: string, ...params: unknown[]) => Promise<T>
  dropTable: (table: string) => Promise<void>
}
