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
