import type { ModelOf } from '~/internals/model'
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { Context } from '~/internals/graphql/context';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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
  currentRevision?: Maybe<ExerciseRevision | GroupedExerciseRevision>;
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
  nodes: Array<CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type AbstractNotificationEventEdge = {
  __typename?: 'AbstractNotificationEventEdge';
  cursor: Scalars['String'];
  node: CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent;
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
  nodes: Array<Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision>;
  totalCount: Scalars['Int'];
  pageInfo: PageInfo;
};

export type AbstractUuidCursor = {
  __typename?: 'AbstractUuidCursor';
  cursor: Scalars['String'];
  node: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  query: Query;
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
  repository: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Page | Solution | Video;
  revision: AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | GroupedExerciseRevision | PageRevision | SolutionRevision | VideoRevision;
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
  legacyObject: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  parent: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
  child: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
};

export type CreateEntityNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  entity: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
};

export type CreateEntityRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityRevisionNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  entity: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
  entityRevision: AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | GroupedExerciseRevision | SolutionRevision | VideoRevision;
};

export type CreateTaxonomyLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateTaxonomyLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  parent: TaxonomyTerm;
  child: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  event: CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent;
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
  notificationEvent?: Maybe<CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent>;
  notifications: NotificationConnection;
  subscription: SubscriptionQuery;
  uuid?: Maybe<Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision>;
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
  repository: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Page | Solution | Video;
  revision: AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | GroupedExerciseRevision | PageRevision | SolutionRevision | VideoRevision;
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
  parent: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
  child: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
};

