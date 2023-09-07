export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  JSON: { input: unknown; output: unknown; }
  JSONObject: { input: Record<string, unknown>; output: Record<string, unknown>; }
};

export type AbstractEntity = {
  alias: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  subject?: Maybe<Subject>;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractEntityEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type AbstractEntityConnection = {
  __typename?: 'AbstractEntityConnection';
  edges: Array<AbstractEntityCursor>;
  nodes: Array<AbstractEntity>;
  pageInfo: HasNextPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbstractEntityCursor = {
  __typename?: 'AbstractEntityCursor';
  cursor: Scalars['String']['output'];
  node: AbstractEntity;
};

export type AbstractEntityRevision = {
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractEntityRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type AbstractExercise = {
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<AbstractExerciseRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  solution?: Maybe<Solution>;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractExerciseEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type AbstractExerciseRevision = {
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractExerciseRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type AbstractNavigationChild = {
  navigation?: Maybe<Navigation>;
};

export type AbstractNotificationEvent = {
  actor: User;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
};

export type AbstractNotificationEventConnection = {
  __typename?: 'AbstractNotificationEventConnection';
  edges: Array<AbstractNotificationEventEdge>;
  nodes: Array<AbstractNotificationEvent>;
  pageInfo: HasNextPageInfo;
};

export type AbstractNotificationEventEdge = {
  __typename?: 'AbstractNotificationEventEdge';
  cursor: Scalars['String']['output'];
  node: AbstractNotificationEvent;
};

export type AbstractRepository = {
  alias: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractRepositoryEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type AbstractRepositoryThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AbstractRevision = {
  alias: Scalars['String']['output'];
  author: User;
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type AbstractRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AbstractTaxonomyTermChild = {
  alias: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  taxonomyTerms: TaxonomyTermConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractTaxonomyTermChildEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type AbstractTaxonomyTermChildTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type AbstractUuid = {
  alias: Scalars['String']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractUuidEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type AbstractUuidConnection = {
  __typename?: 'AbstractUuidConnection';
  edges: Array<AbstractUuidCursor>;
  nodes: Array<AbstractUuid>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbstractUuidCursor = {
  __typename?: 'AbstractUuidCursor';
  cursor: Scalars['String']['output'];
  node: AbstractUuid;
};

export type AddRevisionResponse = {
  __typename?: 'AddRevisionResponse';
  query: Query;
  revisionId?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type AliasInput = {
  instance: Instance;
  path: Scalars['String']['input'];
};

export type AllThreadsConnection = {
  __typename?: 'AllThreadsConnection';
  edges: Array<ThreadsCursor>;
  nodes: Array<Thread>;
  pageInfo: HasNextPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Applet = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Applet';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<AppletRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  revisions: AppletRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AppletEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type AppletRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AppletTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type AppletThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AppletRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'AppletRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  metaDescription: Scalars['String']['output'];
  metaTitle: Scalars['String']['output'];
  repository: Applet;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};


export type AppletRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type AppletRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AppletRevisionConnection = {
  __typename?: 'AppletRevisionConnection';
  edges: Array<AppletRevisionCursor>;
  nodes: Array<AppletRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AppletRevisionCursor = {
  __typename?: 'AppletRevisionCursor';
  cursor: Scalars['String']['output'];
  node: AppletRevision;
};

export type Article = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Article';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<ArticleRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  revisions: ArticleRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ArticleEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ArticleRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ArticleTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ArticleThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ArticleRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'ArticleRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  metaDescription: Scalars['String']['output'];
  metaTitle: Scalars['String']['output'];
  repository: Article;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ArticleRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ArticleRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ArticleRevisionConnection = {
  __typename?: 'ArticleRevisionConnection';
  edges: Array<ArticleRevisionCursor>;
  nodes: Array<ArticleRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ArticleRevisionCursor = {
  __typename?: 'ArticleRevisionCursor';
  cursor: Scalars['String']['output'];
  node: ArticleRevision;
};

export type CacheRemoveInput = {
  keys: Array<Scalars['String']['input']>;
};

export type CacheRemoveResponse = {
  __typename?: 'CacheRemoveResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type CacheSetInput = {
  key: Scalars['String']['input'];
  value: Scalars['JSON']['input'];
};

export type CacheSetResponse = {
  __typename?: 'CacheSetResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type CacheUpdateInput = {
  keys: Array<Scalars['String']['input']>;
};

export type CacheUpdateResponse = {
  __typename?: 'CacheUpdateResponse';
  success: Scalars['Boolean']['output'];
};

export type CheckoutRevisionInput = {
  reason: Scalars['String']['input'];
  revisionId: Scalars['Int']['input'];
};

export type CheckoutRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CheckoutRevisionNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  reason: Scalars['String']['output'];
  repository: AbstractRepository;
  revision: AbstractRevision;
};

export type CheckoutRevisionResponse = {
  __typename?: 'CheckoutRevisionResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type Comment = AbstractUuid & {
  __typename?: 'Comment';
  alias: Scalars['String']['output'];
  archived: Scalars['Boolean']['output'];
  author: User;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  legacyObject: AbstractUuid;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type CommentEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  edges: Array<CommentEdge>;
  nodes: Array<Comment>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CommentEdge = {
  __typename?: 'CommentEdge';
  cursor: Scalars['String']['output'];
  node: Comment;
};

export enum CommentStatus {
  Done = 'done',
  NoStatus = 'noStatus',
  Open = 'open'
}

export type Course = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Course';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<CourseRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  pages: Array<CoursePage>;
  revisions: CourseRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type CourseEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type CoursePagesArgs = {
  hasCurrentRevision?: InputMaybe<Scalars['Boolean']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CourseRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CourseTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CoursePage = AbstractEntity & AbstractRepository & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'CoursePage';
  alias: Scalars['String']['output'];
  course: Course;
  currentRevision?: Maybe<CoursePageRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  revisions: CoursePageRevisionConnection;
  subject?: Maybe<Subject>;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type CoursePageEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type CoursePageRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CoursePageThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CoursePageRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'CoursePageRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  repository: CoursePage;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type CoursePageRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type CoursePageRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CoursePageRevisionConnection = {
  __typename?: 'CoursePageRevisionConnection';
  edges: Array<CoursePageRevisionCursor>;
  nodes: Array<CoursePageRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CoursePageRevisionCursor = {
  __typename?: 'CoursePageRevisionCursor';
  cursor: Scalars['String']['output'];
  node: CoursePageRevision;
};

export type CourseRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'CourseRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  metaDescription: Scalars['String']['output'];
  repository: Course;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type CourseRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CourseRevisionConnection = {
  __typename?: 'CourseRevisionConnection';
  edges: Array<CourseRevisionCursor>;
  nodes: Array<CourseRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CourseRevisionCursor = {
  __typename?: 'CourseRevisionCursor';
  cursor: Scalars['String']['output'];
  node: CourseRevision;
};

export type CreateCommentNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateCommentNotificationEvent';
  actor: User;
  comment: Comment;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  thread: Thread;
};

export type CreateEntityLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityLinkNotificationEvent';
  actor: User;
  child: AbstractEntity;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  parent: AbstractEntity;
};

export type CreateEntityNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  entity: AbstractEntity;
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
};

export type CreateEntityRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityRevisionNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  entity: AbstractRepository;
  entityRevision: AbstractRevision;
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
};

export type CreatePageInput = {
  content: Scalars['String']['input'];
  discussionsEnabled: Scalars['Boolean']['input'];
  forumId?: InputMaybe<Scalars['Int']['input']>;
  instance: Instance;
  licenseId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateTaxonomyLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateTaxonomyLinkNotificationEvent';
  actor: User;
  child: AbstractUuid;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  parent: TaxonomyTerm;
};

export type CreateTaxonomyTermNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateTaxonomyTermNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  taxonomyTerm: TaxonomyTerm;
};

export type CreateThreadNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateThreadNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  object: AbstractUuid;
  objectId: Scalars['Int']['output'];
  thread: Thread;
};

export type DefaultResponse = {
  __typename?: 'DefaultResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type DeletedEntitiesConnection = {
  __typename?: 'DeletedEntitiesConnection';
  edges: Array<DeletedEntityCursor>;
  nodes: Array<DeletedEntity>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type DeletedEntity = {
  __typename?: 'DeletedEntity';
  dateOfDeletion?: Maybe<Scalars['String']['output']>;
  entity?: Maybe<AbstractEntity>;
};

export type DeletedEntityCursor = {
  __typename?: 'DeletedEntityCursor';
  cursor: Scalars['String']['output'];
  node: DeletedEntity;
};

export type EntityMetadataConnection = {
  __typename?: 'EntityMetadataConnection';
  edges: Array<EntityMetadataCursor>;
  nodes: Array<Scalars['JSONObject']['output']>;
  pageInfo: HasNextPageInfo;
};

export type EntityMetadataCursor = {
  __typename?: 'EntityMetadataCursor';
  cursor: Scalars['String']['output'];
  node: Scalars['JSONObject']['output'];
};

export type EntityMutation = {
  __typename?: 'EntityMutation';
  checkoutRevision: CheckoutRevisionResponse;
  rejectRevision: RejectRevisionResponse;
  setApplet: SetEntityResponse;
  setArticle: SetEntityResponse;
  setCourse: SetEntityResponse;
  setCoursePage: SetEntityResponse;
  setEvent: SetEntityResponse;
  setExercise: SetEntityResponse;
  setExerciseGroup: SetEntityResponse;
  setGroupedExercise: SetEntityResponse;
  setSolution: SetEntityResponse;
  setVideo: SetEntityResponse;
  sort: EntitySortResponse;
  updateLicense: EntityUpdateLicenseResponse;
};


export type EntityMutationCheckoutRevisionArgs = {
  input: CheckoutRevisionInput;
};


export type EntityMutationRejectRevisionArgs = {
  input: RejectRevisionInput;
};


export type EntityMutationSetAppletArgs = {
  input: SetAppletInput;
};


export type EntityMutationSetArticleArgs = {
  input: SetArticleInput;
};


export type EntityMutationSetCourseArgs = {
  input: SetCourseInput;
};


export type EntityMutationSetCoursePageArgs = {
  input: SetCoursePageInput;
};


export type EntityMutationSetEventArgs = {
  input: SetEventInput;
};


export type EntityMutationSetExerciseArgs = {
  input: SetGenericEntityInput;
};


export type EntityMutationSetExerciseGroupArgs = {
  input: SetExerciseGroupInput;
};


export type EntityMutationSetGroupedExerciseArgs = {
  input: SetGenericEntityInput;
};


export type EntityMutationSetSolutionArgs = {
  input: SetGenericEntityInput;
};


export type EntityMutationSetVideoArgs = {
  input: SetVideoInput;
};


export type EntityMutationSortArgs = {
  input: EntitySortInput;
};


export type EntityMutationUpdateLicenseArgs = {
  input: EntityUpdateLicenseInput;
};

export type EntityQuery = {
  __typename?: 'EntityQuery';
  deletedEntities: DeletedEntitiesConnection;
};


export type EntityQueryDeletedEntitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
};

export type EntitySortInput = {
  childrenIds: Array<Scalars['Int']['input']>;
  entityId: Scalars['Int']['input'];
};

export type EntitySortResponse = {
  __typename?: 'EntitySortResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type EntityUpdateLicenseInput = {
  entityId: Scalars['Int']['input'];
  licenseId: Scalars['Int']['input'];
};

export type EntityUpdateLicenseResponse = {
  __typename?: 'EntityUpdateLicenseResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type Event = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Event';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<EventRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  revisions: EventRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type EventEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type EventRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type EventTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type EventThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'EventRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  metaDescription: Scalars['String']['output'];
  metaTitle: Scalars['String']['output'];
  repository: Event;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type EventRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type EventRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventRevisionConnection = {
  __typename?: 'EventRevisionConnection';
  edges: Array<EventRevisionCursor>;
  nodes: Array<EventRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type EventRevisionCursor = {
  __typename?: 'EventRevisionCursor';
  cursor: Scalars['String']['output'];
  node: EventRevision;
};

export type Exercise = AbstractEntity & AbstractExercise & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Exercise';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<ExerciseRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  revisions: ExerciseRevisionConnection;
  solution?: Maybe<Solution>;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ExerciseEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ExerciseRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ExerciseTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ExerciseThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ExerciseGroup = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'ExerciseGroup';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<ExerciseGroupRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  exercises: Array<GroupedExercise>;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  revisions: ExerciseGroupRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ExerciseGroupEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ExerciseGroupRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ExerciseGroupTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ExerciseGroupThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ExerciseGroupRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'ExerciseGroupRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  cohesive: Scalars['Boolean']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  repository: ExerciseGroup;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ExerciseGroupRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ExerciseGroupRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ExerciseGroupRevisionConnection = {
  __typename?: 'ExerciseGroupRevisionConnection';
  edges: Array<ExerciseGroupRevisionCursor>;
  nodes: Array<ExerciseGroupRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ExerciseGroupRevisionCursor = {
  __typename?: 'ExerciseGroupRevisionCursor';
  cursor: Scalars['String']['output'];
  node: ExerciseGroupRevision;
};

export type ExerciseRevision = AbstractEntityRevision & AbstractExerciseRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'ExerciseRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  repository: Exercise;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ExerciseRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type ExerciseRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ExerciseRevisionConnection = {
  __typename?: 'ExerciseRevisionConnection';
  edges: Array<ExerciseRevisionCursor>;
  nodes: Array<ExerciseRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ExerciseRevisionCursor = {
  __typename?: 'ExerciseRevisionCursor';
  cursor: Scalars['String']['output'];
  node: ExerciseRevision;
};

export type GroupedExercise = AbstractEntity & AbstractExercise & AbstractRepository & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'GroupedExercise';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<GroupedExerciseRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  exerciseGroup: ExerciseGroup;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  revisions: GroupedExerciseRevisionConnection;
  solution?: Maybe<Solution>;
  subject?: Maybe<Subject>;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type GroupedExerciseEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type GroupedExerciseRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type GroupedExerciseThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GroupedExerciseRevision = AbstractEntityRevision & AbstractExerciseRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'GroupedExerciseRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  repository: GroupedExercise;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type GroupedExerciseRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type GroupedExerciseRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GroupedExerciseRevisionConnection = {
  __typename?: 'GroupedExerciseRevisionConnection';
  edges: Array<GroupedExerciseRevisionCursor>;
  nodes: Array<GroupedExerciseRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GroupedExerciseRevisionCursor = {
  __typename?: 'GroupedExerciseRevisionCursor';
  cursor: Scalars['String']['output'];
  node: GroupedExerciseRevision;
};

export type HasNextPageInfo = {
  __typename?: 'HasNextPageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export enum Instance {
  De = 'de',
  En = 'en',
  Es = 'es',
  Fr = 'fr',
  Hi = 'hi',
  Ta = 'ta'
}

export type InstanceAware = {
  instance: Instance;
};

export type License = {
  __typename?: 'License';
  agreement: Scalars['String']['output'];
  content: Scalars['String']['output'];
  default: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  shortTitle: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type LicenseQuery = {
  __typename?: 'LicenseQuery';
  defaultLicense: License;
  license?: Maybe<License>;
  licenses: Array<License>;
};


export type LicenseQueryDefaultLicenseArgs = {
  instance: Instance;
};


export type LicenseQueryLicenseArgs = {
  id: Scalars['Int']['input'];
};


export type LicenseQueryLicensesArgs = {
  instance?: InputMaybe<Instance>;
};

export type MediaQuery = {
  __typename?: 'MediaQuery';
  newUpload: MediaUpload;
};


export type MediaQueryNewUploadArgs = {
  mediaType: MediaType;
};

export enum MediaType {
  ImageGif = 'IMAGE_GIF',
  ImageJpeg = 'IMAGE_JPEG',
  ImagePng = 'IMAGE_PNG',
  ImageSvgXml = 'IMAGE_SVG_XML',
  ImageWebp = 'IMAGE_WEBP'
}

export type MediaUpload = {
  __typename?: 'MediaUpload';
  uploadUrl: Scalars['String']['output'];
  urlAfterUpload: Scalars['String']['output'];
};

export type MetadataQuery = {
  __typename?: 'MetadataQuery';
  /** @deprecated Please use the `resources` field instead. This property will be deleted. */
  entities: EntityMetadataConnection;
  publisher: Scalars['JSONObject']['output'];
  resources: EntityMetadataConnection;
  version: Scalars['String']['output'];
};


export type MetadataQueryEntitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  modifiedAfter?: InputMaybe<Scalars['String']['input']>;
};


export type MetadataQueryResourcesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  modifiedAfter?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _cache: _CacheMutation;
  entity: EntityMutation;
  notification: NotificationMutation;
  oauth: OauthMutation;
  page: PageMutation;
  subscription: SubscriptionMutation;
  taxonomyTerm: TaxonomyTermMutation;
  thread: ThreadMutation;
  user: UserMutation;
  uuid: UuidMutation;
};

export type Navigation = {
  __typename?: 'Navigation';
  path: NavigationNodeConnection;
};


export type NavigationPathArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type NavigationNode = {
  __typename?: 'NavigationNode';
  id?: Maybe<Scalars['Int']['output']>;
  label: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type NavigationNodeConnection = {
  __typename?: 'NavigationNodeConnection';
  edges?: Maybe<Array<Maybe<NavigationNodeEdge>>>;
  nodes: Array<NavigationNode>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type NavigationNodeEdge = {
  __typename?: 'NavigationNodeEdge';
  cursor: Scalars['String']['output'];
  node: NavigationNode;
};

export type Notification = {
  __typename?: 'Notification';
  email: Scalars['Boolean']['output'];
  emailSent: Scalars['Boolean']['output'];
  event: AbstractNotificationEvent;
  id: Scalars['Int']['output'];
  unread: Scalars['Boolean']['output'];
};

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  edges: Array<NotificationEdge>;
  nodes: Array<Notification>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor: Scalars['String']['output'];
  node: Notification;
};

export type NotificationMutation = {
  __typename?: 'NotificationMutation';
  setState?: Maybe<NotificationSetStateResponse>;
};


export type NotificationMutationSetStateArgs = {
  input: NotificationSetStateInput;
};

export type NotificationSetStateInput = {
  id: Array<Scalars['Int']['input']>;
  unread: Scalars['Boolean']['input'];
};

export type NotificationSetStateResponse = {
  __typename?: 'NotificationSetStateResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type OauthAcceptInput = {
  challenge: Scalars['String']['input'];
  session: Scalars['JSON']['input'];
};

export type OauthAcceptResponse = {
  __typename?: 'OauthAcceptResponse';
  redirectUri: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type OauthMutation = {
  __typename?: 'OauthMutation';
  acceptConsent: OauthAcceptResponse;
  acceptLogin: OauthAcceptResponse;
  acceptLogout: OauthAcceptResponse;
};


export type OauthMutationAcceptConsentArgs = {
  input: OauthAcceptInput;
};


export type OauthMutationAcceptLoginArgs = {
  input: OauthAcceptInput;
};


export type OauthMutationAcceptLogoutArgs = {
  challenge: Scalars['String']['input'];
};

export type Page = AbstractNavigationChild & AbstractRepository & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Page';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<PageRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  navigation?: Maybe<Navigation>;
  revisions: PageRevisionConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type PageEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type PageRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PageThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PageAddRevisionInput = {
  content: Scalars['String']['input'];
  pageId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type PageCreateResponse = {
  __typename?: 'PageCreateResponse';
  query: Query;
  record?: Maybe<Page>;
  success: Scalars['Boolean']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PageMutation = {
  __typename?: 'PageMutation';
  addRevision: AddRevisionResponse;
  checkoutRevision: CheckoutRevisionResponse;
  create: PageCreateResponse;
  rejectRevision: RejectRevisionResponse;
};


export type PageMutationAddRevisionArgs = {
  input: PageAddRevisionInput;
};


export type PageMutationCheckoutRevisionArgs = {
  input: CheckoutRevisionInput;
};


export type PageMutationCreateArgs = {
  input: CreatePageInput;
};


export type PageMutationRejectRevisionArgs = {
  input: RejectRevisionInput;
};

export type PageQuery = {
  __typename?: 'PageQuery';
  pages: Array<Page>;
};


export type PageQueryPagesArgs = {
  instance?: InputMaybe<Instance>;
};

export type PageRevision = AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'PageRevision';
  alias: Scalars['String']['output'];
  author: User;
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  repository: Page;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type PageRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type PageRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PageRevisionConnection = {
  __typename?: 'PageRevisionConnection';
  edges: Array<PageRevisionCursor>;
  nodes: Array<PageRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PageRevisionCursor = {
  __typename?: 'PageRevisionCursor';
  cursor: Scalars['String']['output'];
  node: PageRevision;
};

export type Query = {
  __typename?: 'Query';
  activeAuthors: UserConnection;
  activeDonors: UserConnection;
  activeReviewers: UserConnection;
  authorization: Scalars['JSON']['output'];
  entity?: Maybe<EntityQuery>;
  events: AbstractNotificationEventConnection;
  license: LicenseQuery;
  media: MediaQuery;
  metadata: MetadataQuery;
  notificationEvent?: Maybe<AbstractNotificationEvent>;
  notifications: NotificationConnection;
  page: PageQuery;
  subject: SubjectQuery;
  subscription: SubscriptionQuery;
  thread: ThreadQuery;
  user: UserQuery;
  uuid?: Maybe<AbstractUuid>;
  version: Scalars['String']['output'];
};


export type QueryActiveAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryActiveDonorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryActiveReviewersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
  objectId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotificationEventArgs = {
  id: Scalars['Int']['input'];
};


export type QueryNotificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['Boolean']['input']>;
  emailSent?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unread?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUuidArgs = {
  alias?: InputMaybe<AliasInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type RejectRevisionInput = {
  reason: Scalars['String']['input'];
  revisionId: Scalars['Int']['input'];
};

export type RejectRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RejectRevisionNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  reason: Scalars['String']['output'];
  repository: AbstractRepository;
  revision: AbstractRevision;
};

export type RejectRevisionResponse = {
  __typename?: 'RejectRevisionResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type RemoveEntityLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RemoveEntityLinkNotificationEvent';
  actor: User;
  child: AbstractEntity;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  parent: AbstractEntity;
};

export type RemoveTaxonomyLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RemoveTaxonomyLinkNotificationEvent';
  actor: User;
  child: AbstractUuid;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  parent: TaxonomyTerm;
};

export enum Role {
  Admin = 'admin',
  Architect = 'architect',
  Guest = 'guest',
  Login = 'login',
  Moderator = 'moderator',
  Reviewer = 'reviewer',
  StaticPagesBuilder = 'static_pages_builder',
  Sysadmin = 'sysadmin'
}

export enum Scope {
  Serlo = 'Serlo',
  SerloDe = 'Serlo_De',
  SerloEn = 'Serlo_En',
  SerloEs = 'Serlo_Es',
  SerloFr = 'Serlo_Fr',
  SerloHi = 'Serlo_Hi',
  SerloTa = 'Serlo_Ta'
}

export type ScopedRole = {
  __typename?: 'ScopedRole';
  role: Role;
  scope?: Maybe<Scalars['String']['output']>;
};

export type ScopedRoleConnection = {
  __typename?: 'ScopedRoleConnection';
  edges: Array<ScopedRoleCursor>;
  nodes: Array<ScopedRole>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ScopedRoleCursor = {
  __typename?: 'ScopedRoleCursor';
  cursor: Scalars['String']['output'];
  node: ScopedRole;
};

export type SetAppletInput = {
  changes: Scalars['String']['input'];
  content: Scalars['String']['input'];
  entityId?: InputMaybe<Scalars['Int']['input']>;
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  needsReview: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  subscribeThis: Scalars['Boolean']['input'];
  subscribeThisByEmail: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type SetArticleInput = {
  changes: Scalars['String']['input'];
  content: Scalars['String']['input'];
  entityId?: InputMaybe<Scalars['Int']['input']>;
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  needsReview: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  subscribeThis: Scalars['Boolean']['input'];
  subscribeThisByEmail: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type SetCourseInput = {
  changes: Scalars['String']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  entityId?: InputMaybe<Scalars['Int']['input']>;
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  needsReview: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  subscribeThis: Scalars['Boolean']['input'];
  subscribeThisByEmail: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type SetCoursePageInput = {
  changes: Scalars['String']['input'];
  content: Scalars['String']['input'];
  entityId?: InputMaybe<Scalars['Int']['input']>;
  needsReview: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  subscribeThis: Scalars['Boolean']['input'];
  subscribeThisByEmail: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type SetEntityResponse = {
  __typename?: 'SetEntityResponse';
  query: Query;
  record?: Maybe<AbstractEntity>;
  success: Scalars['Boolean']['output'];
};

export type SetEventInput = {
  changes: Scalars['String']['input'];
  content: Scalars['String']['input'];
  entityId?: InputMaybe<Scalars['Int']['input']>;
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  needsReview: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  subscribeThis: Scalars['Boolean']['input'];
  subscribeThisByEmail: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type SetExerciseGroupInput = {
  changes: Scalars['String']['input'];
  cohesive: Scalars['Boolean']['input'];
  content: Scalars['String']['input'];
  entityId?: InputMaybe<Scalars['Int']['input']>;
  needsReview: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  subscribeThis: Scalars['Boolean']['input'];
  subscribeThisByEmail: Scalars['Boolean']['input'];
};

export type SetGenericEntityInput = {
  changes: Scalars['String']['input'];
  content: Scalars['String']['input'];
  entityId?: InputMaybe<Scalars['Int']['input']>;
  needsReview: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  subscribeThis: Scalars['Boolean']['input'];
  subscribeThisByEmail: Scalars['Boolean']['input'];
};

export type SetLicenseNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetLicenseNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  repository: AbstractRepository;
};

export type SetTaxonomyParentNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetTaxonomyParentNotificationEvent';
  actor: User;
  child: TaxonomyTerm;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  parent?: Maybe<TaxonomyTerm>;
  previousParent?: Maybe<TaxonomyTerm>;
};

export type SetTaxonomyTermNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetTaxonomyTermNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  taxonomyTerm: TaxonomyTerm;
};

export type SetThreadStateNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetThreadStateNotificationEvent';
  actor: User;
  archived: Scalars['Boolean']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  thread: Thread;
};

export type SetUuidStateNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetUuidStateNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  object: AbstractUuid;
  objectId: Scalars['Int']['output'];
  trashed: Scalars['Boolean']['output'];
};

export type SetVideoInput = {
  changes: Scalars['String']['input'];
  content: Scalars['String']['input'];
  entityId?: InputMaybe<Scalars['Int']['input']>;
  needsReview: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  subscribeThis: Scalars['Boolean']['input'];
  subscribeThisByEmail: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type Solution = AbstractEntity & AbstractRepository & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Solution';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<SolutionRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  exercise: AbstractExercise;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  revisions: SolutionRevisionConnection;
  subject?: Maybe<Subject>;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type SolutionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type SolutionRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type SolutionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SolutionRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'SolutionRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  repository: Solution;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type SolutionRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type SolutionRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SolutionRevisionConnection = {
  __typename?: 'SolutionRevisionConnection';
  edges: Array<SolutionRevisionCursor>;
  nodes: Array<SolutionRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SolutionRevisionCursor = {
  __typename?: 'SolutionRevisionCursor';
  cursor: Scalars['String']['output'];
  node: SolutionRevision;
};

export type Subject = {
  __typename?: 'Subject';
  id: Scalars['String']['output'];
  taxonomyTerm: TaxonomyTerm;
  unrevisedEntities: AbstractEntityConnection;
};


export type SubjectUnrevisedEntitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type SubjectQuery = {
  __typename?: 'SubjectQuery';
  subject?: Maybe<Subject>;
  subjects: Array<Subject>;
};


export type SubjectQuerySubjectArgs = {
  id: Scalars['String']['input'];
};


export type SubjectQuerySubjectsArgs = {
  instance: Instance;
};

export type SubscriptionConnection = {
  __typename?: 'SubscriptionConnection';
  edges: Array<SubscriptionCursor>;
  nodes: Array<SubscriptionInfo>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SubscriptionCursor = {
  __typename?: 'SubscriptionCursor';
  cursor: Scalars['String']['output'];
  node: SubscriptionInfo;
};

export type SubscriptionInfo = {
  __typename?: 'SubscriptionInfo';
  object: AbstractUuid;
  sendEmail: Scalars['Boolean']['output'];
};

export type SubscriptionMutation = {
  __typename?: 'SubscriptionMutation';
  set?: Maybe<SubscriptionSetResponse>;
};


export type SubscriptionMutationSetArgs = {
  input: SubscriptionSetInput;
};

export type SubscriptionQuery = {
  __typename?: 'SubscriptionQuery';
  currentUserHasSubscribed: Scalars['Boolean']['output'];
  getSubscriptions: SubscriptionConnection;
};


export type SubscriptionQueryCurrentUserHasSubscribedArgs = {
  id: Scalars['Int']['input'];
};


export type SubscriptionQueryGetSubscriptionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type SubscriptionSetInput = {
  id: Array<Scalars['Int']['input']>;
  sendEmail: Scalars['Boolean']['input'];
  subscribe: Scalars['Boolean']['input'];
};

export type SubscriptionSetResponse = {
  __typename?: 'SubscriptionSetResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type TaxonomyEntityLinksInput = {
  entityIds: Array<Scalars['Int']['input']>;
  taxonomyTermId: Scalars['Int']['input'];
};

export type TaxonomyEntityLinksResponse = {
  __typename?: 'TaxonomyEntityLinksResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type TaxonomyTerm = AbstractNavigationChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'TaxonomyTerm';
  alias: Scalars['String']['output'];
  children: AbstractUuidConnection;
  description?: Maybe<Scalars['String']['output']>;
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  name: Scalars['String']['output'];
  navigation?: Maybe<Navigation>;
  parent?: Maybe<TaxonomyTerm>;
  taxonomyId: Scalars['Int']['output'];
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  type: TaxonomyTermType;
  weight: Scalars['Int']['output'];
};


export type TaxonomyTermChildrenArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonomyTermEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonomyTermThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TaxonomyTermConnection = {
  __typename?: 'TaxonomyTermConnection';
  edges?: Maybe<Array<Maybe<TaxonomyTermEdge>>>;
  nodes: Array<TaxonomyTerm>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TaxonomyTermCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentId: Scalars['Int']['input'];
  taxonomyType: TaxonomyTypeCreateOptions;
};

export type TaxonomyTermCreateResponse = {
  __typename?: 'TaxonomyTermCreateResponse';
  query: Query;
  record?: Maybe<TaxonomyTerm>;
  success: Scalars['Boolean']['output'];
};

export type TaxonomyTermEdge = {
  __typename?: 'TaxonomyTermEdge';
  cursor: Scalars['String']['output'];
  node: TaxonomyTerm;
};

export type TaxonomyTermMutation = {
  __typename?: 'TaxonomyTermMutation';
  create: TaxonomyTermCreateResponse;
  createEntityLinks: TaxonomyEntityLinksResponse;
  deleteEntityLinks: TaxonomyEntityLinksResponse;
  setNameAndDescription: TaxonomyTermSetNameAndDescriptionResponse;
  sort: TaxonomyTermSortResponse;
};


export type TaxonomyTermMutationCreateArgs = {
  input: TaxonomyTermCreateInput;
};


export type TaxonomyTermMutationCreateEntityLinksArgs = {
  input: TaxonomyEntityLinksInput;
};


export type TaxonomyTermMutationDeleteEntityLinksArgs = {
  input: TaxonomyEntityLinksInput;
};


export type TaxonomyTermMutationSetNameAndDescriptionArgs = {
  input: TaxonomyTermSetNameAndDescriptionInput;
};


export type TaxonomyTermMutationSortArgs = {
  input: TaxonomyTermSortInput;
};

export type TaxonomyTermSetNameAndDescriptionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type TaxonomyTermSetNameAndDescriptionResponse = {
  __typename?: 'TaxonomyTermSetNameAndDescriptionResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type TaxonomyTermSortInput = {
  childrenIds: Array<Scalars['Int']['input']>;
  taxonomyTermId: Scalars['Int']['input'];
};

export type TaxonomyTermSortResponse = {
  __typename?: 'TaxonomyTermSortResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export enum TaxonomyTermType {
  ExerciseFolder = 'exerciseFolder',
  Root = 'root',
  Subject = 'subject',
  Topic = 'topic'
}

export enum TaxonomyTypeCreateOptions {
  ExerciseFolder = 'exerciseFolder',
  Topic = 'topic'
}

export type Thread = {
  __typename?: 'Thread';
  archived: Scalars['Boolean']['output'];
  comments: CommentConnection;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  object: AbstractUuid;
  status: CommentStatus;
  title?: Maybe<Scalars['String']['output']>;
  trashed: Scalars['Boolean']['output'];
};


export type ThreadCommentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type ThreadAware = {
  threads: ThreadsConnection;
};


export type ThreadAwareThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ThreadCreateCommentInput = {
  content: Scalars['String']['input'];
  sendEmail: Scalars['Boolean']['input'];
  subscribe: Scalars['Boolean']['input'];
  threadId: Scalars['String']['input'];
};

export type ThreadCreateCommentResponse = {
  __typename?: 'ThreadCreateCommentResponse';
  query: Query;
  record?: Maybe<Comment>;
  success: Scalars['Boolean']['output'];
};

export type ThreadCreateThreadInput = {
  content: Scalars['String']['input'];
  objectId: Scalars['Int']['input'];
  sendEmail: Scalars['Boolean']['input'];
  subscribe: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type ThreadCreateThreadResponse = {
  __typename?: 'ThreadCreateThreadResponse';
  query: Query;
  record?: Maybe<Thread>;
  success: Scalars['Boolean']['output'];
};

export type ThreadEditCommentInput = {
  commentId: Scalars['Int']['input'];
  content: Scalars['String']['input'];
};

export type ThreadMutation = {
  __typename?: 'ThreadMutation';
  createComment: ThreadCreateCommentResponse;
  createThread: ThreadCreateThreadResponse;
  editComment: DefaultResponse;
  setCommentState: DefaultResponse;
  setThreadArchived: DefaultResponse;
  setThreadState: DefaultResponse;
  setThreadStatus: DefaultResponse;
};


export type ThreadMutationCreateCommentArgs = {
  input: ThreadCreateCommentInput;
};


export type ThreadMutationCreateThreadArgs = {
  input: ThreadCreateThreadInput;
};


export type ThreadMutationEditCommentArgs = {
  input: ThreadEditCommentInput;
};


export type ThreadMutationSetCommentStateArgs = {
  input: ThreadSetCommentStateInput;
};


export type ThreadMutationSetThreadArchivedArgs = {
  input: ThreadSetThreadArchivedInput;
};


export type ThreadMutationSetThreadStateArgs = {
  input: ThreadSetThreadStateInput;
};


export type ThreadMutationSetThreadStatusArgs = {
  input: ThreadSetThreadStatusInput;
};

export type ThreadQuery = {
  __typename?: 'ThreadQuery';
  allThreads: AllThreadsConnection;
};


export type ThreadQueryAllThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  status?: InputMaybe<CommentStatus>;
  subjectId?: InputMaybe<Scalars['String']['input']>;
};

export type ThreadSetCommentStateInput = {
  id: Array<Scalars['Int']['input']>;
  trashed: Scalars['Boolean']['input'];
};

export type ThreadSetThreadArchivedInput = {
  archived: Scalars['Boolean']['input'];
  id: Array<Scalars['String']['input']>;
};

export type ThreadSetThreadStateInput = {
  id: Array<Scalars['String']['input']>;
  trashed: Scalars['Boolean']['input'];
};

export type ThreadSetThreadStatusInput = {
  id: Array<Scalars['String']['input']>;
  status: CommentStatus;
};

export type ThreadsConnection = {
  __typename?: 'ThreadsConnection';
  edges: Array<ThreadsCursor>;
  nodes: Array<Thread>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ThreadsCursor = {
  __typename?: 'ThreadsCursor';
  cursor: Scalars['String']['output'];
  node: Thread;
};

export type User = AbstractUuid & ThreadAware & {
  __typename?: 'User';
  activityByType: UserActivityByType;
  alias: Scalars['String']['output'];
  chatUrl?: Maybe<Scalars['String']['output']>;
  date: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  events: AbstractNotificationEventConnection;
  eventsByUser: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  imageUrl: Scalars['String']['output'];
  isActiveAuthor: Scalars['Boolean']['output'];
  isActiveDonor: Scalars['Boolean']['output'];
  isActiveReviewer: Scalars['Boolean']['output'];
  isNewAuthor: Scalars['Boolean']['output'];
  language?: Maybe<Instance>;
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  motivation?: Maybe<Scalars['String']['output']>;
  roles: ScopedRoleConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  unrevisedEntities: AbstractEntityConnection;
  username: Scalars['String']['output'];
};


export type UserEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type UserEventsByUserArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
  objectId?: InputMaybe<Scalars['Int']['input']>;
};


export type UserRolesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type UserThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};


export type UserUnrevisedEntitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type UserActivityByType = {
  __typename?: 'UserActivityByType';
  comments: Scalars['Int']['output'];
  edits: Scalars['Int']['output'];
  reviews: Scalars['Int']['output'];
  taxonomy: Scalars['Int']['output'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  nodes: Array<User>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserDeleteBotsInput = {
  botIds: Array<Scalars['Int']['input']>;
};

export type UserDeleteBotsResponse = {
  __typename?: 'UserDeleteBotsResponse';
  success: Scalars['Boolean']['output'];
};

export type UserDeleteRegularUsersInput = {
  users: Array<UserDescriptionInput>;
};

export type UserDeleteRegularUsersResponse = {
  __typename?: 'UserDeleteRegularUsersResponse';
  reason?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type UserDescriptionInput = {
  id: Scalars['Int']['input'];
  username: Scalars['String']['input'];
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

export type UserMutation = {
  __typename?: 'UserMutation';
  addRole: UserRoleResponse;
  deleteBots: UserDeleteBotsResponse;
  deleteRegularUsers: Array<UserDeleteRegularUsersResponse>;
  removeRole: UserRoleResponse;
  setDescription: UserSetDescriptionResponse;
  setEmail: UserSetEmailResponse;
};


export type UserMutationAddRoleArgs = {
  input: UserRoleInput;
};


export type UserMutationDeleteBotsArgs = {
  input: UserDeleteBotsInput;
};


export type UserMutationDeleteRegularUsersArgs = {
  input: UserDeleteRegularUsersInput;
};


export type UserMutationRemoveRoleArgs = {
  input: UserRoleInput;
};


export type UserMutationSetDescriptionArgs = {
  input: UserSetDescriptionInput;
};


export type UserMutationSetEmailArgs = {
  input: UserSetEmailInput;
};

export type UserQuery = {
  __typename?: 'UserQuery';
  potentialSpamUsers: UserConnection;
  usersByRole: UserWithPermissionsConnection;
};


export type UserQueryPotentialSpamUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type UserQueryUsersByRoleArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  role: Role;
};

export type UserRoleInput = {
  instance?: InputMaybe<Instance>;
  role: Role;
  username: Scalars['String']['input'];
};

export type UserRoleResponse = {
  __typename?: 'UserRoleResponse';
  success: Scalars['Boolean']['output'];
};

export type UserSetDescriptionInput = {
  description: Scalars['String']['input'];
};

export type UserSetDescriptionResponse = {
  __typename?: 'UserSetDescriptionResponse';
  success: Scalars['Boolean']['output'];
};

export type UserSetEmailInput = {
  email: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type UserSetEmailResponse = {
  __typename?: 'UserSetEmailResponse';
  email: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  username: Scalars['String']['output'];
};

export type UserWithPermissionsConnection = {
  __typename?: 'UserWithPermissionsConnection';
  edges: Array<UserEdge>;
  inheritance?: Maybe<Array<Role>>;
  nodes: Array<User>;
  pageInfo: PageInfo;
  permissions: Array<Scalars['String']['output']>;
  totalCount: Scalars['Int']['output'];
};

export type UuidMutation = {
  __typename?: 'UuidMutation';
  setState?: Maybe<UuidSetStateResponse>;
};


export type UuidMutationSetStateArgs = {
  input: UuidSetStateInput;
};

export type UuidSetStateInput = {
  id: Array<Scalars['Int']['input']>;
  trashed: Scalars['Boolean']['input'];
};

export type UuidSetStateResponse = {
  __typename?: 'UuidSetStateResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type Video = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Video';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<VideoRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  license: License;
  revisions: VideoRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type VideoEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type VideoRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type VideoTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type VideoThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VideoRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'VideoRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  repository: Video;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};


export type VideoRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type VideoRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VideoRevisionConnection = {
  __typename?: 'VideoRevisionConnection';
  edges: Array<VideoRevisionCursor>;
  nodes: Array<VideoRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type VideoRevisionCursor = {
  __typename?: 'VideoRevisionCursor';
  cursor: Scalars['String']['output'];
  node: VideoRevision;
};

export type _CacheMutation = {
  __typename?: '_cacheMutation';
  remove: CacheRemoveResponse;
  set: CacheSetResponse;
  update: CacheUpdateResponse;
};


export type _CacheMutationRemoveArgs = {
  input: CacheRemoveInput;
};


export type _CacheMutationSetArgs = {
  input: CacheSetInput;
};


export type _CacheMutationUpdateArgs = {
  input: CacheUpdateInput;
};
