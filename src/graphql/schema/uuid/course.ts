/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020 Serlo Education e.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @copyright Copyright (c) 2020 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
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
import { CoursePage, CoursePagePayload } from './course-page'

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
        return dataSources.serlo
          .getUuid<CoursePagePayload>({ id })
          .then((data) => {
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
  public metaDescription: string

  public constructor(payload: CourseRevisionPayload) {
    super(payload)
    this.title = payload.title
    this.content = payload.content
    this.changes = payload.changes
    this.metaDescription = payload.metaDescription
  }
}

export interface CourseRevisionPayload extends EntityRevisionPayload {
  title: string
  content: string
  changes: string
  metaDescription: string
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
    metaDescription: String!
  `,
})
