export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

export type AbstractEntity = {
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  subject?: Maybe<Subject>;
  trashed: Scalars['Boolean'];
};


export type AbstractEntityEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};

export type AbstractEntityConnection = {
  __typename?: 'AbstractEntityConnection';
  edges: Array<AbstractEntityCursor>;
  nodes: Array<AbstractEntity>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type AbstractEntityCursor = {
  __typename?: 'AbstractEntityCursor';
  cursor: Scalars['String'];
  node: AbstractEntity;
};

export type AbstractEntityRevision = {
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
};


export type AbstractEntityRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};

export type AbstractExercise = {
  alias?: Maybe<Scalars['String']>;
  currentRevision?: Maybe<AbstractExerciseRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  solution?: Maybe<Solution>;
  trashed: Scalars['Boolean'];
};


export type AbstractExerciseEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};

export type AbstractExerciseRevision = {
  alias?: Maybe<Scalars['String']>;
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
};


export type AbstractExerciseRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};

export type AbstractNavigationChild = {
  navigation?: Maybe<Navigation>;
};

export type AbstractNotificationEvent = {
  actor: User;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
};

export type AbstractNotificationEventConnection = {
  __typename?: 'AbstractNotificationEventConnection';
  edges: Array<AbstractNotificationEventEdge>;
  nodes: Array<AbstractNotificationEvent>;
  pageInfo: HasNextPageInfo;
};

export type AbstractNotificationEventEdge = {
  __typename?: 'AbstractNotificationEventEdge';
  cursor: Scalars['String'];
  node: AbstractNotificationEvent;
};

export type AbstractRepository = {
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type AbstractRepositoryEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type AbstractRepositoryThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type AbstractRevision = {
  alias?: Maybe<Scalars['String']>;
  author: User;
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type AbstractRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type AbstractRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type AbstractTaxonomyTermChild = {
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  taxonomyTerms: TaxonomyTermConnection;
  trashed: Scalars['Boolean'];
};


export type AbstractTaxonomyTermChildEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type AbstractTaxonomyTermChildTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type AbstractUuid = {
  alias?: Maybe<Scalars['String']>;
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
};


export type AbstractUuidEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};

export type AbstractUuidConnection = {
  __typename?: 'AbstractUuidConnection';
  edges: Array<AbstractUuidCursor>;
  nodes: Array<AbstractUuid>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type AbstractUuidCursor = {
  __typename?: 'AbstractUuidCursor';
  cursor: Scalars['String'];
  node: AbstractUuid;
};

export type AddAppletRevisionInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId: Scalars['Int'];
  metaDescription?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type AddArticleRevisionInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId: Scalars['Int'];
  metaDescription?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
};

export type AddCoursePageRevisionInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId: Scalars['Int'];
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
};

export type AddCourseRevisionInput = {
  changes: Scalars['String'];
  content?: InputMaybe<Scalars['String']>;
  entityId: Scalars['Int'];
  metaDescription?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
};

export type AddEventRevisionInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId: Scalars['Int'];
  metaDescription?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
};

export type AddExerciseGroupRevisionInput = {
  changes: Scalars['String'];
  cohesive: Scalars['Boolean'];
  content: Scalars['String'];
  entityId: Scalars['Int'];
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
};

export type AddGenericRevisionInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId: Scalars['Int'];
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
};

export type AddRevisionResponse = {
  __typename?: 'AddRevisionResponse';
  query: Query;
  revisionId?: Maybe<Scalars['Int']>;
  success: Scalars['Boolean'];
};

export type AddVideoRevisionInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId: Scalars['Int'];
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type AliasInput = {
  instance: Instance;
  path: Scalars['String'];
};

export type AllThreadsConnection = {
  __typename?: 'AllThreadsConnection';
  edges: Array<ThreadsCursor>;
  nodes: Array<Thread>;
  pageInfo: HasNextPageInfo;
  totalCount: Scalars['Int'];
};

export type Applet = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Applet';
  alias?: Maybe<Scalars['String']>;
  currentRevision?: Maybe<AppletRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  revisions: AppletRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type AppletEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type AppletRevisionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unrevised?: InputMaybe<Scalars['Boolean']>;
};


export type AppletTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type AppletThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type AppletRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'AppletRevision';
  alias?: Maybe<Scalars['String']>;
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  metaDescription: Scalars['String'];
  metaTitle: Scalars['String'];
  repository: Applet;
  threads: ThreadsConnection;
  title: Scalars['String'];
  trashed: Scalars['Boolean'];
  url: Scalars['String'];
};


export type AppletRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type AppletRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type AppletRevisionConnection = {
  __typename?: 'AppletRevisionConnection';
  edges: Array<AppletRevisionCursor>;
  nodes: Array<AppletRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type AppletRevisionCursor = {
  __typename?: 'AppletRevisionCursor';
  cursor: Scalars['String'];
  node: AppletRevision;
};

export type Article = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Article';
  alias?: Maybe<Scalars['String']>;
  currentRevision?: Maybe<ArticleRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  revisions: ArticleRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type ArticleEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ArticleRevisionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unrevised?: InputMaybe<Scalars['Boolean']>;
};