export type RemoveTaxonomyLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RemoveTaxonomyLinkNotificationEvent';
  id: Scalars['Int'];
  instance: Instance;
  date: Scalars['DateTime'];
  actor: User;
  objectId: Scalars['Int'];
  parent: TaxonomyTerm;
  child: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  repository: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Page | Solution | Video;
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
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  revisions?: Maybe<SolutionRevisionConnection>;
  exercise: Exercise | GroupedExercise;
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
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  alias?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  date: Scalars['DateTime'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  roles: ScopedRoleConnection;
  description?: Maybe<Scalars['String']>;
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AbstractEntity: ResolversTypes['Applet'] | ResolversTypes['Article'] | ResolversTypes['Course'] | ResolversTypes['CoursePage'] | ResolversTypes['Event'] | ResolversTypes['Exercise'] | ResolversTypes['ExerciseGroup'] | ResolversTypes['GroupedExercise'] | ResolversTypes['Solution'] | ResolversTypes['Video'];
  Int: ResolverTypeWrapper<ModelOf<Scalars['Int']>>;
  Boolean: ResolverTypeWrapper<ModelOf<Scalars['Boolean']>>;
  String: ResolverTypeWrapper<ModelOf<Scalars['String']>>;
  AbstractEntityRevision: ResolversTypes['AppletRevision'] | ResolversTypes['ArticleRevision'] | ResolversTypes['CoursePageRevision'] | ResolversTypes['CourseRevision'] | ResolversTypes['EventRevision'] | ResolversTypes['ExerciseGroupRevision'] | ResolversTypes['ExerciseRevision'] | ResolversTypes['GroupedExerciseRevision'] | ResolversTypes['SolutionRevision'] | ResolversTypes['VideoRevision'];
  AbstractExercise: ResolversTypes['Exercise'] | ResolversTypes['GroupedExercise'];
  AbstractExerciseRevision: ResolversTypes['ExerciseRevision'] | ResolversTypes['GroupedExerciseRevision'];
  AbstractNavigationChild: ResolversTypes['Page'] | ResolversTypes['TaxonomyTerm'];
  AbstractNotificationEvent: ResolversTypes['CheckoutRevisionNotificationEvent'] | ResolversTypes['CreateCommentNotificationEvent'] | ResolversTypes['CreateEntityLinkNotificationEvent'] | ResolversTypes['CreateEntityNotificationEvent'] | ResolversTypes['CreateEntityRevisionNotificationEvent'] | ResolversTypes['CreateTaxonomyLinkNotificationEvent'] | ResolversTypes['CreateTaxonomyTermNotificationEvent'] | ResolversTypes['CreateThreadNotificationEvent'] | ResolversTypes['RejectRevisionNotificationEvent'] | ResolversTypes['RemoveEntityLinkNotificationEvent'] | ResolversTypes['RemoveTaxonomyLinkNotificationEvent'] | ResolversTypes['SetLicenseNotificationEvent'] | ResolversTypes['SetTaxonomyParentNotificationEvent'] | ResolversTypes['SetTaxonomyTermNotificationEvent'] | ResolversTypes['SetThreadStateNotificationEvent'] | ResolversTypes['SetUuidStateNotificationEvent'];
  AbstractNotificationEventConnection: ResolverTypeWrapper<ModelOf<AbstractNotificationEventConnection>>;
  AbstractNotificationEventEdge: ResolverTypeWrapper<ModelOf<AbstractNotificationEventEdge>>;
  AbstractRepository: ResolversTypes['Applet'] | ResolversTypes['Article'] | ResolversTypes['Course'] | ResolversTypes['CoursePage'] | ResolversTypes['Event'] | ResolversTypes['Exercise'] | ResolversTypes['ExerciseGroup'] | ResolversTypes['GroupedExercise'] | ResolversTypes['Page'] | ResolversTypes['Solution'] | ResolversTypes['Video'];
  AbstractRevision: ResolversTypes['AppletRevision'] | ResolversTypes['ArticleRevision'] | ResolversTypes['CoursePageRevision'] | ResolversTypes['CourseRevision'] | ResolversTypes['EventRevision'] | ResolversTypes['ExerciseGroupRevision'] | ResolversTypes['ExerciseRevision'] | ResolversTypes['GroupedExerciseRevision'] | ResolversTypes['PageRevision'] | ResolversTypes['SolutionRevision'] | ResolversTypes['VideoRevision'];
  AbstractTaxonomyTermChild: ResolversTypes['Applet'] | ResolversTypes['Article'] | ResolversTypes['Course'] | ResolversTypes['Event'] | ResolversTypes['Exercise'] | ResolversTypes['ExerciseGroup'] | ResolversTypes['Video'];
  AbstractUuid: ResolversTypes['Applet'] | ResolversTypes['AppletRevision'] | ResolversTypes['Article'] | ResolversTypes['ArticleRevision'] | ResolversTypes['Comment'] | ResolversTypes['Course'] | ResolversTypes['CoursePage'] | ResolversTypes['CoursePageRevision'] | ResolversTypes['CourseRevision'] | ResolversTypes['Event'] | ResolversTypes['EventRevision'] | ResolversTypes['Exercise'] | ResolversTypes['ExerciseGroup'] | ResolversTypes['ExerciseGroupRevision'] | ResolversTypes['ExerciseRevision'] | ResolversTypes['GroupedExercise'] | ResolversTypes['GroupedExerciseRevision'] | ResolversTypes['Page'] | ResolversTypes['PageRevision'] | ResolversTypes['Solution'] | ResolversTypes['SolutionRevision'] | ResolversTypes['TaxonomyTerm'] | ResolversTypes['User'] | ResolversTypes['Video'] | ResolversTypes['VideoRevision'];
  AbstractUuidConnection: ResolverTypeWrapper<ModelOf<AbstractUuidConnection>>;
  AbstractUuidCursor: ResolverTypeWrapper<ModelOf<AbstractUuidCursor>>;
  AliasInput: ResolverTypeWrapper<ModelOf<AliasInput>>;
  Applet: ResolverTypeWrapper<ModelOf<Applet>>;
  AppletRevision: ResolverTypeWrapper<ModelOf<AppletRevision>>;
  AppletRevisionConnection: ResolverTypeWrapper<ModelOf<AppletRevisionConnection>>;
  AppletRevisionCursor: ResolverTypeWrapper<ModelOf<AppletRevisionCursor>>;
  Article: ResolverTypeWrapper<ModelOf<Article>>;
  ArticleRevision: ResolverTypeWrapper<ModelOf<ArticleRevision>>;
  ArticleRevisionConnection: ResolverTypeWrapper<ModelOf<ArticleRevisionConnection>>;
  ArticleRevisionCursor: ResolverTypeWrapper<ModelOf<ArticleRevisionCursor>>;
  CacheRemoveInput: ResolverTypeWrapper<ModelOf<CacheRemoveInput>>;
  CacheRemoveResponse: ResolverTypeWrapper<ModelOf<CacheRemoveResponse>>;
  CacheSetInput: ResolverTypeWrapper<ModelOf<CacheSetInput>>;
  CacheSetResponse: ResolverTypeWrapper<ModelOf<CacheSetResponse>>;
  CacheUpdateInput: ResolverTypeWrapper<ModelOf<CacheUpdateInput>>;
  CacheUpdateResponse: ResolverTypeWrapper<ModelOf<CacheUpdateResponse>>;
  CheckoutRevisionInput: ResolverTypeWrapper<ModelOf<CheckoutRevisionInput>>;
  CheckoutRevisionNotificationEvent: ResolverTypeWrapper<ModelOf<CheckoutRevisionNotificationEvent>>;
  CheckoutRevisionResponse: ResolverTypeWrapper<ModelOf<CheckoutRevisionResponse>>;
  Comment: ResolverTypeWrapper<ModelOf<Comment>>;
  CommentConnection: ResolverTypeWrapper<ModelOf<CommentConnection>>;
  CommentEdge: ResolverTypeWrapper<ModelOf<CommentEdge>>;
  Course: ResolverTypeWrapper<ModelOf<Course>>;
  CoursePage: ResolverTypeWrapper<ModelOf<CoursePage>>;
  CoursePageRevision: ResolverTypeWrapper<ModelOf<CoursePageRevision>>;
  CoursePageRevisionConnection: ResolverTypeWrapper<ModelOf<CoursePageRevisionConnection>>;
  CoursePageRevisionCursor: ResolverTypeWrapper<ModelOf<CoursePageRevisionCursor>>;
  CourseRevision: ResolverTypeWrapper<ModelOf<CourseRevision>>;
  CourseRevisionConnection: ResolverTypeWrapper<ModelOf<CourseRevisionConnection>>;
  CourseRevisionCursor: ResolverTypeWrapper<ModelOf<CourseRevisionCursor>>;
  CreateCommentNotificationEvent: ResolverTypeWrapper<ModelOf<CreateCommentNotificationEvent>>;
  CreateEntityLinkNotificationEvent: ResolverTypeWrapper<ModelOf<CreateEntityLinkNotificationEvent>>;
  CreateEntityNotificationEvent: ResolverTypeWrapper<ModelOf<CreateEntityNotificationEvent>>;
  CreateEntityRevisionNotificationEvent: ResolverTypeWrapper<ModelOf<CreateEntityRevisionNotificationEvent>>;
  CreateTaxonomyLinkNotificationEvent: ResolverTypeWrapper<ModelOf<CreateTaxonomyLinkNotificationEvent>>;
  CreateTaxonomyTermNotificationEvent: ResolverTypeWrapper<ModelOf<CreateTaxonomyTermNotificationEvent>>;
  CreateThreadNotificationEvent: ResolverTypeWrapper<ModelOf<CreateThreadNotificationEvent>>;
  DateTime: ResolverTypeWrapper<ModelOf<Scalars['DateTime']>>;
  EntityMutation: ResolverTypeWrapper<ModelOf<EntityMutation>>;
  Event: ResolverTypeWrapper<ModelOf<Event>>;
  EventRevision: ResolverTypeWrapper<ModelOf<EventRevision>>;
  EventRevisionConnection: ResolverTypeWrapper<ModelOf<EventRevisionConnection>>;
  EventRevisionCursor: ResolverTypeWrapper<ModelOf<EventRevisionCursor>>;
  Exercise: ResolverTypeWrapper<ModelOf<Exercise>>;
  ExerciseGroup: ResolverTypeWrapper<ModelOf<ExerciseGroup>>;
  ExerciseGroupRevision: ResolverTypeWrapper<ModelOf<ExerciseGroupRevision>>;
  ExerciseGroupRevisionConnection: ResolverTypeWrapper<ModelOf<ExerciseGroupRevisionConnection>>;
  ExerciseGroupRevisionCursor: ResolverTypeWrapper<ModelOf<ExerciseGroupRevisionCursor>>;
  ExerciseRevision: ResolverTypeWrapper<ModelOf<ExerciseRevision>>;
  ExerciseRevisionConnection: ResolverTypeWrapper<ModelOf<ExerciseRevisionConnection>>;
  ExerciseRevisionCursor: ResolverTypeWrapper<ModelOf<ExerciseRevisionCursor>>;
  GroupedExercise: ResolverTypeWrapper<ModelOf<GroupedExercise>>;
  GroupedExerciseRevision: ResolverTypeWrapper<ModelOf<GroupedExerciseRevision>>;
  GroupedExerciseRevisionConnection: ResolverTypeWrapper<ModelOf<GroupedExerciseRevisionConnection>>;
  GroupedExerciseRevisionCursor: ResolverTypeWrapper<ModelOf<GroupedExerciseRevisionCursor>>;
  Instance: ResolverTypeWrapper<ModelOf<Instance>>;
  InstanceAware: ResolversTypes['Applet'] | ResolversTypes['Article'] | ResolversTypes['CheckoutRevisionNotificationEvent'] | ResolversTypes['Course'] | ResolversTypes['CoursePage'] | ResolversTypes['CreateCommentNotificationEvent'] | ResolversTypes['CreateEntityLinkNotificationEvent'] | ResolversTypes['CreateEntityNotificationEvent'] | ResolversTypes['CreateEntityRevisionNotificationEvent'] | ResolversTypes['CreateTaxonomyLinkNotificationEvent'] | ResolversTypes['CreateTaxonomyTermNotificationEvent'] | ResolversTypes['CreateThreadNotificationEvent'] | ResolversTypes['Event'] | ResolversTypes['Exercise'] | ResolversTypes['ExerciseGroup'] | ResolversTypes['GroupedExercise'] | ResolversTypes['Page'] | ResolversTypes['RejectRevisionNotificationEvent'] | ResolversTypes['RemoveEntityLinkNotificationEvent'] | ResolversTypes['RemoveTaxonomyLinkNotificationEvent'] | ResolversTypes['SetLicenseNotificationEvent'] | ResolversTypes['SetTaxonomyParentNotificationEvent'] | ResolversTypes['SetTaxonomyTermNotificationEvent'] | ResolversTypes['SetThreadStateNotificationEvent'] | ResolversTypes['SetUuidStateNotificationEvent'] | ResolversTypes['Solution'] | ResolversTypes['TaxonomyTerm'] | ResolversTypes['Video'];
  JSON: ResolverTypeWrapper<ModelOf<Scalars['JSON']>>;
  JSONObject: ResolverTypeWrapper<ModelOf<Scalars['JSONObject']>>;
  License: ResolverTypeWrapper<ModelOf<License>>;
  Mutation: ResolverTypeWrapper<{}>;
  Navigation: ResolverTypeWrapper<ModelOf<Navigation>>;
  NavigationNode: ResolverTypeWrapper<ModelOf<NavigationNode>>;
  NavigationNodeConnection: ResolverTypeWrapper<ModelOf<NavigationNodeConnection>>;
  NavigationNodeEdge: ResolverTypeWrapper<ModelOf<NavigationNodeEdge>>;
  Notification: ResolverTypeWrapper<ModelOf<Notification>>;
  NotificationConnection: ResolverTypeWrapper<ModelOf<NotificationConnection>>;
  NotificationEdge: ResolverTypeWrapper<ModelOf<NotificationEdge>>;
  NotificationMutation: ResolverTypeWrapper<ModelOf<NotificationMutation>>;
  NotificationSetStateInput: ResolverTypeWrapper<ModelOf<NotificationSetStateInput>>;
  NotificationSetStateResponse: ResolverTypeWrapper<ModelOf<NotificationSetStateResponse>>;
  Page: ResolverTypeWrapper<ModelOf<Page>>;
  PageInfo: ResolverTypeWrapper<ModelOf<PageInfo>>;
  PageRevision: ResolverTypeWrapper<ModelOf<PageRevision>>;
  PageRevisionConnection: ResolverTypeWrapper<ModelOf<PageRevisionConnection>>;
  PageRevisionCursor: ResolverTypeWrapper<ModelOf<PageRevisionCursor>>;
  Query: ResolverTypeWrapper<{}>;
  RejectRevisionInput: ResolverTypeWrapper<ModelOf<RejectRevisionInput>>;
  RejectRevisionNotificationEvent: ResolverTypeWrapper<ModelOf<RejectRevisionNotificationEvent>>;
  RejectRevisionResponse: ResolverTypeWrapper<ModelOf<RejectRevisionResponse>>;
  RemoveEntityLinkNotificationEvent: ResolverTypeWrapper<ModelOf<RemoveEntityLinkNotificationEvent>>;
  RemoveTaxonomyLinkNotificationEvent: ResolverTypeWrapper<ModelOf<RemoveTaxonomyLinkNotificationEvent>>;
  Role: ResolverTypeWrapper<ModelOf<Role>>;
  ScopedRole: ResolverTypeWrapper<ModelOf<ScopedRole>>;
  ScopedRoleConnection: ResolverTypeWrapper<ModelOf<ScopedRoleConnection>>;
  ScopedRoleCursor: ResolverTypeWrapper<ModelOf<ScopedRoleCursor>>;
  SetLicenseNotificationEvent: ResolverTypeWrapper<ModelOf<SetLicenseNotificationEvent>>;
  SetTaxonomyParentNotificationEvent: ResolverTypeWrapper<ModelOf<SetTaxonomyParentNotificationEvent>>;
  SetTaxonomyTermNotificationEvent: ResolverTypeWrapper<ModelOf<SetTaxonomyTermNotificationEvent>>;
  SetThreadStateNotificationEvent: ResolverTypeWrapper<ModelOf<SetThreadStateNotificationEvent>>;
  SetUuidStateNotificationEvent: ResolverTypeWrapper<ModelOf<SetUuidStateNotificationEvent>>;
  Solution: ResolverTypeWrapper<ModelOf<Solution>>;
  SolutionRevision: ResolverTypeWrapper<ModelOf<SolutionRevision>>;
  SolutionRevisionConnection: ResolverTypeWrapper<ModelOf<SolutionRevisionConnection>>;
  SolutionRevisionCursor: ResolverTypeWrapper<ModelOf<SolutionRevisionCursor>>;
  SubscriptionConnection: ResolverTypeWrapper<ModelOf<SubscriptionConnection>>;
  SubscriptionCursor: ResolverTypeWrapper<ModelOf<SubscriptionCursor>>;
  SubscriptionInfo: ResolverTypeWrapper<ModelOf<SubscriptionInfo>>;
  SubscriptionMutation: ResolverTypeWrapper<ModelOf<SubscriptionMutation>>;
  SubscriptionQuery: ResolverTypeWrapper<ModelOf<SubscriptionQuery>>;
  SubscriptionSetInput: ResolverTypeWrapper<ModelOf<SubscriptionSetInput>>;
  SubscriptionSetResponse: ResolverTypeWrapper<ModelOf<SubscriptionSetResponse>>;
  TaxonomyTerm: ResolverTypeWrapper<ModelOf<TaxonomyTerm>>;
  TaxonomyTermConnection: ResolverTypeWrapper<ModelOf<TaxonomyTermConnection>>;
  TaxonomyTermEdge: ResolverTypeWrapper<ModelOf<TaxonomyTermEdge>>;
  TaxonomyTermType: ResolverTypeWrapper<ModelOf<TaxonomyTermType>>;
  Thread: ResolverTypeWrapper<ModelOf<Thread>>;
  ThreadAware: ResolversTypes['Applet'] | ResolversTypes['AppletRevision'] | ResolversTypes['Article'] | ResolversTypes['ArticleRevision'] | ResolversTypes['Course'] | ResolversTypes['CoursePage'] | ResolversTypes['CoursePageRevision'] | ResolversTypes['CourseRevision'] | ResolversTypes['Event'] | ResolversTypes['EventRevision'] | ResolversTypes['Exercise'] | ResolversTypes['ExerciseGroup'] | ResolversTypes['ExerciseGroupRevision'] | ResolversTypes['ExerciseRevision'] | ResolversTypes['GroupedExercise'] | ResolversTypes['GroupedExerciseRevision'] | ResolversTypes['Page'] | ResolversTypes['PageRevision'] | ResolversTypes['Solution'] | ResolversTypes['SolutionRevision'] | ResolversTypes['TaxonomyTerm'] | ResolversTypes['User'] | ResolversTypes['Video'] | ResolversTypes['VideoRevision'];
  ThreadCreateCommentInput: ResolverTypeWrapper<ModelOf<ThreadCreateCommentInput>>;
  ThreadCreateCommentResponse: ResolverTypeWrapper<ModelOf<ThreadCreateCommentResponse>>;
  ThreadCreateThreadInput: ResolverTypeWrapper<ModelOf<ThreadCreateThreadInput>>;
  ThreadCreateThreadResponse: ResolverTypeWrapper<ModelOf<ThreadCreateThreadResponse>>;
  ThreadMutation: ResolverTypeWrapper<ModelOf<ThreadMutation>>;
  ThreadSetCommentStateInput: ResolverTypeWrapper<ModelOf<ThreadSetCommentStateInput>>;
  ThreadSetCommentStateResponse: ResolverTypeWrapper<ModelOf<ThreadSetCommentStateResponse>>;
  ThreadSetThreadArchivedInput: ResolverTypeWrapper<ModelOf<ThreadSetThreadArchivedInput>>;
  ThreadSetThreadArchivedResponse: ResolverTypeWrapper<ModelOf<ThreadSetThreadArchivedResponse>>;
  ThreadSetThreadStateInput: ResolverTypeWrapper<ModelOf<ThreadSetThreadStateInput>>;
  ThreadSetThreadStateResponse: ResolverTypeWrapper<ModelOf<ThreadSetThreadStateResponse>>;
  ThreadsConnection: ResolverTypeWrapper<ModelOf<ThreadsConnection>>;
  ThreadsCursor: ResolverTypeWrapper<ModelOf<ThreadsCursor>>;
  User: ResolverTypeWrapper<ModelOf<User>>;
  UserConnection: ResolverTypeWrapper<ModelOf<UserConnection>>;
  UserDeleteBotsInput: ResolverTypeWrapper<ModelOf<UserDeleteBotsInput>>;
  UserDeleteBotsResponse: ResolverTypeWrapper<ModelOf<UserDeleteBotsResponse>>;
  UserDeleteRegularUsersInput: ResolverTypeWrapper<ModelOf<UserDeleteRegularUsersInput>>;
  UserDeleteRegularUsersResponse: ResolverTypeWrapper<ModelOf<UserDeleteRegularUsersResponse>>;
  UserEdge: ResolverTypeWrapper<ModelOf<UserEdge>>;
  UserMutation: ResolverTypeWrapper<ModelOf<UserMutation>>;
  UserSetEmailInput: ResolverTypeWrapper<ModelOf<UserSetEmailInput>>;
  UserSetEmailResponse: ResolverTypeWrapper<ModelOf<UserSetEmailResponse>>;
  UuidMutation: ResolverTypeWrapper<ModelOf<UuidMutation>>;
  UuidSetStateInput: ResolverTypeWrapper<ModelOf<UuidSetStateInput>>;
  UuidSetStateResponse: ResolverTypeWrapper<ModelOf<UuidSetStateResponse>>;
  Video: ResolverTypeWrapper<ModelOf<Video>>;
  VideoRevision: ResolverTypeWrapper<ModelOf<VideoRevision>>;
  VideoRevisionConnection: ResolverTypeWrapper<ModelOf<VideoRevisionConnection>>;
  VideoRevisionCursor: ResolverTypeWrapper<ModelOf<VideoRevisionCursor>>;
  _cacheMutation: ResolverTypeWrapper<ModelOf<_CacheMutation>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AbstractEntity: ResolversParentTypes['Applet'] | ResolversParentTypes['Article'] | ResolversParentTypes['Course'] | ResolversParentTypes['CoursePage'] | ResolversParentTypes['Event'] | ResolversParentTypes['Exercise'] | ResolversParentTypes['ExerciseGroup'] | ResolversParentTypes['GroupedExercise'] | ResolversParentTypes['Solution'] | ResolversParentTypes['Video'];
  Int: ModelOf<Scalars['Int']>;
  Boolean: ModelOf<Scalars['Boolean']>;
  String: ModelOf<Scalars['String']>;
  AbstractEntityRevision: ResolversParentTypes['AppletRevision'] | ResolversParentTypes['ArticleRevision'] | ResolversParentTypes['CoursePageRevision'] | ResolversParentTypes['CourseRevision'] | ResolversParentTypes['EventRevision'] | ResolversParentTypes['ExerciseGroupRevision'] | ResolversParentTypes['ExerciseRevision'] | ResolversParentTypes['GroupedExerciseRevision'] | ResolversParentTypes['SolutionRevision'] | ResolversParentTypes['VideoRevision'];
  AbstractExercise: ResolversParentTypes['Exercise'] | ResolversParentTypes['GroupedExercise'];
  AbstractExerciseRevision: ResolversParentTypes['ExerciseRevision'] | ResolversParentTypes['GroupedExerciseRevision'];
  AbstractNavigationChild: ResolversParentTypes['Page'] | ResolversParentTypes['TaxonomyTerm'];
  AbstractNotificationEvent: ResolversParentTypes['CheckoutRevisionNotificationEvent'] | ResolversParentTypes['CreateCommentNotificationEvent'] | ResolversParentTypes['CreateEntityLinkNotificationEvent'] | ResolversParentTypes['CreateEntityNotificationEvent'] | ResolversParentTypes['CreateEntityRevisionNotificationEvent'] | ResolversParentTypes['CreateTaxonomyLinkNotificationEvent'] | ResolversParentTypes['CreateTaxonomyTermNotificationEvent'] | ResolversParentTypes['CreateThreadNotificationEvent'] | ResolversParentTypes['RejectRevisionNotificationEvent'] | ResolversParentTypes['RemoveEntityLinkNotificationEvent'] | ResolversParentTypes['RemoveTaxonomyLinkNotificationEvent'] | ResolversParentTypes['SetLicenseNotificationEvent'] | ResolversParentTypes['SetTaxonomyParentNotificationEvent'] | ResolversParentTypes['SetTaxonomyTermNotificationEvent'] | ResolversParentTypes['SetThreadStateNotificationEvent'] | ResolversParentTypes['SetUuidStateNotificationEvent'];
  AbstractNotificationEventConnection: ModelOf<AbstractNotificationEventConnection>;
  AbstractNotificationEventEdge: ModelOf<AbstractNotificationEventEdge>;
  AbstractRepository: ResolversParentTypes['Applet'] | ResolversParentTypes['Article'] | ResolversParentTypes['Course'] | ResolversParentTypes['CoursePage'] | ResolversParentTypes['Event'] | ResolversParentTypes['Exercise'] | ResolversParentTypes['ExerciseGroup'] | ResolversParentTypes['GroupedExercise'] | ResolversParentTypes['Page'] | ResolversParentTypes['Solution'] | ResolversParentTypes['Video'];
  AbstractRevision: ResolversParentTypes['AppletRevision'] | ResolversParentTypes['ArticleRevision'] | ResolversParentTypes['CoursePageRevision'] | ResolversParentTypes['CourseRevision'] | ResolversParentTypes['EventRevision'] | ResolversParentTypes['ExerciseGroupRevision'] | ResolversParentTypes['ExerciseRevision'] | ResolversParentTypes['GroupedExerciseRevision'] | ResolversParentTypes['PageRevision'] | ResolversParentTypes['SolutionRevision'] | ResolversParentTypes['VideoRevision'];
  AbstractTaxonomyTermChild: ResolversParentTypes['Applet'] | ResolversParentTypes['Article'] | ResolversParentTypes['Course'] | ResolversParentTypes['Event'] | ResolversParentTypes['Exercise'] | ResolversParentTypes['ExerciseGroup'] | ResolversParentTypes['Video'];
  AbstractUuid: ResolversParentTypes['Applet'] | ResolversParentTypes['AppletRevision'] | ResolversParentTypes['Article'] | ResolversParentTypes['ArticleRevision'] | ResolversParentTypes['Comment'] | ResolversParentTypes['Course'] | ResolversParentTypes['CoursePage'] | ResolversParentTypes['CoursePageRevision'] | ResolversParentTypes['CourseRevision'] | ResolversParentTypes['Event'] | ResolversParentTypes['EventRevision'] | ResolversParentTypes['Exercise'] | ResolversParentTypes['ExerciseGroup'] | ResolversParentTypes['ExerciseGroupRevision'] | ResolversParentTypes['ExerciseRevision'] | ResolversParentTypes['GroupedExercise'] | ResolversParentTypes['GroupedExerciseRevision'] | ResolversParentTypes['Page'] | ResolversParentTypes['PageRevision'] | ResolversParentTypes['Solution'] | ResolversParentTypes['SolutionRevision'] | ResolversParentTypes['TaxonomyTerm'] | ResolversParentTypes['User'] | ResolversParentTypes['Video'] | ResolversParentTypes['VideoRevision'];
  AbstractUuidConnection: ModelOf<AbstractUuidConnection>;
  AbstractUuidCursor: ModelOf<AbstractUuidCursor>;
  AliasInput: ModelOf<AliasInput>;
  Applet: ModelOf<Applet>;
  AppletRevision: ModelOf<AppletRevision>;
  AppletRevisionConnection: ModelOf<AppletRevisionConnection>;
  AppletRevisionCursor: ModelOf<AppletRevisionCursor>;
  Article: ModelOf<Article>;
  ArticleRevision: ModelOf<ArticleRevision>;
  ArticleRevisionConnection: ModelOf<ArticleRevisionConnection>;
  ArticleRevisionCursor: ModelOf<ArticleRevisionCursor>;
  CacheRemoveInput: ModelOf<CacheRemoveInput>;
  CacheRemoveResponse: ModelOf<CacheRemoveResponse>;
  CacheSetInput: ModelOf<CacheSetInput>;
  CacheSetResponse: ModelOf<CacheSetResponse>;
  CacheUpdateInput: ModelOf<CacheUpdateInput>;
  CacheUpdateResponse: ModelOf<CacheUpdateResponse>;
  CheckoutRevisionInput: ModelOf<CheckoutRevisionInput>;
  CheckoutRevisionNotificationEvent: ModelOf<CheckoutRevisionNotificationEvent>;
  CheckoutRevisionResponse: ModelOf<CheckoutRevisionResponse>;
  Comment: ModelOf<Comment>;
  CommentConnection: ModelOf<CommentConnection>;
  CommentEdge: ModelOf<CommentEdge>;
  Course: ModelOf<Course>;
  CoursePage: ModelOf<CoursePage>;
  CoursePageRevision: ModelOf<CoursePageRevision>;
  CoursePageRevisionConnection: ModelOf<CoursePageRevisionConnection>;
  CoursePageRevisionCursor: ModelOf<CoursePageRevisionCursor>;
  CourseRevision: ModelOf<CourseRevision>;
  CourseRevisionConnection: ModelOf<CourseRevisionConnection>;
  CourseRevisionCursor: ModelOf<CourseRevisionCursor>;
  CreateCommentNotificationEvent: ModelOf<CreateCommentNotificationEvent>;
  CreateEntityLinkNotificationEvent: ModelOf<CreateEntityLinkNotificationEvent>;
  CreateEntityNotificationEvent: ModelOf<CreateEntityNotificationEvent>;
  CreateEntityRevisionNotificationEvent: ModelOf<CreateEntityRevisionNotificationEvent>;
  CreateTaxonomyLinkNotificationEvent: ModelOf<CreateTaxonomyLinkNotificationEvent>;
  CreateTaxonomyTermNotificationEvent: ModelOf<CreateTaxonomyTermNotificationEvent>;
  CreateThreadNotificationEvent: ModelOf<CreateThreadNotificationEvent>;
  DateTime: ModelOf<Scalars['DateTime']>;
  EntityMutation: ModelOf<EntityMutation>;
  Event: ModelOf<Event>;
  EventRevision: ModelOf<EventRevision>;
  EventRevisionConnection: ModelOf<EventRevisionConnection>;
  EventRevisionCursor: ModelOf<EventRevisionCursor>;
  Exercise: ModelOf<Exercise>;
  ExerciseGroup: ModelOf<ExerciseGroup>;
  ExerciseGroupRevision: ModelOf<ExerciseGroupRevision>;
  ExerciseGroupRevisionConnection: ModelOf<ExerciseGroupRevisionConnection>;
  ExerciseGroupRevisionCursor: ModelOf<ExerciseGroupRevisionCursor>;
  ExerciseRevision: ModelOf<ExerciseRevision>;
  ExerciseRevisionConnection: ModelOf<ExerciseRevisionConnection>;
  ExerciseRevisionCursor: ModelOf<ExerciseRevisionCursor>;
  GroupedExercise: ModelOf<GroupedExercise>;
  GroupedExerciseRevision: ModelOf<GroupedExerciseRevision>;
  GroupedExerciseRevisionConnection: ModelOf<GroupedExerciseRevisionConnection>;
  GroupedExerciseRevisionCursor: ModelOf<GroupedExerciseRevisionCursor>;
  InstanceAware: ResolversParentTypes['Applet'] | ResolversParentTypes['Article'] | ResolversParentTypes['CheckoutRevisionNotificationEvent'] | ResolversParentTypes['Course'] | ResolversParentTypes['CoursePage'] | ResolversParentTypes['CreateCommentNotificationEvent'] | ResolversParentTypes['CreateEntityLinkNotificationEvent'] | ResolversParentTypes['CreateEntityNotificationEvent'] | ResolversParentTypes['CreateEntityRevisionNotificationEvent'] | ResolversParentTypes['CreateTaxonomyLinkNotificationEvent'] | ResolversParentTypes['CreateTaxonomyTermNotificationEvent'] | ResolversParentTypes['CreateThreadNotificationEvent'] | ResolversParentTypes['Event'] | ResolversParentTypes['Exercise'] | ResolversParentTypes['ExerciseGroup'] | ResolversParentTypes['GroupedExercise'] | ResolversParentTypes['Page'] | ResolversParentTypes['RejectRevisionNotificationEvent'] | ResolversParentTypes['RemoveEntityLinkNotificationEvent'] | ResolversParentTypes['RemoveTaxonomyLinkNotificationEvent'] | ResolversParentTypes['SetLicenseNotificationEvent'] | ResolversParentTypes['SetTaxonomyParentNotificationEvent'] | ResolversParentTypes['SetTaxonomyTermNotificationEvent'] | ResolversParentTypes['SetThreadStateNotificationEvent'] | ResolversParentTypes['SetUuidStateNotificationEvent'] | ResolversParentTypes['Solution'] | ResolversParentTypes['TaxonomyTerm'] | ResolversParentTypes['Video'];
  JSON: ModelOf<Scalars['JSON']>;
  JSONObject: ModelOf<Scalars['JSONObject']>;
  License: ModelOf<License>;
  Mutation: {};
  Navigation: ModelOf<Navigation>;
  NavigationNode: ModelOf<NavigationNode>;
  NavigationNodeConnection: ModelOf<NavigationNodeConnection>;
  NavigationNodeEdge: ModelOf<NavigationNodeEdge>;
  Notification: ModelOf<Notification>;
  NotificationConnection: ModelOf<NotificationConnection>;
  NotificationEdge: ModelOf<NotificationEdge>;
  NotificationMutation: ModelOf<NotificationMutation>;
  NotificationSetStateInput: ModelOf<NotificationSetStateInput>;
  NotificationSetStateResponse: ModelOf<NotificationSetStateResponse>;
  Page: ModelOf<Page>;
  PageInfo: ModelOf<PageInfo>;
  PageRevision: ModelOf<PageRevision>;
  PageRevisionConnection: ModelOf<PageRevisionConnection>;
  PageRevisionCursor: ModelOf<PageRevisionCursor>;
  Query: {};
  RejectRevisionInput: ModelOf<RejectRevisionInput>;
  RejectRevisionNotificationEvent: ModelOf<RejectRevisionNotificationEvent>;
  RejectRevisionResponse: ModelOf<RejectRevisionResponse>;
  RemoveEntityLinkNotificationEvent: ModelOf<RemoveEntityLinkNotificationEvent>;
  RemoveTaxonomyLinkNotificationEvent: ModelOf<RemoveTaxonomyLinkNotificationEvent>;
  ScopedRole: ModelOf<ScopedRole>;
  ScopedRoleConnection: ModelOf<ScopedRoleConnection>;
  ScopedRoleCursor: ModelOf<ScopedRoleCursor>;
  SetLicenseNotificationEvent: ModelOf<SetLicenseNotificationEvent>;
  SetTaxonomyParentNotificationEvent: ModelOf<SetTaxonomyParentNotificationEvent>;
  SetTaxonomyTermNotificationEvent: ModelOf<SetTaxonomyTermNotificationEvent>;
  SetThreadStateNotificationEvent: ModelOf<SetThreadStateNotificationEvent>;
  SetUuidStateNotificationEvent: ModelOf<SetUuidStateNotificationEvent>;
  Solution: ModelOf<Solution>;
  SolutionRevision: ModelOf<SolutionRevision>;
  SolutionRevisionConnection: ModelOf<SolutionRevisionConnection>;
  SolutionRevisionCursor: ModelOf<SolutionRevisionCursor>;
  SubscriptionConnection: ModelOf<SubscriptionConnection>;
  SubscriptionCursor: ModelOf<SubscriptionCursor>;
  SubscriptionInfo: ModelOf<SubscriptionInfo>;
  SubscriptionMutation: ModelOf<SubscriptionMutation>;
  SubscriptionQuery: ModelOf<SubscriptionQuery>;
  SubscriptionSetInput: ModelOf<SubscriptionSetInput>;
  SubscriptionSetResponse: ModelOf<SubscriptionSetResponse>;
  TaxonomyTerm: ModelOf<TaxonomyTerm>;
  TaxonomyTermConnection: ModelOf<TaxonomyTermConnection>;
  TaxonomyTermEdge: ModelOf<TaxonomyTermEdge>;
  Thread: ModelOf<Thread>;
  ThreadAware: ResolversParentTypes['Applet'] | ResolversParentTypes['AppletRevision'] | ResolversParentTypes['Article'] | ResolversParentTypes['ArticleRevision'] | ResolversParentTypes['Course'] | ResolversParentTypes['CoursePage'] | ResolversParentTypes['CoursePageRevision'] | ResolversParentTypes['CourseRevision'] | ResolversParentTypes['Event'] | ResolversParentTypes['EventRevision'] | ResolversParentTypes['Exercise'] | ResolversParentTypes['ExerciseGroup'] | ResolversParentTypes['ExerciseGroupRevision'] | ResolversParentTypes['ExerciseRevision'] | ResolversParentTypes['GroupedExercise'] | ResolversParentTypes['GroupedExerciseRevision'] | ResolversParentTypes['Page'] | ResolversParentTypes['PageRevision'] | ResolversParentTypes['Solution'] | ResolversParentTypes['SolutionRevision'] | ResolversParentTypes['TaxonomyTerm'] | ResolversParentTypes['User'] | ResolversParentTypes['Video'] | ResolversParentTypes['VideoRevision'];
  ThreadCreateCommentInput: ModelOf<ThreadCreateCommentInput>;
  ThreadCreateCommentResponse: ModelOf<ThreadCreateCommentResponse>;
  ThreadCreateThreadInput: ModelOf<ThreadCreateThreadInput>;
  ThreadCreateThreadResponse: ModelOf<ThreadCreateThreadResponse>;
  ThreadMutation: ModelOf<ThreadMutation>;
  ThreadSetCommentStateInput: ModelOf<ThreadSetCommentStateInput>;
  ThreadSetCommentStateResponse: ModelOf<ThreadSetCommentStateResponse>;
  ThreadSetThreadArchivedInput: ModelOf<ThreadSetThreadArchivedInput>;
  ThreadSetThreadArchivedResponse: ModelOf<ThreadSetThreadArchivedResponse>;
  ThreadSetThreadStateInput: ModelOf<ThreadSetThreadStateInput>;
  ThreadSetThreadStateResponse: ModelOf<ThreadSetThreadStateResponse>;
  ThreadsConnection: ModelOf<ThreadsConnection>;
  ThreadsCursor: ModelOf<ThreadsCursor>;
  User: ModelOf<User>;
  UserConnection: ModelOf<UserConnection>;
  UserDeleteBotsInput: ModelOf<UserDeleteBotsInput>;
  UserDeleteBotsResponse: ModelOf<UserDeleteBotsResponse>;
  UserDeleteRegularUsersInput: ModelOf<UserDeleteRegularUsersInput>;
  UserDeleteRegularUsersResponse: ModelOf<UserDeleteRegularUsersResponse>;
  UserEdge: ModelOf<UserEdge>;
  UserMutation: ModelOf<UserMutation>;
  UserSetEmailInput: ModelOf<UserSetEmailInput>;
  UserSetEmailResponse: ModelOf<UserSetEmailResponse>;
  UuidMutation: ModelOf<UuidMutation>;
  UuidSetStateInput: ModelOf<UuidSetStateInput>;
  UuidSetStateResponse: ModelOf<UuidSetStateResponse>;
  Video: ModelOf<Video>;
  VideoRevision: ModelOf<VideoRevision>;
  VideoRevisionConnection: ModelOf<VideoRevisionConnection>;
  VideoRevisionCursor: ModelOf<VideoRevisionCursor>;
  _cacheMutation: ModelOf<_CacheMutation>;
};

