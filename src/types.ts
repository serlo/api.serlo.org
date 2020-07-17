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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
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
  object: Uuid;
  payload: Scalars['String'];
};

export type NotificationInput = {
  id: Scalars['Int'];
  unread?: Maybe<Scalars['Boolean']>;
  eventId: Scalars['Int'];
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

/**
 * Represents a Serlo.org entity (e.g. an article). An `Entity` is tied to an `Instance`, has a `License`, might have an alias
 * and is the child of `TaxonomyTerm`s
 */
export type Entity = {
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
export type EntityRevision = {
  /** The `User` that created the entity revision */
  author: User;
  /** The `DateTime` the entity revision has been created */
  date: Scalars['DateTime'];
};

export type Uuid = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  uuid?: Maybe<Uuid>;
  license?: Maybe<License>;
  notifications: QueryNotificationsResult;
};


export type QueryUuidArgs = {
  alias?: Maybe<AliasInput>;
  id?: Maybe<Scalars['Int']>;
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

export type Mutation = {
  __typename?: 'Mutation';
  _removeUuid?: Maybe<Scalars['Boolean']>;
  _setCache?: Maybe<Scalars['Boolean']>;
  _removeCache?: Maybe<Scalars['Boolean']>;
  _removeLicense?: Maybe<Scalars['Boolean']>;
  _setLicense?: Maybe<Scalars['Boolean']>;
  setNotificationState?: Maybe<Scalars['Boolean']>;
  _setNotifications?: Maybe<Scalars['Boolean']>;
  _setNotificationEvent?: Maybe<Scalars['Boolean']>;
  /** Inserts the given `Alias` into the cache. May only be called by `serlo.org` when an alias has been created or updated. */
  _setAlias?: Maybe<Scalars['Boolean']>;
  _setApplet?: Maybe<Scalars['Boolean']>;
  _setAppletRevision?: Maybe<Scalars['Boolean']>;
  _setArticle?: Maybe<Scalars['Boolean']>;
  _setArticleRevision?: Maybe<Scalars['Boolean']>;
  _setCourse?: Maybe<Scalars['Boolean']>;
  _setCourseRevision?: Maybe<Scalars['Boolean']>;
  _setCoursePage?: Maybe<Scalars['Boolean']>;
  _setCoursePageRevision?: Maybe<Scalars['Boolean']>;
  _setEvent?: Maybe<Scalars['Boolean']>;
  _setEventRevision?: Maybe<Scalars['Boolean']>;
  _setExercise?: Maybe<Scalars['Boolean']>;
  _setExerciseRevision?: Maybe<Scalars['Boolean']>;
  _setExerciseGroup?: Maybe<Scalars['Boolean']>;
  _setExerciseGroupRevision?: Maybe<Scalars['Boolean']>;
  _setGroupedExercise?: Maybe<Scalars['Boolean']>;
  _setGroupedExerciseRevision?: Maybe<Scalars['Boolean']>;
  _setNavigation?: Maybe<Scalars['Boolean']>;
  /** Inserts the given `Page` into the cache. May only be called by `serlo.org` when a page has been created or updated. */
  _setPage?: Maybe<Scalars['Boolean']>;
  /** Inserts the given `PageRevision` into the cache. May only be called by `serlo.org` when a page revision has been created. */
  _setPageRevision?: Maybe<Scalars['Boolean']>;
  _setSolution?: Maybe<Scalars['Boolean']>;
  _setSolutionRevision?: Maybe<Scalars['Boolean']>;
  _setTaxonomyTerm?: Maybe<Scalars['Boolean']>;
  _setUser?: Maybe<Scalars['Boolean']>;
  _setVideo?: Maybe<Scalars['Boolean']>;
  _setVideoRevision?: Maybe<Scalars['Boolean']>;
};


export type Mutation_RemoveUuidArgs = {
  id: Scalars['Int'];
};


export type Mutation_SetCacheArgs = {
  key: Scalars['String'];
  value: Scalars['String'];
};


export type Mutation_RemoveCacheArgs = {
  key: Scalars['String'];
};


export type Mutation_RemoveLicenseArgs = {
  id: Scalars['Int'];
};


export type Mutation_SetLicenseArgs = {
  id: Scalars['Int'];
  instance: Instance;
  default: Scalars['Boolean'];
  title: Scalars['String'];
  url: Scalars['String'];
  content: Scalars['String'];
  agreement: Scalars['String'];
  iconHref: Scalars['String'];
};


export type MutationSetNotificationStateArgs = {
  id: Scalars['Int'];
  unread: Scalars['Boolean'];
};


export type Mutation_SetNotificationsArgs = {
  userId: Scalars['Int'];
  notifications: Array<NotificationInput>;
};


export type Mutation_SetNotificationEventArgs = {
  id: Scalars['Int'];
  type: Scalars['String'];
  instance: Instance;
  date: Scalars['String'];
  actorId: Scalars['Int'];
  objectId: Scalars['Int'];
  payload: Scalars['String'];
};


export type Mutation_SetAliasArgs = {
  id: Scalars['Int'];
  instance: Instance;
  path: Scalars['String'];
  source: Scalars['String'];
  timestamp: Scalars['DateTime'];
};


export type Mutation_SetAppletArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  currentRevisionId?: Maybe<Scalars['Int']>;
  licenseId: Scalars['Int'];
  taxonomyTermIds: Array<Scalars['Int']>;
};


export type Mutation_SetAppletRevisionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  authorId: Scalars['Int'];
  repositoryId: Scalars['Int'];
  url: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};


export type Mutation_SetArticleArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  currentRevisionId?: Maybe<Scalars['Int']>;
  licenseId: Scalars['Int'];
  taxonomyTermIds: Array<Scalars['Int']>;
};


