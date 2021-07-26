export type Maybe<T> = T | null;
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
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  license: License;
};


export type AbstractEntityEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type AbstractEntityRevision = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  events: AbstractNotificationEventConnection;
  author: User;
  date: Scalars['DateTime'];
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type AbstractEntityRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type AbstractExercise = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  date: Scalars['DateTime'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  license: License;
  currentRevision?: Maybe<AbstractExerciseRevision>;
  events: AbstractNotificationEventConnection;
  solution?: Maybe<Solution>;
};


export type AbstractExerciseEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type AbstractExerciseRevision = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  author: User;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type AbstractExerciseRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type AbstractNavigationChild = {
  navigation?: Maybe<Navigation>;
};

export type AbstractNotificationEvent = {
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
};

export type AbstractNotificationEventConnection = {
  __typename?: 'AbstractNotificationEventConnection';
  edges: Array<AbstractNotificationEventEdge>;
  nodes: Array<AbstractNotificationEvent>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type AbstractNotificationEventEdge = {
  __typename?: 'AbstractNotificationEventEdge';
  cursor: Scalars['String'];
  node: AbstractNotificationEvent;
};

export type AbstractRepository = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  events: AbstractNotificationEventConnection;
  threads: ThreadsConnection;
  date: Scalars['DateTime'];
  instance: Instance;
  license: License;
};


export type AbstractRepositoryEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type AbstractRepositoryThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};

export type AbstractRevision = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  events: AbstractNotificationEventConnection;
  threads: ThreadsConnection;
  author: User;
  date: Scalars['DateTime'];
  content: Scalars['String'];
};


export type AbstractRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type AbstractRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};

export type AbstractTaxonomyTermChild = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  instance: Instance;
  license: License;
  taxonomyTerms: TaxonomyTermConnection;
};


export type AbstractTaxonomyTermChildEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type AbstractTaxonomyTermChildTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type AbstractUuid = {
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  events: AbstractNotificationEventConnection;
};


export type AbstractUuidEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
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

export type AliasInput = {
  instance: Instance;
  path: Scalars['String'];
};

export type Applet = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & InstanceAware & ThreadAware & {
  __typename?: 'Applet';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  events: AbstractNotificationEventConnection;
  threads: ThreadsConnection;
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<AppletRevision>;
  revisions: AppletRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
};


export type AppletEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type AppletThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type AppletRevisionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unrevised?: Maybe<Scalars['Boolean']>;
};


export type AppletTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type AppletRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & ThreadAware & {
  __typename?: 'AppletRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  events: AbstractNotificationEventConnection;
  threads: ThreadsConnection;
  date: Scalars['DateTime'];
  repository: Applet;
  url: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};


export type AppletRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type AppletRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};

export type AppletRevisionConnection = {
  __typename?: 'AppletRevisionConnection';
  edges: Array<AppletRevisionCursor>;
  nodes: Array<AppletRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type AppletRevisionCursor = {
  __typename?: 'AppletRevisionCursor';
  cursor: Scalars['String'];
  node: AppletRevision;
};

export type Article = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & InstanceAware & ThreadAware & {
  __typename?: 'Article';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<ArticleRevision>;
  revisions: ArticleRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
};


export type ArticleThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type ArticleEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type ArticleRevisionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unrevised?: Maybe<Scalars['Boolean']>;
};