export type ArticleTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ArticleThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type ArticleRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'ArticleRevision';
  alias?: Maybe<Scalars['String']>;
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  metaDescription: Scalars['String'];
  metaTitle: Scalars['String'];
  repository: Article;
  threads: ThreadsConnection;
  title: Scalars['String'];
  trashed: Scalars['Boolean'];
};


export type ArticleRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ArticleRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type ArticleRevisionConnection = {
  __typename?: 'ArticleRevisionConnection';
  edges: Array<ArticleRevisionCursor>;
  nodes: Array<ArticleRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ArticleRevisionCursor = {
  __typename?: 'ArticleRevisionCursor';
  cursor: Scalars['String'];
  node: ArticleRevision;
};

export type CacheRemoveInput = {
  key: Scalars['String'];
};

export type CacheRemoveResponse = {
  __typename?: 'CacheRemoveResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type CacheSetInput = {
  key: Scalars['String'];
  value: Scalars['JSON'];
};

export type CacheSetResponse = {
  __typename?: 'CacheSetResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type CacheUpdateInput = {
  keys: Array<Scalars['String']>;
};

export type CacheUpdateResponse = {
  __typename?: 'CacheUpdateResponse';
  success: Scalars['Boolean'];
};

export type CheckoutRevisionInput = {
  reason: Scalars['String'];
  revisionId: Scalars['Int'];
};

export type CheckoutRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CheckoutRevisionNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  reason: Scalars['String'];
  repository: AbstractRepository;
  revision: AbstractRevision;
};

export type CheckoutRevisionResponse = {
  __typename?: 'CheckoutRevisionResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type Comment = AbstractUuid & {
  __typename?: 'Comment';
  alias: Scalars['String'];
  archived: Scalars['Boolean'];
  author: User;
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  legacyObject: AbstractUuid;
  title: Scalars['String'];
  trashed: Scalars['Boolean'];
};


export type CommentEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  edges: Array<CommentEdge>;
  nodes: Array<Comment>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type CommentEdge = {
  __typename?: 'CommentEdge';
  cursor: Scalars['String'];
  node: Comment;
};

export type Course = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Course';
  alias?: Maybe<Scalars['String']>;
  currentRevision?: Maybe<CourseRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  pages: Array<CoursePage>;
  revisions: CourseRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type CourseEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CoursePagesArgs = {
  hasCurrentRevision?: InputMaybe<Scalars['Boolean']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};


export type CourseRevisionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unrevised?: InputMaybe<Scalars['Boolean']>;
};


export type CourseTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CourseThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type CoursePage = AbstractEntity & AbstractRepository & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'CoursePage';
  alias?: Maybe<Scalars['String']>;
  course: Course;
  currentRevision?: Maybe<CoursePageRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  revisions: CoursePageRevisionConnection;
  subject?: Maybe<Subject>;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type CoursePageEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CoursePageRevisionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unrevised?: InputMaybe<Scalars['Boolean']>;
};


export type CoursePageThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type CoursePageRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'CoursePageRevision';
  alias?: Maybe<Scalars['String']>;
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  repository: CoursePage;
  threads: ThreadsConnection;
  title: Scalars['String'];
  trashed: Scalars['Boolean'];
};


export type CoursePageRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CoursePageRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type CoursePageRevisionConnection = {
  __typename?: 'CoursePageRevisionConnection';
  edges: Array<CoursePageRevisionCursor>;
  nodes: Array<CoursePageRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type CoursePageRevisionCursor = {
  __typename?: 'CoursePageRevisionCursor';
  cursor: Scalars['String'];
  node: CoursePageRevision;
};

export type CourseRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'CourseRevision';
  alias?: Maybe<Scalars['String']>;
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  metaDescription: Scalars['String'];
  repository: Course;
  threads: ThreadsConnection;
  title: Scalars['String'];
  trashed: Scalars['Boolean'];
};


export type CourseRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CourseRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type CourseRevisionConnection = {
  __typename?: 'CourseRevisionConnection';
  edges: Array<CourseRevisionCursor>;
  nodes: Array<CourseRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type CourseRevisionCursor = {
  __typename?: 'CourseRevisionCursor';
  cursor: Scalars['String'];
  node: CourseRevision;
};

export type CreateAppletInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  instance: Instance;
  licenseId: Scalars['Int'];
  metaDescription?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  taxonomyTermId: Scalars['Int'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type CreateArticleInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  instance: Instance;
  licenseId: Scalars['Int'];
  metaDescription?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  taxonomyTermId: Scalars['Int'];
  title: Scalars['String'];
};

export type CreateCommentNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateCommentNotificationEvent';
  actor: User;
  comment: Comment;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  thread: Thread;
};

