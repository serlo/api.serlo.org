import { EntityRevisionType, EntityType } from '~/model/decoder'

export function fromEntityTypeToEntityRevisionType(
  entityType: EntityType,
): EntityRevisionType {
  switch (entityType) {
    case EntityType.Applet:
      return EntityRevisionType.AppletRevision
    case EntityType.Article:
      return EntityRevisionType.ArticleRevision
    case EntityType.Course:
      return EntityRevisionType.CourseRevision
    case EntityType.CoursePage:
      return EntityRevisionType.CoursePageRevision
    case EntityType.Event:
      return EntityRevisionType.EventRevision
    case EntityType.Exercise:
      return EntityRevisionType.ExerciseRevision
    case EntityType.ExerciseGroup:
      return EntityRevisionType.ExerciseGroupRevision
    case EntityType.Page:
      return EntityRevisionType.PageRevision
    case EntityType.Video:
      return EntityRevisionType.VideoRevision
  }
}
