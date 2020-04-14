import { Schema } from '../utils'
import {
  EntityPayload,
  EntityRevision,
  EntityRevisionPayload,
  EntityRevisionType,
  EntityType,
} from './abstract-entity'
import {
  addTaxonomyTermChildResolvers,
  TaxonomyTermChild,
} from './abstract-taxonomy-term-child'
import { CoursePage } from './course-page'

export const courseSchema = new Schema()

export class Course extends TaxonomyTermChild {
  public __typename = EntityType.Course
  public pageIds: number[]

  public constructor(payload: CoursePayload) {
    super(payload)
    this.pageIds = payload.pageIds
  }
}
export interface CoursePayload extends EntityPayload {
  taxonomyTermIds: number[]
  pageIds: number[]
}
courseSchema.addResolver<Course, unknown, CoursePage[]>(
  'Course',
  'pages',
  (entity, _args, { dataSources }) => {
    return Promise.all(
      entity.pageIds.map((id: number) => {
        return dataSources.serlo.getUuid({ id }).then((data) => {
          return new CoursePage(data)
        })
      })
    )
  }
)

export class CourseRevision extends EntityRevision {
  public __typename = EntityRevisionType.CourseRevision
  public title: string
  public content: string
  public changes: string

  public constructor(payload: CourseRevisionPayload) {
    super(payload)
    this.title = payload.title
    this.content = payload.content
    this.changes = payload.changes
  }
}

export interface CourseRevisionPayload extends EntityRevisionPayload {
  title: string
  content: string
  changes: string
}

addTaxonomyTermChildResolvers({
  schema: courseSchema,
  entityType: EntityType.Course,
  entityRevisionType: EntityRevisionType.CourseRevision,
  repository: 'course',
  Entity: Course,
  EntityRevision: CourseRevision,
  entityFields: `
    taxonomyTerms: [TaxonomyTerm!]!
    pages: [CoursePage!]!
  `,
  entityPayloadFields: `
    taxonomyTermIds: [Int!]!
    pageIds: [Int!]!
  `,
  entityRevisionFields: `
    title: String!
    content: String!
    changes: String!
  `,
  entitySetter: 'setCourse',
  entityRevisionSetter: 'setCourseRevision',
})