export type CreateCourseInput = {
  changes: Scalars['String'];
  content?: InputMaybe<Scalars['String']>;
  instance: Instance;
  licenseId: Scalars['Int'];
  metaDescription?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  taxonomyTermId: Scalars['Int'];
  title: Scalars['String'];
};

export type CreateCoursePageInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  instance: Instance;
  licenseId: Scalars['Int'];
  needsReview: Scalars['Boolean'];
  parentId: Scalars['Int'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
};

export type CreateEntityLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityLinkNotificationEvent';
  actor: User;
  child: AbstractEntity;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  parent: AbstractEntity;
};

export type CreateEntityNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  entity: AbstractEntity;
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
};

export type CreateEntityResponse = {
  __typename?: 'CreateEntityResponse';
  query: Query;
  record?: Maybe<AbstractEntity>;
  success: Scalars['Boolean'];
};

export type CreateEntityRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityRevisionNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  entity: AbstractRepository;
  entityRevision: AbstractRevision;
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
};

export type CreateEventInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  instance: Instance;
  licenseId: Scalars['Int'];
  metaDescription?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  taxonomyTermId: Scalars['Int'];
  title: Scalars['String'];
};

export type CreateExerciseGroupInput = {
  changes: Scalars['String'];
  cohesive: Scalars['Boolean'];
  content: Scalars['String'];
  instance: Instance;
  licenseId: Scalars['Int'];
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  taxonomyTermId: Scalars['Int'];
};

export type CreateExerciseInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  instance: Instance;
  licenseId: Scalars['Int'];
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  taxonomyTermId: Scalars['Int'];
};

export type CreateGroupedExerciseInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  instance: Instance;
  licenseId: Scalars['Int'];
  needsReview: Scalars['Boolean'];
  parentId: Scalars['Int'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
};

export type CreatePageInput = {
  content: Scalars['String'];
  discussionsEnabled: Scalars['Boolean'];
  forumId?: InputMaybe<Scalars['Int']>;
  instance: Instance;
  licenseId: Scalars['Int'];
  title: Scalars['String'];
};

export type CreateSolutionInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  instance: Instance;
  licenseId: Scalars['Int'];
  needsReview: Scalars['Boolean'];
  parentId: Scalars['Int'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
};

export type CreateTaxonomyLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateTaxonomyLinkNotificationEvent';
  actor: User;
  child: AbstractUuid;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  parent: TaxonomyTerm;
};

export type CreateTaxonomyTermNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateTaxonomyTermNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  taxonomyTerm: TaxonomyTerm;
};

export type CreateThreadNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateThreadNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  object: AbstractUuid;
  objectId: Scalars['Int'];
  thread: Thread;
};

export type CreateVideoInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  instance: Instance;
  licenseId: Scalars['Int'];
  needsReview: Scalars['Boolean'];
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  taxonomyTermId: Scalars['Int'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type EntityMetadataConnection = {
  __typename?: 'EntityMetadataConnection';
  edges: Array<EntityMetadataCursor>;
  nodes: Array<Scalars['JSONObject']>;
  pageInfo: HasNextPageInfo;
};

export type EntityMetadataCursor = {
  __typename?: 'EntityMetadataCursor';
  cursor: Scalars['String'];
  node: Scalars['JSONObject'];
};

export type EntityMutation = {
  __typename?: 'EntityMutation';
  addAppletRevision: AddRevisionResponse;
  addArticleRevision: AddRevisionResponse;
  addCoursePageRevision: AddRevisionResponse;
  addCourseRevision: AddRevisionResponse;
  addEventRevision: AddRevisionResponse;
  addExerciseGroupRevision: AddRevisionResponse;
  addExerciseRevision: AddRevisionResponse;
  addGroupedExerciseRevision: AddRevisionResponse;
  addSolutionRevision: AddRevisionResponse;
  addVideoRevision: AddRevisionResponse;
  checkoutRevision: CheckoutRevisionResponse;
  createApplet: CreateEntityResponse;
  createArticle: CreateEntityResponse;
  createCourse: CreateEntityResponse;
  createCoursePage: CreateEntityResponse;
  createEvent: CreateEntityResponse;
  createExercise: CreateEntityResponse;
  createExerciseGroup: CreateEntityResponse;
  createGroupedExercise: CreateEntityResponse;
  createSolution: CreateEntityResponse;
  createVideo: CreateEntityResponse;
  rejectRevision: RejectRevisionResponse;
};


export type EntityMutationAddAppletRevisionArgs = {
  input: AddAppletRevisionInput;
};


export type EntityMutationAddArticleRevisionArgs = {
  input: AddArticleRevisionInput;
};


export type EntityMutationAddCoursePageRevisionArgs = {
  input: AddCoursePageRevisionInput;
};


export type EntityMutationAddCourseRevisionArgs = {
  input: AddCourseRevisionInput;
};


export type EntityMutationAddEventRevisionArgs = {
  input: AddEventRevisionInput;
};


export type EntityMutationAddExerciseGroupRevisionArgs = {
  input: AddExerciseGroupRevisionInput;
};


export type EntityMutationAddExerciseRevisionArgs = {
  input: AddGenericRevisionInput;
};


export type EntityMutationAddGroupedExerciseRevisionArgs = {
  input: AddGenericRevisionInput;
};


export type EntityMutationAddSolutionRevisionArgs = {
  input: AddGenericRevisionInput;
};


export type EntityMutationAddVideoRevisionArgs = {
  input: AddVideoRevisionInput;
};


export type EntityMutationCheckoutRevisionArgs = {
  input: CheckoutRevisionInput;
};


export type EntityMutationCreateAppletArgs = {
  input: CreateAppletInput;
};


export type EntityMutationCreateArticleArgs = {
  input: CreateArticleInput;
};


export type EntityMutationCreateCourseArgs = {
  input: CreateCourseInput;
};


export type EntityMutationCreateCoursePageArgs = {
  input: CreateCoursePageInput;
};


export type EntityMutationCreateEventArgs = {
  input: CreateEventInput;
};


export type EntityMutationCreateExerciseArgs = {
  input: CreateExerciseInput;
};


export type EntityMutationCreateExerciseGroupArgs = {
  input: CreateExerciseGroupInput;
};


export type EntityMutationCreateGroupedExerciseArgs = {
  input: CreateGroupedExerciseInput;
};


export type EntityMutationCreateSolutionArgs = {
  input: CreateSolutionInput;
};


export type EntityMutationCreateVideoArgs = {
  input: CreateVideoInput;
};


export type EntityMutationRejectRevisionArgs = {
  input: RejectRevisionInput;
};

export type Event = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Event';
  alias?: Maybe<Scalars['String']>;
  currentRevision?: Maybe<EventRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  revisions: EventRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type EventEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type EventRevisionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unrevised?: InputMaybe<Scalars['Boolean']>;
};


