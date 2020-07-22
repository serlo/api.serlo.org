import { AbstractEntity, AbstractEntityRevision } from '../../../../types'
import { TypeResolver } from '../../types'
import { AbstractUuidPreResolver } from '../abstract-uuid'
import { AppletPayload, AppletRevisionPayload } from '../applet'
import { ArticlePayload, ArticleRevisionPayload } from '../article'
import { CoursePayload, CourseRevisionPayload } from '../course'
import { CoursePagePayload, CoursePageRevisionPayload } from '../course-page'
import { EventPayload, EventRevisionPayload } from '../event'
import { ExercisePayload, ExerciseRevisionPayload } from '../exercise'
import {
  ExerciseGroupPayload,
  ExerciseGroupRevisionPayload,
} from '../exercise-group'
import {
  GroupedExercisePayload,
  GroupedExerciseRevisionPayload,
} from '../grouped-exercise'
import { SolutionPayload, SolutionRevisionPayload } from '../solution'
import { VideoPayload, VideoRevisionPayload } from '../video'

export enum EntityType {
  Applet = 'Applet',
  Article = 'Article',
  Course = 'Course',
  CoursePage = 'CoursePage',
  Event = 'Event',
  Exercise = 'Exercise',
  ExerciseGroup = 'ExerciseGroup',
  GroupedExercise = 'GroupedExercise',
  Solution = 'Solution',
  Video = 'Video',
}

export type EntityPreResolver =
  | AppletPayload
  | ArticlePayload
  | CoursePayload
  | CoursePagePayload
  | EventPayload
  | ExercisePayload
  | ExerciseGroupPayload
  | GroupedExercisePayload
  | SolutionPayload
  | VideoPayload
export interface AbstractEntityPreResolver
  extends AbstractUuidPreResolver,
    Omit<AbstractEntity, 'alias' | 'currentRevision' | 'license'> {
  __typename: EntityType
  alias: string | null
  currentRevisionId: number | null
  licenseId: number
}

export type EntityPayload = EntityPreResolver
export type AbstractEntityPayload = AbstractEntityPreResolver

export enum EntityRevisionType {
  ArticleRevision = 'ArticleRevision',
  AppletRevision = 'AppletRevision',
  CourseRevision = 'CourseRevision',
  CoursePageRevision = 'CoursePageRevision',
  EventRevision = 'EventRevision',
  ExerciseRevision = 'ExerciseRevision',
  ExerciseGroupRevision = 'ExerciseGroupRevision',
  GroupedExerciseRevision = 'GroupedExerciseRevision',
  SolutionRevision = 'SolutionRevision',
  VideoRevision = 'VideoRevision',
}

export type EntityRevisionPreResolver =
  | AppletRevisionPayload
  | ArticleRevisionPayload
  | CourseRevisionPayload
  | CoursePageRevisionPayload
  | EventRevisionPayload
  | ExerciseRevisionPayload
  | ExerciseGroupRevisionPayload
  | GroupedExerciseRevisionPayload
  | SolutionRevisionPayload
  | VideoRevisionPayload
export interface AbstractEntityRevisionPreResolver
  extends AbstractUuidPreResolver,
    Omit<AbstractEntityRevision, 'author' | 'repository'> {
  __typename: EntityRevisionType
  authorId: number
  repositoryId: number
}

export type EntityRevisionPayload = EntityRevisionPreResolver
export type AbstractEntityRevisionPayload = AbstractEntityRevisionPreResolver

export interface EntityResolvers {
  AbstractEntity: {
    // FIXME: this should be EntityPreResolver when refactoring is done
    __resolveType: TypeResolver<AbstractEntityPreResolver>
  }
  AbstractEntityRevision: {
    // FIXME: this should be EntityResolverPreResolver when refactoring is done
    __resolveType: TypeResolver<AbstractEntityRevisionPreResolver>
  }
}