export type AbstractEntityResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractEntity'] = ResolversParentTypes['AbstractEntity']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'Course' | 'CoursePage' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'GroupedExercise' | 'Solution' | 'Video', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<AbstractEntityEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
};

export type AbstractEntityRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractEntityRevision'] = ResolversParentTypes['AbstractEntityRevision']> = {
  __resolveType: TypeResolveFn<'AppletRevision' | 'ArticleRevision' | 'CoursePageRevision' | 'CourseRevision' | 'EventRevision' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'GroupedExerciseRevision' | 'SolutionRevision' | 'VideoRevision', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<AbstractEntityRevisionEventsArgs, never>>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type AbstractExerciseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractExercise'] = ResolversParentTypes['AbstractExercise']> = {
  __resolveType: TypeResolveFn<'Exercise' | 'GroupedExercise', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['AbstractExerciseRevision']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<AbstractExerciseEventsArgs, never>>;
  solution?: Resolver<Maybe<ResolversTypes['Solution']>, ParentType, ContextType>;
};

export type AbstractExerciseRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractExerciseRevision'] = ResolversParentTypes['AbstractExerciseRevision']> = {
  __resolveType: TypeResolveFn<'ExerciseRevision' | 'GroupedExerciseRevision', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<AbstractExerciseRevisionEventsArgs, never>>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type AbstractNavigationChildResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractNavigationChild'] = ResolversParentTypes['AbstractNavigationChild']> = {
  __resolveType: TypeResolveFn<'Page' | 'TaxonomyTerm', ParentType, ContextType>;
  navigation?: Resolver<Maybe<ResolversTypes['Navigation']>, ParentType, ContextType>;
};

