/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2021 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2021 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
import * as t from 'io-ts'

import {
  EntityRevisionType,
  EntityType,
} from '~/schema/uuid/abstract-entity/types'
import { DiscriminatorType } from '~/schema/uuid/abstract-uuid/types'
import {
  AppletPayload,
  AppletRevisionPayload,
} from '~/schema/uuid/applet/types'
import {
  ArticlePayload,
  ArticleRevisionPayload,
} from '~/schema/uuid/article/types'
import {
  CoursePagePayload,
  CoursePageRevisionPayload,
} from '~/schema/uuid/course-page/types'
import {
  CoursePayload,
  CourseRevisionPayload,
} from '~/schema/uuid/course/types'
import { EventPayload, EventRevisionPayload } from '~/schema/uuid/event/types'
import {
  ExerciseGroupPayload,
  ExerciseGroupRevisionPayload,
} from '~/schema/uuid/exercise-group/types'
import {
  ExercisePayload,
  ExerciseRevisionPayload,
} from '~/schema/uuid/exercise/types'
import {
  GroupedExercisePayload,
  GroupedExerciseRevisionPayload,
} from '~/schema/uuid/grouped-exercise/types'
import { PagePayload, PageRevisionPayload } from '~/schema/uuid/page/types'
import {
  SolutionPayload,
  SolutionRevisionPayload,
} from '~/schema/uuid/solution/types'
import { TaxonomyTermPayload } from '~/schema/uuid/taxonomy-term/types'
import { UserPayload } from '~/schema/uuid/user/types'
import { VideoPayload, VideoRevisionPayload } from '~/schema/uuid/video/types'
import { Instance, TaxonomyTermType } from '~/types'

export const InstanceDecoder: t.Type<Instance> = t.union([
  t.literal(Instance.De),
  t.literal(Instance.En),
  t.literal(Instance.Es),
  t.literal(Instance.Fr),
  t.literal(Instance.Hi),
  t.literal(Instance.Ta),
])

export const AbstractUuidPayloadDecoder = t.type({
  id: t.number,
  trashed: t.boolean,
  alias: t.string,
})

export const EntityTypeDecoder: t.Type<EntityType> = t.union([
  t.literal(EntityType.Applet),
  t.literal(EntityType.Article),
  t.literal(EntityType.Course),
  t.literal(EntityType.CoursePage),
  t.literal(EntityType.Event),
  t.literal(EntityType.Exercise),
  t.literal(EntityType.ExerciseGroup),
  t.literal(EntityType.GroupedExercise),
  t.literal(EntityType.Solution),
  t.literal(EntityType.Video),
])

export const AbstractEntityPayloadDecoder = t.intersection([
  AbstractUuidPayloadDecoder,
  t.type({
    __typename: EntityTypeDecoder,
    instance: InstanceDecoder,
    date: t.string,
    licenseId: t.number,
    currentRevisionId: t.union([t.number, t.null]),
    revisionIds: t.array(t.number),
  }),
])

export const EntityRevisionTypeDecoder: t.Type<EntityRevisionType> = t.union([
  t.literal(EntityRevisionType.AppletRevision),
  t.literal(EntityRevisionType.ArticleRevision),
  t.literal(EntityRevisionType.CourseRevision),
  t.literal(EntityRevisionType.CoursePageRevision),
  t.literal(EntityRevisionType.EventRevision),
  t.literal(EntityRevisionType.ExerciseRevision),
  t.literal(EntityRevisionType.ExerciseGroupRevision),
  t.literal(EntityRevisionType.GroupedExerciseRevision),
  t.literal(EntityRevisionType.SolutionRevision),
  t.literal(EntityRevisionType.VideoRevision),
])

export const AbstractEntityRevisionPayloadDecoder = t.intersection([
  AbstractUuidPayloadDecoder,
  t.type({
    __typename: EntityRevisionTypeDecoder,
    content: t.string,
    date: t.string,
    authorId: t.number,
    repositoryId: t.number,
    changes: t.string,
  }),
])

export const PagePayloadDecoder: t.Type<PagePayload> = t.exact(
  t.intersection([
    AbstractUuidPayloadDecoder,
    t.type({
      __typename: t.literal(DiscriminatorType.Page),
      instance: InstanceDecoder,
      currentRevisionId: t.union([t.number, t.null]),
      revisionIds: t.array(t.number),
      date: t.string,
      licenseId: t.number,
    }),
  ])
)

