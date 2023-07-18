/**
 * Error for the case an invalid value was returned by a data source function.
 */
export class InvalidCurrentValueError extends Error {
  constructor(
    public errorContext: {
      invalidCachedValue?: unknown
      invalidCurrentValue: unknown
      decoder: string
      validationErrors: string[]
      key?: string
    },
  ) {
    super('Invalid value received from data source.')
  }
}
