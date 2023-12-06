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
 */
export async function useDefaultImport<A>(value: A): Promise<A> {
  // The function `require` does only exists in CommonJS mode
  if (typeof require === 'function') return value

  // Since `default-import` is a ESM only library do not import it statically
  // because otherwise we would get an error in CommonJS runtime mode.
  const { default: defaultImport } = await import('default-import')

  // @ts-expect-error The types do not really match with the dynamic import ->
  // Let's ignore this error for now...
  return defaultImport(value) as A
}
