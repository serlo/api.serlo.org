/**
 * Error for the case an invalid value was returned by a data source function.
 */
export class InvalidCurrentValueError extends Error {
  constructor(
    public errorContext: {
      invalidCachedValue?: unknown
      invalidCurrentValue: unknown
      decoder: string
      type?: string
      payload: unknown
      key?: string
    },
  ) {
    super('Invalid value received from data source.')
  }
}
