import {
  CommentDecoder,
  EntityDecoder,
  RepositoryDecoder,
  RevisionDecoder,
  TaxonomyTermDecoder,
  UserDecoder,
  UuidDecoder,
} from '~/model/decoder'
import { resolveThread } from '~/schema/thread/utils'
import { UuidResolver } from '~/schema/uuid/abstract-uuid/resolvers'
import { AbstractNotificationEventResolvers, Resolvers } from '~/types'

export const resolvers: Resolvers = {
  CheckoutRevisionNotificationEvent: {
    ...createNotificationEventResolvers(),
    async repository(notificationEvent, _args, context) {
      return await UuidResolver.resolveWithDecoder(
        RepositoryDecoder,
        { id: notificationEvent.repositoryId },
        context,
      )
    },
    async revision(notificationEvent, _args, context) {
      return await UuidResolver.resolveWithDecoder(
        RevisionDecoder,
        { id: notificationEvent.revisionId },
        context,
      )
    },
  },

  CreateEntityNotificationEvent: {
    ...createNotificationEventResolvers(),
    async entity(event, _args, context) {
      const id = event.entityId
      return UuidResolver.resolveWithDecoder(EntityDecoder, { id }, context)
    },
  },

  CreateCommentNotificationEvent: {
    ...createNotificationEventResolvers(),
    thread(event, _args, context) {
      return resolveThread(event.threadId, context)
    },
    async comment(event, _args, context) {
      return await UuidResolver.resolveWithDecoder(
        CommentDecoder,
        { id: event.commentId },
        context,
      )
    },
  },

  SetThreadStateNotificationEvent: {
    ...createNotificationEventResolvers(),
    thread(notificationEvent, _args, context) {
      return resolveThread(notificationEvent.threadId, context)
    },
  },

  SetTaxonomyTermNotificationEvent: {
    ...createNotificationEventResolvers(),
    taxonomyTerm(event, _args, context) {
      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id: event.taxonomyTermId },
        context,
      )
    },
  },

  SetLicenseNotificationEvent: {
    ...createNotificationEventResolvers(),
    repository(event, _args, context) {
      const id = event.repositoryId
      return UuidResolver.resolveWithDecoder(RepositoryDecoder, { id }, context)
    },
  },

  RemoveTaxonomyLinkNotificationEvent: {
    ...createNotificationEventResolvers(),
    parent(event, _args, context) {
      const id = event.parentId
      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id },
        context,
      )
    },
    async child(event, _args, context) {
      const id = event.childId
      return UuidResolver.resolveWithDecoder(UuidDecoder, { id }, context)
    },
  },

  CreateTaxonomyLinkNotificationEvent: {
    ...createNotificationEventResolvers(),
    async parent(event, _args, context) {
      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id: event.parentId },
        context,
      )
    },
    async child(event, _args, context) {
      const id = event.childId
      return UuidResolver.resolveWithDecoder(UuidDecoder, { id }, context)
    },
  },

  SetTaxonomyParentNotificationEvent: {
    ...createNotificationEventResolvers(),
    async previousParent(event, _args, context) {
      const id = event.previousParentId
      if (id === null) return null

      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id },
        context,
      )
    },
    async parent(event, _args, context) {
      const id = event.parentId
      if (id === null) return null

      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id },
        context,
      )
    },
    async child(event, _args, context) {
      const id = event.childId
      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id },
        context,
      )
    },
  },

  CreateEntityRevisionNotificationEvent: {
    ...createNotificationEventResolvers(),
    async entity(event, _args, context) {
      const id = event.entityId
      return UuidResolver.resolveWithDecoder(RepositoryDecoder, { id }, context)
    },
    async entityRevision(event, _args, context) {
      const id = event.entityRevisionId
      return UuidResolver.resolveWithDecoder(RevisionDecoder, { id }, context)
    },
  },

  RejectRevisionNotificationEvent: {
    ...createNotificationEventResolvers(),
    async repository(event, _args, context) {
      const id = event.repositoryId
      return UuidResolver.resolveWithDecoder(RepositoryDecoder, { id }, context)
    },
    async revision(event, _args, context) {
      const id = event.revisionId
      return UuidResolver.resolveWithDecoder(RevisionDecoder, { id }, context)
    },
  },

  CreateThreadNotificationEvent: {
    ...createNotificationEventResolvers(),
    async object(event, _args, context) {
      const id = event.objectId
      return UuidResolver.resolveWithDecoder(UuidDecoder, { id }, context)
    },
    thread(event, _args, context) {
      return resolveThread(event.threadId, context)
    },
  },

  CreateTaxonomyTermNotificationEvent: {
    ...createNotificationEventResolvers(),
    async taxonomyTerm(event, _args, context) {
      return UuidResolver.resolveWithDecoder(
        TaxonomyTermDecoder,
        { id: event.taxonomyTermId },
        context,
      )
    },
  },

  RemoveEntityLinkNotificationEvent: {
    ...createNotificationEventResolvers(),
    async parent(event, _args, context) {
      const id = event.parentId
      return UuidResolver.resolveWithDecoder(EntityDecoder, { id }, context)
    },
    async child(event, _args, context) {
      const id = event.childId
      return UuidResolver.resolveWithDecoder(EntityDecoder, { id }, context)
    },
  },

  CreateEntityLinkNotificationEvent: {
    ...createNotificationEventResolvers(),
    async parent(event, _args, context) {
      const id = event.parentId
      return UuidResolver.resolveWithDecoder(EntityDecoder, { id }, context)
    },
    async child(event, _args, context) {
      const id = event.childId
      return UuidResolver.resolveWithDecoder(EntityDecoder, { id }, context)
    },
  },

  SetUuidStateNotificationEvent: {
    ...createNotificationEventResolvers(),
    async object(event, _args, context) {
      const id = event.objectId
      return UuidResolver.resolveWithDecoder(UuidDecoder, { id }, context)
    },
  },
}

function createNotificationEventResolvers(): Pick<
  AbstractNotificationEventResolvers,
  'actor'
> {
  return {
    async actor(event, _args, context) {
      return await UuidResolver.resolveWithDecoder(
        UserDecoder,
        { id: event.actorId },
        context,
      )
    },
  }
}