export type AbstractNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractNotificationEvent'] = ResolversParentTypes['AbstractNotificationEvent']> = {
  __resolveType: TypeResolveFn<'CheckoutRevisionNotificationEvent' | 'CreateCommentNotificationEvent' | 'CreateEntityLinkNotificationEvent' | 'CreateEntityNotificationEvent' | 'CreateEntityRevisionNotificationEvent' | 'CreateTaxonomyLinkNotificationEvent' | 'CreateTaxonomyTermNotificationEvent' | 'CreateThreadNotificationEvent' | 'RejectRevisionNotificationEvent' | 'RemoveEntityLinkNotificationEvent' | 'RemoveTaxonomyLinkNotificationEvent' | 'SetLicenseNotificationEvent' | 'SetTaxonomyParentNotificationEvent' | 'SetTaxonomyTermNotificationEvent' | 'SetThreadStateNotificationEvent' | 'SetUuidStateNotificationEvent', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type AbstractNotificationEventConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractNotificationEventConnection'] = ResolversParentTypes['AbstractNotificationEventConnection']> = {
  edges?: Resolver<Array<ResolversTypes['AbstractNotificationEventEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['AbstractNotificationEvent']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractNotificationEventEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractNotificationEventEdge'] = ResolversParentTypes['AbstractNotificationEventEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AbstractNotificationEvent'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractRepositoryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractRepository'] = ResolversParentTypes['AbstractRepository']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'Course' | 'CoursePage' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'GroupedExercise' | 'Page' | 'Solution' | 'Video', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<AbstractRepositoryEventsArgs, never>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<AbstractRepositoryThreadsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
};

