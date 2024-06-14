declare module 'db-migrate' {
  export function getInstance(
    isModule: boolean,
    options: { cwd: string },
  ): { up(): Promise<void> }
}
