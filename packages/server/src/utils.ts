export type AsyncOrSync<T> = Promise<T> | T

export function isDefined<A>(value?: A | null): value is A {
  return value !== null && value !== undefined
}

export function isDateString(text: string) {
  return !isNaN(new Date(text).getDate())
}

/**
 * Some CommonJS libraries do not properly export a default value (see
 * https://www.npmjs.com/package/default-import for an example). This function
 * extracts the default value from such libraries only iff we are currently
 * in ESM mode.
 *
 * Note: Once also our tests run in ESM mode we should be able to delete this
 * function and use `default-import` as a static import.
 */
export async function useDefaultImport<A>(value: A): Promise<A> {
  // In our tests we are still using the CommonJS format
  // where loading `default-import` would result in an error.
  // However in CommonJS no changes are necessary.
  if (typeof jest === 'object') return value

  // Since `default-import` is a ESM only library do not import it statically
  // because otherwise we would get an error in CommonJS runtime mode.
  const { defaultImport } = await import('default-import')

  // Let's ignore this error for now...
  return defaultImport(value) as A
}