export type EventTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type EventThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type EventRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'EventRevision';
  alias?: Maybe<Scalars['String']>;
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  metaDescription: Scalars['String'];
  metaTitle: Scalars['String'];
  repository: Event;
  threads: ThreadsConnection;
  title: Scalars['String'];
  trashed: Scalars['Boolean'];
};


export type EventRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type EventRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type EventRevisionConnection = {
  __typename?: 'EventRevisionConnection';
  edges: Array<EventRevisionCursor>;
  nodes: Array<EventRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type EventRevisionCursor = {
  __typename?: 'EventRevisionCursor';
  cursor: Scalars['String'];
  node: EventRevision;
};

export type Exercise = AbstractEntity & AbstractExercise & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Exercise';
  alias?: Maybe<Scalars['String']>;
  currentRevision?: Maybe<ExerciseRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  revisions: ExerciseRevisionConnection;
  solution?: Maybe<Solution>;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type ExerciseEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ExerciseRevisionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unrevised?: InputMaybe<Scalars['Boolean']>;
};


export type ExerciseTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ExerciseThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type ExerciseGroup = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'ExerciseGroup';
  alias?: Maybe<Scalars['String']>;
  currentRevision?: Maybe<ExerciseGroupRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  exercises: Array<GroupedExercise>;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  revisions: ExerciseGroupRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type ExerciseGroupEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ExerciseGroupRevisionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unrevised?: InputMaybe<Scalars['Boolean']>;
};