export type AbstractRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractRevision'] = ResolversParentTypes['AbstractRevision']> = {
  __resolveType: TypeResolveFn<'AppletRevision' | 'ArticleRevision' | 'CoursePageRevision' | 'CourseRevision' | 'EventRevision' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'GroupedExerciseRevision' | 'PageRevision' | 'SolutionRevision' | 'VideoRevision', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<AbstractRevisionEventsArgs, never>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<AbstractRevisionThreadsArgs, never>>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type AbstractTaxonomyTermChildResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractTaxonomyTermChild'] = ResolversParentTypes['AbstractTaxonomyTermChild']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'Course' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'Video', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<AbstractTaxonomyTermChildEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, RequireFields<AbstractTaxonomyTermChildTaxonomyTermsArgs, never>>;
};

export type AbstractUuidResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractUuid'] = ResolversParentTypes['AbstractUuid']> = {
  __resolveType: TypeResolveFn<'Applet' | 'AppletRevision' | 'Article' | 'ArticleRevision' | 'Comment' | 'Course' | 'CoursePage' | 'CoursePageRevision' | 'CourseRevision' | 'Event' | 'EventRevision' | 'Exercise' | 'ExerciseGroup' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'GroupedExercise' | 'GroupedExerciseRevision' | 'Page' | 'PageRevision' | 'Solution' | 'SolutionRevision' | 'TaxonomyTerm' | 'User' | 'Video' | 'VideoRevision', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<AbstractUuidEventsArgs, never>>;
};

