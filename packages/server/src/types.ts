import type { ModelOf } from '~/internals/model'
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { Context } from '~/context';
export type Maybe<T> = T extends PromiseLike<infer U> ? Promise<U | null> : T | null;
export type InputMaybe<T> = undefined | T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  currentRevision?: Maybe<AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | VideoRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: AppletRevisionConnection | ArticleRevisionConnection | CoursePageRevisionConnection | CourseRevisionConnection | EventRevisionConnection | ExerciseGroupRevisionConnection | ExerciseRevisionConnection | VideoRevisionConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractEntityEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type AbstractEntityRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AbstractEntityConnection = {
  __typename?: 'AbstractEntityConnection';
  edges: Array<AbstractEntityCursor>;
  nodes: Array<Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Video>;
  pageInfo: HasNextPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbstractEntityCursor = {
  __typename?: 'AbstractEntityCursor';
  cursor: Scalars['String']['output'];
  node: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Video;
};

export type AbstractEntityRevision = {
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Video;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type AbstractEntityRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type AbstractEntityRevisionConnection = {
  nodes: Array<AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | VideoRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
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
  nodes: Array<CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent>;
  pageInfo: PageInfo;
};

export type AbstractNotificationEventEdge = {
  __typename?: 'AbstractNotificationEventEdge';
  cursor: Scalars['String']['output'];
  node: CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent;
};

export type AbstractRepository = {
  alias: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractRepositoryEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  licenseId: Scalars['Int']['output'];
  taxonomyTerms: TaxonomyTermConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractTaxonomyTermChildEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  actorUsername?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type AbstractUuidConnection = {
  __typename?: 'AbstractUuidConnection';
  nodes: Array<Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | Page | PageRevision | TaxonomyTerm | User | Video | VideoRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AddRevisionResponse = {
  __typename?: 'AddRevisionResponse';
  query: Query;
  revisionId?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type AiQuery = {
  __typename?: 'AiQuery';
  executePrompt: ExecutePromptResponse;
};


export type AiQueryExecutePromptArgs = {
  messages: Array<ChatCompletionMessageParam>;
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
  licenseId: Scalars['Int']['output'];
  revisions: AppletRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AppletEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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

export type AppletRevisionConnection = AbstractEntityRevisionConnection & {
  __typename?: 'AppletRevisionConnection';
  nodes: Array<AppletRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Article = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Article';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<ArticleRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: ArticleRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ArticleEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  url?: Maybe<Scalars['String']['output']>;
};


export type ArticleRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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

export type ArticleRevisionConnection = AbstractEntityRevisionConnection & {
  __typename?: 'ArticleRevisionConnection';
  nodes: Array<ArticleRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CacheRemoveInput = {
  keys: Array<Scalars['String']['input']>;
};

export type ChatCompletionMessageParam = {
  content: Scalars['String']['input'];
  role: Scalars['String']['input'];
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
  repository: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video;
  revision: AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | PageRevision | VideoRevision;
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
  legacyObject: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | Page | PageRevision | TaxonomyTerm | User | Video | VideoRevision;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type CommentEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  nodes: Array<Comment>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
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
  licenseId: Scalars['Int']['output'];
  pages: Array<CoursePage>;
  revisions: CourseRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type CourseEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  licenseId: Scalars['Int']['output'];
  revisions: CoursePageRevisionConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type CoursePageEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: CoursePage;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type CoursePageRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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

export type CoursePageRevisionConnection = AbstractEntityRevisionConnection & {
  __typename?: 'CoursePageRevisionConnection';
  nodes: Array<CoursePageRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
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
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: Course;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type CourseRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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

export type CourseRevisionConnection = AbstractEntityRevisionConnection & {
  __typename?: 'CourseRevisionConnection';
  nodes: Array<CourseRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
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
  child: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Video;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  parent: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Video;
};

export type CreateEntityNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  entity: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Video;
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
};

export type CreateEntityRevisionNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityRevisionNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  entity: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video;
  entityRevision: AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | PageRevision | VideoRevision;
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
  child: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | Page | PageRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | Page | PageRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  entity?: Maybe<Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Video>;
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
  setAbstractEntity: SetEntityResponse;
  sort: EntitySortResponse;
  updateLicense: EntityUpdateLicenseResponse;
};


export type EntityMutationCheckoutRevisionArgs = {
  input: CheckoutRevisionInput;
};


export type EntityMutationRejectRevisionArgs = {
  input: RejectRevisionInput;
};


export type EntityMutationSetAbstractEntityArgs = {
  input: SetAbstractEntityInput;
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
  licenseId: Scalars['Int']['output'];
  revisions: EventRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type EventEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  url?: Maybe<Scalars['String']['output']>;
};


export type EventRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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

export type EventRevisionConnection = AbstractEntityRevisionConnection & {
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

export type ExecutePromptResponse = {
  __typename?: 'ExecutePromptResponse';
  record: Scalars['JSONObject']['output'];
  success: Scalars['Boolean']['output'];
};

export type Exercise = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Exercise';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<ExerciseRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: ExerciseRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ExerciseEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: ExerciseGroupRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ExerciseGroupEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: ExerciseGroup;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type ExerciseGroupRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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

export type ExerciseGroupRevisionConnection = AbstractEntityRevisionConnection & {
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

export type ExerciseRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'ExerciseRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: Exercise;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type ExerciseRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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

export type ExerciseRevisionConnection = AbstractEntityRevisionConnection & {
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

export type ExerciseSubmissionInput = {
  entityId: Scalars['Int']['input'];
  path: Scalars['String']['input'];
  result: Scalars['String']['input'];
  revisionId: Scalars['Int']['input'];
  sessionId: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type ExperimentMutation = {
  __typename?: 'ExperimentMutation';
  createExerciseSubmission: DefaultResponse;
};


export type ExperimentMutationCreateExerciseSubmissionArgs = {
  input: ExerciseSubmissionInput;
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
  experiment: ExperimentMutation;
  notification: NotificationMutation;
  oauth: OauthMutation;
  page: PageMutation;
  subscription: SubscriptionMutation;
  taxonomyTerm: TaxonomyTermMutation;
  thread: ThreadMutation;
  user: UserMutation;
  uuid: UuidMutation;
};

export type Notification = {
  __typename?: 'Notification';
  email: Scalars['Boolean']['output'];
  emailSent: Scalars['Boolean']['output'];
  event?: Maybe<CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent>;
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

export type Page = AbstractRepository & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Page';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<PageRevision>;
  date: Scalars['DateTime']['output'];
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: PageRevisionConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type PageEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  ai: AiQuery;
  authorization: Scalars['JSON']['output'];
  entity?: Maybe<EntityQuery>;
  events: AbstractNotificationEventConnection;
  media: MediaQuery;
  metadata: MetadataQuery;
  notificationEvent?: Maybe<CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveEntityLinkNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent>;
  notifications: NotificationConnection;
  page: PageQuery;
  subject: SubjectQuery;
  subscription: SubscriptionQuery;
  thread: ThreadQuery;
  user: UserQuery;
  uuid?: Maybe<Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | Page | PageRevision | TaxonomyTerm | User | Video | VideoRevision>;
  version: Scalars['String']['output'];
};


export type QueryEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  repository: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video;
  revision: AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | PageRevision | VideoRevision;
};

export type RejectRevisionResponse = {
  __typename?: 'RejectRevisionResponse';
  query: Query;
  success: Scalars['Boolean']['output'];
};

export type RemoveEntityLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RemoveEntityLinkNotificationEvent';
  actor: User;
  child: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Video;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  parent: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Video;
};

export type RemoveTaxonomyLinkNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'RemoveTaxonomyLinkNotificationEvent';
  actor: User;
  child: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | Page | PageRevision | TaxonomyTerm | User | Video | VideoRevision;
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

export type SetAbstractEntityInput = {
  changes: Scalars['String']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  entityId?: InputMaybe<Scalars['Int']['input']>;
  entityType: Scalars['String']['input'];
  metaDescription?: InputMaybe<Scalars['String']['input']>;
  metaTitle?: InputMaybe<Scalars['String']['input']>;
  needsReview: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['Int']['input']>;
  subscribeThis: Scalars['Boolean']['input'];
  subscribeThisByEmail: Scalars['Boolean']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type SetEntityResponse = {
  __typename?: 'SetEntityResponse';
  query: Query;
  record?: Maybe<Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Video>;
  success: Scalars['Boolean']['output'];
};

export type SetLicenseNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'SetLicenseNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  repository: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video;
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
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | Page | PageRevision | TaxonomyTerm | User | Video | VideoRevision;
  objectId: Scalars['Int']['output'];
  trashed: Scalars['Boolean']['output'];
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
  subjects: Array<Subject>;
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
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | Page | PageRevision | TaxonomyTerm | User | Video | VideoRevision;
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

export type TaxonomyTerm = AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'TaxonomyTerm';
  alias: Scalars['String']['output'];
  children: AbstractUuidConnection;
  description?: Maybe<Scalars['String']['output']>;
  events: AbstractNotificationEventConnection;
  id: Scalars['Int']['output'];
  instance: Instance;
  name: Scalars['String']['output'];
  parent?: Maybe<TaxonomyTerm>;
  path: Array<Maybe<TaxonomyTerm>>;
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
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | Page | PageRevision | TaxonomyTerm | User | Video | VideoRevision;
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
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  userByUsername?: Maybe<User>;
  usersByRole: UserWithPermissionsConnection;
};


export type UserQueryPotentialSpamUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type UserQueryUserByUsernameArgs = {
  username: Scalars['String']['input'];
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
  licenseId: Scalars['Int']['output'];
  revisions: VideoRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type VideoEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: Video;
  threads: ThreadsConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};


export type VideoRevisionEventsArgs = {
  actorId?: InputMaybe<Scalars['Int']['input']>;
  actorUsername?: InputMaybe<Scalars['String']['input']>;
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

export type VideoRevisionConnection = AbstractEntityRevisionConnection & {
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
  remove: DefaultResponse;
};


export type _CacheMutationRemoveArgs = {
  input: CacheRemoveInput;
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


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = {
  AbstractEntity: ( ModelOf<Applet> ) | ( ModelOf<Article> ) | ( ModelOf<Course> ) | ( ModelOf<CoursePage> ) | ( ModelOf<Event> ) | ( ModelOf<Exercise> ) | ( ModelOf<ExerciseGroup> ) | ( ModelOf<Video> );
  AbstractEntityRevision: ( ModelOf<AppletRevision> ) | ( ModelOf<ArticleRevision> ) | ( ModelOf<CoursePageRevision> ) | ( ModelOf<CourseRevision> ) | ( ModelOf<EventRevision> ) | ( ModelOf<ExerciseGroupRevision> ) | ( ModelOf<ExerciseRevision> ) | ( ModelOf<VideoRevision> );
  AbstractEntityRevisionConnection: ( ModelOf<AppletRevisionConnection> ) | ( ModelOf<ArticleRevisionConnection> ) | ( ModelOf<CoursePageRevisionConnection> ) | ( ModelOf<CourseRevisionConnection> ) | ( ModelOf<EventRevisionConnection> ) | ( ModelOf<ExerciseGroupRevisionConnection> ) | ( ModelOf<ExerciseRevisionConnection> ) | ( ModelOf<VideoRevisionConnection> );
  AbstractNotificationEvent: ( ModelOf<CheckoutRevisionNotificationEvent> ) | ( ModelOf<CreateCommentNotificationEvent> ) | ( ModelOf<CreateEntityLinkNotificationEvent> ) | ( ModelOf<CreateEntityNotificationEvent> ) | ( ModelOf<CreateEntityRevisionNotificationEvent> ) | ( ModelOf<CreateTaxonomyLinkNotificationEvent> ) | ( ModelOf<CreateTaxonomyTermNotificationEvent> ) | ( ModelOf<CreateThreadNotificationEvent> ) | ( ModelOf<RejectRevisionNotificationEvent> ) | ( ModelOf<RemoveEntityLinkNotificationEvent> ) | ( ModelOf<RemoveTaxonomyLinkNotificationEvent> ) | ( ModelOf<SetLicenseNotificationEvent> ) | ( ModelOf<SetTaxonomyParentNotificationEvent> ) | ( ModelOf<SetTaxonomyTermNotificationEvent> ) | ( ModelOf<SetThreadStateNotificationEvent> ) | ( ModelOf<SetUuidStateNotificationEvent> );
  AbstractRepository: ( ModelOf<Applet> ) | ( ModelOf<Article> ) | ( ModelOf<Course> ) | ( ModelOf<CoursePage> ) | ( ModelOf<Event> ) | ( ModelOf<Exercise> ) | ( ModelOf<ExerciseGroup> ) | ( ModelOf<Page> ) | ( ModelOf<Video> );
  AbstractRevision: ( ModelOf<AppletRevision> ) | ( ModelOf<ArticleRevision> ) | ( ModelOf<CoursePageRevision> ) | ( ModelOf<CourseRevision> ) | ( ModelOf<EventRevision> ) | ( ModelOf<ExerciseGroupRevision> ) | ( ModelOf<ExerciseRevision> ) | ( ModelOf<PageRevision> ) | ( ModelOf<VideoRevision> );
  AbstractTaxonomyTermChild: ( ModelOf<Applet> ) | ( ModelOf<Article> ) | ( ModelOf<Course> ) | ( ModelOf<Event> ) | ( ModelOf<Exercise> ) | ( ModelOf<ExerciseGroup> ) | ( ModelOf<Video> );
  AbstractUuid: ( ModelOf<Applet> ) | ( ModelOf<AppletRevision> ) | ( ModelOf<Article> ) | ( ModelOf<ArticleRevision> ) | ( ModelOf<Comment> ) | ( ModelOf<Course> ) | ( ModelOf<CoursePage> ) | ( ModelOf<CoursePageRevision> ) | ( ModelOf<CourseRevision> ) | ( ModelOf<Event> ) | ( ModelOf<EventRevision> ) | ( ModelOf<Exercise> ) | ( ModelOf<ExerciseGroup> ) | ( ModelOf<ExerciseGroupRevision> ) | ( ModelOf<ExerciseRevision> ) | ( ModelOf<Page> ) | ( ModelOf<PageRevision> ) | ( ModelOf<TaxonomyTerm> ) | ( ModelOf<User> ) | ( ModelOf<Video> ) | ( ModelOf<VideoRevision> );
  InstanceAware: ( ModelOf<Applet> ) | ( ModelOf<Article> ) | ( ModelOf<CheckoutRevisionNotificationEvent> ) | ( ModelOf<Course> ) | ( ModelOf<CoursePage> ) | ( ModelOf<CreateCommentNotificationEvent> ) | ( ModelOf<CreateEntityLinkNotificationEvent> ) | ( ModelOf<CreateEntityNotificationEvent> ) | ( ModelOf<CreateEntityRevisionNotificationEvent> ) | ( ModelOf<CreateTaxonomyLinkNotificationEvent> ) | ( ModelOf<CreateTaxonomyTermNotificationEvent> ) | ( ModelOf<CreateThreadNotificationEvent> ) | ( ModelOf<Event> ) | ( ModelOf<Exercise> ) | ( ModelOf<ExerciseGroup> ) | ( ModelOf<Page> ) | ( ModelOf<RejectRevisionNotificationEvent> ) | ( ModelOf<RemoveEntityLinkNotificationEvent> ) | ( ModelOf<RemoveTaxonomyLinkNotificationEvent> ) | ( ModelOf<SetLicenseNotificationEvent> ) | ( ModelOf<SetTaxonomyParentNotificationEvent> ) | ( ModelOf<SetTaxonomyTermNotificationEvent> ) | ( ModelOf<SetThreadStateNotificationEvent> ) | ( ModelOf<SetUuidStateNotificationEvent> ) | ( ModelOf<TaxonomyTerm> ) | ( ModelOf<Video> );
  ThreadAware: ( ModelOf<Applet> ) | ( ModelOf<AppletRevision> ) | ( ModelOf<Article> ) | ( ModelOf<ArticleRevision> ) | ( ModelOf<Course> ) | ( ModelOf<CoursePage> ) | ( ModelOf<CoursePageRevision> ) | ( ModelOf<CourseRevision> ) | ( ModelOf<Event> ) | ( ModelOf<EventRevision> ) | ( ModelOf<Exercise> ) | ( ModelOf<ExerciseGroup> ) | ( ModelOf<ExerciseGroupRevision> ) | ( ModelOf<ExerciseRevision> ) | ( ModelOf<Page> ) | ( ModelOf<PageRevision> ) | ( ModelOf<TaxonomyTerm> ) | ( ModelOf<User> ) | ( ModelOf<Video> ) | ( ModelOf<VideoRevision> );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AbstractEntity: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractEntity']>;
  AbstractEntityConnection: ResolverTypeWrapper<ModelOf<AbstractEntityConnection>>;
  AbstractEntityCursor: ResolverTypeWrapper<ModelOf<AbstractEntityCursor>>;
  AbstractEntityRevision: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractEntityRevision']>;
  AbstractEntityRevisionConnection: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractEntityRevisionConnection']>;
  AbstractNotificationEvent: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractNotificationEvent']>;
  AbstractNotificationEventConnection: ResolverTypeWrapper<ModelOf<AbstractNotificationEventConnection>>;
  AbstractNotificationEventEdge: ResolverTypeWrapper<ModelOf<AbstractNotificationEventEdge>>;
  AbstractRepository: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractRepository']>;
  AbstractRevision: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractRevision']>;
  AbstractTaxonomyTermChild: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractTaxonomyTermChild']>;
  AbstractUuid: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractUuid']>;
  AbstractUuidConnection: ResolverTypeWrapper<ModelOf<AbstractUuidConnection>>;
  AddRevisionResponse: ResolverTypeWrapper<ModelOf<AddRevisionResponse>>;
  AiQuery: ResolverTypeWrapper<ModelOf<AiQuery>>;
  AliasInput: ResolverTypeWrapper<ModelOf<AliasInput>>;
  AllThreadsConnection: ResolverTypeWrapper<ModelOf<AllThreadsConnection>>;
  Applet: ResolverTypeWrapper<ModelOf<Applet>>;
  AppletRevision: ResolverTypeWrapper<ModelOf<AppletRevision>>;
  AppletRevisionConnection: ResolverTypeWrapper<ModelOf<AppletRevisionConnection>>;
  Article: ResolverTypeWrapper<ModelOf<Article>>;
  ArticleRevision: ResolverTypeWrapper<ModelOf<ArticleRevision>>;
  ArticleRevisionConnection: ResolverTypeWrapper<ModelOf<ArticleRevisionConnection>>;
  Boolean: ResolverTypeWrapper<ModelOf<Scalars['Boolean']['output']>>;
  CacheRemoveInput: ResolverTypeWrapper<ModelOf<CacheRemoveInput>>;
  ChatCompletionMessageParam: ResolverTypeWrapper<ModelOf<ChatCompletionMessageParam>>;
  CheckoutRevisionInput: ResolverTypeWrapper<ModelOf<CheckoutRevisionInput>>;
  CheckoutRevisionNotificationEvent: ResolverTypeWrapper<ModelOf<CheckoutRevisionNotificationEvent>>;
  CheckoutRevisionResponse: ResolverTypeWrapper<ModelOf<CheckoutRevisionResponse>>;
  Comment: ResolverTypeWrapper<ModelOf<Comment>>;
  CommentConnection: ResolverTypeWrapper<ModelOf<CommentConnection>>;
  CommentStatus: ResolverTypeWrapper<ModelOf<CommentStatus>>;
  Course: ResolverTypeWrapper<ModelOf<Course>>;
  CoursePage: ResolverTypeWrapper<ModelOf<CoursePage>>;
  CoursePageRevision: ResolverTypeWrapper<ModelOf<CoursePageRevision>>;
  CoursePageRevisionConnection: ResolverTypeWrapper<ModelOf<CoursePageRevisionConnection>>;
  CourseRevision: ResolverTypeWrapper<ModelOf<CourseRevision>>;
  CourseRevisionConnection: ResolverTypeWrapper<ModelOf<CourseRevisionConnection>>;
  CreateCommentNotificationEvent: ResolverTypeWrapper<ModelOf<CreateCommentNotificationEvent>>;
  CreateEntityLinkNotificationEvent: ResolverTypeWrapper<ModelOf<CreateEntityLinkNotificationEvent>>;
  CreateEntityNotificationEvent: ResolverTypeWrapper<ModelOf<CreateEntityNotificationEvent>>;
  CreateEntityRevisionNotificationEvent: ResolverTypeWrapper<ModelOf<CreateEntityRevisionNotificationEvent>>;
  CreatePageInput: ResolverTypeWrapper<ModelOf<CreatePageInput>>;
  CreateTaxonomyLinkNotificationEvent: ResolverTypeWrapper<ModelOf<CreateTaxonomyLinkNotificationEvent>>;
  CreateTaxonomyTermNotificationEvent: ResolverTypeWrapper<ModelOf<CreateTaxonomyTermNotificationEvent>>;
  CreateThreadNotificationEvent: ResolverTypeWrapper<ModelOf<CreateThreadNotificationEvent>>;
  DateTime: ResolverTypeWrapper<ModelOf<Scalars['DateTime']['output']>>;
  DefaultResponse: ResolverTypeWrapper<ModelOf<DefaultResponse>>;
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
  ExecutePromptResponse: ResolverTypeWrapper<ModelOf<ExecutePromptResponse>>;
  Exercise: ResolverTypeWrapper<ModelOf<Exercise>>;
  ExerciseGroup: ResolverTypeWrapper<ModelOf<ExerciseGroup>>;
  ExerciseGroupRevision: ResolverTypeWrapper<ModelOf<ExerciseGroupRevision>>;
  ExerciseGroupRevisionConnection: ResolverTypeWrapper<ModelOf<ExerciseGroupRevisionConnection>>;
  ExerciseGroupRevisionCursor: ResolverTypeWrapper<ModelOf<ExerciseGroupRevisionCursor>>;
  ExerciseRevision: ResolverTypeWrapper<ModelOf<ExerciseRevision>>;
  ExerciseRevisionConnection: ResolverTypeWrapper<ModelOf<ExerciseRevisionConnection>>;
  ExerciseRevisionCursor: ResolverTypeWrapper<ModelOf<ExerciseRevisionCursor>>;
  ExerciseSubmissionInput: ResolverTypeWrapper<ModelOf<ExerciseSubmissionInput>>;
  ExperimentMutation: ResolverTypeWrapper<ModelOf<ExperimentMutation>>;
  HasNextPageInfo: ResolverTypeWrapper<ModelOf<HasNextPageInfo>>;
  Instance: ResolverTypeWrapper<ModelOf<Instance>>;
  InstanceAware: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['InstanceAware']>;
  Int: ResolverTypeWrapper<ModelOf<Scalars['Int']['output']>>;
  JSON: ResolverTypeWrapper<ModelOf<Scalars['JSON']['output']>>;
  JSONObject: ResolverTypeWrapper<ModelOf<Scalars['JSONObject']['output']>>;
  MediaQuery: ResolverTypeWrapper<ModelOf<MediaQuery>>;
  MediaType: ResolverTypeWrapper<ModelOf<MediaType>>;
  MediaUpload: ResolverTypeWrapper<ModelOf<MediaUpload>>;
  MetadataQuery: ResolverTypeWrapper<ModelOf<MetadataQuery>>;
  Mutation: ResolverTypeWrapper<{}>;
  Notification: ResolverTypeWrapper<ModelOf<Notification>>;
  NotificationConnection: ResolverTypeWrapper<ModelOf<NotificationConnection>>;
  NotificationEdge: ResolverTypeWrapper<ModelOf<NotificationEdge>>;
  NotificationMutation: ResolverTypeWrapper<ModelOf<NotificationMutation>>;
  NotificationSetStateInput: ResolverTypeWrapper<ModelOf<NotificationSetStateInput>>;
  NotificationSetStateResponse: ResolverTypeWrapper<ModelOf<NotificationSetStateResponse>>;
  OauthAcceptInput: ResolverTypeWrapper<ModelOf<OauthAcceptInput>>;
  OauthAcceptResponse: ResolverTypeWrapper<ModelOf<OauthAcceptResponse>>;
  OauthMutation: ResolverTypeWrapper<ModelOf<OauthMutation>>;
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
  Scope: ResolverTypeWrapper<ModelOf<Scope>>;
  ScopedRole: ResolverTypeWrapper<ModelOf<ScopedRole>>;
  ScopedRoleConnection: ResolverTypeWrapper<ModelOf<ScopedRoleConnection>>;
  ScopedRoleCursor: ResolverTypeWrapper<ModelOf<ScopedRoleCursor>>;
  SetAbstractEntityInput: ResolverTypeWrapper<ModelOf<SetAbstractEntityInput>>;
  SetEntityResponse: ResolverTypeWrapper<ModelOf<SetEntityResponse>>;
  SetLicenseNotificationEvent: ResolverTypeWrapper<ModelOf<SetLicenseNotificationEvent>>;
  SetTaxonomyParentNotificationEvent: ResolverTypeWrapper<ModelOf<SetTaxonomyParentNotificationEvent>>;
  SetTaxonomyTermNotificationEvent: ResolverTypeWrapper<ModelOf<SetTaxonomyTermNotificationEvent>>;
  SetThreadStateNotificationEvent: ResolverTypeWrapper<ModelOf<SetThreadStateNotificationEvent>>;
  SetUuidStateNotificationEvent: ResolverTypeWrapper<ModelOf<SetUuidStateNotificationEvent>>;
  String: ResolverTypeWrapper<ModelOf<Scalars['String']['output']>>;
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
  ThreadAware: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['ThreadAware']>;
  ThreadCreateCommentInput: ResolverTypeWrapper<ModelOf<ThreadCreateCommentInput>>;
  ThreadCreateCommentResponse: ResolverTypeWrapper<ModelOf<ThreadCreateCommentResponse>>;
  ThreadCreateThreadInput: ResolverTypeWrapper<ModelOf<ThreadCreateThreadInput>>;
  ThreadCreateThreadResponse: ResolverTypeWrapper<ModelOf<ThreadCreateThreadResponse>>;
  ThreadEditCommentInput: ResolverTypeWrapper<ModelOf<ThreadEditCommentInput>>;
  ThreadMutation: ResolverTypeWrapper<ModelOf<ThreadMutation>>;
  ThreadQuery: ResolverTypeWrapper<ModelOf<ThreadQuery>>;
  ThreadSetCommentStateInput: ResolverTypeWrapper<ModelOf<ThreadSetCommentStateInput>>;
  ThreadSetThreadArchivedInput: ResolverTypeWrapper<ModelOf<ThreadSetThreadArchivedInput>>;
  ThreadSetThreadStateInput: ResolverTypeWrapper<ModelOf<ThreadSetThreadStateInput>>;
  ThreadSetThreadStatusInput: ResolverTypeWrapper<ModelOf<ThreadSetThreadStatusInput>>;
  ThreadsConnection: ResolverTypeWrapper<ModelOf<ThreadsConnection>>;
  ThreadsCursor: ResolverTypeWrapper<ModelOf<ThreadsCursor>>;
  User: ResolverTypeWrapper<ModelOf<User>>;
  UserActivityByType: ResolverTypeWrapper<ModelOf<UserActivityByType>>;
  UserConnection: ResolverTypeWrapper<ModelOf<UserConnection>>;
  UserDeleteBotsInput: ResolverTypeWrapper<ModelOf<UserDeleteBotsInput>>;
  UserDeleteBotsResponse: ResolverTypeWrapper<ModelOf<UserDeleteBotsResponse>>;
  UserDeleteRegularUsersInput: ResolverTypeWrapper<ModelOf<UserDeleteRegularUsersInput>>;
  UserDeleteRegularUsersResponse: ResolverTypeWrapper<ModelOf<UserDeleteRegularUsersResponse>>;
  UserDescriptionInput: ResolverTypeWrapper<ModelOf<UserDescriptionInput>>;
  UserEdge: ResolverTypeWrapper<ModelOf<UserEdge>>;
  UserMutation: ResolverTypeWrapper<ModelOf<UserMutation>>;
  UserQuery: ResolverTypeWrapper<ModelOf<UserQuery>>;
  UserRoleInput: ResolverTypeWrapper<ModelOf<UserRoleInput>>;
  UserRoleResponse: ResolverTypeWrapper<ModelOf<UserRoleResponse>>;
  UserSetDescriptionInput: ResolverTypeWrapper<ModelOf<UserSetDescriptionInput>>;
  UserSetDescriptionResponse: ResolverTypeWrapper<ModelOf<UserSetDescriptionResponse>>;
  UserSetEmailInput: ResolverTypeWrapper<ModelOf<UserSetEmailInput>>;
  UserSetEmailResponse: ResolverTypeWrapper<ModelOf<UserSetEmailResponse>>;
  UserWithPermissionsConnection: ResolverTypeWrapper<ModelOf<UserWithPermissionsConnection>>;
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
  AbstractEntity: ResolversInterfaceTypes<ResolversParentTypes>['AbstractEntity'];
  AbstractEntityConnection: ModelOf<AbstractEntityConnection>;
  AbstractEntityCursor: ModelOf<AbstractEntityCursor>;
  AbstractEntityRevision: ResolversInterfaceTypes<ResolversParentTypes>['AbstractEntityRevision'];
  AbstractEntityRevisionConnection: ResolversInterfaceTypes<ResolversParentTypes>['AbstractEntityRevisionConnection'];
  AbstractNotificationEvent: ResolversInterfaceTypes<ResolversParentTypes>['AbstractNotificationEvent'];
  AbstractNotificationEventConnection: ModelOf<AbstractNotificationEventConnection>;
  AbstractNotificationEventEdge: ModelOf<AbstractNotificationEventEdge>;
  AbstractRepository: ResolversInterfaceTypes<ResolversParentTypes>['AbstractRepository'];
  AbstractRevision: ResolversInterfaceTypes<ResolversParentTypes>['AbstractRevision'];
  AbstractTaxonomyTermChild: ResolversInterfaceTypes<ResolversParentTypes>['AbstractTaxonomyTermChild'];
  AbstractUuid: ResolversInterfaceTypes<ResolversParentTypes>['AbstractUuid'];
  AbstractUuidConnection: ModelOf<AbstractUuidConnection>;
  AddRevisionResponse: ModelOf<AddRevisionResponse>;
  AiQuery: ModelOf<AiQuery>;
  AliasInput: ModelOf<AliasInput>;
  AllThreadsConnection: ModelOf<AllThreadsConnection>;
  Applet: ModelOf<Applet>;
  AppletRevision: ModelOf<AppletRevision>;
  AppletRevisionConnection: ModelOf<AppletRevisionConnection>;
  Article: ModelOf<Article>;
  ArticleRevision: ModelOf<ArticleRevision>;
  ArticleRevisionConnection: ModelOf<ArticleRevisionConnection>;
  Boolean: ModelOf<Scalars['Boolean']['output']>;
  CacheRemoveInput: ModelOf<CacheRemoveInput>;
  ChatCompletionMessageParam: ModelOf<ChatCompletionMessageParam>;
  CheckoutRevisionInput: ModelOf<CheckoutRevisionInput>;
  CheckoutRevisionNotificationEvent: ModelOf<CheckoutRevisionNotificationEvent>;
  CheckoutRevisionResponse: ModelOf<CheckoutRevisionResponse>;
  Comment: ModelOf<Comment>;
  CommentConnection: ModelOf<CommentConnection>;
  Course: ModelOf<Course>;
  CoursePage: ModelOf<CoursePage>;
  CoursePageRevision: ModelOf<CoursePageRevision>;
  CoursePageRevisionConnection: ModelOf<CoursePageRevisionConnection>;
  CourseRevision: ModelOf<CourseRevision>;
  CourseRevisionConnection: ModelOf<CourseRevisionConnection>;
  CreateCommentNotificationEvent: ModelOf<CreateCommentNotificationEvent>;
  CreateEntityLinkNotificationEvent: ModelOf<CreateEntityLinkNotificationEvent>;
  CreateEntityNotificationEvent: ModelOf<CreateEntityNotificationEvent>;
  CreateEntityRevisionNotificationEvent: ModelOf<CreateEntityRevisionNotificationEvent>;
  CreatePageInput: ModelOf<CreatePageInput>;
  CreateTaxonomyLinkNotificationEvent: ModelOf<CreateTaxonomyLinkNotificationEvent>;
  CreateTaxonomyTermNotificationEvent: ModelOf<CreateTaxonomyTermNotificationEvent>;
  CreateThreadNotificationEvent: ModelOf<CreateThreadNotificationEvent>;
  DateTime: ModelOf<Scalars['DateTime']['output']>;
  DefaultResponse: ModelOf<DefaultResponse>;
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
  ExecutePromptResponse: ModelOf<ExecutePromptResponse>;
  Exercise: ModelOf<Exercise>;
  ExerciseGroup: ModelOf<ExerciseGroup>;
  ExerciseGroupRevision: ModelOf<ExerciseGroupRevision>;
  ExerciseGroupRevisionConnection: ModelOf<ExerciseGroupRevisionConnection>;
  ExerciseGroupRevisionCursor: ModelOf<ExerciseGroupRevisionCursor>;
  ExerciseRevision: ModelOf<ExerciseRevision>;
  ExerciseRevisionConnection: ModelOf<ExerciseRevisionConnection>;
  ExerciseRevisionCursor: ModelOf<ExerciseRevisionCursor>;
  ExerciseSubmissionInput: ModelOf<ExerciseSubmissionInput>;
  ExperimentMutation: ModelOf<ExperimentMutation>;
  HasNextPageInfo: ModelOf<HasNextPageInfo>;
  InstanceAware: ResolversInterfaceTypes<ResolversParentTypes>['InstanceAware'];
  Int: ModelOf<Scalars['Int']['output']>;
  JSON: ModelOf<Scalars['JSON']['output']>;
  JSONObject: ModelOf<Scalars['JSONObject']['output']>;
  MediaQuery: ModelOf<MediaQuery>;
  MediaUpload: ModelOf<MediaUpload>;
  MetadataQuery: ModelOf<MetadataQuery>;
  Mutation: {};
  Notification: ModelOf<Notification>;
  NotificationConnection: ModelOf<NotificationConnection>;
  NotificationEdge: ModelOf<NotificationEdge>;
  NotificationMutation: ModelOf<NotificationMutation>;
  NotificationSetStateInput: ModelOf<NotificationSetStateInput>;
  NotificationSetStateResponse: ModelOf<NotificationSetStateResponse>;
  OauthAcceptInput: ModelOf<OauthAcceptInput>;
  OauthAcceptResponse: ModelOf<OauthAcceptResponse>;
  OauthMutation: ModelOf<OauthMutation>;
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
  SetAbstractEntityInput: ModelOf<SetAbstractEntityInput>;
  SetEntityResponse: ModelOf<SetEntityResponse>;
  SetLicenseNotificationEvent: ModelOf<SetLicenseNotificationEvent>;
  SetTaxonomyParentNotificationEvent: ModelOf<SetTaxonomyParentNotificationEvent>;
  SetTaxonomyTermNotificationEvent: ModelOf<SetTaxonomyTermNotificationEvent>;
  SetThreadStateNotificationEvent: ModelOf<SetThreadStateNotificationEvent>;
  SetUuidStateNotificationEvent: ModelOf<SetUuidStateNotificationEvent>;
  String: ModelOf<Scalars['String']['output']>;
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
  ThreadAware: ResolversInterfaceTypes<ResolversParentTypes>['ThreadAware'];
  ThreadCreateCommentInput: ModelOf<ThreadCreateCommentInput>;
  ThreadCreateCommentResponse: ModelOf<ThreadCreateCommentResponse>;
  ThreadCreateThreadInput: ModelOf<ThreadCreateThreadInput>;
  ThreadCreateThreadResponse: ModelOf<ThreadCreateThreadResponse>;
  ThreadEditCommentInput: ModelOf<ThreadEditCommentInput>;
  ThreadMutation: ModelOf<ThreadMutation>;
  ThreadQuery: ModelOf<ThreadQuery>;
  ThreadSetCommentStateInput: ModelOf<ThreadSetCommentStateInput>;
  ThreadSetThreadArchivedInput: ModelOf<ThreadSetThreadArchivedInput>;
  ThreadSetThreadStateInput: ModelOf<ThreadSetThreadStateInput>;
  ThreadSetThreadStatusInput: ModelOf<ThreadSetThreadStatusInput>;
  ThreadsConnection: ModelOf<ThreadsConnection>;
  ThreadsCursor: ModelOf<ThreadsCursor>;
  User: ModelOf<User>;
  UserActivityByType: ModelOf<UserActivityByType>;
  UserConnection: ModelOf<UserConnection>;
  UserDeleteBotsInput: ModelOf<UserDeleteBotsInput>;
  UserDeleteBotsResponse: ModelOf<UserDeleteBotsResponse>;
  UserDeleteRegularUsersInput: ModelOf<UserDeleteRegularUsersInput>;
  UserDeleteRegularUsersResponse: ModelOf<UserDeleteRegularUsersResponse>;
  UserDescriptionInput: ModelOf<UserDescriptionInput>;
  UserEdge: ModelOf<UserEdge>;
  UserMutation: ModelOf<UserMutation>;
  UserQuery: ModelOf<UserQuery>;
  UserRoleInput: ModelOf<UserRoleInput>;
  UserRoleResponse: ModelOf<UserRoleResponse>;
  UserSetDescriptionInput: ModelOf<UserSetDescriptionInput>;
  UserSetDescriptionResponse: ModelOf<UserSetDescriptionResponse>;
  UserSetEmailInput: ModelOf<UserSetEmailInput>;
  UserSetEmailResponse: ModelOf<UserSetEmailResponse>;
  UserWithPermissionsConnection: ModelOf<UserWithPermissionsConnection>;
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
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'Course' | 'CoursePage' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'Video', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['AbstractEntityRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractEntityEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['AbstractEntityRevisionConnection'], ParentType, ContextType, Partial<AbstractEntityRevisionsArgs>>;
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
  __resolveType: TypeResolveFn<'AppletRevision' | 'ArticleRevision' | 'CoursePageRevision' | 'CourseRevision' | 'EventRevision' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'VideoRevision', ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractEntityRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type AbstractEntityRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractEntityRevisionConnection'] = ResolversParentTypes['AbstractEntityRevisionConnection']> = {
  __resolveType: TypeResolveFn<'AppletRevisionConnection' | 'ArticleRevisionConnection' | 'CoursePageRevisionConnection' | 'CourseRevisionConnection' | 'EventRevisionConnection' | 'ExerciseGroupRevisionConnection' | 'ExerciseRevisionConnection' | 'VideoRevisionConnection', ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['AbstractEntityRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractNotificationEventEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractNotificationEventEdge'] = ResolversParentTypes['AbstractNotificationEventEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['AbstractNotificationEvent'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractRepositoryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractRepository'] = ResolversParentTypes['AbstractRepository']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'Course' | 'CoursePage' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'Page' | 'Video', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractRepositoryEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<AbstractRepositoryThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractRevision'] = ResolversParentTypes['AbstractRevision']> = {
  __resolveType: TypeResolveFn<'AppletRevision' | 'ArticleRevision' | 'CoursePageRevision' | 'CourseRevision' | 'EventRevision' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'PageRevision' | 'VideoRevision', ParentType, ContextType>;
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
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<AbstractTaxonomyTermChildTaxonomyTermsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractUuidResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractUuid'] = ResolversParentTypes['AbstractUuid']> = {
  __resolveType: TypeResolveFn<'Applet' | 'AppletRevision' | 'Article' | 'ArticleRevision' | 'Comment' | 'Course' | 'CoursePage' | 'CoursePageRevision' | 'CourseRevision' | 'Event' | 'EventRevision' | 'Exercise' | 'ExerciseGroup' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'Page' | 'PageRevision' | 'TaxonomyTerm' | 'User' | 'Video' | 'VideoRevision', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<AbstractUuidEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractUuidConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractUuidConnection'] = ResolversParentTypes['AbstractUuidConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['AbstractUuid']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AddRevisionResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AddRevisionResponse'] = ResolversParentTypes['AddRevisionResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  revisionId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AiQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AiQuery'] = ResolversParentTypes['AiQuery']> = {
  executePrompt?: Resolver<ResolversTypes['ExecutePromptResponse'], ParentType, ContextType, RequireFields<AiQueryExecutePromptArgs, 'messages'>>;
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
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['AppletRevisionConnection'], ParentType, ContextType, Partial<AppletRevisionsArgs>>;
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
  nodes?: Resolver<Array<ResolversTypes['AppletRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['ArticleRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<ArticleEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ArticleRevisionConnection'], ParentType, ContextType, Partial<ArticleRevisionsArgs>>;
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
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ArticleRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ArticleRevisionConnection'] = ResolversParentTypes['ArticleRevisionConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['ArticleRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  nodes?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Course'] = ResolversParentTypes['Course']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['CourseRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<CourseEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pages?: Resolver<Array<ResolversTypes['CoursePage']>, ParentType, ContextType, Partial<CoursePagesArgs>>;
  revisions?: Resolver<ResolversTypes['CourseRevisionConnection'], ParentType, ContextType, Partial<CourseRevisionsArgs>>;
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
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['CoursePageRevisionConnection'], ParentType, ContextType, Partial<CoursePageRevisionsArgs>>;
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
  metaDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['CoursePage'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<CoursePageRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoursePageRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CoursePageRevisionConnection'] = ResolversParentTypes['CoursePageRevisionConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['CoursePageRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<CourseRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CourseRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CourseRevisionConnection'] = ResolversParentTypes['CourseRevisionConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['CourseRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type DefaultResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DefaultResponse'] = ResolversParentTypes['DefaultResponse']> = {
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

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
  setAbstractEntity?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetAbstractEntityArgs, 'input'>>;
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
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['EventRevisionConnection'], ParentType, ContextType, Partial<EventRevisionsArgs>>;
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
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type ExecutePromptResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExecutePromptResponse'] = ResolversParentTypes['ExecutePromptResponse']> = {
  record?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Exercise'] = ResolversParentTypes['Exercise']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['ExerciseRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<ExerciseEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ExerciseRevisionConnection'], ParentType, ContextType, Partial<ExerciseRevisionsArgs>>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ExerciseGroupRevisionConnection'], ParentType, ContextType, Partial<ExerciseGroupRevisionsArgs>>;
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
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<ExerciseGroupRevisionEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['ExerciseGroup'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<ExerciseGroupRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  metaDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Exercise'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadsConnection'], ParentType, ContextType, Partial<ExerciseRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type ExperimentMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExperimentMutation'] = ResolversParentTypes['ExperimentMutation']> = {
  createExerciseSubmission?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ExperimentMutationCreateExerciseSubmissionArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HasNextPageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['HasNextPageInfo'] = ResolversParentTypes['HasNextPageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstanceAwareResolvers<ContextType = Context, ParentType extends ResolversParentTypes['InstanceAware'] = ResolversParentTypes['InstanceAware']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'CheckoutRevisionNotificationEvent' | 'Course' | 'CoursePage' | 'CreateCommentNotificationEvent' | 'CreateEntityLinkNotificationEvent' | 'CreateEntityNotificationEvent' | 'CreateEntityRevisionNotificationEvent' | 'CreateTaxonomyLinkNotificationEvent' | 'CreateTaxonomyTermNotificationEvent' | 'CreateThreadNotificationEvent' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'Page' | 'RejectRevisionNotificationEvent' | 'RemoveEntityLinkNotificationEvent' | 'RemoveTaxonomyLinkNotificationEvent' | 'SetLicenseNotificationEvent' | 'SetTaxonomyParentNotificationEvent' | 'SetTaxonomyTermNotificationEvent' | 'SetThreadStateNotificationEvent' | 'SetUuidStateNotificationEvent' | 'TaxonomyTerm' | 'Video', ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type MediaQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MediaQuery'] = ResolversParentTypes['MediaQuery']> = {
  newUpload?: Resolver<ResolversTypes['MediaUpload'], ParentType, ContextType, RequireFields<MediaQueryNewUploadArgs, 'mediaType'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MediaUploadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MediaUpload'] = ResolversParentTypes['MediaUpload']> = {
  uploadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  urlAfterUpload?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetadataQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['MetadataQuery'] = ResolversParentTypes['MetadataQuery']> = {
  entities?: Resolver<ResolversTypes['EntityMetadataConnection'], ParentType, ContextType, Partial<MetadataQueryEntitiesArgs>>;
  publisher?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  resources?: Resolver<ResolversTypes['EntityMetadataConnection'], ParentType, ContextType, Partial<MetadataQueryResourcesArgs>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _cache?: Resolver<ResolversTypes['_cacheMutation'], ParentType, ContextType>;
  entity?: Resolver<ResolversTypes['EntityMutation'], ParentType, ContextType>;
  experiment?: Resolver<ResolversTypes['ExperimentMutation'], ParentType, ContextType>;
  notification?: Resolver<ResolversTypes['NotificationMutation'], ParentType, ContextType>;
  oauth?: Resolver<ResolversTypes['OauthMutation'], ParentType, ContextType>;
  page?: Resolver<ResolversTypes['PageMutation'], ParentType, ContextType>;
  subscription?: Resolver<ResolversTypes['SubscriptionMutation'], ParentType, ContextType>;
  taxonomyTerm?: Resolver<ResolversTypes['TaxonomyTermMutation'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['ThreadMutation'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserMutation'], ParentType, ContextType>;
  uuid?: Resolver<ResolversTypes['UuidMutation'], ParentType, ContextType>;
};

export type NotificationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Notification'] = ResolversParentTypes['Notification']> = {
  email?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  emailSent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  event?: Resolver<Maybe<ResolversTypes['AbstractNotificationEvent']>, ParentType, ContextType>;
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

export type OauthAcceptResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OauthAcceptResponse'] = ResolversParentTypes['OauthAcceptResponse']> = {
  redirectUri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OauthMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OauthMutation'] = ResolversParentTypes['OauthMutation']> = {
  acceptConsent?: Resolver<ResolversTypes['OauthAcceptResponse'], ParentType, ContextType, RequireFields<OauthMutationAcceptConsentArgs, 'input'>>;
  acceptLogin?: Resolver<ResolversTypes['OauthAcceptResponse'], ParentType, ContextType, RequireFields<OauthMutationAcceptLoginArgs, 'input'>>;
  acceptLogout?: Resolver<ResolversTypes['OauthAcceptResponse'], ParentType, ContextType, RequireFields<OauthMutationAcceptLogoutArgs, 'challenge'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Page'] = ResolversParentTypes['Page']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['PageRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<PageEventsArgs>>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  ai?: Resolver<ResolversTypes['AiQuery'], ParentType, ContextType>;
  authorization?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  entity?: Resolver<Maybe<ResolversTypes['EntityQuery']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<QueryEventsArgs>>;
  media?: Resolver<ResolversTypes['MediaQuery'], ParentType, ContextType>;
  metadata?: Resolver<ResolversTypes['MetadataQuery'], ParentType, ContextType>;
  notificationEvent?: Resolver<Maybe<ResolversTypes['AbstractNotificationEvent']>, ParentType, ContextType, RequireFields<QueryNotificationEventArgs, 'id'>>;
  notifications?: Resolver<ResolversTypes['NotificationConnection'], ParentType, ContextType, Partial<QueryNotificationsArgs>>;
  page?: Resolver<ResolversTypes['PageQuery'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['SubjectQuery'], ParentType, ContextType>;
  subscription?: Resolver<ResolversTypes['SubscriptionQuery'], ParentType, ContextType>;
  thread?: Resolver<ResolversTypes['ThreadQuery'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['UserQuery'], ParentType, ContextType>;
  uuid?: Resolver<Maybe<ResolversTypes['AbstractUuid']>, ParentType, ContextType, Partial<QueryUuidArgs>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type SubjectResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subject'] = ResolversParentTypes['Subject']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taxonomyTerm?: Resolver<ResolversTypes['TaxonomyTerm'], ParentType, ContextType>;
  unrevisedEntities?: Resolver<ResolversTypes['AbstractEntityConnection'], ParentType, ContextType, Partial<SubjectUnrevisedEntitiesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubjectQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubjectQuery'] = ResolversParentTypes['SubjectQuery']> = {
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
  parent?: Resolver<Maybe<ResolversTypes['TaxonomyTerm']>, ParentType, ContextType>;
  path?: Resolver<Array<Maybe<ResolversTypes['TaxonomyTerm']>>, ParentType, ContextType>;
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
  status?: Resolver<ResolversTypes['CommentStatus'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadAwareResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadAware'] = ResolversParentTypes['ThreadAware']> = {
  __resolveType: TypeResolveFn<'Applet' | 'AppletRevision' | 'Article' | 'ArticleRevision' | 'Course' | 'CoursePage' | 'CoursePageRevision' | 'CourseRevision' | 'Event' | 'EventRevision' | 'Exercise' | 'ExerciseGroup' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'Page' | 'PageRevision' | 'TaxonomyTerm' | 'User' | 'Video' | 'VideoRevision', ParentType, ContextType>;
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
  createComment?: Resolver<ResolversTypes['ThreadCreateCommentResponse'], ParentType, ContextType, RequireFields<ThreadMutationCreateCommentArgs, 'input'>>;
  createThread?: Resolver<ResolversTypes['ThreadCreateThreadResponse'], ParentType, ContextType, RequireFields<ThreadMutationCreateThreadArgs, 'input'>>;
  editComment?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationEditCommentArgs, 'input'>>;
  setCommentState?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationSetCommentStateArgs, 'input'>>;
  setThreadArchived?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationSetThreadArchivedArgs, 'input'>>;
  setThreadState?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationSetThreadStateArgs, 'input'>>;
  setThreadStatus?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationSetThreadStatusArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadQuery'] = ResolversParentTypes['ThreadQuery']> = {
  allThreads?: Resolver<ResolversTypes['AllThreadsConnection'], ParentType, ContextType, Partial<ThreadQueryAllThreadsArgs>>;
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
  language?: Resolver<Maybe<ResolversTypes['Instance']>, ParentType, ContextType>;
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
  addRole?: Resolver<ResolversTypes['UserRoleResponse'], ParentType, ContextType, RequireFields<UserMutationAddRoleArgs, 'input'>>;
  deleteBots?: Resolver<ResolversTypes['UserDeleteBotsResponse'], ParentType, ContextType, RequireFields<UserMutationDeleteBotsArgs, 'input'>>;
  deleteRegularUsers?: Resolver<Array<ResolversTypes['UserDeleteRegularUsersResponse']>, ParentType, ContextType, RequireFields<UserMutationDeleteRegularUsersArgs, 'input'>>;
  removeRole?: Resolver<ResolversTypes['UserRoleResponse'], ParentType, ContextType, RequireFields<UserMutationRemoveRoleArgs, 'input'>>;
  setDescription?: Resolver<ResolversTypes['UserSetDescriptionResponse'], ParentType, ContextType, RequireFields<UserMutationSetDescriptionArgs, 'input'>>;
  setEmail?: Resolver<ResolversTypes['UserSetEmailResponse'], ParentType, ContextType, RequireFields<UserMutationSetEmailArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserQuery'] = ResolversParentTypes['UserQuery']> = {
  potentialSpamUsers?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, Partial<UserQueryPotentialSpamUsersArgs>>;
  userByUsername?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<UserQueryUserByUsernameArgs, 'username'>>;
  usersByRole?: Resolver<ResolversTypes['UserWithPermissionsConnection'], ParentType, ContextType, RequireFields<UserQueryUsersByRoleArgs, 'role'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserRoleResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserRoleResponse'] = ResolversParentTypes['UserRoleResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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

export type UserWithPermissionsConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserWithPermissionsConnection'] = ResolversParentTypes['UserWithPermissionsConnection']> = {
  edges?: Resolver<Array<ResolversTypes['UserEdge']>, ParentType, ContextType>;
  inheritance?: Resolver<Maybe<Array<ResolversTypes['Role']>>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['VideoRevisionConnection'], ParentType, ContextType, Partial<VideoRevisionsArgs>>;
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
  metaDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  remove?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<_CacheMutationRemoveArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AbstractEntity?: AbstractEntityResolvers<ContextType>;
  AbstractEntityConnection?: AbstractEntityConnectionResolvers<ContextType>;
  AbstractEntityCursor?: AbstractEntityCursorResolvers<ContextType>;
  AbstractEntityRevision?: AbstractEntityRevisionResolvers<ContextType>;
  AbstractEntityRevisionConnection?: AbstractEntityRevisionConnectionResolvers<ContextType>;
  AbstractNotificationEvent?: AbstractNotificationEventResolvers<ContextType>;
  AbstractNotificationEventConnection?: AbstractNotificationEventConnectionResolvers<ContextType>;
  AbstractNotificationEventEdge?: AbstractNotificationEventEdgeResolvers<ContextType>;
  AbstractRepository?: AbstractRepositoryResolvers<ContextType>;
  AbstractRevision?: AbstractRevisionResolvers<ContextType>;
  AbstractTaxonomyTermChild?: AbstractTaxonomyTermChildResolvers<ContextType>;
  AbstractUuid?: AbstractUuidResolvers<ContextType>;
  AbstractUuidConnection?: AbstractUuidConnectionResolvers<ContextType>;
  AddRevisionResponse?: AddRevisionResponseResolvers<ContextType>;
  AiQuery?: AiQueryResolvers<ContextType>;
  AllThreadsConnection?: AllThreadsConnectionResolvers<ContextType>;
  Applet?: AppletResolvers<ContextType>;
  AppletRevision?: AppletRevisionResolvers<ContextType>;
  AppletRevisionConnection?: AppletRevisionConnectionResolvers<ContextType>;
  Article?: ArticleResolvers<ContextType>;
  ArticleRevision?: ArticleRevisionResolvers<ContextType>;
  ArticleRevisionConnection?: ArticleRevisionConnectionResolvers<ContextType>;
  CheckoutRevisionNotificationEvent?: CheckoutRevisionNotificationEventResolvers<ContextType>;
  CheckoutRevisionResponse?: CheckoutRevisionResponseResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  CommentConnection?: CommentConnectionResolvers<ContextType>;
  Course?: CourseResolvers<ContextType>;
  CoursePage?: CoursePageResolvers<ContextType>;
  CoursePageRevision?: CoursePageRevisionResolvers<ContextType>;
  CoursePageRevisionConnection?: CoursePageRevisionConnectionResolvers<ContextType>;
  CourseRevision?: CourseRevisionResolvers<ContextType>;
  CourseRevisionConnection?: CourseRevisionConnectionResolvers<ContextType>;
  CreateCommentNotificationEvent?: CreateCommentNotificationEventResolvers<ContextType>;
  CreateEntityLinkNotificationEvent?: CreateEntityLinkNotificationEventResolvers<ContextType>;
  CreateEntityNotificationEvent?: CreateEntityNotificationEventResolvers<ContextType>;
  CreateEntityRevisionNotificationEvent?: CreateEntityRevisionNotificationEventResolvers<ContextType>;
  CreateTaxonomyLinkNotificationEvent?: CreateTaxonomyLinkNotificationEventResolvers<ContextType>;
  CreateTaxonomyTermNotificationEvent?: CreateTaxonomyTermNotificationEventResolvers<ContextType>;
  CreateThreadNotificationEvent?: CreateThreadNotificationEventResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DefaultResponse?: DefaultResponseResolvers<ContextType>;
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
  ExecutePromptResponse?: ExecutePromptResponseResolvers<ContextType>;
  Exercise?: ExerciseResolvers<ContextType>;
  ExerciseGroup?: ExerciseGroupResolvers<ContextType>;
  ExerciseGroupRevision?: ExerciseGroupRevisionResolvers<ContextType>;
  ExerciseGroupRevisionConnection?: ExerciseGroupRevisionConnectionResolvers<ContextType>;
  ExerciseGroupRevisionCursor?: ExerciseGroupRevisionCursorResolvers<ContextType>;
  ExerciseRevision?: ExerciseRevisionResolvers<ContextType>;
  ExerciseRevisionConnection?: ExerciseRevisionConnectionResolvers<ContextType>;
  ExerciseRevisionCursor?: ExerciseRevisionCursorResolvers<ContextType>;
  ExperimentMutation?: ExperimentMutationResolvers<ContextType>;
  HasNextPageInfo?: HasNextPageInfoResolvers<ContextType>;
  InstanceAware?: InstanceAwareResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  MediaQuery?: MediaQueryResolvers<ContextType>;
  MediaUpload?: MediaUploadResolvers<ContextType>;
  MetadataQuery?: MetadataQueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  NotificationConnection?: NotificationConnectionResolvers<ContextType>;
  NotificationEdge?: NotificationEdgeResolvers<ContextType>;
  NotificationMutation?: NotificationMutationResolvers<ContextType>;
  NotificationSetStateResponse?: NotificationSetStateResponseResolvers<ContextType>;
  OauthAcceptResponse?: OauthAcceptResponseResolvers<ContextType>;
  OauthMutation?: OauthMutationResolvers<ContextType>;
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
  ThreadsConnection?: ThreadsConnectionResolvers<ContextType>;
  ThreadsCursor?: ThreadsCursorResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserActivityByType?: UserActivityByTypeResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserDeleteBotsResponse?: UserDeleteBotsResponseResolvers<ContextType>;
  UserDeleteRegularUsersResponse?: UserDeleteRegularUsersResponseResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
  UserMutation?: UserMutationResolvers<ContextType>;
  UserQuery?: UserQueryResolvers<ContextType>;
  UserRoleResponse?: UserRoleResponseResolvers<ContextType>;
  UserSetDescriptionResponse?: UserSetDescriptionResponseResolvers<ContextType>;
  UserSetEmailResponse?: UserSetEmailResponseResolvers<ContextType>;
  UserWithPermissionsConnection?: UserWithPermissionsConnectionResolvers<ContextType>;
  UuidMutation?: UuidMutationResolvers<ContextType>;
  UuidSetStateResponse?: UuidSetStateResponseResolvers<ContextType>;
  Video?: VideoResolvers<ContextType>;
  VideoRevision?: VideoRevisionResolvers<ContextType>;
  VideoRevisionConnection?: VideoRevisionConnectionResolvers<ContextType>;
  VideoRevisionCursor?: VideoRevisionCursorResolvers<ContextType>;
  _cacheMutation?: _CacheMutationResolvers<ContextType>;
};

