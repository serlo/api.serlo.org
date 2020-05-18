export enum UuidType {
  Thread = 'Thread',
  Comment = 'Comment',
}

/**
 * interface Uuid
 */
export abstract class Uuid {
  public abstract __typename: UuidType
  public id: string

  public constructor(payload: UuidPayload) {
    this.id = payload.id
  }
}
export interface UuidPayload {
  id: string
}
