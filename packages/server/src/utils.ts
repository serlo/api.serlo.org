export type AsyncOrSync<T> = Promise<T> | T

export function isDefined<A>(value?: A | null): value is A {
  return value !== null && value !== undefined
}

export function isDateString(text: string) {
  return !isNaN(new Date(text).getDate())
}
