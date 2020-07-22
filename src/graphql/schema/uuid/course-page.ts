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
import { requestsOnlyFields, Schema } from '../utils'
import {
  AbstractEntityPayload,
  AbstractEntityRevisionPayload,
  addEntityResolvers,
  Entity,
  EntityRevision,
  EntityRevisionType,
  EntityType,
} from './abstract-entity'
import { Course, CoursePayload } from './course'
import typeDefs from './course-page.graphql'

export const coursePageSchema = new Schema({}, [typeDefs])

export class CoursePage extends Entity {
  public __typename = EntityType.CoursePage
  public parentId: number

  public constructor(payload: CoursePagePayload) {
    super(payload)
    this.parentId = payload.parentId
  }
}
export interface CoursePagePayload extends AbstractEntityPayload {
  __typename: EntityType.CoursePage
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
    const data = await dataSources.serlo.getUuid<CoursePayload>(partialCourse)
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
export interface CoursePageRevisionPayload
  extends AbstractEntityRevisionPayload {
  __typename: EntityRevisionType.CoursePageRevision
  title: string
  content: string
  changes: string
}

addEntityResolvers({
  schema: coursePageSchema,
  entityType: EntityType.CoursePage,
  entityRevisionType: EntityRevisionType.CoursePageRevision,
  repository: 'coursePage',
})