export type ArticleTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type ArticleRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & ThreadAware & {
  __typename?: 'ArticleRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  repository: Article;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};


export type ArticleRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type ArticleRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type ArticleRevisionConnection = {
  __typename?: 'ArticleRevisionConnection';
  edges: Array<ArticleRevisionCursor>;
  nodes: Array<ArticleRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type ArticleRevisionCursor = {
  __typename?: 'ArticleRevisionCursor';
  cursor: Scalars['String'];
  node: ArticleRevision;
};

export type CacheFillEventsResponse = {
  __typename?: 'CacheFillEventsResponse';
  success: Scalars['Boolean'];
  query: Query;
};

export type CacheRemoveInput = {
  key: Scalars['String'];
};

export type CacheRemoveResponse = {
  __typename?: 'CacheRemoveResponse';
  success: Scalars['Boolean'];
  query: Query;
};

export type CacheSetInput = {
  key: Scalars['String'];
  value: Scalars['JSON'];
};

export type CacheSetResponse = {
  __typename?: 'CacheSetResponse';
  success: Scalars['Boolean'];
  query: Query;
};

export type CacheUpdateInput = {
  keys: Array<Scalars['String']>;
};

export type CacheUpdateResponse = {
  __typename?: 'CacheUpdateResponse';
  success: Scalars['Boolean'];
};

export type CheckoutRevisionInput = {
  revisionId: Scalars['Int'];
  reason: Scalars['String'];
};

export type CheckoutRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CheckoutRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  repository: AbstractRepository;
  revision: AbstractRevision;
  reason: Scalars['String'];
};

export type CheckoutRevisionResponse = {
  __typename?: 'CheckoutRevisionResponse';
  success: Scalars['Boolean'];
  query: Query;
};

export type Comment = AbstractUuid & {
  __typename?: 'Comment';
  id: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  alias: Scalars['String'];
  events: AbstractNotificationEventConnection;
  trashed: Scalars['Boolean'];
  archived: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  author: User;
  legacyObject: AbstractUuid;
};


export type CommentEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  edges: Array<CommentEdge>;
  nodes: Array<Comment>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type CommentEdge = {
  __typename?: 'CommentEdge';
  cursor: Scalars['String'];
  node: Comment;
};

export type Course = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & InstanceAware & ThreadAware & {
  __typename?: 'Course';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<CourseRevision>;
  revisions: CourseRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  pages: Array<CoursePage>;
};


export type CourseThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type CourseEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type CourseRevisionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unrevised?: Maybe<Scalars['Boolean']>;
};


export type CourseTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type CoursePagesArgs = {
  trashed?: Maybe<Scalars['Boolean']>;
  hasCurrentRevision?: Maybe<Scalars['Boolean']>;
};

export type CoursePage = AbstractUuid & AbstractRepository & AbstractEntity & InstanceAware & ThreadAware & {
  __typename?: 'CoursePage';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<CoursePageRevision>;
  revisions: CoursePageRevisionConnection;
  course: Course;
};


export type CoursePageThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type CoursePageEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type CoursePageRevisionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unrevised?: Maybe<Scalars['Boolean']>;
};

export type CoursePageRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & ThreadAware & {
  __typename?: 'CoursePageRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  repository: CoursePage;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type CoursePageRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type CoursePageRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type CoursePageRevisionConnection = {
  __typename?: 'CoursePageRevisionConnection';
  edges: Array<CoursePageRevisionCursor>;
  nodes: Array<CoursePageRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type CoursePageRevisionCursor = {
  __typename?: 'CoursePageRevisionCursor';
  cursor: Scalars['String'];
  node: CoursePageRevision;
};

export type CourseRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & ThreadAware & {
  __typename?: 'CourseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  repository: Course;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaDescription: Scalars['String'];
};


export type CourseRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type CourseRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type CourseRevisionConnection = {
  __typename?: 'CourseRevisionConnection';
  edges: Array<CourseRevisionCursor>;
  nodes: Array<CourseRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type CourseRevisionCursor = {
  __typename?: 'CourseRevisionCursor';
  cursor: Scalars['String'];
  node: CourseRevision;
};

export type CreateCommentNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateCommentNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  thread: Thread;
  comment: Comment;
};

export type CreateEntityLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  parent: AbstractEntity;
  child: AbstractEntity;
};

export type CreateEntityNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  entity: AbstractEntity;
};

export type CreateEntityRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  entity: AbstractEntity;
  entityRevision: AbstractEntityRevision;
};

export type CreateTaxonomyLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateTaxonomyLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  parent: TaxonomyTerm;
  child: AbstractUuid;
};

export type CreateTaxonomyTermNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateTaxonomyTermNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  taxonomyTerm: TaxonomyTerm;
};

export type CreateThreadNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateThreadNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  object: AbstractUuid;
  thread: Thread;
};


export type EntityMutation = {
  __typename?: 'EntityMutation';
  checkoutRevision: CheckoutRevisionResponse;
  rejectRevision: RejectRevisionResponse;
};


export type EntityMutationCheckoutRevisionArgs = {
  input: CheckoutRevisionInput;
};


export type EntityMutationRejectRevisionArgs = {
  input: RejectRevisionInput;
};

