/**
 * Error which is thrown when an invalid value was returned by a data source
 * request.
 */
export class InvalidValueError extends Error {
  constructor(public invalidValue: unknown) {
    super('Invalid value received from a data source.')
  }
}
