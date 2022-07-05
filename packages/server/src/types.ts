import type { ModelOf } from '~/internals/model'
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { Context } from '~/internals/graphql/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = undefined | T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  alias: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  subject?: Maybe<Subject>;
  title: Scalars['String'];
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
  nodes: Array<Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video>;
  pageInfo: HasNextPageInfo;
  totalCount: Scalars['Int'];
};

export type AbstractEntityCursor = {
  __typename?: 'AbstractEntityCursor';
  cursor: Scalars['String'];
  node: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
};

export type AbstractEntityRevision = {
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  title: Scalars['String'];
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
  alias: Scalars['String'];
  currentRevision?: Maybe<ExerciseRevision | GroupedExerciseRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  solution?: Maybe<Solution>;
  title: Scalars['String'];
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
  alias: Scalars['String'];
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  title: Scalars['String'];
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
  nodes: Array<CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent>;
  pageInfo: HasNextPageInfo;
};

export type AbstractNotificationEventEdge = {
  __typename?: 'AbstractNotificationEventEdge';
  cursor: Scalars['String'];
  node: CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent;
};

export type AbstractRepository = {
  alias: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  threads: ThreadsConnection;
  title: Scalars['String'];
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
  alias: Scalars['String'];
  author: User;
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  threads: ThreadsConnection;
  title: Scalars['String'];
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
  alias: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  taxonomyTerms: TaxonomyTermConnection;
  title: Scalars['String'];
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
  alias: Scalars['String'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  title: Scalars['String'];
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
  nodes: Array<Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type AbstractUuidCursor = {
  __typename?: 'AbstractUuidCursor';
  cursor: Scalars['String'];
  node: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
};

export type AddRevisionResponse = {
  __typename?: 'AddRevisionResponse';
  query: Query;
  revisionId?: Maybe<Scalars['Int']>;
  success: Scalars['Boolean'];
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
  alias: Scalars['String'];
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
  title: Scalars['String'];
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
  alias: Scalars['String'];
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
  alias: Scalars['String'];
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
  title: Scalars['String'];
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
  alias: Scalars['String'];
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
  repository: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Page | Solution | Video;
  revision: AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | GroupedExerciseRevision | PageRevision | SolutionRevision | VideoRevision;
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
  legacyObject: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  alias: Scalars['String'];
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
  title: Scalars['String'];
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
  alias: Scalars['String'];
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
  title: Scalars['String'];
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
  alias: Scalars['String'];
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
  alias: Scalars['String'];
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

export type CreateEntityLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityLinkNotificationEvent';
  actor: User;
  child: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  parent: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
};

export type CreateEntityNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  entity: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
};

export type CreateEntityRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityRevisionNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  entity: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Page | Solution | Video;
  entityRevision: AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | GroupedExerciseRevision | PageRevision | SolutionRevision | VideoRevision;
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
};

export type CreatePageInput = {
  content: Scalars['String'];
  discussionsEnabled: Scalars['Boolean'];
  forumId?: InputMaybe<Scalars['Int']>;
  instance: Instance;
  licenseId: Scalars['Int'];
  title: Scalars['String'];
};

export type CreateTaxonomyLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateTaxonomyLinkNotificationEvent';
  actor: User;
  child: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
  objectId: Scalars['Int'];
  thread: Thread;
};

export type DeletedEntitiesConnection = {
  __typename?: 'DeletedEntitiesConnection';
  edges: Array<DeletedEntityCursor>;
  nodes: Array<DeletedEntity>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type DeletedEntity = {
  __typename?: 'DeletedEntity';
  dateOfDeletion?: Maybe<Scalars['String']>;
  entity?: Maybe<Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video>;
};

export type DeletedEntityCursor = {
  __typename?: 'DeletedEntityCursor';
  cursor: Scalars['String'];
  node: DeletedEntity;
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
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  instance?: InputMaybe<Instance>;
};

export type EntitySortInput = {
  childrenIds: Array<Scalars['Int']>;
  entityId: Scalars['Int'];
};

export type EntitySortResponse = {
  __typename?: 'EntitySortResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type EntityUpdateLicenseInput = {
  entityId: Scalars['Int'];
  licenseId: Scalars['Int'];
};

export type EntityUpdateLicenseResponse = {
  __typename?: 'EntityUpdateLicenseResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type Event = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Event';
  alias: Scalars['String'];
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
  title: Scalars['String'];
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
  alias: Scalars['String'];
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
  alias: Scalars['String'];
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
  title: Scalars['String'];
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
  alias: Scalars['String'];
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
  title: Scalars['String'];
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
  alias: Scalars['String'];
  author: User;
  changes: Scalars['String'];
  cohesive: Scalars['Boolean'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  repository: ExerciseGroup;
  threads: ThreadsConnection;
  title: Scalars['String'];
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
  alias: Scalars['String'];
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  repository: Exercise;
  threads: ThreadsConnection;
  title: Scalars['String'];
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
  alias: Scalars['String'];
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
  title: Scalars['String'];
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
  alias: Scalars['String'];
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  repository: GroupedExercise;
  threads: ThreadsConnection;
  title: Scalars['String'];
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
  id: Scalars['Int'];
  instance: Instance;
  shortTitle: Scalars['String'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type LicenseQuery = {
  __typename?: 'LicenseQuery';
  license?: Maybe<License>;
  licenses: Array<License>;
};


export type LicenseQueryLicenseArgs = {
  id: Scalars['Int'];
};


export type LicenseQueryLicensesArgs = {
  instance?: InputMaybe<Instance>;
};

export type MetadataQuery = {
  __typename?: 'MetadataQuery';
  entities: EntityMetadataConnection;
  publisher: Scalars['JSONObject'];
  version: Scalars['String'];
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
  event: CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent;
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
  alias: Scalars['String'];
  currentRevision?: Maybe<PageRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  navigation?: Maybe<Navigation>;
  revisions: PageRevisionConnection;
  threads: ThreadsConnection;
  title: Scalars['String'];
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

export type PageQuery = {
  __typename?: 'PageQuery';
  pages: Array<Page>;
};


export type PageQueryPagesArgs = {
  instance?: InputMaybe<Instance>;
};

export type PageRevision = AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'PageRevision';
  alias: Scalars['String'];
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
  entity?: Maybe<EntityQuery>;
  events: AbstractNotificationEventConnection;
  license: LicenseQuery;
  metadata: MetadataQuery;
  notificationEvent?: Maybe<CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent>;
  notifications: NotificationConnection;
  page: PageQuery;
  subject: SubjectQuery;
  subscription: SubscriptionQuery;
  thread: ThreadQuery;
  user: UserQuery;
  uuid?: Maybe<Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision>;
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
  repository: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Page | Solution | Video;
  revision: AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | GroupedExerciseRevision | PageRevision | SolutionRevision | VideoRevision;
};

export type RejectRevisionResponse = {
  __typename?: 'RejectRevisionResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type RemoveEntityLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RemoveEntityLinkNotificationEvent';
  actor: User;
  child: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  parent: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video;
};

export type RemoveTaxonomyLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RemoveTaxonomyLinkNotificationEvent';
  actor: User;
  child: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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

export type SetAppletInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId?: InputMaybe<Scalars['Int']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  parentId?: InputMaybe<Scalars['Int']>;
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type SetArticleInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId?: InputMaybe<Scalars['Int']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  parentId?: InputMaybe<Scalars['Int']>;
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
};

export type SetCourseInput = {
  changes: Scalars['String'];
  content?: InputMaybe<Scalars['String']>;
  entityId?: InputMaybe<Scalars['Int']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  parentId?: InputMaybe<Scalars['Int']>;
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
};

export type SetCoursePageInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId?: InputMaybe<Scalars['Int']>;
  needsReview: Scalars['Boolean'];
  parentId?: InputMaybe<Scalars['Int']>;
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
};

export type SetEntityResponse = {
  __typename?: 'SetEntityResponse';
  query: Query;
  record?: Maybe<Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Solution | Video>;
  success: Scalars['Boolean'];
};

export type SetEventInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId?: InputMaybe<Scalars['Int']>;
  metaDescription?: InputMaybe<Scalars['String']>;
  metaTitle?: InputMaybe<Scalars['String']>;
  needsReview: Scalars['Boolean'];
  parentId?: InputMaybe<Scalars['Int']>;
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
};

export type SetExerciseGroupInput = {
  changes: Scalars['String'];
  cohesive: Scalars['Boolean'];
  content: Scalars['String'];
  entityId?: InputMaybe<Scalars['Int']>;
  needsReview: Scalars['Boolean'];
  parentId?: InputMaybe<Scalars['Int']>;
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
};

export type SetGenericEntityInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId?: InputMaybe<Scalars['Int']>;
  needsReview: Scalars['Boolean'];
  parentId?: InputMaybe<Scalars['Int']>;
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
};

export type SetLicenseNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetLicenseNotificationEvent';
  actor: User;
  date: Scalars['DateTime'];
  id: Scalars['Int'];
  instance: Instance;
  objectId: Scalars['Int'];
  repository: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | GroupedExercise | Page | Solution | Video;
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
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
  objectId: Scalars['Int'];
  trashed: Scalars['Boolean'];
};

export type SetVideoInput = {
  changes: Scalars['String'];
  content: Scalars['String'];
  entityId?: InputMaybe<Scalars['Int']>;
  needsReview: Scalars['Boolean'];
  parentId?: InputMaybe<Scalars['Int']>;
  subscribeThis: Scalars['Boolean'];
  subscribeThisByEmail: Scalars['Boolean'];
  title: Scalars['String'];
  url: Scalars['String'];
};