export type Event = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & InstanceAware & ThreadAware & {
  __typename?: 'Event';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<EventRevision>;
  revisions: EventRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
};


export type EventThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type EventEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type EventRevisionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unrevised?: Maybe<Scalars['Boolean']>;
};


export type EventTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type EventRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & ThreadAware & {
  __typename?: 'EventRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  repository: Event;
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
  metaTitle: Scalars['String'];
  metaDescription: Scalars['String'];
};


export type EventRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type EventRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type EventRevisionConnection = {
  __typename?: 'EventRevisionConnection';
  edges: Array<EventRevisionCursor>;
  nodes: Array<EventRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type EventRevisionCursor = {
  __typename?: 'EventRevisionCursor';
  cursor: Scalars['String'];
  node: EventRevision;
};

export type Exercise = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & AbstractExercise & InstanceAware & ThreadAware & {
  __typename?: 'Exercise';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<ExerciseRevision>;
  revisions: ExerciseRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  solution?: Maybe<Solution>;
};


export type ExerciseThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type ExerciseEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type ExerciseRevisionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unrevised?: Maybe<Scalars['Boolean']>;
};


export type ExerciseTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type ExerciseGroup = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & InstanceAware & ThreadAware & {
  __typename?: 'ExerciseGroup';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<ExerciseGroupRevision>;
  revisions: ExerciseGroupRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  exercises: Array<GroupedExercise>;
};


export type ExerciseGroupThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type ExerciseGroupEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type ExerciseGroupRevisionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unrevised?: Maybe<Scalars['Boolean']>;
};