export type ExerciseGroupTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ExerciseGroupThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type ExerciseGroupRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'ExerciseGroupRevision';
  alias?: Maybe<Scalars['String']>;
  author: User;
  changes: Scalars['String'];
  cohesive: Scalars['Boolean'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  repository: ExerciseGroup;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type ExerciseGroupRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ExerciseGroupRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type ExerciseGroupRevisionConnection = {
  __typename?: 'ExerciseGroupRevisionConnection';
  edges: Array<ExerciseGroupRevisionCursor>;
  nodes: Array<ExerciseGroupRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ExerciseGroupRevisionCursor = {
  __typename?: 'ExerciseGroupRevisionCursor';
  cursor: Scalars['String'];
  node: ExerciseGroupRevision;
};

export type ExerciseRevision = AbstractEntityRevision & AbstractExerciseRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'ExerciseRevision';
  alias?: Maybe<Scalars['String']>;
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  repository: Exercise;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type ExerciseRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ExerciseRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type ExerciseRevisionConnection = {
  __typename?: 'ExerciseRevisionConnection';
  edges: Array<ExerciseRevisionCursor>;
  nodes: Array<ExerciseRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ExerciseRevisionCursor = {
  __typename?: 'ExerciseRevisionCursor';
  cursor: Scalars['String'];
  node: ExerciseRevision;
};

export type GroupedExercise = AbstractEntity & AbstractExercise & AbstractRepository & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'GroupedExercise';
  alias?: Maybe<Scalars['String']>;
  currentRevision?: Maybe<GroupedExerciseRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  exerciseGroup: ExerciseGroup;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  revisions: GroupedExerciseRevisionConnection;
  solution?: Maybe<Solution>;
  subject?: Maybe<Subject>;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type GroupedExerciseEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type GroupedExerciseRevisionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unrevised?: InputMaybe<Scalars['Boolean']>;
};


export type GroupedExerciseThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type GroupedExerciseRevision = AbstractEntityRevision & AbstractExerciseRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'GroupedExerciseRevision';
  alias?: Maybe<Scalars['String']>;
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  repository: GroupedExercise;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type GroupedExerciseRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type GroupedExerciseRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type GroupedExerciseRevisionConnection = {
  __typename?: 'GroupedExerciseRevisionConnection';
  edges: Array<GroupedExerciseRevisionCursor>;
  nodes: Array<GroupedExerciseRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type GroupedExerciseRevisionCursor = {
  __typename?: 'GroupedExerciseRevisionCursor';
  cursor: Scalars['String'];
  node: GroupedExerciseRevision;
};

export type HasNextPageInfo = {
  __typename?: 'HasNextPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
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
  agreement: Scalars['String'];
  content: Scalars['String'];
  default: Scalars['Boolean'];
  iconHref: Scalars['String'];
  id: Scalars['Int'];
  instance: Instance;
  title: Scalars['String'];
  url: Scalars['String'];
};

export type MetadataQuery = {
  __typename?: 'MetadataQuery';
  entities: EntityMetadataConnection;
  publisher: Scalars['JSONObject'];
};


export type MetadataQueryEntitiesArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  modifiedAfter?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _cache: _CacheMutation;
  entity: EntityMutation;
  notification: NotificationMutation;
  page: PageMutation;
  subscription: SubscriptionMutation;
  taxonomyTerm: TaxonomyTermMutation;
  thread: ThreadMutation;
  user: UserMutation;
  uuid: UuidMutation;
};

export type Navigation = {
  __typename?: 'Navigation';
  data: Scalars['JSON'];
  path: NavigationNodeConnection;
};


export type NavigationPathArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type NavigationNode = {
  __typename?: 'NavigationNode';
  id?: Maybe<Scalars['Int']>;
  label: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type NavigationNodeConnection = {
  __typename?: 'NavigationNodeConnection';
  edges?: Maybe<Array<Maybe<NavigationNodeEdge>>>;
  nodes: Array<NavigationNode>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type NavigationNodeEdge = {
  __typename?: 'NavigationNodeEdge';
  cursor: Scalars['String'];
  node: NavigationNode;
};

export type Notification = {
  __typename?: 'Notification';
  event: AbstractNotificationEvent;
  id: Scalars['Int'];
  unread: Scalars['Boolean'];
};

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  edges: Array<NotificationEdge>;
  nodes: Array<Notification>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor: Scalars['String'];
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
  id: Array<Scalars['Int']>;
  unread: Scalars['Boolean'];
};

export type NotificationSetStateResponse = {
  __typename?: 'NotificationSetStateResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type Page = AbstractNavigationChild & AbstractRepository & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Page';
  alias?: Maybe<Scalars['String']>;
  currentRevision?: Maybe<PageRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  navigation?: Maybe<Navigation>;
  revisions: PageRevisionConnection;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type PageEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type PageRevisionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unrevised?: InputMaybe<Scalars['Boolean']>;
};


export type PageThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type PageAddRevisionInput = {
  content: Scalars['String'];
  pageId: Scalars['Int'];
  title: Scalars['String'];
};

export type PageCreateResponse = {
  __typename?: 'PageCreateResponse';
  query: Query;
  record?: Maybe<Page>;
  success: Scalars['Boolean'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
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

export type PageRevision = AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'PageRevision';
  alias?: Maybe<Scalars['String']>;
  author: User;
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  repository: Page;
  threads: ThreadsConnection;
  title: Scalars['String'];
  trashed: Scalars['Boolean'];
};


export type PageRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type PageRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type PageRevisionConnection = {
  __typename?: 'PageRevisionConnection';
  edges: Array<PageRevisionCursor>;
  nodes: Array<PageRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PageRevisionCursor = {
  __typename?: 'PageRevisionCursor';
  cursor: Scalars['String'];
  node: PageRevision;
};

export type Query = {
  __typename?: 'Query';
  activeAuthors: UserConnection;
  activeDonors: UserConnection;
  activeReviewers: UserConnection;
  authorization: Scalars['JSON'];
  events: AbstractNotificationEventConnection;
  license?: Maybe<License>;
  metadata: MetadataQuery;
  notificationEvent?: Maybe<AbstractNotificationEvent>;
  notifications: NotificationConnection;
  subject: SubjectQuery;
  subscription: SubscriptionQuery;
  thread: ThreadQuery;
  user: UserQuery;
  uuid?: Maybe<AbstractUuid>;
};


export type QueryActiveAuthorsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryActiveDonorsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryActiveReviewersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
  objectId?: InputMaybe<Scalars['Int']>;
};


export type QueryLicenseArgs = {
  id: Scalars['Int'];
};


export type QueryNotificationEventArgs = {
  id: Scalars['Int'];
};


export type QueryNotificationsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unread?: InputMaybe<Scalars['Boolean']>;
};


export type QueryUuidArgs = {
  alias?: InputMaybe<AliasInput>;
  id?: InputMaybe<Scalars['Int']>;
};

export type RejectRevisionInput = {
  reason: Scalars['String'];
  revisionId: Scalars['Int'];
};

export type RejectRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RejectRevisionNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  reason: Scalars['String'];
  repository: AbstractRepository;
  revision: AbstractRevision;
};

export type RejectRevisionResponse = {
  __typename?: 'RejectRevisionResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type RemoveEntityLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RemoveEntityLinkNotificationEvent';
  actor: User;
  child: AbstractEntity;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  parent: AbstractEntity;
};

export type RemoveTaxonomyLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RemoveTaxonomyLinkNotificationEvent';
  actor: User;
  child: AbstractUuid;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  parent: TaxonomyTerm;
};

export enum Role {
  Admin = 'admin',
  Architect = 'architect',
  Guest = 'guest',
  Login = 'login',
  Moderator = 'moderator',
  Reviewer = 'reviewer',
  StaticPagesBuilder = 'staticPagesBuilder',
  Sysadmin = 'sysadmin'
}

export type ScopedRole = {
  __typename?: 'ScopedRole';
  role: Role;
  scope?: Maybe<Scalars['String']>;
};

export type ScopedRoleConnection = {
  __typename?: 'ScopedRoleConnection';
  edges: Array<ScopedRoleCursor>;
  nodes: Array<ScopedRole>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ScopedRoleCursor = {
  __typename?: 'ScopedRoleCursor';
  cursor: Scalars['String'];
  node: ScopedRole;
};

export type SetLicenseNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetLicenseNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  repository: AbstractRepository;
};

export type SetTaxonomyParentNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetTaxonomyParentNotificationEvent';
  actor: User;
  child: TaxonomyTerm;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  parent?: Maybe<TaxonomyTerm>;
  previousParent?: Maybe<TaxonomyTerm>;
};