export type Mutation_SetArticleRevisionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  authorId: Scalars['Int'];
  repositoryId: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};


export type Mutation_SetCourseArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  currentRevisionId?: Maybe<Scalars['Int']>;
  licenseId: Scalars['Int'];
  taxonomyTermIds: Array<Scalars['Int']>;
  pageIds: Array<Scalars['Int']>;
};


export type Mutation_SetCourseRevisionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  authorId: Scalars['Int'];
  repositoryId: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaDescription: Scalars['String'];
};


export type Mutation_SetCoursePageArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  currentRevisionId?: Maybe<Scalars['Int']>;
  licenseId: Scalars['Int'];
  parentId: Scalars['Int'];
};


export type Mutation_SetCoursePageRevisionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  authorId: Scalars['Int'];
  repositoryId: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type Mutation_SetEventArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  currentRevisionId?: Maybe<Scalars['Int']>;
  licenseId: Scalars['Int'];
  taxonomyTermIds: Array<Scalars['Int']>;
};


export type Mutation_SetEventRevisionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  authorId: Scalars['Int'];
  repositoryId: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};


export type Mutation_SetExerciseArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  currentRevisionId?: Maybe<Scalars['Int']>;
  licenseId: Scalars['Int'];
  taxonomyTermIds: Array<Scalars['Int']>;
  solutionId?: Maybe<Scalars['Int']>;
};


export type Mutation_SetExerciseRevisionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  authorId: Scalars['Int'];
  repositoryId: Scalars['Int'];
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type Mutation_SetExerciseGroupArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  currentRevisionId?: Maybe<Scalars['Int']>;
  licenseId: Scalars['Int'];
  taxonomyTermIds: Array<Scalars['Int']>;
  exerciseIds: Array<Scalars['Int']>;
};


export type Mutation_SetExerciseGroupRevisionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  authorId: Scalars['Int'];
  repositoryId: Scalars['Int'];
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type Mutation_SetGroupedExerciseArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  currentRevisionId?: Maybe<Scalars['Int']>;
  licenseId: Scalars['Int'];
  solutionId?: Maybe<Scalars['Int']>;
  parentId: Scalars['Int'];
};


export type Mutation_SetGroupedExerciseRevisionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  authorId: Scalars['Int'];
  repositoryId: Scalars['Int'];
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type Mutation_SetNavigationArgs = {
  data: Scalars['String'];
  instance: Instance;
};


export type Mutation_SetPageArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  currentRevisionId?: Maybe<Scalars['Int']>;
  licenseId: Scalars['Int'];
};


export type Mutation_SetPageRevisionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  title: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  authorId: Scalars['Int'];
  repositoryId: Scalars['Int'];
};


export type Mutation_SetSolutionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  currentRevisionId?: Maybe<Scalars['Int']>;
  licenseId: Scalars['Int'];
  parentId: Scalars['Int'];
};


export type Mutation_SetSolutionRevisionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  authorId: Scalars['Int'];
  repositoryId: Scalars['Int'];
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type Mutation_SetTaxonomyTermArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  type: TaxonomyTermType;
  instance: Instance;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  weight: Scalars['Int'];
  parentId?: Maybe<Scalars['Int']>;
  childrenIds: Array<Scalars['Int']>;
};


export type Mutation_SetUserArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  username: Scalars['String'];
  date: Scalars['DateTime'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
};


export type Mutation_SetVideoArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  currentRevisionId?: Maybe<Scalars['Int']>;
  licenseId: Scalars['Int'];
  taxonomyTermIds: Array<Scalars['Int']>;
};


export type Mutation_SetVideoRevisionArgs = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  authorId: Scalars['Int'];
  repositoryId: Scalars['Int'];
  url: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
};

/** Needed input to look up an Uuid by alias. */
export type AliasInput = {
  /** The `Instance` the alias should be looked up in */
  instance: Instance;
  /** The path that should be looked up */
  path: Scalars['String'];
};

export type Applet = Uuid & Entity & {
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

export type AppletRevision = Uuid & EntityRevision & {
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

export type Article = Uuid & Entity & {
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

export type ArticleRevision = Uuid & EntityRevision & {
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

export type Course = Uuid & Entity & {
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

export type CourseRevision = Uuid & EntityRevision & {
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

export type CoursePage = Uuid & Entity & {
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

export type CoursePageRevision = Uuid & EntityRevision & {
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

export type Event = Uuid & Entity & {
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

export type EventRevision = Uuid & EntityRevision & {
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

export type Exercise = Uuid & Entity & {
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

export type ExerciseRevision = Uuid & EntityRevision & {
  __typename?: 'ExerciseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  exercise: Exercise;
  content: Scalars['String'];
  changes: Scalars['String'];
};

export type ExerciseGroup = Uuid & Entity & {
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

export type ExerciseGroupRevision = Uuid & EntityRevision & {
  __typename?: 'ExerciseGroupRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  exerciseGroup: ExerciseGroup;
  content: Scalars['String'];
  changes: Scalars['String'];
};

export type GroupedExercise = Uuid & Entity & {
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

export type GroupedExerciseRevision = Uuid & EntityRevision & {
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
  data: Scalars['String'];
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
export type Page = Uuid & {
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
export type PageRevision = Uuid & {
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

export type Solution = Uuid & Entity & {
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

export type SolutionRevision = Uuid & EntityRevision & {
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

export type TaxonomyTerm = Uuid & {
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
  children: Array<Uuid>;
  navigation?: Maybe<Navigation>;
};

export type User = Uuid & {
  __typename?: 'User';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  username: Scalars['String'];
  date: Scalars['DateTime'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
};

export type Video = Uuid & Entity & {
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

export type VideoRevision = Uuid & EntityRevision & {
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

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