export type ExerciseGroupTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type ExerciseGroupRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & ThreadAware & {
  __typename?: 'ExerciseGroupRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  repository: ExerciseGroup;
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type ExerciseGroupRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type ExerciseGroupRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type ExerciseGroupRevisionConnection = {
  __typename?: 'ExerciseGroupRevisionConnection';
  edges: Array<ExerciseGroupRevisionCursor>;
  nodes: Array<ExerciseGroupRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type ExerciseGroupRevisionCursor = {
  __typename?: 'ExerciseGroupRevisionCursor';
  cursor: Scalars['String'];
  node: ExerciseGroupRevision;
};

export type ExerciseRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & AbstractExerciseRevision & ThreadAware & {
  __typename?: 'ExerciseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  repository: Exercise;
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type ExerciseRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type ExerciseRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type ExerciseRevisionConnection = {
  __typename?: 'ExerciseRevisionConnection';
  edges: Array<ExerciseRevisionCursor>;
  nodes: Array<ExerciseRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type ExerciseRevisionCursor = {
  __typename?: 'ExerciseRevisionCursor';
  cursor: Scalars['String'];
  node: ExerciseRevision;
};

export type GroupedExercise = AbstractUuid & AbstractRepository & AbstractEntity & AbstractExercise & InstanceAware & ThreadAware & {
  __typename?: 'GroupedExercise';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<GroupedExerciseRevision>;
  revisions: GroupedExerciseRevisionConnection;
  solution?: Maybe<Solution>;
  exerciseGroup: ExerciseGroup;
};


export type GroupedExerciseThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type GroupedExerciseEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type GroupedExerciseRevisionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unrevised?: Maybe<Scalars['Boolean']>;
};

export type GroupedExerciseRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & AbstractExerciseRevision & ThreadAware & {
  __typename?: 'GroupedExerciseRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  repository: GroupedExercise;
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type GroupedExerciseRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type GroupedExerciseRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type GroupedExerciseRevisionConnection = {
  __typename?: 'GroupedExerciseRevisionConnection';
  edges: Array<GroupedExerciseRevisionCursor>;
  nodes: Array<GroupedExerciseRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type GroupedExerciseRevisionCursor = {
  __typename?: 'GroupedExerciseRevisionCursor';
  cursor: Scalars['String'];
  node: GroupedExerciseRevision;
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
  id: Scalars['Int'];
  instance: Instance;
  default: Scalars['Boolean'];
  title: Scalars['String'];
  url: Scalars['String'];
  content: Scalars['String'];
  agreement: Scalars['String'];
  iconHref: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _cache: _CacheMutation;
  entity: EntityMutation;
  notification: NotificationMutation;
  subscription: SubscriptionMutation;
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
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type NavigationNode = {
  __typename?: 'NavigationNode';
  label: Scalars['String'];
  url?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
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

export type Notification = {
  __typename?: 'Notification';
  id: Scalars['Int'];
  unread: Scalars['Boolean'];
  event: AbstractNotificationEvent;
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
  success: Scalars['Boolean'];
  query: Query;
};

export type Page = AbstractUuid & AbstractRepository & AbstractNavigationChild & InstanceAware & ThreadAware & {
  __typename?: 'Page';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  license: License;
  currentRevision?: Maybe<PageRevision>;
  revisions: PageRevisionConnection;
  navigation?: Maybe<Navigation>;
};


export type PageThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type PageEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type PageRevisionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unrevised?: Maybe<Scalars['Boolean']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
  endCursor?: Maybe<Scalars['String']>;
};

export type PageRevision = AbstractUuid & AbstractRevision & ThreadAware & {
  __typename?: 'PageRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  title: Scalars['String'];
  content: Scalars['String'];
  repository: Page;
};


export type PageRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type PageRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type PageRevisionConnection = {
  __typename?: 'PageRevisionConnection';
  edges: Array<PageRevisionCursor>;
  nodes: Array<PageRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
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
  notificationEvent?: Maybe<AbstractNotificationEvent>;
  notifications: NotificationConnection;
  subscription: SubscriptionQuery;
  uuid?: Maybe<AbstractUuid>;
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


export type QueryEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  actorId?: Maybe<Scalars['Int']>;
  objectId?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
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

export type RejectRevisionInput = {
  revisionId: Scalars['Int'];
  reason: Scalars['String'];
};

export type RejectRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RejectRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  repository: AbstractRepository;
  revision: AbstractRevision;
  reason: Scalars['String'];
};

export type RejectRevisionResponse = {
  __typename?: 'RejectRevisionResponse';
  success: Scalars['Boolean'];
  query: Query;
};

export type RemoveEntityLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RemoveEntityLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  parent: AbstractEntity;
  child: AbstractEntity;
};

export type RemoveTaxonomyLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RemoveTaxonomyLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  parent: TaxonomyTerm;
  child: AbstractUuid;
};

export enum Role {
  Guest = 'guest',
  Login = 'login',
  Sysadmin = 'sysadmin',
  Moderator = 'moderator',
  Reviewer = 'reviewer',
  Architect = 'architect',
  StaticPagesBuilder = 'staticPagesBuilder',
  Admin = 'admin'
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
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type ScopedRoleCursor = {
  __typename?: 'ScopedRoleCursor';
  cursor: Scalars['String'];
  node: ScopedRole;
};

export type SetLicenseNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetLicenseNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  repository: AbstractRepository;
};

export type SetTaxonomyParentNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetTaxonomyParentNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  previousParent?: Maybe<TaxonomyTerm>;
  parent?: Maybe<TaxonomyTerm>;
  child: TaxonomyTerm;
};

export type SetTaxonomyTermNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetTaxonomyTermNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  taxonomyTerm: TaxonomyTerm;
};

export type SetThreadStateNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetThreadStateNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  thread: Thread;
  archived: Scalars['Boolean'];
};

export type SetUuidStateNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetUuidStateNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  object: AbstractUuid;
  trashed: Scalars['Boolean'];
};

export type Solution = AbstractUuid & AbstractRepository & AbstractEntity & InstanceAware & ThreadAware & {
  __typename?: 'Solution';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<SolutionRevision>;
  revisions: SolutionRevisionConnection;
  exercise: AbstractExercise;
};


export type SolutionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type SolutionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type SolutionRevisionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unrevised?: Maybe<Scalars['Boolean']>;
};

