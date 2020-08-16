export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
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
  _cacheKeys: StringConnection;
  activeAuthors: UserConnection;
  activeDonors: UserConnection;
  activeReviewers: UserConnection;
  license?: Maybe<License>;
  notificationEvent?: Maybe<AbstractNotificationEvent>;
  notifications: NotificationConnection;
  uuid?: Maybe<AbstractUuid>;
};


export type Query_CacheKeysArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryActiveAuthorsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryActiveDonorsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryActiveReviewersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryLicenseArgs = {
  id: Scalars['Int'];
};


export type QueryNotificationEventArgs = {
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

export type StringConnection = {
  __typename?: 'StringConnection';
  edges: Array<StringEdge>;
  nodes: Array<Scalars['String']>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type StringEdge = {
  __typename?: 'StringEdge';
  cursor: Scalars['String'];
  node: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _removeCache?: Maybe<Scalars['Boolean']>;
  _setCache?: Maybe<Scalars['Boolean']>;
  _updateCache?: Maybe<Scalars['Boolean']>;
  setNotificationState?: Maybe<Scalars['Boolean']>;
};


export type Mutation_RemoveCacheArgs = {
  key: Scalars['String'];
};


export type Mutation_SetCacheArgs = {
  key: Scalars['String'];
  value: Scalars['JSON'];
};


export type Mutation_UpdateCacheArgs = {
  keys: Array<Scalars['String']>;
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

export type CheckoutRevisionNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CheckoutRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  repository: AbstractRepository;
  revision: AbstractRevision;
  reason: Scalars['String'];
};

export type CreateCommentNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateCommentNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  thread: UnsupportedThread;
  comment: UnsupportedComment;
};

export type CreateEntityLinkNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateEntityLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  parent: AbstractEntity;
  child: AbstractEntity;
};

export type CreateEntityNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateEntityNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  entity: AbstractEntity;
};

export type CreateEntityRevisionNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateEntityRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  entity: AbstractEntity;
  entityRevision: AbstractEntityRevision;
};

export type CreateTaxonomyLinkNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateTaxonomyLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  parent: TaxonomyTerm;
  child: AbstractUuid;
};

export type CreateTaxonomyTermNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateTaxonomyTermNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  taxonomyTerm: TaxonomyTerm;
};

export type CreateThreadNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'CreateThreadNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  object: AbstractUuid;
  thread: UnsupportedThread;
};

export type RejectRevisionNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'RejectRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  repository: AbstractRepository;
  revision: AbstractRevision;
  reason: Scalars['String'];
};

export type RemoveEntityLinkNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'RemoveEntityLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  parent: AbstractEntity;
  child: AbstractEntity;
};

export type RemoveTaxonomyLinkNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'RemoveTaxonomyLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  parent: TaxonomyTerm;
  child: AbstractUuid;
};

export type SetLicenseNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'SetLicenseNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  repository: AbstractRepository;
};

export type SetTaxonomyParentNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'SetTaxonomyParentNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  previousParent?: Maybe<TaxonomyTerm>;
  parent?: Maybe<TaxonomyTerm>;
  child: TaxonomyTerm;
};

export type SetTaxonomyTermNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'SetTaxonomyTermNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  taxonomyTerm: TaxonomyTerm;
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

export type SetUuidStateNotificationEvent = AbstractNotificationEvent & {
  __typename?: 'SetUuidStateNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  object: AbstractUuid;
  trashed: Scalars['Boolean'];
};

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['Int'];
  unread: Scalars['Boolean'];
  event: AbstractNotificationEvent;
};

export type AbstractNotificationEvent = {
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
};

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  edges: Array<NotificationEdge>;
  nodes: Array<Notification>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor: Scalars['String'];
  node: Notification;
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
  path: NavigationNodeConnection;
};


export type NavigationPathArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type NavigationNodeConnection = {
  __typename?: 'NavigationNodeConnection';
  edges?: Maybe<Array<Maybe<NavigationNodeEdge>>>;
  nodes: Array<NavigationNode>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type NavigationNodeEdge = {
  __typename?: 'NavigationNodeEdge';
  cursor: Scalars['String'];
  node: NavigationNode;
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
  taxonomyTerms: TaxonomyTermConnection;
};


export type AbstractTaxonomyTermChildTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type TaxonomyTermConnection = {
  __typename?: 'TaxonomyTermConnection';
  edges?: Maybe<Array<Maybe<TaxonomyTermEdge>>>;
  nodes: Array<TaxonomyTerm>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type TaxonomyTermEdge = {
  __typename?: 'TaxonomyTermEdge';
  cursor: Scalars['String'];
  node: TaxonomyTerm;
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
  taxonomyTerms: TaxonomyTermConnection;
};


export type AppletTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
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
  taxonomyTerms: TaxonomyTermConnection;
};


export type ArticleTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
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
  taxonomyTerms: TaxonomyTermConnection;
  pages: Array<CoursePage>;
};


export type CourseTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
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
  taxonomyTerms: TaxonomyTermConnection;
};


export type EventTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
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
  taxonomyTerms: TaxonomyTermConnection;
  exercises: Array<GroupedExercise>;
};


export type ExerciseGroupTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
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
  taxonomyTerms: TaxonomyTermConnection;
  solution?: Maybe<Solution>;
};


export type ExerciseTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
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
  children: AbstractUuidConnection;
  navigation?: Maybe<Navigation>;
};


export type TaxonomyTermChildrenArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type AbstractUuidConnection = {
  __typename?: 'AbstractUuidConnection';
  edges: Array<AbstractUuidCursor>;
  nodes: Array<AbstractUuid>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type AbstractUuidCursor = {
  __typename?: 'AbstractUuidCursor';
  cursor: Scalars['String'];
  node: AbstractUuid;
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
  activeAuthor: Scalars['Boolean'];
  activeDonor: Scalars['Boolean'];
  activeReviewer: Scalars['Boolean'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  nodes: Array<User>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String'];
  node: User;
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
  taxonomyTerms: TaxonomyTermConnection;
};


export type VideoTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
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
