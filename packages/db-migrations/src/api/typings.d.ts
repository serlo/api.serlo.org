declare module 'db-migrate' {
  export function getInstance(isModule: boolean): { up(): Promise<void> }
}
