export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: string;
  JSON: unknown;
  JSONObject: Record<string, unknown>;
};

export type Query = {
  __typename?: 'Query';
  _cacheKeys: Query_CacheKeysResult;
  activeDonors: Array<User>;
  legacyNotifications: QueryLegacyNotificationsResult;
  license?: Maybe<License>;
  notificationEvent?: Maybe<AbstractNotificationEvent>;
  uuid?: Maybe<AbstractUuid>;
};


export type Query_CacheKeysArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryLegacyNotificationsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unread?: Maybe<Scalars['Boolean']>;
};


export type QueryLicenseArgs = {
  id: Scalars['Int'];
};


export type QueryNotificationEventArgs = {
  id: Scalars['Int'];
};


export type QueryUuidArgs = {
  alias?: Maybe<AliasInput>;
  id?: Maybe<Scalars['Int']>;
};

export type Query_CacheKeysResult = {
  __typename?: 'Query_CacheKeysResult';
  edges: Array<CacheKeyCursor>;
  nodes: Array<Scalars['String']>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type CacheKeyCursor = {
  __typename?: 'CacheKeyCursor';
  cursor: Scalars['String'];
  node: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _removeCache?: Maybe<Scalars['Boolean']>;
  _setCache?: Maybe<Scalars['Boolean']>;
  setLegacyNotificationState?: Maybe<Scalars['Boolean']>;
};


export type Mutation_RemoveCacheArgs = {
  key: Scalars['String'];
};


export type Mutation_SetCacheArgs = {
  key: Scalars['String'];
  value: Scalars['JSON'];
};


export type MutationSetLegacyNotificationStateArgs = {
  id: Scalars['Int'];
  unread: Scalars['Boolean'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
  endCursor?: Maybe<Scalars['String']>;
};


export enum Instance {
  De = 'de',
  En = 'en',
  Es = 'es',
  Fr = 'fr',
  Hi = 'hi',
  Ta = 'ta'
}



export type LegacyNotification = {
  __typename?: 'LegacyNotification';
  id: Scalars['Int'];
  unread: Scalars['Boolean'];
  event: LegacyNotificationEvent;
};

export type LegacyNotificationEvent = {
  __typename?: 'LegacyNotificationEvent';
  id: Scalars['Int'];
  type: Scalars['String'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  object: AbstractUuid;
  payload: Scalars['String'];
};

export type QueryLegacyNotificationsResult = {
  __typename?: 'QueryLegacyNotificationsResult';
  edges: Array<LegacyNotificationCursor>;
  nodes: Array<LegacyNotification>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type LegacyNotificationCursor = {
  __typename?: 'LegacyNotificationCursor';
  cursor: Scalars['String'];
  node: LegacyNotification;
};

export type License = {
  __typename?: 'License';
  id: Scalars['Int'];
  instance: Instance;
  default: Scalars['Boolean'];
  title: Scalars['String'];
  url: Scalars['String'];
  content: Scalars['String'];
  agreement: Scalars['String'];
  iconHref: Scalars['String'];
};

export type CreateThreadNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateThreadNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  author: User;
  object: AbstractUuid;
  thread: UnsupportedThread;
};

export type AbstractNotificationEvent = {
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
};

export type CreateCommentNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateCommentNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  author: User;
  thread: UnsupportedThread;
  comment: UnsupportedComment;
};

export type SetThreadStateNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'SetThreadStateNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  thread: UnsupportedThread;
  archived: Scalars['Boolean'];
};

export type CreateEntityNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateEntityNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  author: User;
  entity: AbstractEntity;
};

export type CreateEntityRevisionNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateEntityRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  author: User;
  entity: AbstractEntity;
  entityRevision: AbstractEntityRevision;
};

export type CheckoutRevisionNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CheckoutRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  reviewer: User;
  entity: AbstractEntity;
  entityRevision: AbstractEntityRevision;
  reason: Scalars['String'];
};

export type RejectRevisionNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'RejectRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  reviewer: User;
  entity: AbstractEntity;
  entityRevision: AbstractEntityRevision;
  reason: Scalars['String'];
};

export type SetLicenseNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'SetLicenseNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  object: AbstractUuid;
};

export type CreateLinkNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  parent: AbstractUuid;
  entity: AbstractEntity;
};

export type RemoveLinkNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'RemoveLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  parent: AbstractUuid;
  entity: AbstractEntity;
};

export type CreateTaxonomyAssociationNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateTaxonomyAssociationNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  taxonomyTerm: TaxonomyTerm;
  entity: AbstractEntity;
};

export type CreateTaxonomyTermNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateTaxonomyTermNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  taxonomyTerm: TaxonomyTerm;
};

export type SetTaxonomyTermNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'SetTaxonomyTermNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  taxonomyTerm: TaxonomyTerm;
};

export type SetTaxonomyParentNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'SetTaxonomyParentNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  taxonomyTerm: TaxonomyTerm;
  previousParent: TaxonomyTerm;
  parent: TaxonomyTerm;
};

export type RemoveTaxonomyAssociationNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'RemoveTaxonomyAssociationNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  taxonomyTerm: TaxonomyTerm;
  entity: AbstractEntity;
};

export type SetUuidStateNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'SetUuidStateNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  object: AbstractUuid;
  trashed: Scalars['Boolean'];
};

export type AbstractEntity = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  license: License;
};

export type AbstractEntityRevision = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  author: User;
  date: Scalars['DateTime'];
};

export type AbstractExercise = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  license: License;
  currentRevision?: Maybe<AbstractExerciseRevision>;
  solution?: Maybe<Solution>;
};

export type AbstractExerciseRevision = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  author: User;
  date: Scalars['DateTime'];
  content: Scalars['String'];
  changes: Scalars['String'];
};

export type AbstractNavigationChild = {
  navigation?: Maybe<Navigation>;
};

export type Navigation = {
  __typename?: 'Navigation';
  data: Scalars['JSON'];
  path: Array<NavigationNode>;
};

export type NavigationNode = {
  __typename?: 'NavigationNode';
  label: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
};

export type AbstractTaxonomyTermChild = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  license: License;
  taxonomyTerms: Array<TaxonomyTerm>;
};

export type AbstractUuid = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
};

export type AliasInput = {
  instance: Instance;
  path: Scalars['String'];
};

export type Applet = AbstractUuid & AbstractEntity & AbstractTaxonomyTermChild & {
  __typename?: 'Applet';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<AppletRevision>;
  taxonomyTerms: Array<TaxonomyTerm>;
};

export type AppletRevision = AbstractUuid & AbstractEntityRevision & {
  __typename?: 'AppletRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  applet: Applet;
  url: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};

export type Article = AbstractUuid & AbstractEntity & AbstractTaxonomyTermChild & {
  __typename?: 'Article';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<ArticleRevision>;
  taxonomyTerms: Array<TaxonomyTerm>;
};