export const PageRevisionPayloadDecoder: t.Type<PageRevisionPayload> = t.exact(
  t.intersection([
    AbstractUuidPayloadDecoder,
    t.type({
      __typename: t.literal(DiscriminatorType.PageRevision),
      title: t.string,
      content: t.string,
      date: t.string,
      authorId: t.number,
      repositoryId: t.number,
    }),
  ])
)

export const TaxonomyTermTypeDecoder: t.Type<TaxonomyTermType> = t.union([
  t.literal(TaxonomyTermType.Blog),
  t.literal(TaxonomyTermType.Curriculum),
  t.literal(TaxonomyTermType.CurriculumTopic),
  t.literal(TaxonomyTermType.CurriculumTopicFolder),
  t.literal(TaxonomyTermType.Forum),
  t.literal(TaxonomyTermType.ForumCategory),
  t.literal(TaxonomyTermType.Locale),
  t.literal(TaxonomyTermType.Root),
  t.literal(TaxonomyTermType.Subject),
  t.literal(TaxonomyTermType.Topic),
  t.literal(TaxonomyTermType.TopicFolder),
])

export const TaxonomyTermPayloadDecoder: t.Type<TaxonomyTermPayload> = t.exact(
  t.intersection([
    AbstractUuidPayloadDecoder,
    t.type({
      __typename: t.literal(DiscriminatorType.TaxonomyTerm),
      type: TaxonomyTermTypeDecoder,
      instance: InstanceDecoder,
      name: t.string,
      weight: t.number,
      childrenIds: t.array(t.number),
      parentId: t.union([t.number, t.null]),
    }),
    t.partial({
      description: t.union([t.string, t.null]),
    }),
  ])
)

export const CommentDecoder = t.exact(
  t.intersection([
    AbstractUuidPayloadDecoder,
    t.type({
      __typename: t.literal('Comment'),
      authorId: t.number,
      title: t.union([t.string, t.null]),
      date: t.string,
      archived: t.boolean,
      content: t.string,
      parentId: t.number,
      childrenIds: t.array(t.number),
    }),
  ])
)

export const ArticleDecoder: t.Type<ArticlePayload> = t.exact(
  t.intersection([
    AbstractEntityPayloadDecoder,
    t.type({
      __typename: t.literal(EntityType.Article),
      taxonomyTermIds: t.array(t.number),
    }),
  ])
)

export const ArticleRevisionDecoder: t.Type<ArticleRevisionPayload> = t.exact(
  t.intersection([
    AbstractEntityRevisionPayloadDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.ArticleRevision),
      title: t.string,
      content: t.string,
      metaTitle: t.string,
      metaDescription: t.string,
    }),
  ])
)

export const AppletDecoder: t.Type<AppletPayload> = t.exact(
  t.intersection([
    AbstractEntityPayloadDecoder,
    t.type({
      __typename: t.literal(EntityType.Applet),
      taxonomyTermIds: t.array(t.number),
    }),
  ])
)

export const AppletRevisionDecoder: t.Type<AppletRevisionPayload> = t.exact(
  t.intersection([
    AbstractEntityRevisionPayloadDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.AppletRevision),
      url: t.string,
      title: t.string,
      content: t.string,
      metaTitle: t.string,
      metaDescription: t.string,
    }),
  ])
)

export const CourseDecoder: t.Type<CoursePayload> = t.exact(
  t.intersection([
    AbstractEntityPayloadDecoder,
    t.type({
      __typename: t.literal(EntityType.Course),
      taxonomyTermIds: t.array(t.number),
      pageIds: t.array(t.number),
    }),
  ])
)

export const CourseRevisionDecoder: t.Type<CourseRevisionPayload> = t.exact(
  t.intersection([
    AbstractEntityRevisionPayloadDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.CourseRevision),
      title: t.string,
      content: t.string,
      metaDescription: t.string,
    }),
  ])
)

export const CoursePageDecoder: t.Type<CoursePagePayload> = t.exact(
  t.intersection([
    AbstractEntityPayloadDecoder,
    t.type({
      __typename: t.literal(EntityType.CoursePage),
      parentId: t.number,
    }),
  ])
)

export const CoursePageRevisionDecoder: t.Type<CoursePageRevisionPayload> = t.exact(
  t.intersection([
    AbstractEntityRevisionPayloadDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.CoursePageRevision),
      title: t.string,
      content: t.string,
    }),
  ])
)

export const ExerciseDecoder: t.Type<ExercisePayload> = t.exact(
  t.intersection([
    AbstractEntityPayloadDecoder,
    t.type({
      __typename: t.literal(EntityType.Exercise),
      taxonomyTermIds: t.array(t.number),
      solutionId: t.union([t.number, t.null]),
    }),
  ])
)

