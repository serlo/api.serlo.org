/**
 * This file is part of Serlo.org API
 *
 * Copyright (c) 2020-2022 Serlo Education e.V.
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
 * @copyright Copyright (c) 2020-2022 Serlo Education e.V.
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/serlo-org/api.serlo.org for the canonical source repository
 */
export interface EntityFields {
  title: string
  cohesive: boolean
  content: string
  description: string
  metaTitle: string
  metaDescription: string
  url: string
}

export const ALL_POSSIBLE_FIELDS: EntityFields = {
  title: 'title',
  cohesive: false,
  content: 'content',
  description: 'description',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  url: 'https://url.org',
}

export const appletFields = [
  'title',
  'content',
  'metaTitle',
  'metaDescription',
  'url',
] as (keyof EntityFields)[]

export const articleFields = [
  'title',
  'content',
  'metaTitle',
  'metaDescription',
] as (keyof EntityFields)[]

export const courseFields = [
  'title',
  'content',
  'metaDescription',
] as (keyof EntityFields)[]

export const coursePageFields = ['title', 'content'] as (keyof EntityFields)[]

export const eventFields = [
  'title',
  'content',
  'metaTitle',
  'metaDescription',
] as (keyof EntityFields)[]

export const genericFields = ['content'] as (keyof EntityFields)[]

export const exerciseGroupFields = [
  'cohesive',
  'content',
] as (keyof EntityFields)[]

export const videoFields = ['title', 'content', 'url'] as (keyof EntityFields)[]

export interface AbstractEntitySetInput {
  changes: string
  subscribeThis: boolean
  subscribeThisByEmail: boolean
  needsReview: boolean
  entityId?: number
  parentId?: number
  cohesive?: 'true' | 'false'
  content?: string
  description?: string
  metaDescription?: string
  metaTitle?: string
  title?: string
  url?: string
}
