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

export type Mutation = {
  __typename?: 'Mutation';
  _removeCache?: Maybe<Scalars['Boolean']>;
  _setCache?: Maybe<Scalars['Boolean']>;
  createThread?: Maybe<Thread>;
  setNotificationState?: Maybe<Scalars['Boolean']>;
};


export type Mutation_RemoveCacheArgs = {
  key: Scalars['String'];
};


export type Mutation_SetCacheArgs = {
  key: Scalars['String'];
  value: Scalars['JSON'];
};


export type MutationCreateThreadArgs = {
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  authorId: Scalars['Int'];
  objectId: Scalars['Int'];
  content: Scalars['String'];
};


export type MutationSetNotificationStateArgs = {
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

export type Query = {
  __typename?: 'Query';
  activeDonors: Array<User>;
  license?: Maybe<License>;
  notifications: QueryNotificationsResult;
  uuid?: Maybe<AbstractUuid>;
};


export type QueryLicenseArgs = {
  id: Scalars['Int'];
};


export type QueryNotificationsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unread?: Maybe<Scalars['Boolean']>;
};


export type QueryUuidArgs = {
  alias?: Maybe<AliasInput>;
  id?: Maybe<Scalars['Int']>;
};

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['Int'];
  unread: Scalars['Boolean'];
  event: NotificationEvent;
};

export type NotificationEvent = {
  __typename?: 'NotificationEvent';
  id: Scalars['Int'];
  type: Scalars['String'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  object: AbstractUuid;
  payload: Scalars['String'];
};

export type QueryNotificationsResult = {
  __typename?: 'QueryNotificationsResult';
  edges: Array<NotificationCursor>;
  nodes: Array<Notification>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type NotificationCursor = {
  __typename?: 'NotificationCursor';
  cursor: Scalars['String'];
  node: Notification;
};

export type ThreadsResult = {
  __typename?: 'ThreadsResult';
  totalCount: Scalars['Int'];
  nodes: Array<Thread>;
};

export type Thread = {
  __typename?: 'Thread';
  id: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  title: Scalars['String'];
  archived: Scalars['Boolean'];
  trashed: Scalars['Boolean'];
  object: AbstractUuid;
  comments: CommentsResult;
};

export type CommentsResult = {
  __typename?: 'CommentsResult';
  totalCount: Scalars['Int'];
  nodes: Array<Comment>;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['Int'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  author: User;
};

export type QueryThreadsResult = {
  __typename?: 'QueryThreadsResult';
  edges: Array<ThreadsCursor>;
  nodes: Array<Thread>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type ThreadsCursor = {
  __typename?: 'ThreadsCursor';
  cursor: Scalars['String'];
  node: Thread;
};

/**
 * Represents a Serlo.org entity (e.g. an article). An `Entity` is tied to an `Instance`, has a `License`, might have an alias
 * and is the child of `TaxonomyTerm`s
 */
export type AbstractEntity = {
  /** The `DateTime` the entity has been created */
  date: Scalars['DateTime'];
  /** The `Instance` the entity is tied to */
  instance: Instance;
  /** The current alias of the entity */
  alias?: Maybe<Scalars['String']>;
  /** The `License` of the entity */
  license: License;
};

/** Represents a Serlo.org entity revision (e.g. a revision of an article). An `EntityRevision` is tied to an `Entity` and has an author. */
export type AbstractEntityRevision = {
  /** The `User` that created the entity revision */
  author: User;
  /** The `DateTime` the entity revision has been created */
  date: Scalars['DateTime'];
};

export type AbstractUuid = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
};

export type AliasInput = {
  instance: Instance;
  path: Scalars['String'];
};

export type Applet = AbstractUuid & AbstractEntity & {
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

export type Article = AbstractUuid & AbstractEntity & {
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

export type Course = AbstractUuid & AbstractEntity & {
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

export type Event = AbstractUuid & AbstractEntity & {
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

export type ExerciseGroup = AbstractUuid & AbstractEntity & {
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

export type Exercise = AbstractUuid & AbstractEntity & {
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

export type ExerciseRevision = AbstractUuid & AbstractEntityRevision & {
  __typename?: 'ExerciseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  exercise: Exercise;
  content: Scalars['String'];
  changes: Scalars['String'];
};

export type GroupedExercise = AbstractUuid & AbstractEntity & {
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

export type GroupedExerciseRevision = AbstractUuid & AbstractEntityRevision & {
  __typename?: 'GroupedExerciseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  groupedExercise: GroupedExercise;
  content: Scalars['String'];
  changes: Scalars['String'];
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

/**
 * Represents a Serlo.org page. A `Page` is a repository containing `PageRevision`s, is tied to an `Instance`,
 * has a `License`, and has an alias.
 */
export type Page = AbstractUuid & {
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
  exercise: Exercise;
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

export type TaxonomyTerm = AbstractUuid & {
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

export type User = AbstractUuid & {
  __typename?: 'User';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  username: Scalars['String'];
  date: Scalars['DateTime'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  activeDonor: Scalars['Boolean'];
  threads: QueryThreadsResult;
};


export type UserThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type Video = AbstractUuid & AbstractEntity & {
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
