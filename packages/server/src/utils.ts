export function isDefined<A>(value?: A | null): value is A {
  return value !== null && value !== undefined
}

export function isDateString(text: string) {
  return !isNaN(new Date(text).getDate())
}

export type FunctionOrValue<T> = UpdateFunction<T> | { value: T }

export type AsyncOrSync<T> = Promise<T> | T

interface UpdateFunction<T> {
  getValue: (current?: T) => AsyncOrSync<T | undefined>
}