export type SetTaxonomyTermNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetTaxonomyTermNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  taxonomyTerm: TaxonomyTerm;
};

export type SetThreadStateNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetThreadStateNotificationEvent';
  actor: User;
  archived: Scalars['Boolean'];
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  thread: Thread;
};

export type SetUuidStateNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetUuidStateNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  object: AbstractUuid;
  objectId: Scalars['Int'];
  trashed: Scalars['Boolean'];
};

export type Solution = AbstractEntity & AbstractRepository & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Solution';
  alias?: Maybe<Scalars['String']>;
  currentRevision?: Maybe<SolutionRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  exercise: AbstractExercise;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  revisions: SolutionRevisionConnection;
  subject?: Maybe<Subject>;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type SolutionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type SolutionRevisionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unrevised?: InputMaybe<Scalars['Boolean']>;
};


export type SolutionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type SolutionRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'SolutionRevision';
  alias?: Maybe<Scalars['String']>;
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  repository: Solution;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type SolutionRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type SolutionRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type SolutionRevisionConnection = {
  __typename?: 'SolutionRevisionConnection';
  edges: Array<SolutionRevisionCursor>;
  nodes: Array<SolutionRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type SolutionRevisionCursor = {
  __typename?: 'SolutionRevisionCursor';
  cursor: Scalars['String'];
  node: SolutionRevision;
};

export type Subject = {
  __typename?: 'Subject';
  id: Scalars['String'];
  taxonomyTerm: TaxonomyTerm;
  unrevisedEntities: AbstractEntityConnection;
};


export type SubjectUnrevisedEntitiesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type SubjectQuery = {
  __typename?: 'SubjectQuery';
  subject?: Maybe<Subject>;
  subjects: Array<Subject>;
};


export type SubjectQuerySubjectArgs = {
  id: Scalars['String'];
};


export type SubjectQuerySubjectsArgs = {
  instance: Instance;
};

export type SubscriptionConnection = {
  __typename?: 'SubscriptionConnection';
  edges: Array<SubscriptionCursor>;
  nodes: Array<SubscriptionInfo>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type SubscriptionCursor = {
  __typename?: 'SubscriptionCursor';
  cursor: Scalars['String'];
  node: SubscriptionInfo;
};

export type SubscriptionInfo = {
  __typename?: 'SubscriptionInfo';
  object: AbstractUuid;
  sendEmail: Scalars['Boolean'];
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
  currentUserHasSubscribed: Scalars['Boolean'];
  getSubscriptions: SubscriptionConnection;
};


export type SubscriptionQueryCurrentUserHasSubscribedArgs = {
  id: Scalars['Int'];
};


export type SubscriptionQueryGetSubscriptionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type SubscriptionSetInput = {
  id: Array<Scalars['Int']>;
  sendEmail: Scalars['Boolean'];
  subscribe: Scalars['Boolean'];
};

export type SubscriptionSetResponse = {
  __typename?: 'SubscriptionSetResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type TaxonomyTerm = AbstractNavigationChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'TaxonomyTerm';
  alias?: Maybe<Scalars['String']>;
  children: AbstractUuidConnection;
  description?: Maybe<Scalars['String']>;
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  name: Scalars['String'];
  navigation?: Maybe<Navigation>;
  parent?: Maybe<TaxonomyTerm>;
  taxonomyId: Scalars['Int'];
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
  type: TaxonomyTermType;
  weight: Scalars['Int'];
};


export type TaxonomyTermChildrenArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type TaxonomyTermEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type TaxonomyTermThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type TaxonomyTermConnection = {
  __typename?: 'TaxonomyTermConnection';
  edges?: Maybe<Array<Maybe<TaxonomyTermEdge>>>;
  nodes: Array<TaxonomyTerm>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type TaxonomyTermCreateInput = {
  description?: InputMaybe<Scalars['String']>;
  instance?: InputMaybe<Instance>;
  name: Scalars['String'];
  parentId?: InputMaybe<Scalars['Int']>;
};

export type TaxonomyTermCreateResponse = {
  __typename?: 'TaxonomyTermCreateResponse';
  query: Query;
  record?: Maybe<TaxonomyTerm>;
  success: Scalars['Boolean'];
};

export type TaxonomyTermEdge = {
  __typename?: 'TaxonomyTermEdge';
  cursor: Scalars['String'];
  node: TaxonomyTerm;
};

export type TaxonomyTermMoveInput = {
  childrenIds: Array<Scalars['Int']>;
  destination: Scalars['Int'];
};

export type TaxonomyTermMoveResponse = {
  __typename?: 'TaxonomyTermMoveResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type TaxonomyTermMutation = {
  __typename?: 'TaxonomyTermMutation';
  create: TaxonomyTermCreateResponse;
  move: TaxonomyTermMoveResponse;
  setNameAndDescription: TaxonomyTermSetNameAndDescriptionResponse;
};


export type TaxonomyTermMutationCreateArgs = {
  input: TaxonomyTermCreateInput;
};


export type TaxonomyTermMutationMoveArgs = {
  input: TaxonomyTermMoveInput;
};


export type TaxonomyTermMutationSetNameAndDescriptionArgs = {
  input: TaxonomyTermSetNameAndDescriptionInput;
};

export type TaxonomyTermSetNameAndDescriptionInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type TaxonomyTermSetNameAndDescriptionResponse = {
  __typename?: 'TaxonomyTermSetNameAndDescriptionResponse';
  query: Query;
  success: Scalars['Boolean'];
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

export type Thread = {
  __typename?: 'Thread';
  archived: Scalars['Boolean'];
  comments: CommentConnection;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  object: AbstractUuid;
  title?: Maybe<Scalars['String']>;
  trashed: Scalars['Boolean'];
};


export type ThreadCommentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type ThreadAware = {
  threads: ThreadsConnection;
};


export type ThreadAwareThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type ThreadCreateCommentInput = {
  content: Scalars['String'];
  sendEmail: Scalars['Boolean'];
  subscribe: Scalars['Boolean'];
  threadId: Scalars['String'];
};

export type ThreadCreateCommentResponse = {
  __typename?: 'ThreadCreateCommentResponse';
  query: Query;
  record?: Maybe<Comment>;
  success: Scalars['Boolean'];
};

export type ThreadCreateThreadInput = {
  content: Scalars['String'];
  objectId: Scalars['Int'];
  sendEmail: Scalars['Boolean'];
  subscribe: Scalars['Boolean'];
  title: Scalars['String'];
};

export type ThreadCreateThreadResponse = {
  __typename?: 'ThreadCreateThreadResponse';
  query: Query;
  record?: Maybe<Thread>;
  success: Scalars['Boolean'];
};

export type ThreadMutation = {
  __typename?: 'ThreadMutation';
  createComment?: Maybe<ThreadCreateCommentResponse>;
  createThread?: Maybe<ThreadCreateThreadResponse>;
  setCommentState?: Maybe<ThreadSetCommentStateResponse>;
  setThreadArchived?: Maybe<ThreadSetThreadArchivedResponse>;
  setThreadState?: Maybe<ThreadSetThreadStateResponse>;
};


export type ThreadMutationCreateCommentArgs = {
  input: ThreadCreateCommentInput;
};


export type ThreadMutationCreateThreadArgs = {
  input: ThreadCreateThreadInput;
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

export type ThreadQuery = {
  __typename?: 'ThreadQuery';
  allThreads: AllThreadsConnection;
};


export type ThreadQueryAllThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
};

export type ThreadSetCommentStateInput = {
  id: Array<Scalars['Int']>;
  trashed: Scalars['Boolean'];
};

export type ThreadSetCommentStateResponse = {
  __typename?: 'ThreadSetCommentStateResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type ThreadSetThreadArchivedInput = {
  archived: Scalars['Boolean'];
  id: Array<Scalars['String']>;
};

export type ThreadSetThreadArchivedResponse = {
  __typename?: 'ThreadSetThreadArchivedResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type ThreadSetThreadStateInput = {
  id: Array<Scalars['String']>;
  trashed: Scalars['Boolean'];
};

export type ThreadSetThreadStateResponse = {
  __typename?: 'ThreadSetThreadStateResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type ThreadsConnection = {
  __typename?: 'ThreadsConnection';
  edges: Array<ThreadsCursor>;
  nodes: Array<Thread>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ThreadsCursor = {
  __typename?: 'ThreadsCursor';
  cursor: Scalars['String'];
  node: Thread;
};

export type User = AbstractUuid & ThreadAware & {
  __typename?: 'User';
  activityByType: UserActivityByType;
  alias?: Maybe<Scalars['String']>;
  chatUrl?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  events: AbstractNotificationEventConnection;
  eventsByUser: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  imageUrl: Scalars['String'];
  isActiveAuthor: Scalars['Boolean'];
  isActiveDonor: Scalars['Boolean'];
  isActiveReviewer: Scalars['Boolean'];
  isNewAuthor: Scalars['Boolean'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  motivation?: Maybe<Scalars['String']>;
  roles: ScopedRoleConnection;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
  unrevisedEntities: AbstractEntityConnection;
  username: Scalars['String'];
};


export type UserEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type UserEventsByUserArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
  objectId?: InputMaybe<Scalars['Int']>;
};


export type UserRolesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type UserThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};


export type UserUnrevisedEntitiesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type UserActivityByType = {
  __typename?: 'UserActivityByType';
  comments: Scalars['Int'];
  edits: Scalars['Int'];
  reviews: Scalars['Int'];
  taxonomy: Scalars['Int'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  nodes: Array<User>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type UserDeleteBotsInput = {
  botIds: Array<Scalars['Int']>;
};

export type UserDeleteBotsResponse = {
  __typename?: 'UserDeleteBotsResponse';
  success: Scalars['Boolean'];
};

export type UserDeleteRegularUsersInput = {
  userIds: Array<Scalars['Int']>;
};

export type UserDeleteRegularUsersResponse = {
  __typename?: 'UserDeleteRegularUsersResponse';
  reason?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
  username?: Maybe<Scalars['String']>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String'];
  node: User;
};

export type UserMutation = {
  __typename?: 'UserMutation';
  deleteBots: UserDeleteBotsResponse;
  deleteRegularUsers: Array<UserDeleteRegularUsersResponse>;
  setDescription: UserSetDescriptionResponse;
  setEmail: UserSetEmailResponse;
};


export type UserMutationDeleteBotsArgs = {
  input: UserDeleteBotsInput;
};


export type UserMutationDeleteRegularUsersArgs = {
  input: UserDeleteRegularUsersInput;
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
};


export type UserQueryPotentialSpamUsersArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
};

export type UserSetDescriptionInput = {
  description: Scalars['String'];
};

export type UserSetDescriptionResponse = {
  __typename?: 'UserSetDescriptionResponse';
  success: Scalars['Boolean'];
};

export type UserSetEmailInput = {
  email: Scalars['String'];
  userId: Scalars['Int'];
};

export type UserSetEmailResponse = {
  __typename?: 'UserSetEmailResponse';
  email: Scalars['String'];
  success: Scalars['Boolean'];
  username: Scalars['String'];
};

export type UuidMutation = {
  __typename?: 'UuidMutation';
  setState?: Maybe<UuidSetStateResponse>;
};


export type UuidMutationSetStateArgs = {
  input: UuidSetStateInput;
};

export type UuidSetStateInput = {
  id: Array<Scalars['Int']>;
  trashed: Scalars['Boolean'];
};

export type UuidSetStateResponse = {
  __typename?: 'UuidSetStateResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type Video = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Video';
  alias?: Maybe<Scalars['String']>;
  currentRevision?: Maybe<VideoRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  revisions: VideoRevisionConnection;
  subject?: Maybe<Subject>;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  trashed: Scalars['Boolean'];
};


export type VideoEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type VideoRevisionsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  unrevised?: InputMaybe<Scalars['Boolean']>;
};


export type VideoTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type VideoThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type VideoRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'VideoRevision';
  alias?: Maybe<Scalars['String']>;
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  repository: Video;
  threads: ThreadsConnection;
  title: Scalars['String'];
  trashed: Scalars['Boolean'];
  url: Scalars['String'];
};


export type VideoRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']>;
};


export type VideoRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  trashed?: InputMaybe<Scalars['Boolean']>;
};

export type VideoRevisionConnection = {
  __typename?: 'VideoRevisionConnection';
  edges: Array<VideoRevisionCursor>;
  nodes: Array<VideoRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type VideoRevisionCursor = {
  __typename?: 'VideoRevisionCursor';
  cursor: Scalars['String'];
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