export type AbstractUuidConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractUuidConnection'] = ResolversParentTypes['AbstractUuidConnection']> = {
  edges?: Resolver<Array<ResolversTypes['AbstractUuidCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['AbstractUuid']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractUuidCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractUuidCursor'] = ResolversParentTypes['AbstractUuidCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppletResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Applet'] = ResolversParentTypes['Applet']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<AppletEventsArgs, never>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<AppletThreadsArgs, never>>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['AppletRevision']>, ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['AppletRevisionConnection'], ParentType, ContextType, RequireFields<AppletRevisionsArgs, never>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, RequireFields<AppletTaxonomyTermsArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppletRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AppletRevision'] = ResolversParentTypes['AppletRevision']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<AppletRevisionEventsArgs, never>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<AppletRevisionThreadsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Applet'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppletRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AppletRevisionConnection'] = ResolversParentTypes['AppletRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['AppletRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['AppletRevision']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppletRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AppletRevisionCursor'] = ResolversParentTypes['AppletRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AppletRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<ArticleThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<ArticleEventsArgs, never>>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['ArticleRevision']>, ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ArticleRevisionConnection'], ParentType, ContextType, RequireFields<ArticleRevisionsArgs, never>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, RequireFields<ArticleTaxonomyTermsArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticleRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ArticleRevision'] = ResolversParentTypes['ArticleRevision']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<ArticleRevisionThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<ArticleRevisionEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Article'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticleRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ArticleRevisionConnection'] = ResolversParentTypes['ArticleRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ArticleRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['ArticleRevision']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticleRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ArticleRevisionCursor'] = ResolversParentTypes['ArticleRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ArticleRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CacheRemoveResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CacheRemoveResponse'] = ResolversParentTypes['CacheRemoveResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CacheSetResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CacheSetResponse'] = ResolversParentTypes['CacheSetResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CacheUpdateResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CacheUpdateResponse'] = ResolversParentTypes['CacheUpdateResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckoutRevisionNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CheckoutRevisionNotificationEvent'] = ResolversParentTypes['CheckoutRevisionNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['AbstractRepository'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['AbstractRevision'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckoutRevisionResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CheckoutRevisionResponse'] = ResolversParentTypes['CheckoutRevisionResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<CommentEventsArgs, never>>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  archived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  legacyObject?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommentConnection'] = ResolversParentTypes['CommentConnection']> = {
  edges?: Resolver<Array<ResolversTypes['CommentEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommentEdge'] = ResolversParentTypes['CommentEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Course'] = ResolversParentTypes['Course']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<CourseThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<CourseEventsArgs, never>>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['CourseRevision']>, ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['CourseRevisionConnection'], ParentType, ContextType, RequireFields<CourseRevisionsArgs, never>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, RequireFields<CourseTaxonomyTermsArgs, never>>;
  pages?: Resolver<Array<ResolversTypes['CoursePage']>, ParentType, ContextType, RequireFields<CoursePagesArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoursePageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CoursePage'] = ResolversParentTypes['CoursePage']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<CoursePageThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<CoursePageEventsArgs, never>>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['CoursePageRevision']>, ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['CoursePageRevisionConnection'], ParentType, ContextType, RequireFields<CoursePageRevisionsArgs, never>>;
  course?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoursePageRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CoursePageRevision'] = ResolversParentTypes['CoursePageRevision']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<CoursePageRevisionThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<CoursePageRevisionEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['CoursePage'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoursePageRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CoursePageRevisionConnection'] = ResolversParentTypes['CoursePageRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['CoursePageRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['CoursePageRevision']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoursePageRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CoursePageRevisionCursor'] = ResolversParentTypes['CoursePageRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['CoursePageRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CourseRevision'] = ResolversParentTypes['CourseRevision']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<CourseRevisionThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<CourseRevisionEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CourseRevisionConnection'] = ResolversParentTypes['CourseRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['CourseRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['CourseRevision']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CourseRevisionCursor'] = ResolversParentTypes['CourseRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['CourseRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCommentNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommentNotificationEvent'] = ResolversParentTypes['CreateCommentNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['Thread'], ParentType, ContextType>;
  comment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEntityLinkNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEntityLinkNotificationEvent'] = ResolversParentTypes['CreateEntityLinkNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEntityNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEntityNotificationEvent'] = ResolversParentTypes['CreateEntityNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entity?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEntityRevisionNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEntityRevisionNotificationEvent'] = ResolversParentTypes['CreateEntityRevisionNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entity?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  entityRevision?: Resolver<ResolversTypes['AbstractEntityRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTaxonomyLinkNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateTaxonomyLinkNotificationEvent'] = ResolversParentTypes['CreateTaxonomyLinkNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTaxonomyTermNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateTaxonomyTermNotificationEvent'] = ResolversParentTypes['CreateTaxonomyTermNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taxonomyTerm?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateThreadNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateThreadNotificationEvent'] = ResolversParentTypes['CreateThreadNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  object?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['Thread'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EntityMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EntityMutation'] = ResolversParentTypes['EntityMutation']> = {
  checkoutRevision?: Resolver<ResolversTypes['CheckoutRevisionResponse'], ParentType, ContextType, RequireFields<EntityMutationCheckoutRevisionArgs, 'input'>>;
  rejectRevision?: Resolver<ResolversTypes['RejectRevisionResponse'], ParentType, ContextType, RequireFields<EntityMutationRejectRevisionArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<EventThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<EventEventsArgs, never>>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['EventRevision']>, ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['EventRevisionConnection'], ParentType, ContextType, RequireFields<EventRevisionsArgs, never>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, RequireFields<EventTaxonomyTermsArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventRevision'] = ResolversParentTypes['EventRevision']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<EventRevisionThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<EventRevisionEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventRevisionConnection'] = ResolversParentTypes['EventRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['EventRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['EventRevision']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventRevisionCursor'] = ResolversParentTypes['EventRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['EventRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Exercise'] = ResolversParentTypes['Exercise']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<ExerciseThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<ExerciseEventsArgs, never>>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['ExerciseRevision']>, ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ExerciseRevisionConnection'], ParentType, ContextType, RequireFields<ExerciseRevisionsArgs, never>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, RequireFields<ExerciseTaxonomyTermsArgs, never>>;
  solution?: Resolver<Maybe<ResolversTypes['Solution']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseGroupResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseGroup'] = ResolversParentTypes['ExerciseGroup']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<ExerciseGroupThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<ExerciseGroupEventsArgs, never>>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['ExerciseGroupRevision']>, ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ExerciseGroupRevisionConnection'], ParentType, ContextType, RequireFields<ExerciseGroupRevisionsArgs, never>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, RequireFields<ExerciseGroupTaxonomyTermsArgs, never>>;
  exercises?: Resolver<Array<ResolversTypes['GroupedExercise']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseGroupRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseGroupRevision'] = ResolversParentTypes['ExerciseGroupRevision']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<ExerciseGroupRevisionThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<ExerciseGroupRevisionEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['ExerciseGroup'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseGroupRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseGroupRevisionConnection'] = ResolversParentTypes['ExerciseGroupRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ExerciseGroupRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['ExerciseGroupRevision']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseGroupRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseGroupRevisionCursor'] = ResolversParentTypes['ExerciseGroupRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ExerciseGroupRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseRevision'] = ResolversParentTypes['ExerciseRevision']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<ExerciseRevisionThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<ExerciseRevisionEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Exercise'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseRevisionConnection'] = ResolversParentTypes['ExerciseRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ExerciseRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['ExerciseRevision']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseRevisionCursor'] = ResolversParentTypes['ExerciseRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ExerciseRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupedExerciseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupedExercise'] = ResolversParentTypes['GroupedExercise']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<GroupedExerciseThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<GroupedExerciseEventsArgs, never>>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['GroupedExerciseRevision']>, ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['GroupedExerciseRevisionConnection'], ParentType, ContextType, RequireFields<GroupedExerciseRevisionsArgs, never>>;
  solution?: Resolver<Maybe<ResolversTypes['Solution']>, ParentType, ContextType>;
  exerciseGroup?: Resolver<ResolversTypes['ExerciseGroup'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupedExerciseRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupedExerciseRevision'] = ResolversParentTypes['GroupedExerciseRevision']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<GroupedExerciseRevisionThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<GroupedExerciseRevisionEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['GroupedExercise'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupedExerciseRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupedExerciseRevisionConnection'] = ResolversParentTypes['GroupedExerciseRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['GroupedExerciseRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['GroupedExerciseRevision']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupedExerciseRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupedExerciseRevisionCursor'] = ResolversParentTypes['GroupedExerciseRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['GroupedExerciseRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstanceAwareResolvers<ContextType = Context, ParentType extends ResolversParentTypes['InstanceAware'] = ResolversParentTypes['InstanceAware']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'CheckoutRevisionNotificationEvent' | 'Course' | 'CoursePage' | 'CreateCommentNotificationEvent' | 'CreateEntityLinkNotificationEvent' | 'CreateEntityNotificationEvent' | 'CreateEntityRevisionNotificationEvent' | 'CreateTaxonomyLinkNotificationEvent' | 'CreateTaxonomyTermNotificationEvent' | 'CreateThreadNotificationEvent' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'GroupedExercise' | 'Page' | 'RejectRevisionNotificationEvent' | 'RemoveEntityLinkNotificationEvent' | 'RemoveTaxonomyLinkNotificationEvent' | 'SetLicenseNotificationEvent' | 'SetTaxonomyParentNotificationEvent' | 'SetTaxonomyTermNotificationEvent' | 'SetThreadStateNotificationEvent' | 'SetUuidStateNotificationEvent' | 'Solution' | 'TaxonomyTerm' | 'Video', ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type LicenseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['License'] = ResolversParentTypes['License']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  default?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  agreement?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  iconHref?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _cache?: Resolver<ResolversTypes['_cacheMutation'], ParentType, ContextType>;
  entity?: Resolver<ResolversTypes['EntityMutation'], ParentType, ContextType>;
  notification?: Resolver<ResolversTypes['NotificationMutation'], ParentType, ContextType>;
  subscription?: Resolver<ResolversTypes['SubscriptionMutation'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['ThreadMutation'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserMutation'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['UuidMutation'], ParentType, ContextType>;
};

export type NavigationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Navigation'] = ResolversParentTypes['Navigation']> = {
  data?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['NavigationNodeConnection'], ParentType, ContextType, RequireFields<NavigationPathArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NavigationNodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NavigationNode'] = ResolversParentTypes['NavigationNode']> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NavigationNodeConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NavigationNodeConnection'] = ResolversParentTypes['NavigationNodeConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['NavigationNodeEdge']>>>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['NavigationNode']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NavigationNodeEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NavigationNodeEdge'] = ResolversParentTypes['NavigationNodeEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NavigationNode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unread?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  event?: Resolver<ResolversTypes['AbstractNotificationEvent'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NotificationConnection'] = ResolversParentTypes['NotificationConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NotificationEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Notification']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NotificationEdge'] = ResolversParentTypes['NotificationEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Notification'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NotificationMutation'] = ResolversParentTypes['NotificationMutation']> = {
  setState?: Resolver<Maybe<ResolversTypes['NotificationSetStateResponse']>, ParentType, ContextType, RequireFields<NotificationMutationSetStateArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationSetStateResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NotificationSetStateResponse'] = ResolversParentTypes['NotificationSetStateResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<PageThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<PageEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['PageRevision']>, ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['PageRevisionConnection'], ParentType, ContextType, RequireFields<PageRevisionsArgs, never>>;
  navigation?: Resolver<Maybe<ResolversTypes['Navigation']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageRevision'] = ResolversParentTypes['PageRevision']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<PageRevisionThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<PageRevisionEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Page'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageRevisionConnection'] = ResolversParentTypes['PageRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['PageRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['PageRevision']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageRevisionCursor'] = ResolversParentTypes['PageRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['PageRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activeAuthors?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<QueryActiveAuthorsArgs, never>>;
  activeDonors?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<QueryActiveDonorsArgs, never>>;
  activeReviewers?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<QueryActiveReviewersArgs, never>>;
  authorization?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<QueryEventsArgs, never>>;
  license?: Resolver<Maybe<ResolversTypes['License']>, ParentType, ContextType, RequireFields<QueryLicenseArgs, 'id'>>;
  notificationEvent?: Resolver<Maybe<ResolversTypes['AbstractNotificationEvent']>, ParentType, ContextType, RequireFields<QueryNotificationEventArgs, 'id'>>;
  notifications?: Resolver<ResolversTypes['NotificationConnection'], ParentType, ContextType, RequireFields<QueryNotificationsArgs, never>>;
  subscription?: Resolver<ResolversTypes['SubscriptionQuery'], ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['AbstractUuid']>, ParentType, ContextType, RequireFields<QueryUuidArgs, never>>;
};

export type RejectRevisionNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RejectRevisionNotificationEvent'] = ResolversParentTypes['RejectRevisionNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['AbstractRepository'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['AbstractRevision'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RejectRevisionResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RejectRevisionResponse'] = ResolversParentTypes['RejectRevisionResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RemoveEntityLinkNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RemoveEntityLinkNotificationEvent'] = ResolversParentTypes['RemoveEntityLinkNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RemoveTaxonomyLinkNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RemoveTaxonomyLinkNotificationEvent'] = ResolversParentTypes['RemoveTaxonomyLinkNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScopedRoleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ScopedRole'] = ResolversParentTypes['ScopedRole']> = {
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  scope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScopedRoleConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ScopedRoleConnection'] = ResolversParentTypes['ScopedRoleConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ScopedRoleCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['ScopedRole']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScopedRoleCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ScopedRoleCursor'] = ResolversParentTypes['ScopedRoleCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ScopedRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetLicenseNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetLicenseNotificationEvent'] = ResolversParentTypes['SetLicenseNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['AbstractRepository'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetTaxonomyParentNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetTaxonomyParentNotificationEvent'] = ResolversParentTypes['SetTaxonomyParentNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  previousParent?: Resolver<Maybe<ResolversTypes['TaxonomyTerm']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['TaxonomyTerm']>, ParentType, ContextType>;
  child?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetTaxonomyTermNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetTaxonomyTermNotificationEvent'] = ResolversParentTypes['SetTaxonomyTermNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taxonomyTerm?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetThreadStateNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetThreadStateNotificationEvent'] = ResolversParentTypes['SetThreadStateNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['Thread'], ParentType, ContextType>;
  archived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetUuidStateNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetUuidStateNotificationEvent'] = ResolversParentTypes['SetUuidStateNotificationEvent']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  object?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SolutionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Solution'] = ResolversParentTypes['Solution']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<SolutionThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<SolutionEventsArgs, never>>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['SolutionRevision']>, ParentType, ContextType>;
  revisions?: Resolver<Maybe<ResolversTypes['SolutionRevisionConnection']>, ParentType, ContextType, RequireFields<SolutionRevisionsArgs, never>>;
  exercise?: Resolver<ResolversTypes['AbstractExercise'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SolutionRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SolutionRevision'] = ResolversParentTypes['SolutionRevision']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<SolutionRevisionThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<SolutionRevisionEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Solution'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SolutionRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SolutionRevisionConnection'] = ResolversParentTypes['SolutionRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['SolutionRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['SolutionRevision']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SolutionRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SolutionRevisionCursor'] = ResolversParentTypes['SolutionRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['SolutionRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionConnection'] = ResolversParentTypes['SubscriptionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['SubscriptionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['SubscriptionInfo']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionCursor'] = ResolversParentTypes['SubscriptionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['SubscriptionInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionInfo'] = ResolversParentTypes['SubscriptionInfo']> = {
  object?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  sendEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionMutation'] = ResolversParentTypes['SubscriptionMutation']> = {
  set?: Resolver<Maybe<ResolversTypes['SubscriptionSetResponse']>, ParentType, ContextType, RequireFields<SubscriptionMutationSetArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionQuery'] = ResolversParentTypes['SubscriptionQuery']> = {
  currentUserHasSubscribed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<SubscriptionQueryCurrentUserHasSubscribedArgs, 'id'>>;
  getSubscriptions?: Resolver<ResolversTypes['SubscriptionConnection'], ParentType, ContextType, RequireFields<SubscriptionQueryGetSubscriptionsArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionSetResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionSetResponse'] = ResolversParentTypes['SubscriptionSetResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTerm'] = ResolversParentTypes['TaxonomyTerm']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<TaxonomyTermThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<TaxonomyTermEventsArgs, never>>;
  type?: Resolver<ResolversTypes['TaxonomyTermType'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['TaxonomyTerm']>, ParentType, ContextType>;
  children?: Resolver<ResolversTypes['AbstractUuidConnection'], ParentType, ContextType, RequireFields<TaxonomyTermChildrenArgs, never>>;
  navigation?: Resolver<Maybe<ResolversTypes['Navigation']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTermConnection'] = ResolversParentTypes['TaxonomyTermConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['TaxonomyTermEdge']>>>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['TaxonomyTerm']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTermEdge'] = ResolversParentTypes['TaxonomyTermEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Thread'] = ResolversParentTypes['Thread']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  archived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  object?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  comments?: Resolver<ResolversTypes['CommentConnection'], ParentType, ContextType, RequireFields<ThreadCommentsArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadAwareResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadAware'] = ResolversParentTypes['ThreadAware']> = {
  __resolveType: TypeResolveFn<'Applet' | 'AppletRevision' | 'Article' | 'ArticleRevision' | 'Course' | 'CoursePage' | 'CoursePageRevision' | 'CourseRevision' | 'Event' | 'EventRevision' | 'Exercise' | 'ExerciseGroup' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'GroupedExercise' | 'GroupedExerciseRevision' | 'Page' | 'PageRevision' | 'Solution' | 'SolutionRevision' | 'TaxonomyTerm' | 'User' | 'Video' | 'VideoRevision', ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<ThreadAwareThreadsArgs, never>>;
};

export type ThreadCreateCommentResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadCreateCommentResponse'] = ResolversParentTypes['ThreadCreateCommentResponse']> = {
  record?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadCreateThreadResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadCreateThreadResponse'] = ResolversParentTypes['ThreadCreateThreadResponse']> = {
  record?: Resolver<Maybe<ResolversTypes['Thread']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadMutation'] = ResolversParentTypes['ThreadMutation']> = {
  createThread?: Resolver<Maybe<ResolversTypes['ThreadCreateThreadResponse']>, ParentType, ContextType, RequireFields<ThreadMutationCreateThreadArgs, 'input'>>;
  createComment?: Resolver<Maybe<ResolversTypes['ThreadCreateCommentResponse']>, ParentType, ContextType, RequireFields<ThreadMutationCreateCommentArgs, 'input'>>;
  setThreadArchived?: Resolver<Maybe<ResolversTypes['ThreadSetThreadArchivedResponse']>, ParentType, ContextType, RequireFields<ThreadMutationSetThreadArchivedArgs, 'input'>>;
  setThreadState?: Resolver<Maybe<ResolversTypes['ThreadSetThreadStateResponse']>, ParentType, ContextType, RequireFields<ThreadMutationSetThreadStateArgs, 'input'>>;
  setCommentState?: Resolver<Maybe<ResolversTypes['ThreadSetCommentStateResponse']>, ParentType, ContextType, RequireFields<ThreadMutationSetCommentStateArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadSetCommentStateResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadSetCommentStateResponse'] = ResolversParentTypes['ThreadSetCommentStateResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadSetThreadArchivedResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadSetThreadArchivedResponse'] = ResolversParentTypes['ThreadSetThreadArchivedResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadSetThreadStateResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadSetThreadStateResponse'] = ResolversParentTypes['ThreadSetThreadStateResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadsConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadsConnection'] = ResolversParentTypes['ThreadsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ThreadsCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Thread']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadsCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadsCursor'] = ResolversParentTypes['ThreadsCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Thread'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<UserThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<UserEventsArgs, never>>;
  eventsByUser?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<UserEventsByUserArgs, never>>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  lastLogin?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  roles?: Resolver<ResolversTypes['ScopedRoleConnection'], ParentType, ContextType, RequireFields<UserRolesArgs, never>>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  activeAuthor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  activeDonor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  activeReviewer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = {
  edges?: Resolver<Array<ResolversTypes['UserEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDeleteBotsResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserDeleteBotsResponse'] = ResolversParentTypes['UserDeleteBotsResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDeleteRegularUsersResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserDeleteRegularUsersResponse'] = ResolversParentTypes['UserDeleteRegularUsersResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserEdge'] = ResolversParentTypes['UserEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserMutation'] = ResolversParentTypes['UserMutation']> = {
  deleteBots?: Resolver<Array<ResolversTypes['UserDeleteBotsResponse']>, ParentType, ContextType, RequireFields<UserMutationDeleteBotsArgs, 'input'>>;
  deleteRegularUsers?: Resolver<Array<ResolversTypes['UserDeleteRegularUsersResponse']>, ParentType, ContextType, RequireFields<UserMutationDeleteRegularUsersArgs, 'input'>>;
  setEmail?: Resolver<ResolversTypes['UserSetEmailResponse'], ParentType, ContextType, RequireFields<UserMutationSetEmailArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSetEmailResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserSetEmailResponse'] = ResolversParentTypes['UserSetEmailResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UuidMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UuidMutation'] = ResolversParentTypes['UuidMutation']> = {
  setState?: Resolver<Maybe<ResolversTypes['UuidSetStateResponse']>, ParentType, ContextType, RequireFields<UuidMutationSetStateArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UuidSetStateResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UuidSetStateResponse'] = ResolversParentTypes['UuidSetStateResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Video'] = ResolversParentTypes['Video']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<VideoThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<VideoEventsArgs, never>>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['VideoRevision']>, ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['VideoRevisionConnection'], ParentType, ContextType, RequireFields<VideoRevisionsArgs, never>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, RequireFields<VideoTaxonomyTermsArgs, never>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VideoRevision'] = ResolversParentTypes['VideoRevision']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  alias?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, RequireFields<VideoRevisionThreadsArgs, never>>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, RequireFields<VideoRevisionEventsArgs, never>>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Video'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VideoRevisionConnection'] = ResolversParentTypes['VideoRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['VideoRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['VideoRevision']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VideoRevisionCursor'] = ResolversParentTypes['VideoRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['VideoRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type _CacheMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['_cacheMutation'] = ResolversParentTypes['_cacheMutation']> = {
  set?: Resolver<ResolversTypes['CacheSetResponse'], ParentType, ContextType, RequireFields<_CacheMutationSetArgs, 'input'>>;
  remove?: Resolver<ResolversTypes['CacheRemoveResponse'], ParentType, ContextType, RequireFields<_CacheMutationRemoveArgs, 'input'>>;
  update?: Resolver<ResolversTypes['CacheUpdateResponse'], ParentType, ContextType, RequireFields<_CacheMutationUpdateArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AbstractEntity?: AbstractEntityResolvers<ContextType>;
  AbstractEntityRevision?: AbstractEntityRevisionResolvers<ContextType>;
  AbstractExercise?: AbstractExerciseResolvers<ContextType>;
  AbstractExerciseRevision?: AbstractExerciseRevisionResolvers<ContextType>;
  AbstractNavigationChild?: AbstractNavigationChildResolvers<ContextType>;
  AbstractNotificationEvent?: AbstractNotificationEventResolvers<ContextType>;
  AbstractNotificationEventConnection?: AbstractNotificationEventConnectionResolvers<ContextType>;
  AbstractNotificationEventEdge?: AbstractNotificationEventEdgeResolvers<ContextType>;
  AbstractRepository?: AbstractRepositoryResolvers<ContextType>;
  AbstractRevision?: AbstractRevisionResolvers<ContextType>;
  AbstractTaxonomyTermChild?: AbstractTaxonomyTermChildResolvers<ContextType>;
  AbstractUuid?: AbstractUuidResolvers<ContextType>;
  AbstractUuidConnection?: AbstractUuidConnectionResolvers<ContextType>;
  AbstractUuidCursor?: AbstractUuidCursorResolvers<ContextType>;
  Applet?: AppletResolvers<ContextType>;
  AppletRevision?: AppletRevisionResolvers<ContextType>;
  AppletRevisionConnection?: AppletRevisionConnectionResolvers<ContextType>;
  AppletRevisionCursor?: AppletRevisionCursorResolvers<ContextType>;
  Article?: ArticleResolvers<ContextType>;
  ArticleRevision?: ArticleRevisionResolvers<ContextType>;
  ArticleRevisionConnection?: ArticleRevisionConnectionResolvers<ContextType>;
  ArticleRevisionCursor?: ArticleRevisionCursorResolvers<ContextType>;
  CacheRemoveResponse?: CacheRemoveResponseResolvers<ContextType>;
  CacheSetResponse?: CacheSetResponseResolvers<ContextType>;
  CacheUpdateResponse?: CacheUpdateResponseResolvers<ContextType>;
  CheckoutRevisionNotificationEvent?: CheckoutRevisionNotificationEventResolvers<ContextType>;
  CheckoutRevisionResponse?: CheckoutRevisionResponseResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  CommentConnection?: CommentConnectionResolvers<ContextType>;
  CommentEdge?: CommentEdgeResolvers<ContextType>;
  Course?: CourseResolvers<ContextType>;
  CoursePage?: CoursePageResolvers<ContextType>;
  CoursePageRevision?: CoursePageRevisionResolvers<ContextType>;
  CoursePageRevisionConnection?: CoursePageRevisionConnectionResolvers<ContextType>;
  CoursePageRevisionCursor?: CoursePageRevisionCursorResolvers<ContextType>;
  CourseRevision?: CourseRevisionResolvers<ContextType>;
  CourseRevisionConnection?: CourseRevisionConnectionResolvers<ContextType>;
  CourseRevisionCursor?: CourseRevisionCursorResolvers<ContextType>;
  CreateCommentNotificationEvent?: CreateCommentNotificationEventResolvers<ContextType>;
  CreateEntityLinkNotificationEvent?: CreateEntityLinkNotificationEventResolvers<ContextType>;
  CreateEntityNotificationEvent?: CreateEntityNotificationEventResolvers<ContextType>;
  CreateEntityRevisionNotificationEvent?: CreateEntityRevisionNotificationEventResolvers<ContextType>;
  CreateTaxonomyLinkNotificationEvent?: CreateTaxonomyLinkNotificationEventResolvers<ContextType>;
  CreateTaxonomyTermNotificationEvent?: CreateTaxonomyTermNotificationEventResolvers<ContextType>;
  CreateThreadNotificationEvent?: CreateThreadNotificationEventResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  EntityMutation?: EntityMutationResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventRevision?: EventRevisionResolvers<ContextType>;
  EventRevisionConnection?: EventRevisionConnectionResolvers<ContextType>;
  EventRevisionCursor?: EventRevisionCursorResolvers<ContextType>;
  Exercise?: ExerciseResolvers<ContextType>;
  ExerciseGroup?: ExerciseGroupResolvers<ContextType>;
  ExerciseGroupRevision?: ExerciseGroupRevisionResolvers<ContextType>;
  ExerciseGroupRevisionConnection?: ExerciseGroupRevisionConnectionResolvers<ContextType>;
  ExerciseGroupRevisionCursor?: ExerciseGroupRevisionCursorResolvers<ContextType>;
  ExerciseRevision?: ExerciseRevisionResolvers<ContextType>;
  ExerciseRevisionConnection?: ExerciseRevisionConnectionResolvers<ContextType>;
  ExerciseRevisionCursor?: ExerciseRevisionCursorResolvers<ContextType>;
  GroupedExercise?: GroupedExerciseResolvers<ContextType>;
  GroupedExerciseRevision?: GroupedExerciseRevisionResolvers<ContextType>;
  GroupedExerciseRevisionConnection?: GroupedExerciseRevisionConnectionResolvers<ContextType>;
  GroupedExerciseRevisionCursor?: GroupedExerciseRevisionCursorResolvers<ContextType>;
  InstanceAware?: InstanceAwareResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  License?: LicenseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Navigation?: NavigationResolvers<ContextType>;
  NavigationNode?: NavigationNodeResolvers<ContextType>;
  NavigationNodeConnection?: NavigationNodeConnectionResolvers<ContextType>;
  NavigationNodeEdge?: NavigationNodeEdgeResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  NotificationConnection?: NotificationConnectionResolvers<ContextType>;
  NotificationEdge?: NotificationEdgeResolvers<ContextType>;
  NotificationMutation?: NotificationMutationResolvers<ContextType>;
  NotificationSetStateResponse?: NotificationSetStateResponseResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PageRevision?: PageRevisionResolvers<ContextType>;
  PageRevisionConnection?: PageRevisionConnectionResolvers<ContextType>;
  PageRevisionCursor?: PageRevisionCursorResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RejectRevisionNotificationEvent?: RejectRevisionNotificationEventResolvers<ContextType>;
  RejectRevisionResponse?: RejectRevisionResponseResolvers<ContextType>;
  RemoveEntityLinkNotificationEvent?: RemoveEntityLinkNotificationEventResolvers<ContextType>;
  RemoveTaxonomyLinkNotificationEvent?: RemoveTaxonomyLinkNotificationEventResolvers<ContextType>;
  ScopedRole?: ScopedRoleResolvers<ContextType>;
  ScopedRoleConnection?: ScopedRoleConnectionResolvers<ContextType>;
  ScopedRoleCursor?: ScopedRoleCursorResolvers<ContextType>;
  SetLicenseNotificationEvent?: SetLicenseNotificationEventResolvers<ContextType>;
  SetTaxonomyParentNotificationEvent?: SetTaxonomyParentNotificationEventResolvers<ContextType>;
  SetTaxonomyTermNotificationEvent?: SetTaxonomyTermNotificationEventResolvers<ContextType>;
  SetThreadStateNotificationEvent?: SetThreadStateNotificationEventResolvers<ContextType>;
  SetUuidStateNotificationEvent?: SetUuidStateNotificationEventResolvers<ContextType>;
  Solution?: SolutionResolvers<ContextType>;
  SolutionRevision?: SolutionRevisionResolvers<ContextType>;
  SolutionRevisionConnection?: SolutionRevisionConnectionResolvers<ContextType>;
  SolutionRevisionCursor?: SolutionRevisionCursorResolvers<ContextType>;
  SubscriptionConnection?: SubscriptionConnectionResolvers<ContextType>;
  SubscriptionCursor?: SubscriptionCursorResolvers<ContextType>;
  SubscriptionInfo?: SubscriptionInfoResolvers<ContextType>;
  SubscriptionMutation?: SubscriptionMutationResolvers<ContextType>;
  SubscriptionQuery?: SubscriptionQueryResolvers<ContextType>;
  SubscriptionSetResponse?: SubscriptionSetResponseResolvers<ContextType>;
  TaxonomyTerm?: TaxonomyTermResolvers<ContextType>;
  TaxonomyTermConnection?: TaxonomyTermConnectionResolvers<ContextType>;
  TaxonomyTermEdge?: TaxonomyTermEdgeResolvers<ContextType>;
  Thread?: ThreadResolvers<ContextType>;
  ThreadAware?: ThreadAwareResolvers<ContextType>;
  ThreadCreateCommentResponse?: ThreadCreateCommentResponseResolvers<ContextType>;
  ThreadCreateThreadResponse?: ThreadCreateThreadResponseResolvers<ContextType>;
  ThreadMutation?: ThreadMutationResolvers<ContextType>;
  ThreadSetCommentStateResponse?: ThreadSetCommentStateResponseResolvers<ContextType>;
  ThreadSetThreadArchivedResponse?: ThreadSetThreadArchivedResponseResolvers<ContextType>;
  ThreadSetThreadStateResponse?: ThreadSetThreadStateResponseResolvers<ContextType>;
  ThreadsConnection?: ThreadsConnectionResolvers<ContextType>;
  ThreadsCursor?: ThreadsCursorResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserDeleteBotsResponse?: UserDeleteBotsResponseResolvers<ContextType>;
  UserDeleteRegularUsersResponse?: UserDeleteRegularUsersResponseResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
  UserMutation?: UserMutationResolvers<ContextType>;
  UserSetEmailResponse?: UserSetEmailResponseResolvers<ContextType>;
  UuidMutation?: UuidMutationResolvers<ContextType>;
  UuidSetStateResponse?: UuidSetStateResponseResolvers<ContextType>;
  Video?: VideoResolvers<ContextType>;
  VideoRevision?: VideoRevisionResolvers<ContextType>;
  VideoRevisionConnection?: VideoRevisionConnectionResolvers<ContextType>;
  VideoRevisionCursor?: VideoRevisionCursorResolvers<ContextType>;
  _cacheMutation?: _CacheMutationResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