export type SolutionRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & ThreadAware & {
  __typename?: 'SolutionRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  repository: Solution;
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type SolutionRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type SolutionRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type SolutionRevisionConnection = {
  __typename?: 'SolutionRevisionConnection';
  edges: Array<SolutionRevisionCursor>;
  nodes: Array<SolutionRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type SolutionRevisionCursor = {
  __typename?: 'SolutionRevisionCursor';
  cursor: Scalars['String'];
  node: SolutionRevision;
};

export type SubscriptionConnection = {
  __typename?: 'SubscriptionConnection';
  edges: Array<SubscriptionCursor>;
  nodes: Array<SubscriptionInfo>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
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
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type SubscriptionSetInput = {
  id: Array<Scalars['Int']>;
  subscribe: Scalars['Boolean'];
  sendEmail: Scalars['Boolean'];
};

export type SubscriptionSetResponse = {
  __typename?: 'SubscriptionSetResponse';
  success: Scalars['Boolean'];
  query: Query;
};

export type TaxonomyTerm = AbstractUuid & AbstractNavigationChild & InstanceAware & ThreadAware & {
  __typename?: 'TaxonomyTerm';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
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


export type TaxonomyTermThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type TaxonomyTermEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type TaxonomyTermChildrenArgs = {
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
  id: Scalars['String'];
  createdAt: Scalars['DateTime'];
  title?: Maybe<Scalars['String']>;
  archived: Scalars['Boolean'];
  trashed: Scalars['Boolean'];
  object: AbstractUuid;
  comments: CommentConnection;
};


export type ThreadCommentsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type ThreadAware = {
  threads: ThreadsConnection;
};


export type ThreadAwareThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};

export type ThreadCreateCommentInput = {
  content: Scalars['String'];
  threadId: Scalars['String'];
  subscribe: Scalars['Boolean'];
  sendEmail: Scalars['Boolean'];
};

export type ThreadCreateCommentResponse = {
  __typename?: 'ThreadCreateCommentResponse';
  record?: Maybe<Comment>;
  success: Scalars['Boolean'];
  query: Query;
};

export type ThreadCreateThreadInput = {
  title: Scalars['String'];
  content: Scalars['String'];
  objectId: Scalars['Int'];
  subscribe: Scalars['Boolean'];
  sendEmail: Scalars['Boolean'];
};

export type ThreadCreateThreadResponse = {
  __typename?: 'ThreadCreateThreadResponse';
  record?: Maybe<Thread>;
  success: Scalars['Boolean'];
  query: Query;
};

export type ThreadMutation = {
  __typename?: 'ThreadMutation';
  createThread?: Maybe<ThreadCreateThreadResponse>;
  createComment?: Maybe<ThreadCreateCommentResponse>;
  setThreadArchived?: Maybe<ThreadSetThreadArchivedResponse>;
  setThreadState?: Maybe<ThreadSetThreadStateResponse>;
  setCommentState?: Maybe<ThreadSetCommentStateResponse>;
};


export type ThreadMutationCreateThreadArgs = {
  input: ThreadCreateThreadInput;
};


export type ThreadMutationCreateCommentArgs = {
  input: ThreadCreateCommentInput;
};


export type ThreadMutationSetThreadArchivedArgs = {
  input: ThreadSetThreadArchivedInput;
};


export type ThreadMutationSetThreadStateArgs = {
  input: ThreadSetThreadStateInput;
};


export type ThreadMutationSetCommentStateArgs = {
  input: ThreadSetCommentStateInput;
};

export type ThreadSetCommentStateInput = {
  id: Array<Scalars['Int']>;
  trashed: Scalars['Boolean'];
};

export type ThreadSetCommentStateResponse = {
  __typename?: 'ThreadSetCommentStateResponse';
  success: Scalars['Boolean'];
  query: Query;
};

export type ThreadSetThreadArchivedInput = {
  id: Array<Scalars['String']>;
  archived: Scalars['Boolean'];
};

export type ThreadSetThreadArchivedResponse = {
  __typename?: 'ThreadSetThreadArchivedResponse';
  success: Scalars['Boolean'];
  query: Query;
};

export type ThreadSetThreadStateInput = {
  id: Array<Scalars['String']>;
  trashed: Scalars['Boolean'];
};

export type ThreadSetThreadStateResponse = {
  __typename?: 'ThreadSetThreadStateResponse';
  success: Scalars['Boolean'];
  query: Query;
};

export type ThreadsConnection = {
  __typename?: 'ThreadsConnection';
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

export type User = AbstractUuid & ThreadAware & {
  __typename?: 'User';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  eventsByUser: AbstractNotificationEventConnection;
  activityByType: UserActivityByType;
  alias?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  imageUrl: Scalars['String'];
  date: Scalars['DateTime'];
  chatUrl?: Maybe<Scalars['String']>;
  lastLogin?: Maybe<Scalars['DateTime']>;
  roles: ScopedRoleConnection;
  description?: Maybe<Scalars['String']>;
  motivation?: Maybe<Scalars['String']>;
  activeAuthor: Scalars['Boolean'];
  activeDonor: Scalars['Boolean'];
  activeReviewer: Scalars['Boolean'];
};


export type UserThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type UserEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type UserEventsByUserArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  objectId?: Maybe<Scalars['Int']>;
};


export type UserRolesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type UserActivityByType = {
  __typename?: 'UserActivityByType';
  edits: Scalars['Int'];
  comments: Scalars['Int'];
  reviews: Scalars['Int'];
  taxonomy: Scalars['Int'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  nodes: Array<User>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type UserDeleteBotsInput = {
  botIds: Array<Scalars['Int']>;
};

export type UserDeleteBotsResponse = {
  __typename?: 'UserDeleteBotsResponse';
  success: Scalars['Boolean'];
  username: Scalars['String'];
  reason?: Maybe<Scalars['String']>;
};

export type UserDeleteRegularUsersInput = {
  userIds: Array<Scalars['Int']>;
};

export type UserDeleteRegularUsersResponse = {
  __typename?: 'UserDeleteRegularUsersResponse';
  success: Scalars['Boolean'];
  username?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String'];
  node: User;
};

export type UserMutation = {
  __typename?: 'UserMutation';
  deleteBots: Array<UserDeleteBotsResponse>;
  deleteRegularUsers: Array<UserDeleteRegularUsersResponse>;
  setEmail: UserSetEmailResponse;
};


export type UserMutationDeleteBotsArgs = {
  input: UserDeleteBotsInput;
};


export type UserMutationDeleteRegularUsersArgs = {
  input: UserDeleteRegularUsersInput;
};


export type UserMutationSetEmailArgs = {
  input: UserSetEmailInput;
};

export type UserSetEmailInput = {
  userId: Scalars['Int'];
  email: Scalars['String'];
};

export type UserSetEmailResponse = {
  __typename?: 'UserSetEmailResponse';
  success: Scalars['Boolean'];
  username: Scalars['String'];
  email: Scalars['String'];
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
  success: Scalars['Boolean'];
  query: Query;
};

export type Video = AbstractUuid & AbstractRepository & AbstractEntity & AbstractTaxonomyTermChild & InstanceAware & ThreadAware & {
  __typename?: 'Video';
  id: Scalars['Int'];
  trashed: Scalars['Boolean'];
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  instance: Instance;
  alias?: Maybe<Scalars['String']>;
  date: Scalars['DateTime'];
  license: License;
  currentRevision?: Maybe<VideoRevision>;
  revisions: VideoRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
};


export type VideoThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type VideoEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};


export type VideoRevisionsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  unrevised?: Maybe<Scalars['Boolean']>;
};


export type VideoTaxonomyTermsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type VideoRevision = AbstractUuid & AbstractRevision & AbstractEntityRevision & ThreadAware & {
  __typename?: 'VideoRevision';
  id: Scalars['Int'];
  author: User;
  trashed: Scalars['Boolean'];
  alias?: Maybe<Scalars['String']>;
  threads: ThreadsConnection;
  events: AbstractNotificationEventConnection;
  date: Scalars['DateTime'];
  repository: Video;
  url: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  changes: Scalars['String'];
};


export type VideoRevisionThreadsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  archived?: Maybe<Scalars['Boolean']>;
  trashed?: Maybe<Scalars['Boolean']>;
};


export type VideoRevisionEventsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  instance?: Maybe<Instance>;
  actorId?: Maybe<Scalars['Int']>;
};

export type VideoRevisionConnection = {
  __typename?: 'VideoRevisionConnection';
  edges: Array<VideoRevisionCursor>;
  nodes: Array<VideoRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type VideoRevisionCursor = {
  __typename?: 'VideoRevisionCursor';
  cursor: Scalars['String'];
  node: VideoRevision;
};

export type _CacheMutation = {
  __typename?: '_cacheMutation';
  set: CacheSetResponse;
  remove: CacheRemoveResponse;
  update: CacheUpdateResponse;
  fillEventsCache: CacheFillEventsResponse;
};


export type _CacheMutationSetArgs = {
  input: CacheSetInput;
};


export type _CacheMutationRemoveArgs = {
  input: CacheRemoveInput;
};


export type _CacheMutationUpdateArgs = {
  input: CacheUpdateInput;
};