export type Solution = AbstractEntity & AbstractRepository & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Solution';
  alias: Scalars['String'];
  currentRevision?: Maybe<SolutionRevision>;
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  exercise: Exercise | GroupedExercise;
  id: Scalars['Int'];
  instance: Instance;
  license: License;
  revisions: SolutionRevisionConnection;
  subject?: Maybe<Subject>;
  threads: ThreadsConnection;
  title: Scalars['String'];
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
  alias: Scalars['String'];
  author: User;
  changes: Scalars['String'];
  content: Scalars['String'];
  date: Scalars['DateTime'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int'];
  repository: Solution;
  threads: ThreadsConnection;
  title: Scalars['String'];
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

export type TaxonomyEntityLinksInput = {
  entityIds: Array<Scalars['Int']>;
  taxonomyTermId: Scalars['Int'];
};

export type TaxonomyEntityLinksResponse = {
  __typename?: 'TaxonomyEntityLinksResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type TaxonomyTerm = AbstractNavigationChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'TaxonomyTerm';
  alias: Scalars['String'];
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
  title: Scalars['String'];
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
  name: Scalars['String'];
  parentId: Scalars['Int'];
  taxonomyType: TaxonomyTypeCreateOptions;
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
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type TaxonomyTermSetNameAndDescriptionResponse = {
  __typename?: 'TaxonomyTermSetNameAndDescriptionResponse';
  query: Query;
  success: Scalars['Boolean'];
};

export type TaxonomyTermSortInput = {
  childrenIds: Array<Scalars['Int']>;
  taxonomyTermId: Scalars['Int'];
};

export type TaxonomyTermSortResponse = {
  __typename?: 'TaxonomyTermSortResponse';
  query: Query;
  success: Scalars['Boolean'];
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
  archived: Scalars['Boolean'];
  comments: CommentConnection;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | GroupedExercise | GroupedExerciseRevision | Page | PageRevision | Solution | SolutionRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  instance?: InputMaybe<Instance>;
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
  alias: Scalars['String'];
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
  title: Scalars['String'];
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

export type UserDeleteOwnAccountResponse = {
  __typename?: 'UserDeleteOwnAccountResponse';
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
  deleteOwnAccount: UserDeleteOwnAccountResponse;
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
  alias: Scalars['String'];
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
  title: Scalars['String'];
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
  alias: Scalars['String'];
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

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
  AbstractEntityConnection: ResolverTypeWrapper<ModelOf<AbstractEntityConnection>>;
  AbstractEntityCursor: ResolverTypeWrapper<ModelOf<AbstractEntityCursor>>;
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
  AddRevisionResponse: ResolverTypeWrapper<ModelOf<AddRevisionResponse>>;
  AliasInput: ResolverTypeWrapper<ModelOf<AliasInput>>;
  AllThreadsConnection: ResolverTypeWrapper<ModelOf<AllThreadsConnection>>;
  Applet: ResolverTypeWrapper<ModelOf<Applet>>;
  AppletRevision: ResolverTypeWrapper<ModelOf<AppletRevision>>;
  AppletRevisionConnection: ResolverTypeWrapper<ModelOf<AppletRevisionConnection>>;
  AppletRevisionCursor: ResolverTypeWrapper<ModelOf<AppletRevisionCursor>>;
  Article: ResolverTypeWrapper<ModelOf<Article>>;
  ArticleRevision: ResolverTypeWrapper<ModelOf<ArticleRevision>>;
  ArticleRevisionConnection: ResolverTypeWrapper<ModelOf<ArticleRevisionConnection>>;
  ArticleRevisionCursor: ResolverTypeWrapper<ModelOf<ArticleRevisionCursor>>;
  Boolean: ResolverTypeWrapper<ModelOf<Scalars['Boolean']>>;
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
  CreatePageInput: ResolverTypeWrapper<ModelOf<CreatePageInput>>;
  CreateTaxonomyLinkNotificationEvent: ResolverTypeWrapper<ModelOf<CreateTaxonomyLinkNotificationEvent>>;
  CreateTaxonomyTermNotificationEvent: ResolverTypeWrapper<ModelOf<CreateTaxonomyTermNotificationEvent>>;
  CreateThreadNotificationEvent: ResolverTypeWrapper<ModelOf<CreateThreadNotificationEvent>>;
  DateTime: ResolverTypeWrapper<ModelOf<Scalars['DateTime']>>;
  DeletedEntitiesConnection: ResolverTypeWrapper<ModelOf<DeletedEntitiesConnection>>;
  DeletedEntity: ResolverTypeWrapper<ModelOf<DeletedEntity>>;
  DeletedEntityCursor: ResolverTypeWrapper<ModelOf<DeletedEntityCursor>>;
  EntityMetadataConnection: ResolverTypeWrapper<ModelOf<EntityMetadataConnection>>;
  EntityMetadataCursor: ResolverTypeWrapper<ModelOf<EntityMetadataCursor>>;
  EntityMutation: ResolverTypeWrapper<ModelOf<EntityMutation>>;
  EntityQuery: ResolverTypeWrapper<ModelOf<EntityQuery>>;
  EntitySortInput: ResolverTypeWrapper<ModelOf<EntitySortInput>>;
  EntitySortResponse: ResolverTypeWrapper<ModelOf<EntitySortResponse>>;
  EntityUpdateLicenseInput: ResolverTypeWrapper<ModelOf<EntityUpdateLicenseInput>>;
  EntityUpdateLicenseResponse: ResolverTypeWrapper<ModelOf<EntityUpdateLicenseResponse>>;
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
  HasNextPageInfo: ResolverTypeWrapper<ModelOf<HasNextPageInfo>>;
  Instance: ResolverTypeWrapper<ModelOf<Instance>>;
  InstanceAware: ResolversTypes['Applet'] | ResolversTypes['Article'] | ResolversTypes['CheckoutRevisionNotificationEvent'] | ResolversTypes['Course'] | ResolversTypes['CoursePage'] | ResolversTypes['CreateCommentNotificationEvent'] | ResolversTypes['CreateEntityLinkNotificationEvent'] | ResolversTypes['CreateEntityNotificationEvent'] | ResolversTypes['CreateEntityRevisionNotificationEvent'] | ResolversTypes['CreateTaxonomyLinkNotificationEvent'] | ResolversTypes['CreateTaxonomyTermNotificationEvent'] | ResolversTypes['CreateThreadNotificationEvent'] | ResolversTypes['Event'] | ResolversTypes['Exercise'] | ResolversTypes['ExerciseGroup'] | ResolversTypes['GroupedExercise'] | ResolversTypes['Page'] | ResolversTypes['RejectRevisionNotificationEvent'] | ResolversTypes['RemoveEntityLinkNotificationEvent'] | ResolversTypes['RemoveTaxonomyLinkNotificationEvent'] | ResolversTypes['SetLicenseNotificationEvent'] | ResolversTypes['SetTaxonomyParentNotificationEvent'] | ResolversTypes['SetTaxonomyTermNotificationEvent'] | ResolversTypes['SetThreadStateNotificationEvent'] | ResolversTypes['SetUuidStateNotificationEvent'] | ResolversTypes['Solution'] | ResolversTypes['TaxonomyTerm'] | ResolversTypes['Video'];
  Int: ResolverTypeWrapper<ModelOf<Scalars['Int']>>;
  JSON: ResolverTypeWrapper<ModelOf<Scalars['JSON']>>;
  JSONObject: ResolverTypeWrapper<ModelOf<Scalars['JSONObject']>>;
  License: ResolverTypeWrapper<ModelOf<License>>;
  LicenseQuery: ResolverTypeWrapper<ModelOf<LicenseQuery>>;
  MetadataQuery: ResolverTypeWrapper<ModelOf<MetadataQuery>>;
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
  PageAddRevisionInput: ResolverTypeWrapper<ModelOf<PageAddRevisionInput>>;
  PageCreateResponse: ResolverTypeWrapper<ModelOf<PageCreateResponse>>;
  PageInfo: ResolverTypeWrapper<ModelOf<PageInfo>>;
  PageMutation: ResolverTypeWrapper<ModelOf<PageMutation>>;
  PageQuery: ResolverTypeWrapper<ModelOf<PageQuery>>;
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
  SetAppletInput: ResolverTypeWrapper<ModelOf<SetAppletInput>>;
  SetArticleInput: ResolverTypeWrapper<ModelOf<SetArticleInput>>;
  SetCourseInput: ResolverTypeWrapper<ModelOf<SetCourseInput>>;
  SetCoursePageInput: ResolverTypeWrapper<ModelOf<SetCoursePageInput>>;
  SetEntityResponse: ResolverTypeWrapper<ModelOf<SetEntityResponse>>;
  SetEventInput: ResolverTypeWrapper<ModelOf<SetEventInput>>;
  SetExerciseGroupInput: ResolverTypeWrapper<ModelOf<SetExerciseGroupInput>>;
  SetGenericEntityInput: ResolverTypeWrapper<ModelOf<SetGenericEntityInput>>;
  SetLicenseNotificationEvent: ResolverTypeWrapper<ModelOf<SetLicenseNotificationEvent>>;
  SetTaxonomyParentNotificationEvent: ResolverTypeWrapper<ModelOf<SetTaxonomyParentNotificationEvent>>;
  SetTaxonomyTermNotificationEvent: ResolverTypeWrapper<ModelOf<SetTaxonomyTermNotificationEvent>>;
  SetThreadStateNotificationEvent: ResolverTypeWrapper<ModelOf<SetThreadStateNotificationEvent>>;
  SetUuidStateNotificationEvent: ResolverTypeWrapper<ModelOf<SetUuidStateNotificationEvent>>;
  SetVideoInput: ResolverTypeWrapper<ModelOf<SetVideoInput>>;
  Solution: ResolverTypeWrapper<ModelOf<Solution>>;
  SolutionRevision: ResolverTypeWrapper<ModelOf<SolutionRevision>>;
  SolutionRevisionConnection: ResolverTypeWrapper<ModelOf<SolutionRevisionConnection>>;
  SolutionRevisionCursor: ResolverTypeWrapper<ModelOf<SolutionRevisionCursor>>;
  String: ResolverTypeWrapper<ModelOf<Scalars['String']>>;
  Subject: ResolverTypeWrapper<ModelOf<Subject>>;
  SubjectQuery: ResolverTypeWrapper<ModelOf<SubjectQuery>>;
  SubscriptionConnection: ResolverTypeWrapper<ModelOf<SubscriptionConnection>>;
  SubscriptionCursor: ResolverTypeWrapper<ModelOf<SubscriptionCursor>>;
  SubscriptionInfo: ResolverTypeWrapper<ModelOf<SubscriptionInfo>>;
  SubscriptionMutation: ResolverTypeWrapper<ModelOf<SubscriptionMutation>>;
  SubscriptionQuery: ResolverTypeWrapper<ModelOf<SubscriptionQuery>>;
  SubscriptionSetInput: ResolverTypeWrapper<ModelOf<SubscriptionSetInput>>;
  SubscriptionSetResponse: ResolverTypeWrapper<ModelOf<SubscriptionSetResponse>>;
  TaxonomyEntityLinksInput: ResolverTypeWrapper<ModelOf<TaxonomyEntityLinksInput>>;
  TaxonomyEntityLinksResponse: ResolverTypeWrapper<ModelOf<TaxonomyEntityLinksResponse>>;
  TaxonomyTerm: ResolverTypeWrapper<ModelOf<TaxonomyTerm>>;
  TaxonomyTermConnection: ResolverTypeWrapper<ModelOf<TaxonomyTermConnection>>;
  TaxonomyTermCreateInput: ResolverTypeWrapper<ModelOf<TaxonomyTermCreateInput>>;
  TaxonomyTermCreateResponse: ResolverTypeWrapper<ModelOf<TaxonomyTermCreateResponse>>;
  TaxonomyTermEdge: ResolverTypeWrapper<ModelOf<TaxonomyTermEdge>>;
  TaxonomyTermMutation: ResolverTypeWrapper<ModelOf<TaxonomyTermMutation>>;
  TaxonomyTermSetNameAndDescriptionInput: ResolverTypeWrapper<ModelOf<TaxonomyTermSetNameAndDescriptionInput>>;
  TaxonomyTermSetNameAndDescriptionResponse: ResolverTypeWrapper<ModelOf<TaxonomyTermSetNameAndDescriptionResponse>>;
  TaxonomyTermSortInput: ResolverTypeWrapper<ModelOf<TaxonomyTermSortInput>>;
  TaxonomyTermSortResponse: ResolverTypeWrapper<ModelOf<TaxonomyTermSortResponse>>;
  TaxonomyTermType: ResolverTypeWrapper<ModelOf<TaxonomyTermType>>;
  TaxonomyTypeCreateOptions: ResolverTypeWrapper<ModelOf<TaxonomyTypeCreateOptions>>;
  Thread: ResolverTypeWrapper<ModelOf<Thread>>;
  ThreadAware: ResolversTypes['Applet'] | ResolversTypes['AppletRevision'] | ResolversTypes['Article'] | ResolversTypes['ArticleRevision'] | ResolversTypes['Course'] | ResolversTypes['CoursePage'] | ResolversTypes['CoursePageRevision'] | ResolversTypes['CourseRevision'] | ResolversTypes['Event'] | ResolversTypes['EventRevision'] | ResolversTypes['Exercise'] | ResolversTypes['ExerciseGroup'] | ResolversTypes['ExerciseGroupRevision'] | ResolversTypes['ExerciseRevision'] | ResolversTypes['GroupedExercise'] | ResolversTypes['GroupedExerciseRevision'] | ResolversTypes['Page'] | ResolversTypes['PageRevision'] | ResolversTypes['Solution'] | ResolversTypes['SolutionRevision'] | ResolversTypes['TaxonomyTerm'] | ResolversTypes['User'] | ResolversTypes['Video'] | ResolversTypes['VideoRevision'];
  ThreadCreateCommentInput: ResolverTypeWrapper<ModelOf<ThreadCreateCommentInput>>;
  ThreadCreateCommentResponse: ResolverTypeWrapper<ModelOf<ThreadCreateCommentResponse>>;
  ThreadCreateThreadInput: ResolverTypeWrapper<ModelOf<ThreadCreateThreadInput>>;
  ThreadCreateThreadResponse: ResolverTypeWrapper<ModelOf<ThreadCreateThreadResponse>>;
  ThreadMutation: ResolverTypeWrapper<ModelOf<ThreadMutation>>;
  ThreadQuery: ResolverTypeWrapper<ModelOf<ThreadQuery>>;
  ThreadSetCommentStateInput: ResolverTypeWrapper<ModelOf<ThreadSetCommentStateInput>>;
  ThreadSetCommentStateResponse: ResolverTypeWrapper<ModelOf<ThreadSetCommentStateResponse>>;
  ThreadSetThreadArchivedInput: ResolverTypeWrapper<ModelOf<ThreadSetThreadArchivedInput>>;
  ThreadSetThreadArchivedResponse: ResolverTypeWrapper<ModelOf<ThreadSetThreadArchivedResponse>>;
  ThreadSetThreadStateInput: ResolverTypeWrapper<ModelOf<ThreadSetThreadStateInput>>;
  ThreadSetThreadStateResponse: ResolverTypeWrapper<ModelOf<ThreadSetThreadStateResponse>>;
  ThreadsConnection: ResolverTypeWrapper<ModelOf<ThreadsConnection>>;
  ThreadsCursor: ResolverTypeWrapper<ModelOf<ThreadsCursor>>;
  User: ResolverTypeWrapper<ModelOf<User>>;
  UserActivityByType: ResolverTypeWrapper<ModelOf<UserActivityByType>>;
  UserConnection: ResolverTypeWrapper<ModelOf<UserConnection>>;
  UserDeleteBotsInput: ResolverTypeWrapper<ModelOf<UserDeleteBotsInput>>;
  UserDeleteBotsResponse: ResolverTypeWrapper<ModelOf<UserDeleteBotsResponse>>;
  UserDeleteOwnAccountResponse: ResolverTypeWrapper<ModelOf<UserDeleteOwnAccountResponse>>;
  UserDeleteRegularUsersInput: ResolverTypeWrapper<ModelOf<UserDeleteRegularUsersInput>>;
  UserDeleteRegularUsersResponse: ResolverTypeWrapper<ModelOf<UserDeleteRegularUsersResponse>>;
  UserEdge: ResolverTypeWrapper<ModelOf<UserEdge>>;
  UserMutation: ResolverTypeWrapper<ModelOf<UserMutation>>;
  UserQuery: ResolverTypeWrapper<ModelOf<UserQuery>>;
  UserSetDescriptionInput: ResolverTypeWrapper<ModelOf<UserSetDescriptionInput>>;
  UserSetDescriptionResponse: ResolverTypeWrapper<ModelOf<UserSetDescriptionResponse>>;
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
  AbstractEntityConnection: ModelOf<AbstractEntityConnection>;
  AbstractEntityCursor: ModelOf<AbstractEntityCursor>;
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
  AddRevisionResponse: ModelOf<AddRevisionResponse>;
  AliasInput: ModelOf<AliasInput>;
  AllThreadsConnection: ModelOf<AllThreadsConnection>;
  Applet: ModelOf<Applet>;
  AppletRevision: ModelOf<AppletRevision>;
  AppletRevisionConnection: ModelOf<AppletRevisionConnection>;
  AppletRevisionCursor: ModelOf<AppletRevisionCursor>;
  Article: ModelOf<Article>;
  ArticleRevision: ModelOf<ArticleRevision>;
  ArticleRevisionConnection: ModelOf<ArticleRevisionConnection>;
  ArticleRevisionCursor: ModelOf<ArticleRevisionCursor>;
  Boolean: ModelOf<Scalars['Boolean']>;
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
  CreatePageInput: ModelOf<CreatePageInput>;
  CreateTaxonomyLinkNotificationEvent: ModelOf<CreateTaxonomyLinkNotificationEvent>;
  CreateTaxonomyTermNotificationEvent: ModelOf<CreateTaxonomyTermNotificationEvent>;
  CreateThreadNotificationEvent: ModelOf<CreateThreadNotificationEvent>;
  DateTime: ModelOf<Scalars['DateTime']>;
  DeletedEntitiesConnection: ModelOf<DeletedEntitiesConnection>;
  DeletedEntity: ModelOf<DeletedEntity>;
  DeletedEntityCursor: ModelOf<DeletedEntityCursor>;
  EntityMetadataConnection: ModelOf<EntityMetadataConnection>;
  EntityMetadataCursor: ModelOf<EntityMetadataCursor>;
  EntityMutation: ModelOf<EntityMutation>;
  EntityQuery: ModelOf<EntityQuery>;
  EntitySortInput: ModelOf<EntitySortInput>;
  EntitySortResponse: ModelOf<EntitySortResponse>;
  EntityUpdateLicenseInput: ModelOf<EntityUpdateLicenseInput>;
  EntityUpdateLicenseResponse: ModelOf<EntityUpdateLicenseResponse>;
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
  HasNextPageInfo: ModelOf<HasNextPageInfo>;
  InstanceAware: ResolversParentTypes['Applet'] | ResolversParentTypes['Article'] | ResolversParentTypes['CheckoutRevisionNotificationEvent'] | ResolversParentTypes['Course'] | ResolversParentTypes['CoursePage'] | ResolversParentTypes['CreateCommentNotificationEvent'] | ResolversParentTypes['CreateEntityLinkNotificationEvent'] | ResolversParentTypes['CreateEntityNotificationEvent'] | ResolversParentTypes['CreateEntityRevisionNotificationEvent'] | ResolversParentTypes['CreateTaxonomyLinkNotificationEvent'] | ResolversParentTypes['CreateTaxonomyTermNotificationEvent'] | ResolversParentTypes['CreateThreadNotificationEvent'] | ResolversParentTypes['Event'] | ResolversParentTypes['Exercise'] | ResolversParentTypes['ExerciseGroup'] | ResolversParentTypes['GroupedExercise'] | ResolversParentTypes['Page'] | ResolversParentTypes['RejectRevisionNotificationEvent'] | ResolversParentTypes['RemoveEntityLinkNotificationEvent'] | ResolversParentTypes['RemoveTaxonomyLinkNotificationEvent'] | ResolversParentTypes['SetLicenseNotificationEvent'] | ResolversParentTypes['SetTaxonomyParentNotificationEvent'] | ResolversParentTypes['SetTaxonomyTermNotificationEvent'] | ResolversParentTypes['SetThreadStateNotificationEvent'] | ResolversParentTypes['SetUuidStateNotificationEvent'] | ResolversParentTypes['Solution'] | ResolversParentTypes['TaxonomyTerm'] | ResolversParentTypes['Video'];
  Int: ModelOf<Scalars['Int']>;
  JSON: ModelOf<Scalars['JSON']>;
  JSONObject: ModelOf<Scalars['JSONObject']>;
  License: ModelOf<License>;
  LicenseQuery: ModelOf<LicenseQuery>;
  MetadataQuery: ModelOf<MetadataQuery>;
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
  PageAddRevisionInput: ModelOf<PageAddRevisionInput>;
  PageCreateResponse: ModelOf<PageCreateResponse>;
  PageInfo: ModelOf<PageInfo>;
  PageMutation: ModelOf<PageMutation>;
  PageQuery: ModelOf<PageQuery>;
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
  SetAppletInput: ModelOf<SetAppletInput>;
  SetArticleInput: ModelOf<SetArticleInput>;
  SetCourseInput: ModelOf<SetCourseInput>;
  SetCoursePageInput: ModelOf<SetCoursePageInput>;
  SetEntityResponse: ModelOf<SetEntityResponse>;
  SetEventInput: ModelOf<SetEventInput>;
  SetExerciseGroupInput: ModelOf<SetExerciseGroupInput>;
  SetGenericEntityInput: ModelOf<SetGenericEntityInput>;
  SetLicenseNotificationEvent: ModelOf<SetLicenseNotificationEvent>;
  SetTaxonomyParentNotificationEvent: ModelOf<SetTaxonomyParentNotificationEvent>;
  SetTaxonomyTermNotificationEvent: ModelOf<SetTaxonomyTermNotificationEvent>;
  SetThreadStateNotificationEvent: ModelOf<SetThreadStateNotificationEvent>;
  SetUuidStateNotificationEvent: ModelOf<SetUuidStateNotificationEvent>;
  SetVideoInput: ModelOf<SetVideoInput>;
  Solution: ModelOf<Solution>;
  SolutionRevision: ModelOf<SolutionRevision>;
  SolutionRevisionConnection: ModelOf<SolutionRevisionConnection>;
  SolutionRevisionCursor: ModelOf<SolutionRevisionCursor>;
  String: ModelOf<Scalars['String']>;
  Subject: ModelOf<Subject>;
  SubjectQuery: ModelOf<SubjectQuery>;
  SubscriptionConnection: ModelOf<SubscriptionConnection>;
  SubscriptionCursor: ModelOf<SubscriptionCursor>;
  SubscriptionInfo: ModelOf<SubscriptionInfo>;
  SubscriptionMutation: ModelOf<SubscriptionMutation>;
  SubscriptionQuery: ModelOf<SubscriptionQuery>;
  SubscriptionSetInput: ModelOf<SubscriptionSetInput>;
  SubscriptionSetResponse: ModelOf<SubscriptionSetResponse>;
  TaxonomyEntityLinksInput: ModelOf<TaxonomyEntityLinksInput>;
  TaxonomyEntityLinksResponse: ModelOf<TaxonomyEntityLinksResponse>;
  TaxonomyTerm: ModelOf<TaxonomyTerm>;
  TaxonomyTermConnection: ModelOf<TaxonomyTermConnection>;
  TaxonomyTermCreateInput: ModelOf<TaxonomyTermCreateInput>;
  TaxonomyTermCreateResponse: ModelOf<TaxonomyTermCreateResponse>;
  TaxonomyTermEdge: ModelOf<TaxonomyTermEdge>;
  TaxonomyTermMutation: ModelOf<TaxonomyTermMutation>;
  TaxonomyTermSetNameAndDescriptionInput: ModelOf<TaxonomyTermSetNameAndDescriptionInput>;
  TaxonomyTermSetNameAndDescriptionResponse: ModelOf<TaxonomyTermSetNameAndDescriptionResponse>;
  TaxonomyTermSortInput: ModelOf<TaxonomyTermSortInput>;
  TaxonomyTermSortResponse: ModelOf<TaxonomyTermSortResponse>;
  Thread: ModelOf<Thread>;
  ThreadAware: ResolversParentTypes['Applet'] | ResolversParentTypes['AppletRevision'] | ResolversParentTypes['Article'] | ResolversParentTypes['ArticleRevision'] | ResolversParentTypes['Course'] | ResolversParentTypes['CoursePage'] | ResolversParentTypes['CoursePageRevision'] | ResolversParentTypes['CourseRevision'] | ResolversParentTypes['Event'] | ResolversParentTypes['EventRevision'] | ResolversParentTypes['Exercise'] | ResolversParentTypes['ExerciseGroup'] | ResolversParentTypes['ExerciseGroupRevision'] | ResolversParentTypes['ExerciseRevision'] | ResolversParentTypes['GroupedExercise'] | ResolversParentTypes['GroupedExerciseRevision'] | ResolversParentTypes['Page'] | ResolversParentTypes['PageRevision'] | ResolversParentTypes['Solution'] | ResolversParentTypes['SolutionRevision'] | ResolversParentTypes['TaxonomyTerm'] | ResolversParentTypes['User'] | ResolversParentTypes['Video'] | ResolversParentTypes['VideoRevision'];
  ThreadCreateCommentInput: ModelOf<ThreadCreateCommentInput>;
  ThreadCreateCommentResponse: ModelOf<ThreadCreateCommentResponse>;
  ThreadCreateThreadInput: ModelOf<ThreadCreateThreadInput>;
  ThreadCreateThreadResponse: ModelOf<ThreadCreateThreadResponse>;
  ThreadMutation: ModelOf<ThreadMutation>;
  ThreadQuery: ModelOf<ThreadQuery>;
  ThreadSetCommentStateInput: ModelOf<ThreadSetCommentStateInput>;
  ThreadSetCommentStateResponse: ModelOf<ThreadSetCommentStateResponse>;
  ThreadSetThreadArchivedInput: ModelOf<ThreadSetThreadArchivedInput>;
  ThreadSetThreadArchivedResponse: ModelOf<ThreadSetThreadArchivedResponse>;
  ThreadSetThreadStateInput: ModelOf<ThreadSetThreadStateInput>;
  ThreadSetThreadStateResponse: ModelOf<ThreadSetThreadStateResponse>;
  ThreadsConnection: ModelOf<ThreadsConnection>;
  ThreadsCursor: ModelOf<ThreadsCursor>;
  User: ModelOf<User>;
  UserActivityByType: ModelOf<UserActivityByType>;
  UserConnection: ModelOf<UserConnection>;
  UserDeleteBotsInput: ModelOf<UserDeleteBotsInput>;
  UserDeleteBotsResponse: ModelOf<UserDeleteBotsResponse>;
  UserDeleteOwnAccountResponse: ModelOf<UserDeleteOwnAccountResponse>;
  UserDeleteRegularUsersInput: ModelOf<UserDeleteRegularUsersInput>;
  UserDeleteRegularUsersResponse: ModelOf<UserDeleteRegularUsersResponse>;
  UserEdge: ModelOf<UserEdge>;
  UserMutation: ModelOf<UserMutation>;
  UserQuery: ModelOf<UserQuery>;
  UserSetDescriptionInput: ModelOf<UserSetDescriptionInput>;
  UserSetDescriptionResponse: ModelOf<UserSetDescriptionResponse>;
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
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractEntityEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractEntityConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractEntityConnection'] = ResolversParentTypes['AbstractEntityConnection']> = {
  edges?: Resolver<Array<ResolversTypes['AbstractEntityCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['AbstractEntity']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['HasNextPageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractEntityCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractEntityCursor'] = ResolversParentTypes['AbstractEntityCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractEntityRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractEntityRevision'] = ResolversParentTypes['AbstractEntityRevision']> = {
  __resolveType: TypeResolveFn<'AppletRevision' | 'ArticleRevision' | 'CoursePageRevision' | 'CourseRevision' | 'EventRevision' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'GroupedExerciseRevision' | 'SolutionRevision' | 'VideoRevision', ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractEntityRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractExerciseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractExercise'] = ResolversParentTypes['AbstractExercise']> = {
  __resolveType: TypeResolveFn<'Exercise' | 'GroupedExercise', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['AbstractExerciseRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractExerciseEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  solution?: Resolver<Maybe<ResolversTypes['Solution']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractExerciseRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractExerciseRevision'] = ResolversParentTypes['AbstractExerciseRevision']> = {
  __resolveType: TypeResolveFn<'ExerciseRevision' | 'GroupedExerciseRevision', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractExerciseRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractNavigationChildResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractNavigationChild'] = ResolversParentTypes['AbstractNavigationChild']> = {
  __resolveType: TypeResolveFn<'Page' | 'TaxonomyTerm', ParentType, ContextType>;
  navigation?: Resolver<Maybe<ResolversTypes['Navigation']>, ParentType, ContextType>;
};

export type AbstractNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractNotificationEvent'] = ResolversParentTypes['AbstractNotificationEvent']> = {
  __resolveType: TypeResolveFn<'CheckoutRevisionNotificationEvent' | 'CreateCommentNotificationEvent' | 'CreateEntityLinkNotificationEvent' | 'CreateEntityNotificationEvent' | 'CreateEntityRevisionNotificationEvent' | 'CreateTaxonomyLinkNotificationEvent' | 'CreateTaxonomyTermNotificationEvent' | 'CreateThreadNotificationEvent' | 'RejectRevisionNotificationEvent' | 'RemoveEntityLinkNotificationEvent' | 'RemoveTaxonomyLinkNotificationEvent' | 'SetLicenseNotificationEvent' | 'SetTaxonomyParentNotificationEvent' | 'SetTaxonomyTermNotificationEvent' | 'SetThreadStateNotificationEvent' | 'SetUuidStateNotificationEvent', ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type AbstractNotificationEventConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractNotificationEventConnection'] = ResolversParentTypes['AbstractNotificationEventConnection']> = {
  edges?: Resolver<Array<ResolversTypes['AbstractNotificationEventEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['AbstractNotificationEvent']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['HasNextPageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractNotificationEventEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractNotificationEventEdge'] = ResolversParentTypes['AbstractNotificationEventEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AbstractNotificationEvent'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractRepositoryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractRepository'] = ResolversParentTypes['AbstractRepository']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'Course' | 'CoursePage' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'GroupedExercise' | 'Page' | 'Solution' | 'Video', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractRepositoryEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<AbstractRepositoryThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractRevision'] = ResolversParentTypes['AbstractRevision']> = {
  __resolveType: TypeResolveFn<'AppletRevision' | 'ArticleRevision' | 'CoursePageRevision' | 'CourseRevision' | 'EventRevision' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'GroupedExerciseRevision' | 'PageRevision' | 'SolutionRevision' | 'VideoRevision', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<AbstractRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractTaxonomyTermChildResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractTaxonomyTermChild'] = ResolversParentTypes['AbstractTaxonomyTermChild']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'Course' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'Video', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractTaxonomyTermChildEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<AbstractTaxonomyTermChildTaxonomyTermsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractUuidResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractUuid'] = ResolversParentTypes['AbstractUuid']> = {
  __resolveType: TypeResolveFn<'Applet' | 'AppletRevision' | 'Article' | 'ArticleRevision' | 'Comment' | 'Course' | 'CoursePage' | 'CoursePageRevision' | 'CourseRevision' | 'Event' | 'EventRevision' | 'Exercise' | 'ExerciseGroup' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'GroupedExercise' | 'GroupedExerciseRevision' | 'Page' | 'PageRevision' | 'Solution' | 'SolutionRevision' | 'TaxonomyTerm' | 'User' | 'Video' | 'VideoRevision', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractUuidEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractUuidConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractUuidConnection'] = ResolversParentTypes['AbstractUuidConnection']> = {
  edges?: Resolver<Array<ResolversTypes['AbstractUuidCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['AbstractUuid']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractUuidCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractUuidCursor'] = ResolversParentTypes['AbstractUuidCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AddRevisionResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AddRevisionResponse'] = ResolversParentTypes['AddRevisionResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  revisionId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AllThreadsConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AllThreadsConnection'] = ResolversParentTypes['AllThreadsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ThreadsCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Thread']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['HasNextPageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppletResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Applet'] = ResolversParentTypes['Applet']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['AppletRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AppletEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['AppletRevisionConnection'], ParentType, ContextType, Partial<AppletRevisionsArgs>>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<AppletTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<AppletThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppletRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AppletRevision'] = ResolversParentTypes['AppletRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AppletRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Applet'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<AppletRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppletRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AppletRevisionConnection'] = ResolversParentTypes['AppletRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['AppletRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['AppletRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppletRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AppletRevisionCursor'] = ResolversParentTypes['AppletRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AppletRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['ArticleRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<ArticleEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ArticleRevisionConnection'], ParentType, ContextType, Partial<ArticleRevisionsArgs>>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<ArticleTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<ArticleThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticleRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ArticleRevision'] = ResolversParentTypes['ArticleRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<ArticleRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Article'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<ArticleRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticleRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ArticleRevisionConnection'] = ResolversParentTypes['ArticleRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ArticleRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['ArticleRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticleRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ArticleRevisionCursor'] = ResolversParentTypes['ArticleRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ArticleRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CacheRemoveResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CacheRemoveResponse'] = ResolversParentTypes['CacheRemoveResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CacheSetResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CacheSetResponse'] = ResolversParentTypes['CacheSetResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CacheUpdateResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CacheUpdateResponse'] = ResolversParentTypes['CacheUpdateResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckoutRevisionNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CheckoutRevisionNotificationEvent'] = ResolversParentTypes['CheckoutRevisionNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['AbstractRepository'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['AbstractRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckoutRevisionResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CheckoutRevisionResponse'] = ResolversParentTypes['CheckoutRevisionResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  archived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<CommentEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  legacyObject?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommentConnection'] = ResolversParentTypes['CommentConnection']> = {
  edges?: Resolver<Array<ResolversTypes['CommentEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommentEdge'] = ResolversParentTypes['CommentEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Course'] = ResolversParentTypes['Course']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['CourseRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<CourseEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  pages?: Resolver<Array<ResolversTypes['CoursePage']>, ParentType, ContextType, Partial<CoursePagesArgs>>;
  revisions?: Resolver<ResolversTypes['CourseRevisionConnection'], ParentType, ContextType, Partial<CourseRevisionsArgs>>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<CourseTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<CourseThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoursePageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CoursePage'] = ResolversParentTypes['CoursePage']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  course?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['CoursePageRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<CoursePageEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['CoursePageRevisionConnection'], ParentType, ContextType, Partial<CoursePageRevisionsArgs>>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<CoursePageThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoursePageRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CoursePageRevision'] = ResolversParentTypes['CoursePageRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<CoursePageRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['CoursePage'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<CoursePageRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoursePageRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CoursePageRevisionConnection'] = ResolversParentTypes['CoursePageRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['CoursePageRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['CoursePageRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoursePageRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CoursePageRevisionCursor'] = ResolversParentTypes['CoursePageRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['CoursePageRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CourseRevision'] = ResolversParentTypes['CourseRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<CourseRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<CourseRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CourseRevisionConnection'] = ResolversParentTypes['CourseRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['CourseRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['CourseRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CourseRevisionCursor'] = ResolversParentTypes['CourseRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['CourseRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCommentNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommentNotificationEvent'] = ResolversParentTypes['CreateCommentNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  comment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['Thread'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEntityLinkNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEntityLinkNotificationEvent'] = ResolversParentTypes['CreateEntityLinkNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEntityNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEntityNotificationEvent'] = ResolversParentTypes['CreateEntityNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  entity?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateEntityRevisionNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateEntityRevisionNotificationEvent'] = ResolversParentTypes['CreateEntityRevisionNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  entity?: Resolver<ResolversTypes['AbstractRepository'], ParentType, ContextType>;
  entityRevision?: Resolver<ResolversTypes['AbstractRevision'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTaxonomyLinkNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateTaxonomyLinkNotificationEvent'] = ResolversParentTypes['CreateTaxonomyLinkNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateTaxonomyTermNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateTaxonomyTermNotificationEvent'] = ResolversParentTypes['CreateTaxonomyTermNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taxonomyTerm?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateThreadNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateThreadNotificationEvent'] = ResolversParentTypes['CreateThreadNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  object?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['Thread'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeletedEntitiesConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeletedEntitiesConnection'] = ResolversParentTypes['DeletedEntitiesConnection']> = {
  edges?: Resolver<Array<ResolversTypes['DeletedEntityCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['DeletedEntity']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeletedEntityResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeletedEntity'] = ResolversParentTypes['DeletedEntity']> = {
  dateOfDeletion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  entity?: Resolver<Maybe<ResolversTypes['AbstractEntity']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeletedEntityCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeletedEntityCursor'] = ResolversParentTypes['DeletedEntityCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['DeletedEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityMetadataConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EntityMetadataConnection'] = ResolversParentTypes['EntityMetadataConnection']> = {
  edges?: Resolver<Array<ResolversTypes['EntityMetadataCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['JSONObject']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['HasNextPageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityMetadataCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EntityMetadataCursor'] = ResolversParentTypes['EntityMetadataCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EntityMutation'] = ResolversParentTypes['EntityMutation']> = {
  checkoutRevision?: Resolver<ResolversTypes['CheckoutRevisionResponse'], ParentType, ContextType, RequireFields<EntityMutationCheckoutRevisionArgs, 'input'>>;
  rejectRevision?: Resolver<ResolversTypes['RejectRevisionResponse'], ParentType, ContextType, RequireFields<EntityMutationRejectRevisionArgs, 'input'>>;
  setApplet?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetAppletArgs, 'input'>>;
  setArticle?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetArticleArgs, 'input'>>;
  setCourse?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetCourseArgs, 'input'>>;
  setCoursePage?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetCoursePageArgs, 'input'>>;
  setEvent?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetEventArgs, 'input'>>;
  setExercise?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetExerciseArgs, 'input'>>;
  setExerciseGroup?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetExerciseGroupArgs, 'input'>>;
  setGroupedExercise?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetGroupedExerciseArgs, 'input'>>;
  setSolution?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetSolutionArgs, 'input'>>;
  setVideo?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetVideoArgs, 'input'>>;
  sort?: Resolver<ResolversTypes['EntitySortResponse'], ParentType, ContextType, RequireFields<EntityMutationSortArgs, 'input'>>;
  updateLicense?: Resolver<ResolversTypes['EntityUpdateLicenseResponse'], ParentType, ContextType, RequireFields<EntityMutationUpdateLicenseArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EntityQuery'] = ResolversParentTypes['EntityQuery']> = {
  deletedEntities?: Resolver<ResolversTypes['DeletedEntitiesConnection'], ParentType, ContextType, Partial<EntityQueryDeletedEntitiesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntitySortResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EntitySortResponse'] = ResolversParentTypes['EntitySortResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityUpdateLicenseResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EntityUpdateLicenseResponse'] = ResolversParentTypes['EntityUpdateLicenseResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['EventRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<EventEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['EventRevisionConnection'], ParentType, ContextType, Partial<EventRevisionsArgs>>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<EventTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<EventThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventRevision'] = ResolversParentTypes['EventRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<EventRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<EventRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventRevisionConnection'] = ResolversParentTypes['EventRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['EventRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['EventRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventRevisionCursor'] = ResolversParentTypes['EventRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['EventRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Exercise'] = ResolversParentTypes['Exercise']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['ExerciseRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<ExerciseEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ExerciseRevisionConnection'], ParentType, ContextType, Partial<ExerciseRevisionsArgs>>;
  solution?: Resolver<Maybe<ResolversTypes['Solution']>, ParentType, ContextType>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<ExerciseTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<ExerciseThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseGroupResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseGroup'] = ResolversParentTypes['ExerciseGroup']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['ExerciseGroupRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<ExerciseGroupEventsArgs>>;
  exercises?: Resolver<Array<ResolversTypes['GroupedExercise']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ExerciseGroupRevisionConnection'], ParentType, ContextType, Partial<ExerciseGroupRevisionsArgs>>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<ExerciseGroupTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<ExerciseGroupThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseGroupRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseGroupRevision'] = ResolversParentTypes['ExerciseGroupRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cohesive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<ExerciseGroupRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['ExerciseGroup'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<ExerciseGroupRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseGroupRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseGroupRevisionConnection'] = ResolversParentTypes['ExerciseGroupRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ExerciseGroupRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['ExerciseGroupRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseGroupRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseGroupRevisionCursor'] = ResolversParentTypes['ExerciseGroupRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ExerciseGroupRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseRevision'] = ResolversParentTypes['ExerciseRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<ExerciseRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Exercise'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<ExerciseRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseRevisionConnection'] = ResolversParentTypes['ExerciseRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ExerciseRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['ExerciseRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseRevisionCursor'] = ResolversParentTypes['ExerciseRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ExerciseRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupedExerciseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupedExercise'] = ResolversParentTypes['GroupedExercise']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['GroupedExerciseRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<GroupedExerciseEventsArgs>>;
  exerciseGroup?: Resolver<ResolversTypes['ExerciseGroup'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['GroupedExerciseRevisionConnection'], ParentType, ContextType, Partial<GroupedExerciseRevisionsArgs>>;
  solution?: Resolver<Maybe<ResolversTypes['Solution']>, ParentType, ContextType>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<GroupedExerciseThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupedExerciseRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupedExerciseRevision'] = ResolversParentTypes['GroupedExerciseRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<GroupedExerciseRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['GroupedExercise'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<GroupedExerciseRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupedExerciseRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupedExerciseRevisionConnection'] = ResolversParentTypes['GroupedExerciseRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['GroupedExerciseRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['GroupedExerciseRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupedExerciseRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupedExerciseRevisionCursor'] = ResolversParentTypes['GroupedExerciseRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['GroupedExerciseRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HasNextPageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['HasNextPageInfo'] = ResolversParentTypes['HasNextPageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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
  agreement?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  default?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  shortTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LicenseQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LicenseQuery'] = ResolversParentTypes['LicenseQuery']> = {
  license?: Resolver<Maybe<ResolversTypes['License']>, ParentType, ContextType, RequireFields<LicenseQueryLicenseArgs, 'id'>>;
  licenses?: Resolver<Array<ResolversTypes['License']>, ParentType, ContextType, Partial<LicenseQueryLicensesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetadataQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MetadataQuery'] = ResolversParentTypes['MetadataQuery']> = {
  entities?: Resolver<ResolversTypes['EntityMetadataConnection'], ParentType, ContextType, Partial<MetadataQueryEntitiesArgs>>;
  publisher?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _cache?: Resolver<ResolversTypes['_cacheMutation'], ParentType, ContextType>;
  entity?: Resolver<ResolversTypes['EntityMutation'], ParentType, ContextType>;
  notification?: Resolver<ResolversTypes['NotificationMutation'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['PageMutation'], ParentType, ContextType>;
  subscription?: Resolver<ResolversTypes['SubscriptionMutation'], ParentType, ContextType>;
  taxonomyTerm?: Resolver<ResolversTypes['TaxonomyTermMutation'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['ThreadMutation'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserMutation'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['UuidMutation'], ParentType, ContextType>;
};

export type NavigationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Navigation'] = ResolversParentTypes['Navigation']> = {
  path?: Resolver<ResolversTypes['NavigationNodeConnection'], ParentType, ContextType, Partial<NavigationPathArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NavigationNodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NavigationNode'] = ResolversParentTypes['NavigationNode']> = {
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NavigationNodeConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NavigationNodeConnection'] = ResolversParentTypes['NavigationNodeConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['NavigationNodeEdge']>>>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['NavigationNode']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NavigationNodeEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NavigationNodeEdge'] = ResolversParentTypes['NavigationNodeEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['NavigationNode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = {
  event?: Resolver<ResolversTypes['AbstractNotificationEvent'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unread?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NotificationConnection'] = ResolversParentTypes['NotificationConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NotificationEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Notification']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['PageRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<PageEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  navigation?: Resolver<Maybe<ResolversTypes['Navigation']>, ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['PageRevisionConnection'], ParentType, ContextType, Partial<PageRevisionsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<PageThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageCreateResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageCreateResponse'] = ResolversParentTypes['PageCreateResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  record?: Resolver<Maybe<ResolversTypes['Page']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageMutation'] = ResolversParentTypes['PageMutation']> = {
  addRevision?: Resolver<ResolversTypes['AddRevisionResponse'], ParentType, ContextType, RequireFields<PageMutationAddRevisionArgs, 'input'>>;
  checkoutRevision?: Resolver<ResolversTypes['CheckoutRevisionResponse'], ParentType, ContextType, RequireFields<PageMutationCheckoutRevisionArgs, 'input'>>;
  create?: Resolver<ResolversTypes['PageCreateResponse'], ParentType, ContextType, RequireFields<PageMutationCreateArgs, 'input'>>;
  rejectRevision?: Resolver<ResolversTypes['RejectRevisionResponse'], ParentType, ContextType, RequireFields<PageMutationRejectRevisionArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageQuery'] = ResolversParentTypes['PageQuery']> = {
  pages?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType, Partial<PageQueryPagesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageRevision'] = ResolversParentTypes['PageRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<PageRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Page'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<PageRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageRevisionConnection'] = ResolversParentTypes['PageRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['PageRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['PageRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageRevisionCursor'] = ResolversParentTypes['PageRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['PageRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activeAuthors?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, Partial<QueryActiveAuthorsArgs>>;
  activeDonors?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, Partial<QueryActiveDonorsArgs>>;
  activeReviewers?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, Partial<QueryActiveReviewersArgs>>;
  authorization?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  entity?: Resolver<Maybe<ResolversTypes['EntityQuery']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<QueryEventsArgs>>;
  license?: Resolver<ResolversTypes['LicenseQuery'], ParentType, ContextType>;
  metadata?: Resolver<ResolversTypes['MetadataQuery'], ParentType, ContextType>;
  notificationEvent?: Resolver<Maybe<ResolversTypes['AbstractNotificationEvent']>, ParentType, ContextType, RequireFields<QueryNotificationEventArgs, 'id'>>;
  notifications?: Resolver<ResolversTypes['NotificationConnection'], ParentType, ContextType, Partial<QueryNotificationsArgs>>;
  page?: Resolver<ResolversTypes['PageQuery'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['SubjectQuery'], ParentType, ContextType>;
  subscription?: Resolver<ResolversTypes['SubscriptionQuery'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['ThreadQuery'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserQuery'], ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['AbstractUuid']>, ParentType, ContextType, Partial<QueryUuidArgs>>;
};

export type RejectRevisionNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RejectRevisionNotificationEvent'] = ResolversParentTypes['RejectRevisionNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reason?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['AbstractRepository'], ParentType, ContextType>;
  revision?: Resolver<ResolversTypes['AbstractRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RejectRevisionResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RejectRevisionResponse'] = ResolversParentTypes['RejectRevisionResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RemoveEntityLinkNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RemoveEntityLinkNotificationEvent'] = ResolversParentTypes['RemoveEntityLinkNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RemoveTaxonomyLinkNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RemoveTaxonomyLinkNotificationEvent'] = ResolversParentTypes['RemoveTaxonomyLinkNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
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
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScopedRoleCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ScopedRoleCursor'] = ResolversParentTypes['ScopedRoleCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['ScopedRole'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetEntityResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetEntityResponse'] = ResolversParentTypes['SetEntityResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  record?: Resolver<Maybe<ResolversTypes['AbstractEntity']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetLicenseNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetLicenseNotificationEvent'] = ResolversParentTypes['SetLicenseNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['AbstractRepository'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetTaxonomyParentNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetTaxonomyParentNotificationEvent'] = ResolversParentTypes['SetTaxonomyParentNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  child?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['TaxonomyTerm']>, ParentType, ContextType>;
  previousParent?: Resolver<Maybe<ResolversTypes['TaxonomyTerm']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetTaxonomyTermNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetTaxonomyTermNotificationEvent'] = ResolversParentTypes['SetTaxonomyTermNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taxonomyTerm?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetThreadStateNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetThreadStateNotificationEvent'] = ResolversParentTypes['SetThreadStateNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  archived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['Thread'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetUuidStateNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetUuidStateNotificationEvent'] = ResolversParentTypes['SetUuidStateNotificationEvent']> = {
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  object?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SolutionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Solution'] = ResolversParentTypes['Solution']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['SolutionRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<SolutionEventsArgs>>;
  exercise?: Resolver<ResolversTypes['AbstractExercise'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['SolutionRevisionConnection'], ParentType, ContextType, Partial<SolutionRevisionsArgs>>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<SolutionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SolutionRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SolutionRevision'] = ResolversParentTypes['SolutionRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<SolutionRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Solution'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<SolutionRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SolutionRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SolutionRevisionConnection'] = ResolversParentTypes['SolutionRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['SolutionRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['SolutionRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SolutionRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SolutionRevisionCursor'] = ResolversParentTypes['SolutionRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['SolutionRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taxonomyTerm?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  unrevisedEntities?: Resolver<ResolversTypes['AbstractEntityConnection'], ParentType, ContextType, Partial<SubjectUnrevisedEntitiesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectQuery'] = ResolversParentTypes['SubjectQuery']> = {
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<SubjectQuerySubjectArgs, 'id'>>;
  subjects?: Resolver<Array<ResolversTypes['Subject']>, ParentType, ContextType, RequireFields<SubjectQuerySubjectsArgs, 'instance'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionConnection'] = ResolversParentTypes['SubscriptionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['SubscriptionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['SubscriptionInfo']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  getSubscriptions?: Resolver<ResolversTypes['SubscriptionConnection'], ParentType, ContextType, Partial<SubscriptionQueryGetSubscriptionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionSetResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionSetResponse'] = ResolversParentTypes['SubscriptionSetResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyEntityLinksResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyEntityLinksResponse'] = ResolversParentTypes['TaxonomyEntityLinksResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTerm'] = ResolversParentTypes['TaxonomyTerm']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  children?: Resolver<ResolversTypes['AbstractUuidConnection'], ParentType, ContextType, Partial<TaxonomyTermChildrenArgs>>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<TaxonomyTermEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  navigation?: Resolver<Maybe<ResolversTypes['Navigation']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['TaxonomyTerm']>, ParentType, ContextType>;
  taxonomyId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<TaxonomyTermThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TaxonomyTermType'], ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTermConnection'] = ResolversParentTypes['TaxonomyTermConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['TaxonomyTermEdge']>>>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['TaxonomyTerm']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermCreateResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTermCreateResponse'] = ResolversParentTypes['TaxonomyTermCreateResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  record?: Resolver<Maybe<ResolversTypes['TaxonomyTerm']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTermEdge'] = ResolversParentTypes['TaxonomyTermEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTermMutation'] = ResolversParentTypes['TaxonomyTermMutation']> = {
  create?: Resolver<ResolversTypes['TaxonomyTermCreateResponse'], ParentType, ContextType, RequireFields<TaxonomyTermMutationCreateArgs, 'input'>>;
  createEntityLinks?: Resolver<ResolversTypes['TaxonomyEntityLinksResponse'], ParentType, ContextType, RequireFields<TaxonomyTermMutationCreateEntityLinksArgs, 'input'>>;
  deleteEntityLinks?: Resolver<ResolversTypes['TaxonomyEntityLinksResponse'], ParentType, ContextType, RequireFields<TaxonomyTermMutationDeleteEntityLinksArgs, 'input'>>;
  setNameAndDescription?: Resolver<ResolversTypes['TaxonomyTermSetNameAndDescriptionResponse'], ParentType, ContextType, RequireFields<TaxonomyTermMutationSetNameAndDescriptionArgs, 'input'>>;
  sort?: Resolver<ResolversTypes['TaxonomyTermSortResponse'], ParentType, ContextType, RequireFields<TaxonomyTermMutationSortArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermSetNameAndDescriptionResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTermSetNameAndDescriptionResponse'] = ResolversParentTypes['TaxonomyTermSetNameAndDescriptionResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermSortResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTermSortResponse'] = ResolversParentTypes['TaxonomyTermSortResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Thread'] = ResolversParentTypes['Thread']> = {
  archived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  comments?: Resolver<ResolversTypes['CommentConnection'], ParentType, ContextType, Partial<ThreadCommentsArgs>>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  object?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadAwareResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadAware'] = ResolversParentTypes['ThreadAware']> = {
  __resolveType: TypeResolveFn<'Applet' | 'AppletRevision' | 'Article' | 'ArticleRevision' | 'Course' | 'CoursePage' | 'CoursePageRevision' | 'CourseRevision' | 'Event' | 'EventRevision' | 'Exercise' | 'ExerciseGroup' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'GroupedExercise' | 'GroupedExerciseRevision' | 'Page' | 'PageRevision' | 'Solution' | 'SolutionRevision' | 'TaxonomyTerm' | 'User' | 'Video' | 'VideoRevision', ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<ThreadAwareThreadsArgs>>;
};

export type ThreadCreateCommentResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadCreateCommentResponse'] = ResolversParentTypes['ThreadCreateCommentResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  record?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadCreateThreadResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadCreateThreadResponse'] = ResolversParentTypes['ThreadCreateThreadResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  record?: Resolver<Maybe<ResolversTypes['Thread']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadMutation'] = ResolversParentTypes['ThreadMutation']> = {
  createComment?: Resolver<Maybe<ResolversTypes['ThreadCreateCommentResponse']>, ParentType, ContextType, RequireFields<ThreadMutationCreateCommentArgs, 'input'>>;
  createThread?: Resolver<Maybe<ResolversTypes['ThreadCreateThreadResponse']>, ParentType, ContextType, RequireFields<ThreadMutationCreateThreadArgs, 'input'>>;
  setCommentState?: Resolver<Maybe<ResolversTypes['ThreadSetCommentStateResponse']>, ParentType, ContextType, RequireFields<ThreadMutationSetCommentStateArgs, 'input'>>;
  setThreadArchived?: Resolver<Maybe<ResolversTypes['ThreadSetThreadArchivedResponse']>, ParentType, ContextType, RequireFields<ThreadMutationSetThreadArchivedArgs, 'input'>>;
  setThreadState?: Resolver<Maybe<ResolversTypes['ThreadSetThreadStateResponse']>, ParentType, ContextType, RequireFields<ThreadMutationSetThreadStateArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadQuery'] = ResolversParentTypes['ThreadQuery']> = {
  allThreads?: Resolver<ResolversTypes['AllThreadsConnection'], ParentType, ContextType, Partial<ThreadQueryAllThreadsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadSetCommentStateResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadSetCommentStateResponse'] = ResolversParentTypes['ThreadSetCommentStateResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadSetThreadArchivedResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadSetThreadArchivedResponse'] = ResolversParentTypes['ThreadSetThreadArchivedResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadSetThreadStateResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadSetThreadStateResponse'] = ResolversParentTypes['ThreadSetThreadStateResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadsConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadsConnection'] = ResolversParentTypes['ThreadsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ThreadsCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Thread']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadsCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadsCursor'] = ResolversParentTypes['ThreadsCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Thread'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  activityByType?: Resolver<ResolversTypes['UserActivityByType'], ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chatUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<UserEventsArgs>>;
  eventsByUser?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<UserEventsByUserArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  imageUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isActiveAuthor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isActiveDonor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isActiveReviewer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isNewAuthor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastLogin?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  motivation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roles?: Resolver<ResolversTypes['ScopedRoleConnection'], ParentType, ContextType, Partial<UserRolesArgs>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<UserThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  unrevisedEntities?: Resolver<ResolversTypes['AbstractEntityConnection'], ParentType, ContextType, Partial<UserUnrevisedEntitiesArgs>>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserActivityByTypeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserActivityByType'] = ResolversParentTypes['UserActivityByType']> = {
  comments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  edits?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reviews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taxonomy?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = {
  edges?: Resolver<Array<ResolversTypes['UserEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDeleteBotsResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserDeleteBotsResponse'] = ResolversParentTypes['UserDeleteBotsResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDeleteOwnAccountResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserDeleteOwnAccountResponse'] = ResolversParentTypes['UserDeleteOwnAccountResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDeleteRegularUsersResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserDeleteRegularUsersResponse'] = ResolversParentTypes['UserDeleteRegularUsersResponse']> = {
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserEdge'] = ResolversParentTypes['UserEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserMutation'] = ResolversParentTypes['UserMutation']> = {
  deleteBots?: Resolver<ResolversTypes['UserDeleteBotsResponse'], ParentType, ContextType, RequireFields<UserMutationDeleteBotsArgs, 'input'>>;
  deleteOwnAccount?: Resolver<ResolversTypes['UserDeleteOwnAccountResponse'], ParentType, ContextType>;
  deleteRegularUsers?: Resolver<Array<ResolversTypes['UserDeleteRegularUsersResponse']>, ParentType, ContextType, RequireFields<UserMutationDeleteRegularUsersArgs, 'input'>>;
  setDescription?: Resolver<ResolversTypes['UserSetDescriptionResponse'], ParentType, ContextType, RequireFields<UserMutationSetDescriptionArgs, 'input'>>;
  setEmail?: Resolver<ResolversTypes['UserSetEmailResponse'], ParentType, ContextType, RequireFields<UserMutationSetEmailArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserQuery'] = ResolversParentTypes['UserQuery']> = {
  potentialSpamUsers?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, Partial<UserQueryPotentialSpamUsersArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSetDescriptionResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserSetDescriptionResponse'] = ResolversParentTypes['UserSetDescriptionResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSetEmailResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserSetEmailResponse'] = ResolversParentTypes['UserSetEmailResponse']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UuidMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UuidMutation'] = ResolversParentTypes['UuidMutation']> = {
  setState?: Resolver<Maybe<ResolversTypes['UuidSetStateResponse']>, ParentType, ContextType, RequireFields<UuidMutationSetStateArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UuidSetStateResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UuidSetStateResponse'] = ResolversParentTypes['UuidSetStateResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Video'] = ResolversParentTypes['Video']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['VideoRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<VideoEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  license?: Resolver<ResolversTypes['License'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['VideoRevisionConnection'], ParentType, ContextType, Partial<VideoRevisionsArgs>>;
  subject?: Resolver<Maybe<ResolversTypes['Subject']>, ParentType, ContextType>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<VideoTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<VideoThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VideoRevision'] = ResolversParentTypes['VideoRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<VideoRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Video'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<VideoRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VideoRevisionConnection'] = ResolversParentTypes['VideoRevisionConnection']> = {
  edges?: Resolver<Array<ResolversTypes['VideoRevisionCursor']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['VideoRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoRevisionCursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VideoRevisionCursor'] = ResolversParentTypes['VideoRevisionCursor']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['VideoRevision'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type _CacheMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['_cacheMutation'] = ResolversParentTypes['_cacheMutation']> = {
  remove?: Resolver<ResolversTypes['CacheRemoveResponse'], ParentType, ContextType, RequireFields<_CacheMutationRemoveArgs, 'input'>>;
  set?: Resolver<ResolversTypes['CacheSetResponse'], ParentType, ContextType, RequireFields<_CacheMutationSetArgs, 'input'>>;
  update?: Resolver<ResolversTypes['CacheUpdateResponse'], ParentType, ContextType, RequireFields<_CacheMutationUpdateArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AbstractEntity?: AbstractEntityResolvers<ContextType>;
  AbstractEntityConnection?: AbstractEntityConnectionResolvers<ContextType>;
  AbstractEntityCursor?: AbstractEntityCursorResolvers<ContextType>;
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
  AddRevisionResponse?: AddRevisionResponseResolvers<ContextType>;
  AllThreadsConnection?: AllThreadsConnectionResolvers<ContextType>;
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
  DeletedEntitiesConnection?: DeletedEntitiesConnectionResolvers<ContextType>;
  DeletedEntity?: DeletedEntityResolvers<ContextType>;
  DeletedEntityCursor?: DeletedEntityCursorResolvers<ContextType>;
  EntityMetadataConnection?: EntityMetadataConnectionResolvers<ContextType>;
  EntityMetadataCursor?: EntityMetadataCursorResolvers<ContextType>;
  EntityMutation?: EntityMutationResolvers<ContextType>;
  EntityQuery?: EntityQueryResolvers<ContextType>;
  EntitySortResponse?: EntitySortResponseResolvers<ContextType>;
  EntityUpdateLicenseResponse?: EntityUpdateLicenseResponseResolvers<ContextType>;
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
  HasNextPageInfo?: HasNextPageInfoResolvers<ContextType>;
  InstanceAware?: InstanceAwareResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  License?: LicenseResolvers<ContextType>;
  LicenseQuery?: LicenseQueryResolvers<ContextType>;
  MetadataQuery?: MetadataQueryResolvers<ContextType>;
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
  PageCreateResponse?: PageCreateResponseResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PageMutation?: PageMutationResolvers<ContextType>;
  PageQuery?: PageQueryResolvers<ContextType>;
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
  SetEntityResponse?: SetEntityResponseResolvers<ContextType>;
  SetLicenseNotificationEvent?: SetLicenseNotificationEventResolvers<ContextType>;
  SetTaxonomyParentNotificationEvent?: SetTaxonomyParentNotificationEventResolvers<ContextType>;
  SetTaxonomyTermNotificationEvent?: SetTaxonomyTermNotificationEventResolvers<ContextType>;
  SetThreadStateNotificationEvent?: SetThreadStateNotificationEventResolvers<ContextType>;
  SetUuidStateNotificationEvent?: SetUuidStateNotificationEventResolvers<ContextType>;
  Solution?: SolutionResolvers<ContextType>;
  SolutionRevision?: SolutionRevisionResolvers<ContextType>;
  SolutionRevisionConnection?: SolutionRevisionConnectionResolvers<ContextType>;
  SolutionRevisionCursor?: SolutionRevisionCursorResolvers<ContextType>;
  Subject?: SubjectResolvers<ContextType>;
  SubjectQuery?: SubjectQueryResolvers<ContextType>;
  SubscriptionConnection?: SubscriptionConnectionResolvers<ContextType>;
  SubscriptionCursor?: SubscriptionCursorResolvers<ContextType>;
  SubscriptionInfo?: SubscriptionInfoResolvers<ContextType>;
  SubscriptionMutation?: SubscriptionMutationResolvers<ContextType>;
  SubscriptionQuery?: SubscriptionQueryResolvers<ContextType>;
  SubscriptionSetResponse?: SubscriptionSetResponseResolvers<ContextType>;
  TaxonomyEntityLinksResponse?: TaxonomyEntityLinksResponseResolvers<ContextType>;
  TaxonomyTerm?: TaxonomyTermResolvers<ContextType>;
  TaxonomyTermConnection?: TaxonomyTermConnectionResolvers<ContextType>;
  TaxonomyTermCreateResponse?: TaxonomyTermCreateResponseResolvers<ContextType>;
  TaxonomyTermEdge?: TaxonomyTermEdgeResolvers<ContextType>;
  TaxonomyTermMutation?: TaxonomyTermMutationResolvers<ContextType>;
  TaxonomyTermSetNameAndDescriptionResponse?: TaxonomyTermSetNameAndDescriptionResponseResolvers<ContextType>;
  TaxonomyTermSortResponse?: TaxonomyTermSortResponseResolvers<ContextType>;
  Thread?: ThreadResolvers<ContextType>;
  ThreadAware?: ThreadAwareResolvers<ContextType>;
  ThreadCreateCommentResponse?: ThreadCreateCommentResponseResolvers<ContextType>;
  ThreadCreateThreadResponse?: ThreadCreateThreadResponseResolvers<ContextType>;
  ThreadMutation?: ThreadMutationResolvers<ContextType>;
  ThreadQuery?: ThreadQueryResolvers<ContextType>;
  ThreadSetCommentStateResponse?: ThreadSetCommentStateResponseResolvers<ContextType>;
  ThreadSetThreadArchivedResponse?: ThreadSetThreadArchivedResponseResolvers<ContextType>;
  ThreadSetThreadStateResponse?: ThreadSetThreadStateResponseResolvers<ContextType>;
  ThreadsConnection?: ThreadsConnectionResolvers<ContextType>;
  ThreadsCursor?: ThreadsCursorResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserActivityByType?: UserActivityByTypeResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserDeleteBotsResponse?: UserDeleteBotsResponseResolvers<ContextType>;
  UserDeleteOwnAccountResponse?: UserDeleteOwnAccountResponseResolvers<ContextType>;
  UserDeleteRegularUsersResponse?: UserDeleteRegularUsersResponseResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
  UserMutation?: UserMutationResolvers<ContextType>;
  UserQuery?: UserQueryResolvers<ContextType>;
  UserSetDescriptionResponse?: UserSetDescriptionResponseResolvers<ContextType>;
  UserSetEmailResponse?: UserSetEmailResponseResolvers<ContextType>;
  UuidMutation?: UuidMutationResolvers<ContextType>;
  UuidSetStateResponse?: UuidSetStateResponseResolvers<ContextType>;
  Video?: VideoResolvers<ContextType>;
  VideoRevision?: VideoRevisionResolvers<ContextType>;
  VideoRevisionConnection?: VideoRevisionConnectionResolvers<ContextType>;
  VideoRevisionCursor?: VideoRevisionCursorResolvers<ContextType>;
  _cacheMutation?: _CacheMutationResolvers<ContextType>;
};

