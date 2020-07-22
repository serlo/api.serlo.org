import { Applet, AppletRevision } from '../../../../types'
import {
  AbstractEntityRevisionPreResolver,
  EntityRevisionType,
  EntityType,
} from '../abstract-entity'
import { AbstractTaxonomyTermChildPreResolver } from '../abstract-taxonomy-term-child'

export interface AppletPreResolver
  extends AbstractTaxonomyTermChildPreResolver {
  __typename: EntityType.Applet
}

export type AppletPayload = AppletPreResolver

export interface AppletRevisionPreResolver
  extends AbstractEntityRevisionPreResolver {
  __typename: EntityRevisionType.AppletRevision
  url: string
  title: string
  content: string
  changes: string
  metaTitle: string
  metaDescription: string
}

export type AppletRevisionPayload = AppletRevisionPreResolver
