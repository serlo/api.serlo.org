import * as R from 'ramda'

export function isDefined<A>(value?: A | null): value is A {
  return value !== null && value !== undefined
}

export function isDateString(text: string) {
  return !isNaN(new Date(text).getDate())
}

export type FunctionOrValue<T> = UpdateFunction<T> | { value: T }

interface UpdateFunction<T> {
  getValue: (current?: T) => AsyncOrSync<T | undefined>
}

export function isUpdateFunction<T>(
  arg: FunctionOrValue<T>,
): arg is UpdateFunction<T> {
  return R.has('getValue', arg) && typeof arg.getValue === 'function'
}

export type AsyncOrSync<T> = Promise<T> | T