export type ArticleRevision = AbstractUuid & AbstractEntityRevision & {
  __typename?: 'ArticleRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  article: Article;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};

export type CoursePage = AbstractUuid & AbstractEntity & {
  __typename?: 'CoursePage';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<CoursePageRevision>;
  course: Course;
};

export type CoursePageRevision = AbstractUuid & AbstractEntityRevision & {
  __typename?: 'CoursePageRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  coursePage: CoursePage;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
};

export type Course = AbstractUuid & AbstractEntity & AbstractTaxonomyTermChild & {
  __typename?: 'Course';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<CourseRevision>;
  taxonomyTerms: Array<TaxonomyTerm>;
  pages: Array<CoursePage>;
};

export type CourseRevision = AbstractUuid & AbstractEntityRevision & {
  __typename?: 'CourseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  course: Course;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaDescription: Scalars['String'];
};

export type Event = AbstractUuid & AbstractEntity & AbstractTaxonomyTermChild & {
  __typename?: 'Event';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<EventRevision>;
  taxonomyTerms: Array<TaxonomyTerm>;
};

export type EventRevision = AbstractUuid & AbstractEntityRevision & {
  __typename?: 'EventRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  event: Event;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};

export type ExerciseGroup = AbstractUuid & AbstractEntity & AbstractTaxonomyTermChild & {
  __typename?: 'ExerciseGroup';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<ExerciseGroupRevision>;
  taxonomyTerms: Array<TaxonomyTerm>;
  exercises: Array<GroupedExercise>;
};

export type ExerciseGroupRevision = AbstractUuid & AbstractEntityRevision & {
  __typename?: 'ExerciseGroupRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  exerciseGroup: ExerciseGroup;
  content: Scalars['String'];
  changes: Scalars['String'];
};

export type Exercise = AbstractUuid & AbstractEntity & AbstractTaxonomyTermChild & AbstractExercise & {
  __typename?: 'Exercise';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<ExerciseRevision>;
  taxonomyTerms: Array<TaxonomyTerm>;
  solution?: Maybe<Solution>;
};

export type ExerciseRevision = AbstractUuid & AbstractEntityRevision & AbstractExerciseRevision & {
  __typename?: 'ExerciseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  exercise: Exercise;
  content: Scalars['String'];
  changes: Scalars['String'];
};

export type GroupedExercise = AbstractUuid & AbstractEntity & AbstractExercise & {
  __typename?: 'GroupedExercise';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<GroupedExerciseRevision>;
  solution?: Maybe<Solution>;
  exerciseGroup: ExerciseGroup;
};

export type GroupedExerciseRevision = AbstractUuid & AbstractEntityRevision & AbstractExerciseRevision & {
  __typename?: 'GroupedExerciseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  groupedExercise: GroupedExercise;
  content: Scalars['String'];
  changes: Scalars['String'];
};

/**
 * Represents a Serlo.org page. A `Page` is a repository containing `PageRevision`s, is tied to an `Instance`,
 * has a `License`, and has an alias.
 */
export type Page = AbstractUuid & AbstractNavigationChild & {
  __typename?: 'Page';
  /** The ID of the page */
  id: Scalars['Int'];
  /** `true` iff the page has been trashed */
  trashed: Scalars['Boolean'];
  /** The `Instance` the page is tied to */
  instance: Instance;
  /** The alias of the page */
  alias?: Maybe<Scalars['String']>;
  /** The `License` of the page */
  license: License;
  /** The `PageRevision` that is currently checked out */
  currentRevision?: Maybe<PageRevision>;
  navigation?: Maybe<Navigation>;
};

/** Represents a Serlo.org page revision. A `PageRevision` has fields title and content. */
export type PageRevision = AbstractUuid & {
  __typename?: 'PageRevision';
  /** The ID of the page revision */
  id: Scalars['Int'];
  /** The `User` that created the page revision */
  author: User;
  /** `true` iff the page revision has been trashed */
  trashed: Scalars['Boolean'];
  /** The `DateTime` the page revision has been created */
  date: Scalars['DateTime'];
  /** The heading */
  title: Scalars['String'];
  /** The content */
  content: Scalars['String'];
  /** The `Page` the page revision is tied to */
  page: Page;
};

export type Solution = AbstractUuid & AbstractEntity & {
  __typename?: 'Solution';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<SolutionRevision>;
  exercise: AbstractExercise;
};

export type SolutionRevision = AbstractUuid & AbstractEntityRevision & {
  __typename?: 'SolutionRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  solution: Solution;
  content: Scalars['String'];
  changes: Scalars['String'];
};

export enum TaxonomyTermType {
  Blog = 'blog',
  Curriculum = 'curriculum',
  CurriculumTopic = 'curriculumTopic',
  CurriculumTopicFolder = 'curriculumTopicFolder',
  Forum = 'forum',
  ForumCategory = 'forumCategory',
  Locale = 'locale',
  Root = 'root',
  Subject = 'subject',
  Topic = 'topic',
  TopicFolder = 'topicFolder'
}

export type TaxonomyTerm = AbstractUuid & AbstractNavigationChild & {
  __typename?: 'TaxonomyTerm';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  type: TaxonomyTermType;
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  weight: Scalars['Int'];
  parent?: Maybe<TaxonomyTerm>;
  children: Array<AbstractUuid>;
  navigation?: Maybe<Navigation>;
};

export type UnsupportedThread = {
  __typename?: 'UnsupportedThread';
  id: Scalars['Int'];
};

export type UnsupportedComment = {
  __typename?: 'UnsupportedComment';
  id: Scalars['Int'];
};

export type User = AbstractUuid & {
  __typename?: 'User';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  username: Scalars['String'];
  date: Scalars['DateTime'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  activeDonor: Scalars['Boolean'];
};

export type Video = AbstractUuid & AbstractEntity & AbstractTaxonomyTermChild & {
  __typename?: 'Video';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<VideoRevision>;
  taxonomyTerms: Array<TaxonomyTerm>;
};

export type VideoRevision = AbstractUuid & AbstractEntityRevision & {
  __typename?: 'VideoRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  video: Video;
  url: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
};
