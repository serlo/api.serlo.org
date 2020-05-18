import { requestsOnlyFields, Schema } from '../utils'
import {
  addEntityResolvers,
  EntityType,
  EntityRevisionType,
  Entity,
  EntityPayload,
  EntityRevision,
  EntityRevisionPayload,
} from './abstract-entity'
import { Course } from './course'

export const coursePageSchema = new Schema()

export class CoursePage extends Entity {
  public __typename = EntityType.CoursePage
  public parentId: number

  public constructor(payload: CoursePagePayload) {
    super(payload)
    this.parentId = payload.parentId
  }
}
export interface CoursePagePayload extends EntityPayload {
  parentId: number
}
coursePageSchema.addResolver<CoursePage, unknown, Partial<Course>>(
  'CoursePage',
  'course',
  async (entity, _args, { dataSources }, info) => {
    const partialCourse = { id: entity.parentId }
    if (requestsOnlyFields('Course', ['id'], info)) {
      return partialCourse
    }
    const data = await dataSources.serlo.getUuid(partialCourse)
    return new Course(data)
  }
)

export class CoursePageRevision extends EntityRevision {
  public __typename = EntityRevisionType.CoursePageRevision
  public title: string
  public content: string
  public changes: string

  public constructor(payload: CoursePageRevisionPayload) {
    super(payload)
    this.title = payload.title
    this.content = payload.content
    this.changes = payload.changes
  }
}
export interface CoursePageRevisionPayload extends EntityRevisionPayload {
  title: string
  content: string
  changes: string
}

addEntityResolvers({
  schema: coursePageSchema,
  entityType: EntityType.CoursePage,
  entityRevisionType: EntityRevisionType.CoursePageRevision,
  repository: 'coursePage',
  Entity: CoursePage,
  EntityRevision: CoursePageRevision,
  entityFields: `
    course: Course!
  `,
  entityPayloadFields: `
    parentId: Int!
  `,
  entityRevisionFields: `
    title: String!
    content: String!
    changes: String!
  `,
  entitySetter: 'setCoursePage',
  entityRevisionSetter: 'setCoursePageRevision',
})
