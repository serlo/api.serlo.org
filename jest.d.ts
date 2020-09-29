interface URL {
  readonly pathname: string
  readonly searchParams: {
    get(key: string): string | null
  }
}
