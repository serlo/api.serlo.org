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

export type CheckoutRevisionNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CheckoutRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  reviewer: User;
  repository: AbstractRepository;
  revision: AbstractRevision;
  reason: Scalars['String'];
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

export type CreateThreadNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateThreadNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  author: User;
  object: AbstractUuid;
  thread: UnsupportedThread;
};

export type RejectRevisionNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'RejectRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  reviewer: User;
  repository: AbstractRepository;
  revision: AbstractRevision;
  reason: Scalars['String'];
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

export type AbstractNotificationEvent = {
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
};

export type SetLicenseNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'SetLicenseNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  repository: AbstractRepository;
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

export type AbstractRepository = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  license: License;
};

export type AbstractRevision = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  author: User;
  date: Scalars['DateTime'];
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

export type Applet = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & {
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

export type AppletRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & {
  __typename?: 'AppletRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  repository: Applet;
  url: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};

export type Article = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & {
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

export type ArticleRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & {
  __typename?: 'ArticleRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  repository: Article;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};

export type CoursePage = AbstractUuid & AbstractRepository & AbstractEntity & {
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

export type CoursePageRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & {
  __typename?: 'CoursePageRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  repository: CoursePage;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
};

export type Course = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & {
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

export type CourseRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & {
  __typename?: 'CourseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  repository: Course;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaDescription: Scalars['String'];
};

export type Event = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & {
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

export type EventRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & {
  __typename?: 'EventRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  repository: Event;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};

export type ExerciseGroup = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & {
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

export type ExerciseGroupRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & {
  __typename?: 'ExerciseGroupRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  repository: ExerciseGroup;
  content: Scalars['String'];
  changes: Scalars['String'];
};

export type Exercise = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & AbstractExercise & {
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

export type ExerciseRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & AbstractExerciseRevision & {
  __typename?: 'ExerciseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  repository: Exercise;
  content: Scalars['String'];
  changes: Scalars['String'];
};

export type GroupedExercise = AbstractUuid & AbstractRepository & AbstractEntity & AbstractExercise & {
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

export type GroupedExerciseRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & AbstractExerciseRevision & {
  __typename?: 'GroupedExerciseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  repository: GroupedExercise;
  content: Scalars['String'];
  changes: Scalars['String'];
};

export type Page = AbstractUuid & AbstractRepository & AbstractNavigationChild & {
  __typename?: 'Page';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  license: License;
  currentRevision?: Maybe<PageRevision>;
  navigation?: Maybe<Navigation>;
};

export type PageRevision = AbstractUuid & AbstractRevision & {
  __typename?: 'PageRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  title: Scalars['String'];
  content: Scalars['String'];
  repository: Page;
};

export type Solution = AbstractUuid & AbstractRepository & AbstractEntity & {
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

export type SolutionRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & {
  __typename?: 'SolutionRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  repository: Solution;
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

export type Video = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & {
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

export type VideoRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & {
  __typename?: 'VideoRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  repository: Video;
  url: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
};