export const ExerciseRevisionDecoder: t.Type<ExerciseRevisionPayload> = t.exact(
  t.intersection([
    AbstractEntityRevisionPayloadDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.ExerciseRevision),
      content: t.string,
    }),
  ])
)

export const ExerciseGroupDecoder: t.Type<ExerciseGroupPayload> = t.exact(
  t.intersection([
    AbstractEntityPayloadDecoder,
    t.type({
      __typename: t.literal(EntityType.ExerciseGroup),
      taxonomyTermIds: t.array(t.number),
      exerciseIds: t.array(t.number),
    }),
  ])
)

export const ExerciseGroupRevisionDecoder: t.Type<ExerciseGroupRevisionPayload> = t.exact(
  t.intersection([
    AbstractEntityRevisionPayloadDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.ExerciseGroupRevision),
      content: t.string,
    }),
  ])
)

export const EventDecoder: t.Type<EventPayload> = t.exact(
  t.intersection([
    AbstractEntityPayloadDecoder,
    t.type({
      __typename: t.literal(EntityType.Event),
      taxonomyTermIds: t.array(t.number),
    }),
  ])
)

export const EventRevisionDecoder: t.Type<EventRevisionPayload> = t.exact(
  t.intersection([
    AbstractEntityRevisionPayloadDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.EventRevision),
      title: t.string,
      content: t.string,
      metaTitle: t.string,
      metaDescription: t.string,
    }),
  ])
)

export const GroupedExerciseDecoder: t.Type<GroupedExercisePayload> = t.exact(
  t.intersection([
    AbstractEntityPayloadDecoder,
    t.type({
      __typename: t.literal(EntityType.GroupedExercise),
      parentId: t.number,
      solutionId: t.union([t.number, t.null]),
    }),
  ])
)

export const GroupedExerciseRevisionDecoder: t.Type<GroupedExerciseRevisionPayload> = t.exact(
  t.intersection([
    AbstractEntityRevisionPayloadDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.GroupedExerciseRevision),
      content: t.string,
    }),
  ])
)

export const SolutionDecoder: t.Type<SolutionPayload> = t.exact(
  t.intersection([
    AbstractEntityPayloadDecoder,
    t.type({
      __typename: t.literal(EntityType.Solution),
      parentId: t.number,
    }),
  ])
)

export const SolutionRevisionDecoder: t.Type<SolutionRevisionPayload> = t.exact(
  t.intersection([
    AbstractEntityRevisionPayloadDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.SolutionRevision),
      content: t.string,
    }),
  ])
)

export const VideoDecoder: t.Type<VideoPayload> = t.exact(
  t.intersection([
    AbstractEntityPayloadDecoder,
    t.type({
      __typename: t.literal(EntityType.Video),
      taxonomyTermIds: t.array(t.number),
    }),
  ])
)

export const VideoRevisionDecoder: t.Type<VideoRevisionPayload> = t.exact(
  t.intersection([
    AbstractEntityRevisionPayloadDecoder,
    t.type({
      __typename: t.literal(EntityRevisionType.VideoRevision),
      url: t.string,
      title: t.string,
      content: t.string,
    }),
  ])
)

export const UserDecoder: t.Type<UserPayload> = t.exact(
  t.intersection([
    AbstractUuidPayloadDecoder,
    t.type({
      __typename: t.literal(DiscriminatorType.User),
      username: t.string,
      date: t.string,
    }),
    t.partial({
      lastLogin: t.union([t.string, t.null]),
      description: t.union([t.string, t.null]),
    }),
  ])
)

export const EntityPayloadDecoder = t.union([
  AppletDecoder,
  ArticleDecoder,
  CourseDecoder,
  CoursePageDecoder,
  EventDecoder,
  ExerciseDecoder,
  ExerciseGroupDecoder,
  GroupedExerciseDecoder,
  SolutionDecoder,
  VideoDecoder,
])

export const EntityRevisionPayloadDecoder = t.union([
  AppletRevisionDecoder,
  ArticleRevisionDecoder,
  CourseRevisionDecoder,
  CoursePageRevisionDecoder,
  EventRevisionDecoder,
  ExerciseRevisionDecoder,
  ExerciseGroupRevisionDecoder,
  GroupedExerciseRevisionDecoder,
  SolutionRevisionDecoder,
  VideoRevisionDecoder,
])

export const UuidPayloadDecoder = t.union([
  CommentDecoder,
  EntityPayloadDecoder,
  EntityRevisionPayloadDecoder,
  PagePayloadDecoder,
  PageRevisionPayloadDecoder,
  TaxonomyTermPayloadDecoder,
  UserDecoder,
])
