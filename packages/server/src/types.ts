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
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  currentRevision?: Maybe<AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | PageRevision | VideoRevision>;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: AppletRevisionConnection | ArticleRevisionConnection | CoursePageRevisionConnection | CourseRevisionConnection | EventRevisionConnection | ExerciseGroupRevisionConnection | ExerciseRevisionConnection | PageRevisionConnection | VideoRevisionConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractEntityRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AbstractEntityConnection = {
  __typename?: 'AbstractEntityConnection';
  nodes: Array<Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AbstractEntityRevision = {
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type AbstractEntityRevisionConnection = {
  nodes: Array<AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | PageRevision | VideoRevision>;
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
  nodes: Array<CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent>;
  pageInfo: PageInfo;
};

export type AbstractRepository = {
  alias: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractRepositoryThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AbstractRevision = {
  alias: Scalars['String']['output'];
  author: User;
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AbstractTaxonomyTermChild = {
  alias: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  taxonomyTerms: TaxonomyTermConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AbstractTaxonomyTermChildTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type AbstractUuid = {
  alias: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};

export type AbstractUuidConnection = {
  __typename?: 'AbstractUuidConnection';
  nodes: Array<Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | Page | PageRevision | TaxonomyTerm | User | Video | VideoRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
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

export type Applet = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Applet';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<AppletRevision>;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: AppletRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type AppletRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type AppletTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type AppletThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AppletRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'AppletRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  metaDescription: Scalars['String']['output'];
  metaTitle: Scalars['String']['output'];
  repository: Applet;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};


export type AppletRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
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
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: ArticleRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ArticleRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ArticleTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type ArticleThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ArticleRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'ArticleRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  metaDescription: Scalars['String']['output'];
  metaTitle: Scalars['String']['output'];
  repository: Article;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type ArticleRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
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
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
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
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  pages: Array<CoursePage>;
  revisions: CourseRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type CoursePagesArgs = {
  hasCurrentRevision?: InputMaybe<Scalars['Boolean']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CourseRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CourseTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CoursePage = AbstractEntity & AbstractRepository & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'CoursePage';
  alias: Scalars['String']['output'];
  course: Course;
  currentRevision?: Maybe<CoursePageRevision>;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: CoursePageRevisionConnection;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type CoursePageRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type CoursePageThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CoursePageRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'CoursePageRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: CoursePage;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type CoursePageRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
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
  id: Scalars['Int']['output'];
  metaDescription: Scalars['String']['output'];
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: Course;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type CourseRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
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
  child: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  objectId: Scalars['Int']['output'];
  parent: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video;
};

export type CreateEntityNotificationEvent = AbstractNotificationEvent & InstanceAware & {
  __typename?: 'CreateEntityNotificationEvent';
  actor: User;
  date: Scalars['DateTime']['output'];
  entity: Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video;
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

export type DeletedEntity = {
  __typename?: 'DeletedEntity';
  dateOfDeletion?: Maybe<Scalars['String']['output']>;
  entity?: Maybe<Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video>;
};

export type DeletedEntityConnection = {
  __typename?: 'DeletedEntityConnection';
  nodes: Array<DeletedEntity>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type EntityMutation = {
  __typename?: 'EntityMutation';
  checkoutRevision: DefaultResponse;
  rejectRevision: DefaultResponse;
  setAbstractEntity: SetEntityResponse;
  updateLicense: DefaultResponse;
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


export type EntityMutationUpdateLicenseArgs = {
  input: EntityUpdateLicenseInput;
};

export type EntityQuery = {
  __typename?: 'EntityQuery';
  deletedEntities: DeletedEntityConnection;
};


export type EntityQueryDeletedEntitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
};

export type EntityUpdateLicenseInput = {
  entityId: Scalars['Int']['input'];
  licenseId: Scalars['Int']['input'];
};

export type Event = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Event';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<EventRevision>;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: EventRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type EventRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type EventTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type EventThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'EventRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  metaDescription: Scalars['String']['output'];
  metaTitle: Scalars['String']['output'];
  repository: Event;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type EventRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventRevisionConnection = AbstractEntityRevisionConnection & {
  __typename?: 'EventRevisionConnection';
  nodes: Array<EventRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
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
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: ExerciseRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ExerciseRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ExerciseTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type ExerciseThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ExerciseGroup = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'ExerciseGroup';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<ExerciseGroupRevision>;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: ExerciseGroupRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type ExerciseGroupRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type ExerciseGroupTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type ExerciseGroupThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ExerciseGroupRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'ExerciseGroupRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: ExerciseGroup;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type ExerciseGroupRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ExerciseGroupRevisionConnection = AbstractEntityRevisionConnection & {
  __typename?: 'ExerciseGroupRevisionConnection';
  nodes: Array<ExerciseGroupRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ExerciseRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'ExerciseRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: Exercise;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type ExerciseRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ExerciseRevisionConnection = AbstractEntityRevisionConnection & {
  __typename?: 'ExerciseRevisionConnection';
  nodes: Array<ExerciseRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
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
  publisher: Scalars['JSONObject']['output'];
  resources: ResourceMetadataConnection;
  version: Scalars['String']['output'];
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
  event?: Maybe<CheckoutRevisionNotificationEvent | CreateCommentNotificationEvent | CreateEntityLinkNotificationEvent | CreateEntityNotificationEvent | CreateEntityRevisionNotificationEvent | CreateTaxonomyLinkNotificationEvent | CreateTaxonomyTermNotificationEvent | CreateThreadNotificationEvent | RejectRevisionNotificationEvent | RemoveTaxonomyLinkNotificationEvent | SetLicenseNotificationEvent | SetTaxonomyParentNotificationEvent | SetTaxonomyTermNotificationEvent | SetThreadStateNotificationEvent | SetUuidStateNotificationEvent>;
  id: Scalars['Int']['output'];
  unread: Scalars['Boolean']['output'];
};

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  nodes: Array<Notification>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type NotificationMutation = {
  __typename?: 'NotificationMutation';
  setState?: Maybe<DefaultResponse>;
};


export type NotificationMutationSetStateArgs = {
  input: NotificationSetStateInput;
};

export type NotificationSetStateInput = {
  id: Array<Scalars['Int']['input']>;
  unread: Scalars['Boolean']['input'];
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

export type Page = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Page';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<PageRevision>;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: PageRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type PageRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PageTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type PageThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PageAddRevisionInput = {
  content: Scalars['String']['input'];
  pageId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type PageMutation = {
  __typename?: 'PageMutation';
  addRevision: DefaultResponse;
  checkoutRevision: DefaultResponse;
  create: DefaultResponse;
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

export type PageRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'PageRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: Page;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};


export type PageRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PageRevisionConnection = AbstractEntityRevisionConnection & {
  __typename?: 'PageRevisionConnection';
  nodes: Array<PageRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  ai: AiQuery;
  authorization: Scalars['JSON']['output'];
  entity?: Maybe<EntityQuery>;
  events: AbstractNotificationEventConnection;
  media: MediaQuery;
  metadata: MetadataQuery;
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
  first?: InputMaybe<Scalars['Int']['input']>;
  instance?: InputMaybe<Instance>;
  last?: InputMaybe<Scalars['Int']['input']>;
  objectId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['Boolean']['input']>;
  emailSent?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
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

export type ResourceMetadataConnection = {
  __typename?: 'ResourceMetadataConnection';
  nodes: Array<Scalars['JSONObject']['output']>;
  pageInfo: PageInfo;
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
  nodes: Array<ScopedRole>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
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
  entity?: Maybe<Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video>;
  query: Query;
  record?: Maybe<Applet | Article | Course | CoursePage | Event | Exercise | ExerciseGroup | Page | Video>;
  revision?: Maybe<AppletRevision | ArticleRevision | CoursePageRevision | CourseRevision | EventRevision | ExerciseGroupRevision | ExerciseRevision | PageRevision | VideoRevision>;
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
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type SubjectQuery = {
  __typename?: 'SubjectQuery';
  subjects: Array<Subject>;
};


export type SubjectQuerySubjectsArgs = {
  instance: Instance;
};

export type SubscriptionInfo = {
  __typename?: 'SubscriptionInfo';
  object: Applet | AppletRevision | Article | ArticleRevision | Comment | Course | CoursePage | CoursePageRevision | CourseRevision | Event | EventRevision | Exercise | ExerciseGroup | ExerciseGroupRevision | ExerciseRevision | Page | PageRevision | TaxonomyTerm | User | Video | VideoRevision;
  sendEmail: Scalars['Boolean']['output'];
};

export type SubscriptionInfoConnection = {
  __typename?: 'SubscriptionInfoConnection';
  nodes: Array<SubscriptionInfo>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SubscriptionMutation = {
  __typename?: 'SubscriptionMutation';
  set: DefaultResponse;
};


export type SubscriptionMutationSetArgs = {
  input: SubscriptionSetInput;
};

export type SubscriptionQuery = {
  __typename?: 'SubscriptionQuery';
  currentUserHasSubscribed: Scalars['Boolean']['output'];
  getSubscriptions: SubscriptionInfoConnection;
};


export type SubscriptionQueryCurrentUserHasSubscribedArgs = {
  id: Scalars['Int']['input'];
};


export type SubscriptionQueryGetSubscriptionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type SubscriptionSetInput = {
  id: Array<Scalars['Int']['input']>;
  sendEmail: Scalars['Boolean']['input'];
  subscribe: Scalars['Boolean']['input'];
};

export type TaxonomyEntityLinksInput = {
  entityIds: Array<Scalars['Int']['input']>;
  taxonomyTermId: Scalars['Int']['input'];
};

export type TaxonomyTerm = AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'TaxonomyTerm';
  alias: Scalars['String']['output'];
  children: AbstractUuidConnection;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  instance: Instance;
  name: Scalars['String']['output'];
  parent?: Maybe<TaxonomyTerm>;
  path: Array<Maybe<TaxonomyTerm>>;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  type: TaxonomyTermType;
  weight: Scalars['Int']['output'];
};


export type TaxonomyTermChildrenArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type TaxonomyTermThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TaxonomyTermConnection = {
  __typename?: 'TaxonomyTermConnection';
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

export type TaxonomyTermMutation = {
  __typename?: 'TaxonomyTermMutation';
  create: TaxonomyTermCreateResponse;
  createEntityLinks: DefaultResponse;
  deleteEntityLinks: DefaultResponse;
  setNameAndDescription: DefaultResponse;
  sort: DefaultResponse;
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

export type TaxonomyTermSortInput = {
  childrenIds: Array<Scalars['Int']['input']>;
  taxonomyTermId: Scalars['Int']['input'];
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
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type ThreadAware = {
  threads: ThreadConnection;
};


export type ThreadAwareThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ThreadConnection = {
  __typename?: 'ThreadConnection';
  nodes: Array<Thread>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ThreadCreateCommentInput = {
  content: Scalars['String']['input'];
  sendEmail: Scalars['Boolean']['input'];
  subscribe: Scalars['Boolean']['input'];
  threadId: Scalars['String']['input'];
};

export type ThreadCreateThreadInput = {
  content: Scalars['String']['input'];
  objectId: Scalars['Int']['input'];
  sendEmail: Scalars['Boolean']['input'];
  subscribe: Scalars['Boolean']['input'];
  title: Scalars['String']['input'];
};

export type ThreadEditCommentInput = {
  commentId: Scalars['Int']['input'];
  content: Scalars['String']['input'];
};

export type ThreadMutation = {
  __typename?: 'ThreadMutation';
  createComment: DefaultResponse;
  createThread: DefaultResponse;
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
  allThreads: ThreadConnection;
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

export type User = AbstractUuid & ThreadAware & {
  __typename?: 'User';
  activityByType: UserActivityByType;
  alias: Scalars['String']['output'];
  chatUrl?: Maybe<Scalars['String']['output']>;
  date: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
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
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  unrevisedEntities: AbstractEntityConnection;
  username: Scalars['String']['output'];
};


export type UserRolesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type UserThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};


export type UserUnrevisedEntitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
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
  nodes: Array<User>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UserDeleteBotsInput = {
  botIds: Array<Scalars['Int']['input']>;
};

export type UserDeleteRegularUsersInput = {
  id: Scalars['Int']['input'];
  username: Scalars['String']['input'];
};

export type UserDeleteRegularUsersResponse = {
  __typename?: 'UserDeleteRegularUsersResponse';
  reason?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type UserMutation = {
  __typename?: 'UserMutation';
  addRole: DefaultResponse;
  deleteBots: DefaultResponse;
  deleteRegularUser: DefaultResponse;
  removeRole: DefaultResponse;
  setDescription: DefaultResponse;
};


export type UserMutationAddRoleArgs = {
  input: UserRoleInput;
};


export type UserMutationDeleteBotsArgs = {
  input: UserDeleteBotsInput;
};


export type UserMutationDeleteRegularUserArgs = {
  input: UserDeleteRegularUsersInput;
};


export type UserMutationRemoveRoleArgs = {
  input: UserRoleInput;
};


export type UserMutationSetDescriptionArgs = {
  input: UserSetDescriptionInput;
};

export type UserQuery = {
  __typename?: 'UserQuery';
  potentialSpamUsers: UserConnection;
  userByUsername?: Maybe<User>;
  usersByRole: UserConnection;
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

export type UserSetDescriptionInput = {
  description: Scalars['String']['input'];
};

export type UuidMutation = {
  __typename?: 'UuidMutation';
  setState: DefaultResponse;
};


export type UuidMutationSetStateArgs = {
  input: UuidSetStateInput;
};

export type UuidSetStateInput = {
  id: Array<Scalars['Int']['input']>;
  trashed: Scalars['Boolean']['input'];
};

export type Video = AbstractEntity & AbstractRepository & AbstractTaxonomyTermChild & AbstractUuid & InstanceAware & ThreadAware & {
  __typename?: 'Video';
  alias: Scalars['String']['output'];
  currentRevision?: Maybe<VideoRevision>;
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  instance: Instance;
  licenseId: Scalars['Int']['output'];
  revisions: VideoRevisionConnection;
  taxonomyTerms: TaxonomyTermConnection;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
};


export type VideoRevisionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  unrevised?: InputMaybe<Scalars['Boolean']['input']>;
};


export type VideoTaxonomyTermsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type VideoThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VideoRevision = AbstractEntityRevision & AbstractRevision & AbstractUuid & ThreadAware & {
  __typename?: 'VideoRevision';
  alias: Scalars['String']['output'];
  author: User;
  changes: Scalars['String']['output'];
  content: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  metaDescription?: Maybe<Scalars['String']['output']>;
  metaTitle?: Maybe<Scalars['String']['output']>;
  repository: Video;
  threads: ThreadConnection;
  title: Scalars['String']['output'];
  trashed: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};


export type VideoRevisionThreadsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  trashed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type VideoRevisionConnection = AbstractEntityRevisionConnection & {
  __typename?: 'VideoRevisionConnection';
  nodes: Array<VideoRevision>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
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
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  AbstractEntity: ( ModelOf<Omit<Applet, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['AppletRevision']>, revisions: _RefType['AppletRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Article, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ArticleRevision']>, revisions: _RefType['ArticleRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Course, 'currentRevision' | 'pages' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['CourseRevision']>, pages: Array<_RefType['CoursePage']>, revisions: _RefType['CourseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CoursePage, 'course' | 'currentRevision' | 'revisions' | 'threads'> & { course: _RefType['Course'], currentRevision?: Maybe<_RefType['CoursePageRevision']>, revisions: _RefType['CoursePageRevisionConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Event, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['EventRevision']>, revisions: _RefType['EventRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Exercise, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseRevision']>, revisions: _RefType['ExerciseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseGroup, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseGroupRevision']>, revisions: _RefType['ExerciseGroupRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Page, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['PageRevision']>, revisions: _RefType['PageRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Video, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['VideoRevision']>, revisions: _RefType['VideoRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> );
  AbstractEntityRevision: ( ModelOf<Omit<AppletRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Applet'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ArticleRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Article'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CoursePageRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['CoursePage'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CourseRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Course'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<EventRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Event'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseGroupRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['ExerciseGroup'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Exercise'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<PageRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Page'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<VideoRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Video'], threads: _RefType['ThreadConnection'] }> );
  AbstractEntityRevisionConnection: ( ModelOf<Omit<AppletRevisionConnection, 'nodes'> & { nodes: Array<_RefType['AppletRevision']> }> ) | ( ModelOf<Omit<ArticleRevisionConnection, 'nodes'> & { nodes: Array<_RefType['ArticleRevision']> }> ) | ( ModelOf<Omit<CoursePageRevisionConnection, 'nodes'> & { nodes: Array<_RefType['CoursePageRevision']> }> ) | ( ModelOf<Omit<CourseRevisionConnection, 'nodes'> & { nodes: Array<_RefType['CourseRevision']> }> ) | ( ModelOf<Omit<EventRevisionConnection, 'nodes'> & { nodes: Array<_RefType['EventRevision']> }> ) | ( ModelOf<Omit<ExerciseGroupRevisionConnection, 'nodes'> & { nodes: Array<_RefType['ExerciseGroupRevision']> }> ) | ( ModelOf<Omit<ExerciseRevisionConnection, 'nodes'> & { nodes: Array<_RefType['ExerciseRevision']> }> ) | ( ModelOf<Omit<PageRevisionConnection, 'nodes'> & { nodes: Array<_RefType['PageRevision']> }> ) | ( ModelOf<Omit<VideoRevisionConnection, 'nodes'> & { nodes: Array<_RefType['VideoRevision']> }> );
  AbstractNotificationEvent: ( ModelOf<Omit<CheckoutRevisionNotificationEvent, 'actor' | 'repository' | 'revision'> & { actor: _RefType['User'], repository: _RefType['AbstractRepository'], revision: _RefType['AbstractRevision'] }> ) | ( ModelOf<Omit<CreateCommentNotificationEvent, 'actor' | 'comment' | 'thread'> & { actor: _RefType['User'], comment: _RefType['Comment'], thread: _RefType['Thread'] }> ) | ( ModelOf<Omit<CreateEntityLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: _RefType['User'], child: _RefType['AbstractEntity'], parent: _RefType['AbstractEntity'] }> ) | ( ModelOf<Omit<CreateEntityNotificationEvent, 'actor' | 'entity'> & { actor: _RefType['User'], entity: _RefType['AbstractEntity'] }> ) | ( ModelOf<Omit<CreateEntityRevisionNotificationEvent, 'actor' | 'entity' | 'entityRevision'> & { actor: _RefType['User'], entity: _RefType['AbstractRepository'], entityRevision: _RefType['AbstractRevision'] }> ) | ( ModelOf<Omit<CreateTaxonomyLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: _RefType['User'], child: _RefType['AbstractUuid'], parent: _RefType['TaxonomyTerm'] }> ) | ( ModelOf<Omit<CreateTaxonomyTermNotificationEvent, 'actor' | 'taxonomyTerm'> & { actor: _RefType['User'], taxonomyTerm: _RefType['TaxonomyTerm'] }> ) | ( ModelOf<Omit<CreateThreadNotificationEvent, 'actor' | 'object' | 'thread'> & { actor: _RefType['User'], object: _RefType['AbstractUuid'], thread: _RefType['Thread'] }> ) | ( ModelOf<Omit<RejectRevisionNotificationEvent, 'actor' | 'repository' | 'revision'> & { actor: _RefType['User'], repository: _RefType['AbstractRepository'], revision: _RefType['AbstractRevision'] }> ) | ( ModelOf<Omit<RemoveTaxonomyLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: _RefType['User'], child: _RefType['AbstractUuid'], parent: _RefType['TaxonomyTerm'] }> ) | ( ModelOf<Omit<SetLicenseNotificationEvent, 'actor' | 'repository'> & { actor: _RefType['User'], repository: _RefType['AbstractRepository'] }> ) | ( ModelOf<Omit<SetTaxonomyParentNotificationEvent, 'actor' | 'child' | 'parent' | 'previousParent'> & { actor: _RefType['User'], child: _RefType['TaxonomyTerm'], parent?: Maybe<_RefType['TaxonomyTerm']>, previousParent?: Maybe<_RefType['TaxonomyTerm']> }> ) | ( ModelOf<Omit<SetTaxonomyTermNotificationEvent, 'actor' | 'taxonomyTerm'> & { actor: _RefType['User'], taxonomyTerm: _RefType['TaxonomyTerm'] }> ) | ( ModelOf<Omit<SetThreadStateNotificationEvent, 'actor' | 'thread'> & { actor: _RefType['User'], thread: _RefType['Thread'] }> ) | ( ModelOf<Omit<SetUuidStateNotificationEvent, 'actor' | 'object'> & { actor: _RefType['User'], object: _RefType['AbstractUuid'] }> );
  AbstractRepository: ( ModelOf<Omit<Applet, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['AppletRevision']>, revisions: _RefType['AppletRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Article, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ArticleRevision']>, revisions: _RefType['ArticleRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Course, 'currentRevision' | 'pages' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['CourseRevision']>, pages: Array<_RefType['CoursePage']>, revisions: _RefType['CourseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CoursePage, 'course' | 'currentRevision' | 'revisions' | 'threads'> & { course: _RefType['Course'], currentRevision?: Maybe<_RefType['CoursePageRevision']>, revisions: _RefType['CoursePageRevisionConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Event, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['EventRevision']>, revisions: _RefType['EventRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Exercise, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseRevision']>, revisions: _RefType['ExerciseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseGroup, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseGroupRevision']>, revisions: _RefType['ExerciseGroupRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Page, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['PageRevision']>, revisions: _RefType['PageRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Video, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['VideoRevision']>, revisions: _RefType['VideoRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> );
  AbstractRevision: ( ModelOf<Omit<AppletRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Applet'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ArticleRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Article'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CoursePageRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['CoursePage'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CourseRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Course'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<EventRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Event'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseGroupRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['ExerciseGroup'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Exercise'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<PageRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Page'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<VideoRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Video'], threads: _RefType['ThreadConnection'] }> );
  AbstractTaxonomyTermChild: ( ModelOf<Omit<Applet, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['AppletRevision']>, revisions: _RefType['AppletRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Article, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ArticleRevision']>, revisions: _RefType['ArticleRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Course, 'currentRevision' | 'pages' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['CourseRevision']>, pages: Array<_RefType['CoursePage']>, revisions: _RefType['CourseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Event, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['EventRevision']>, revisions: _RefType['EventRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Exercise, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseRevision']>, revisions: _RefType['ExerciseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseGroup, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseGroupRevision']>, revisions: _RefType['ExerciseGroupRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Page, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['PageRevision']>, revisions: _RefType['PageRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Video, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['VideoRevision']>, revisions: _RefType['VideoRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> );
  AbstractUuid: ( ModelOf<Omit<Applet, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['AppletRevision']>, revisions: _RefType['AppletRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<AppletRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Applet'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Article, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ArticleRevision']>, revisions: _RefType['ArticleRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ArticleRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Article'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Comment, 'author' | 'events' | 'legacyObject'> & { author: _RefType['User'], events: _RefType['AbstractNotificationEventConnection'], legacyObject: _RefType['AbstractUuid'] }> ) | ( ModelOf<Omit<Course, 'currentRevision' | 'pages' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['CourseRevision']>, pages: Array<_RefType['CoursePage']>, revisions: _RefType['CourseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CoursePage, 'course' | 'currentRevision' | 'revisions' | 'threads'> & { course: _RefType['Course'], currentRevision?: Maybe<_RefType['CoursePageRevision']>, revisions: _RefType['CoursePageRevisionConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CoursePageRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['CoursePage'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CourseRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Course'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Event, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['EventRevision']>, revisions: _RefType['EventRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<EventRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Event'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Exercise, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseRevision']>, revisions: _RefType['ExerciseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseGroup, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseGroupRevision']>, revisions: _RefType['ExerciseGroupRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseGroupRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['ExerciseGroup'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Exercise'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Page, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['PageRevision']>, revisions: _RefType['PageRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<PageRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Page'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<TaxonomyTerm, 'children' | 'parent' | 'path' | 'threads'> & { children: _RefType['AbstractUuidConnection'], parent?: Maybe<_RefType['TaxonomyTerm']>, path: Array<Maybe<_RefType['TaxonomyTerm']>>, threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<User, 'activityByType' | 'threads' | 'unrevisedEntities'> & { activityByType: _RefType['UserActivityByType'], threads: _RefType['ThreadConnection'], unrevisedEntities: _RefType['AbstractEntityConnection'] }> ) | ( ModelOf<Omit<Video, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['VideoRevision']>, revisions: _RefType['VideoRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<VideoRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Video'], threads: _RefType['ThreadConnection'] }> );
  InstanceAware: ( ModelOf<Omit<Applet, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['AppletRevision']>, revisions: _RefType['AppletRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Article, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ArticleRevision']>, revisions: _RefType['ArticleRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CheckoutRevisionNotificationEvent, 'actor' | 'repository' | 'revision'> & { actor: _RefType['User'], repository: _RefType['AbstractRepository'], revision: _RefType['AbstractRevision'] }> ) | ( ModelOf<Omit<Course, 'currentRevision' | 'pages' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['CourseRevision']>, pages: Array<_RefType['CoursePage']>, revisions: _RefType['CourseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CoursePage, 'course' | 'currentRevision' | 'revisions' | 'threads'> & { course: _RefType['Course'], currentRevision?: Maybe<_RefType['CoursePageRevision']>, revisions: _RefType['CoursePageRevisionConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CreateCommentNotificationEvent, 'actor' | 'comment' | 'thread'> & { actor: _RefType['User'], comment: _RefType['Comment'], thread: _RefType['Thread'] }> ) | ( ModelOf<Omit<CreateEntityLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: _RefType['User'], child: _RefType['AbstractEntity'], parent: _RefType['AbstractEntity'] }> ) | ( ModelOf<Omit<CreateEntityNotificationEvent, 'actor' | 'entity'> & { actor: _RefType['User'], entity: _RefType['AbstractEntity'] }> ) | ( ModelOf<Omit<CreateEntityRevisionNotificationEvent, 'actor' | 'entity' | 'entityRevision'> & { actor: _RefType['User'], entity: _RefType['AbstractRepository'], entityRevision: _RefType['AbstractRevision'] }> ) | ( ModelOf<Omit<CreateTaxonomyLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: _RefType['User'], child: _RefType['AbstractUuid'], parent: _RefType['TaxonomyTerm'] }> ) | ( ModelOf<Omit<CreateTaxonomyTermNotificationEvent, 'actor' | 'taxonomyTerm'> & { actor: _RefType['User'], taxonomyTerm: _RefType['TaxonomyTerm'] }> ) | ( ModelOf<Omit<CreateThreadNotificationEvent, 'actor' | 'object' | 'thread'> & { actor: _RefType['User'], object: _RefType['AbstractUuid'], thread: _RefType['Thread'] }> ) | ( ModelOf<Omit<Event, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['EventRevision']>, revisions: _RefType['EventRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Exercise, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseRevision']>, revisions: _RefType['ExerciseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseGroup, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseGroupRevision']>, revisions: _RefType['ExerciseGroupRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Page, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['PageRevision']>, revisions: _RefType['PageRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<RejectRevisionNotificationEvent, 'actor' | 'repository' | 'revision'> & { actor: _RefType['User'], repository: _RefType['AbstractRepository'], revision: _RefType['AbstractRevision'] }> ) | ( ModelOf<Omit<RemoveTaxonomyLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: _RefType['User'], child: _RefType['AbstractUuid'], parent: _RefType['TaxonomyTerm'] }> ) | ( ModelOf<Omit<SetLicenseNotificationEvent, 'actor' | 'repository'> & { actor: _RefType['User'], repository: _RefType['AbstractRepository'] }> ) | ( ModelOf<Omit<SetTaxonomyParentNotificationEvent, 'actor' | 'child' | 'parent' | 'previousParent'> & { actor: _RefType['User'], child: _RefType['TaxonomyTerm'], parent?: Maybe<_RefType['TaxonomyTerm']>, previousParent?: Maybe<_RefType['TaxonomyTerm']> }> ) | ( ModelOf<Omit<SetTaxonomyTermNotificationEvent, 'actor' | 'taxonomyTerm'> & { actor: _RefType['User'], taxonomyTerm: _RefType['TaxonomyTerm'] }> ) | ( ModelOf<Omit<SetThreadStateNotificationEvent, 'actor' | 'thread'> & { actor: _RefType['User'], thread: _RefType['Thread'] }> ) | ( ModelOf<Omit<SetUuidStateNotificationEvent, 'actor' | 'object'> & { actor: _RefType['User'], object: _RefType['AbstractUuid'] }> ) | ( ModelOf<Omit<TaxonomyTerm, 'children' | 'parent' | 'path' | 'threads'> & { children: _RefType['AbstractUuidConnection'], parent?: Maybe<_RefType['TaxonomyTerm']>, path: Array<Maybe<_RefType['TaxonomyTerm']>>, threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Video, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['VideoRevision']>, revisions: _RefType['VideoRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> );
  ThreadAware: ( ModelOf<Omit<Applet, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['AppletRevision']>, revisions: _RefType['AppletRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<AppletRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Applet'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Article, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ArticleRevision']>, revisions: _RefType['ArticleRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ArticleRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Article'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Course, 'currentRevision' | 'pages' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['CourseRevision']>, pages: Array<_RefType['CoursePage']>, revisions: _RefType['CourseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CoursePage, 'course' | 'currentRevision' | 'revisions' | 'threads'> & { course: _RefType['Course'], currentRevision?: Maybe<_RefType['CoursePageRevision']>, revisions: _RefType['CoursePageRevisionConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CoursePageRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['CoursePage'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<CourseRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Course'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Event, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['EventRevision']>, revisions: _RefType['EventRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<EventRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Event'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Exercise, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseRevision']>, revisions: _RefType['ExerciseRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseGroup, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['ExerciseGroupRevision']>, revisions: _RefType['ExerciseGroupRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseGroupRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['ExerciseGroup'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<ExerciseRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Exercise'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<Page, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['PageRevision']>, revisions: _RefType['PageRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<PageRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Page'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<TaxonomyTerm, 'children' | 'parent' | 'path' | 'threads'> & { children: _RefType['AbstractUuidConnection'], parent?: Maybe<_RefType['TaxonomyTerm']>, path: Array<Maybe<_RefType['TaxonomyTerm']>>, threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<User, 'activityByType' | 'threads' | 'unrevisedEntities'> & { activityByType: _RefType['UserActivityByType'], threads: _RefType['ThreadConnection'], unrevisedEntities: _RefType['AbstractEntityConnection'] }> ) | ( ModelOf<Omit<Video, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<_RefType['VideoRevision']>, revisions: _RefType['VideoRevisionConnection'], taxonomyTerms: _RefType['TaxonomyTermConnection'], threads: _RefType['ThreadConnection'] }> ) | ( ModelOf<Omit<VideoRevision, 'author' | 'repository' | 'threads'> & { author: _RefType['User'], repository: _RefType['Video'], threads: _RefType['ThreadConnection'] }> );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AbstractEntity: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractEntity']>;
  AbstractEntityConnection: ResolverTypeWrapper<ModelOf<Omit<AbstractEntityConnection, 'nodes'> & { nodes: Array<ResolversTypes['AbstractEntity']> }>>;
  AbstractEntityRevision: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractEntityRevision']>;
  AbstractEntityRevisionConnection: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractEntityRevisionConnection']>;
  AbstractNotificationEvent: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractNotificationEvent']>;
  AbstractNotificationEventConnection: ResolverTypeWrapper<ModelOf<Omit<AbstractNotificationEventConnection, 'nodes'> & { nodes: Array<ResolversTypes['AbstractNotificationEvent']> }>>;
  AbstractRepository: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractRepository']>;
  AbstractRevision: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractRevision']>;
  AbstractTaxonomyTermChild: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractTaxonomyTermChild']>;
  AbstractUuid: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AbstractUuid']>;
  AbstractUuidConnection: ResolverTypeWrapper<ModelOf<Omit<AbstractUuidConnection, 'nodes'> & { nodes: Array<ResolversTypes['AbstractUuid']> }>>;
  AiQuery: ResolverTypeWrapper<ModelOf<AiQuery>>;
  AliasInput: ResolverTypeWrapper<ModelOf<AliasInput>>;
  Applet: ResolverTypeWrapper<ModelOf<Omit<Applet, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversTypes['AppletRevision']>, revisions: ResolversTypes['AppletRevisionConnection'], taxonomyTerms: ResolversTypes['TaxonomyTermConnection'], threads: ResolversTypes['ThreadConnection'] }>>;
  AppletRevision: ResolverTypeWrapper<ModelOf<Omit<AppletRevision, 'author' | 'repository' | 'threads'> & { author: ResolversTypes['User'], repository: ResolversTypes['Applet'], threads: ResolversTypes['ThreadConnection'] }>>;
  AppletRevisionConnection: ResolverTypeWrapper<ModelOf<Omit<AppletRevisionConnection, 'nodes'> & { nodes: Array<ResolversTypes['AppletRevision']> }>>;
  Article: ResolverTypeWrapper<ModelOf<Omit<Article, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversTypes['ArticleRevision']>, revisions: ResolversTypes['ArticleRevisionConnection'], taxonomyTerms: ResolversTypes['TaxonomyTermConnection'], threads: ResolversTypes['ThreadConnection'] }>>;
  ArticleRevision: ResolverTypeWrapper<ModelOf<Omit<ArticleRevision, 'author' | 'repository' | 'threads'> & { author: ResolversTypes['User'], repository: ResolversTypes['Article'], threads: ResolversTypes['ThreadConnection'] }>>;
  ArticleRevisionConnection: ResolverTypeWrapper<ModelOf<Omit<ArticleRevisionConnection, 'nodes'> & { nodes: Array<ResolversTypes['ArticleRevision']> }>>;
  Boolean: ResolverTypeWrapper<ModelOf<Scalars['Boolean']['output']>>;
  CacheRemoveInput: ResolverTypeWrapper<ModelOf<CacheRemoveInput>>;
  ChatCompletionMessageParam: ResolverTypeWrapper<ModelOf<ChatCompletionMessageParam>>;
  CheckoutRevisionInput: ResolverTypeWrapper<ModelOf<CheckoutRevisionInput>>;
  CheckoutRevisionNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<CheckoutRevisionNotificationEvent, 'actor' | 'repository' | 'revision'> & { actor: ResolversTypes['User'], repository: ResolversTypes['AbstractRepository'], revision: ResolversTypes['AbstractRevision'] }>>;
  Comment: ResolverTypeWrapper<ModelOf<Omit<Comment, 'author' | 'events' | 'legacyObject'> & { author: ResolversTypes['User'], events: ResolversTypes['AbstractNotificationEventConnection'], legacyObject: ResolversTypes['AbstractUuid'] }>>;
  CommentConnection: ResolverTypeWrapper<ModelOf<Omit<CommentConnection, 'nodes'> & { nodes: Array<ResolversTypes['Comment']> }>>;
  CommentStatus: ResolverTypeWrapper<ModelOf<CommentStatus>>;
  Course: ResolverTypeWrapper<ModelOf<Omit<Course, 'currentRevision' | 'pages' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversTypes['CourseRevision']>, pages: Array<ResolversTypes['CoursePage']>, revisions: ResolversTypes['CourseRevisionConnection'], taxonomyTerms: ResolversTypes['TaxonomyTermConnection'], threads: ResolversTypes['ThreadConnection'] }>>;
  CoursePage: ResolverTypeWrapper<ModelOf<Omit<CoursePage, 'course' | 'currentRevision' | 'revisions' | 'threads'> & { course: ResolversTypes['Course'], currentRevision?: Maybe<ResolversTypes['CoursePageRevision']>, revisions: ResolversTypes['CoursePageRevisionConnection'], threads: ResolversTypes['ThreadConnection'] }>>;
  CoursePageRevision: ResolverTypeWrapper<ModelOf<Omit<CoursePageRevision, 'author' | 'repository' | 'threads'> & { author: ResolversTypes['User'], repository: ResolversTypes['CoursePage'], threads: ResolversTypes['ThreadConnection'] }>>;
  CoursePageRevisionConnection: ResolverTypeWrapper<ModelOf<Omit<CoursePageRevisionConnection, 'nodes'> & { nodes: Array<ResolversTypes['CoursePageRevision']> }>>;
  CourseRevision: ResolverTypeWrapper<ModelOf<Omit<CourseRevision, 'author' | 'repository' | 'threads'> & { author: ResolversTypes['User'], repository: ResolversTypes['Course'], threads: ResolversTypes['ThreadConnection'] }>>;
  CourseRevisionConnection: ResolverTypeWrapper<ModelOf<Omit<CourseRevisionConnection, 'nodes'> & { nodes: Array<ResolversTypes['CourseRevision']> }>>;
  CreateCommentNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<CreateCommentNotificationEvent, 'actor' | 'comment' | 'thread'> & { actor: ResolversTypes['User'], comment: ResolversTypes['Comment'], thread: ResolversTypes['Thread'] }>>;
  CreateEntityLinkNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<CreateEntityLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: ResolversTypes['User'], child: ResolversTypes['AbstractEntity'], parent: ResolversTypes['AbstractEntity'] }>>;
  CreateEntityNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<CreateEntityNotificationEvent, 'actor' | 'entity'> & { actor: ResolversTypes['User'], entity: ResolversTypes['AbstractEntity'] }>>;
  CreateEntityRevisionNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<CreateEntityRevisionNotificationEvent, 'actor' | 'entity' | 'entityRevision'> & { actor: ResolversTypes['User'], entity: ResolversTypes['AbstractRepository'], entityRevision: ResolversTypes['AbstractRevision'] }>>;
  CreatePageInput: ResolverTypeWrapper<ModelOf<CreatePageInput>>;
  CreateTaxonomyLinkNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<CreateTaxonomyLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: ResolversTypes['User'], child: ResolversTypes['AbstractUuid'], parent: ResolversTypes['TaxonomyTerm'] }>>;
  CreateTaxonomyTermNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<CreateTaxonomyTermNotificationEvent, 'actor' | 'taxonomyTerm'> & { actor: ResolversTypes['User'], taxonomyTerm: ResolversTypes['TaxonomyTerm'] }>>;
  CreateThreadNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<CreateThreadNotificationEvent, 'actor' | 'object' | 'thread'> & { actor: ResolversTypes['User'], object: ResolversTypes['AbstractUuid'], thread: ResolversTypes['Thread'] }>>;
  DateTime: ResolverTypeWrapper<ModelOf<Scalars['DateTime']['output']>>;
  DefaultResponse: ResolverTypeWrapper<ModelOf<Omit<DefaultResponse, 'query'> & { query: ResolversTypes['Query'] }>>;
  DeletedEntity: ResolverTypeWrapper<ModelOf<Omit<DeletedEntity, 'entity'> & { entity?: Maybe<ResolversTypes['AbstractEntity']> }>>;
  DeletedEntityConnection: ResolverTypeWrapper<ModelOf<Omit<DeletedEntityConnection, 'nodes'> & { nodes: Array<ResolversTypes['DeletedEntity']> }>>;
  EntityMutation: ResolverTypeWrapper<ModelOf<Omit<EntityMutation, 'checkoutRevision' | 'rejectRevision' | 'setAbstractEntity' | 'updateLicense'> & { checkoutRevision: ResolversTypes['DefaultResponse'], rejectRevision: ResolversTypes['DefaultResponse'], setAbstractEntity: ResolversTypes['SetEntityResponse'], updateLicense: ResolversTypes['DefaultResponse'] }>>;
  EntityQuery: ResolverTypeWrapper<ModelOf<Omit<EntityQuery, 'deletedEntities'> & { deletedEntities: ResolversTypes['DeletedEntityConnection'] }>>;
  EntityUpdateLicenseInput: ResolverTypeWrapper<ModelOf<EntityUpdateLicenseInput>>;
  Event: ResolverTypeWrapper<ModelOf<Omit<Event, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversTypes['EventRevision']>, revisions: ResolversTypes['EventRevisionConnection'], taxonomyTerms: ResolversTypes['TaxonomyTermConnection'], threads: ResolversTypes['ThreadConnection'] }>>;
  EventRevision: ResolverTypeWrapper<ModelOf<Omit<EventRevision, 'author' | 'repository' | 'threads'> & { author: ResolversTypes['User'], repository: ResolversTypes['Event'], threads: ResolversTypes['ThreadConnection'] }>>;
  EventRevisionConnection: ResolverTypeWrapper<ModelOf<Omit<EventRevisionConnection, 'nodes'> & { nodes: Array<ResolversTypes['EventRevision']> }>>;
  ExecutePromptResponse: ResolverTypeWrapper<ModelOf<ExecutePromptResponse>>;
  Exercise: ResolverTypeWrapper<ModelOf<Omit<Exercise, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversTypes['ExerciseRevision']>, revisions: ResolversTypes['ExerciseRevisionConnection'], taxonomyTerms: ResolversTypes['TaxonomyTermConnection'], threads: ResolversTypes['ThreadConnection'] }>>;
  ExerciseGroup: ResolverTypeWrapper<ModelOf<Omit<ExerciseGroup, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversTypes['ExerciseGroupRevision']>, revisions: ResolversTypes['ExerciseGroupRevisionConnection'], taxonomyTerms: ResolversTypes['TaxonomyTermConnection'], threads: ResolversTypes['ThreadConnection'] }>>;
  ExerciseGroupRevision: ResolverTypeWrapper<ModelOf<Omit<ExerciseGroupRevision, 'author' | 'repository' | 'threads'> & { author: ResolversTypes['User'], repository: ResolversTypes['ExerciseGroup'], threads: ResolversTypes['ThreadConnection'] }>>;
  ExerciseGroupRevisionConnection: ResolverTypeWrapper<ModelOf<Omit<ExerciseGroupRevisionConnection, 'nodes'> & { nodes: Array<ResolversTypes['ExerciseGroupRevision']> }>>;
  ExerciseRevision: ResolverTypeWrapper<ModelOf<Omit<ExerciseRevision, 'author' | 'repository' | 'threads'> & { author: ResolversTypes['User'], repository: ResolversTypes['Exercise'], threads: ResolversTypes['ThreadConnection'] }>>;
  ExerciseRevisionConnection: ResolverTypeWrapper<ModelOf<Omit<ExerciseRevisionConnection, 'nodes'> & { nodes: Array<ResolversTypes['ExerciseRevision']> }>>;
  ExerciseSubmissionInput: ResolverTypeWrapper<ModelOf<ExerciseSubmissionInput>>;
  ExperimentMutation: ResolverTypeWrapper<ModelOf<Omit<ExperimentMutation, 'createExerciseSubmission'> & { createExerciseSubmission: ResolversTypes['DefaultResponse'] }>>;
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
  Notification: ResolverTypeWrapper<ModelOf<Omit<Notification, 'event'> & { event?: Maybe<ResolversTypes['AbstractNotificationEvent']> }>>;
  NotificationConnection: ResolverTypeWrapper<ModelOf<Omit<NotificationConnection, 'nodes'> & { nodes: Array<ResolversTypes['Notification']> }>>;
  NotificationMutation: ResolverTypeWrapper<ModelOf<Omit<NotificationMutation, 'setState'> & { setState?: Maybe<ResolversTypes['DefaultResponse']> }>>;
  NotificationSetStateInput: ResolverTypeWrapper<ModelOf<NotificationSetStateInput>>;
  OauthAcceptInput: ResolverTypeWrapper<ModelOf<OauthAcceptInput>>;
  OauthAcceptResponse: ResolverTypeWrapper<ModelOf<OauthAcceptResponse>>;
  OauthMutation: ResolverTypeWrapper<ModelOf<OauthMutation>>;
  Page: ResolverTypeWrapper<ModelOf<Omit<Page, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversTypes['PageRevision']>, revisions: ResolversTypes['PageRevisionConnection'], taxonomyTerms: ResolversTypes['TaxonomyTermConnection'], threads: ResolversTypes['ThreadConnection'] }>>;
  PageAddRevisionInput: ResolverTypeWrapper<ModelOf<PageAddRevisionInput>>;
  PageInfo: ResolverTypeWrapper<ModelOf<PageInfo>>;
  PageMutation: ResolverTypeWrapper<ModelOf<Omit<PageMutation, 'addRevision' | 'checkoutRevision' | 'create'> & { addRevision: ResolversTypes['DefaultResponse'], checkoutRevision: ResolversTypes['DefaultResponse'], create: ResolversTypes['DefaultResponse'] }>>;
  PageQuery: ResolverTypeWrapper<ModelOf<Omit<PageQuery, 'pages'> & { pages: Array<ResolversTypes['Page']> }>>;
  PageRevision: ResolverTypeWrapper<ModelOf<Omit<PageRevision, 'author' | 'repository' | 'threads'> & { author: ResolversTypes['User'], repository: ResolversTypes['Page'], threads: ResolversTypes['ThreadConnection'] }>>;
  PageRevisionConnection: ResolverTypeWrapper<ModelOf<Omit<PageRevisionConnection, 'nodes'> & { nodes: Array<ResolversTypes['PageRevision']> }>>;
  Query: ResolverTypeWrapper<{}>;
  RejectRevisionInput: ResolverTypeWrapper<ModelOf<RejectRevisionInput>>;
  RejectRevisionNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<RejectRevisionNotificationEvent, 'actor' | 'repository' | 'revision'> & { actor: ResolversTypes['User'], repository: ResolversTypes['AbstractRepository'], revision: ResolversTypes['AbstractRevision'] }>>;
  RemoveTaxonomyLinkNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<RemoveTaxonomyLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: ResolversTypes['User'], child: ResolversTypes['AbstractUuid'], parent: ResolversTypes['TaxonomyTerm'] }>>;
  ResourceMetadataConnection: ResolverTypeWrapper<ModelOf<ResourceMetadataConnection>>;
  Role: ResolverTypeWrapper<ModelOf<Role>>;
  Scope: ResolverTypeWrapper<ModelOf<Scope>>;
  ScopedRole: ResolverTypeWrapper<ModelOf<ScopedRole>>;
  ScopedRoleConnection: ResolverTypeWrapper<ModelOf<ScopedRoleConnection>>;
  SetAbstractEntityInput: ResolverTypeWrapper<ModelOf<SetAbstractEntityInput>>;
  SetEntityResponse: ResolverTypeWrapper<ModelOf<Omit<SetEntityResponse, 'entity' | 'query' | 'record' | 'revision'> & { entity?: Maybe<ResolversTypes['AbstractEntity']>, query: ResolversTypes['Query'], record?: Maybe<ResolversTypes['AbstractEntity']>, revision?: Maybe<ResolversTypes['AbstractEntityRevision']> }>>;
  SetLicenseNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<SetLicenseNotificationEvent, 'actor' | 'repository'> & { actor: ResolversTypes['User'], repository: ResolversTypes['AbstractRepository'] }>>;
  SetTaxonomyParentNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<SetTaxonomyParentNotificationEvent, 'actor' | 'child' | 'parent' | 'previousParent'> & { actor: ResolversTypes['User'], child: ResolversTypes['TaxonomyTerm'], parent?: Maybe<ResolversTypes['TaxonomyTerm']>, previousParent?: Maybe<ResolversTypes['TaxonomyTerm']> }>>;
  SetTaxonomyTermNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<SetTaxonomyTermNotificationEvent, 'actor' | 'taxonomyTerm'> & { actor: ResolversTypes['User'], taxonomyTerm: ResolversTypes['TaxonomyTerm'] }>>;
  SetThreadStateNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<SetThreadStateNotificationEvent, 'actor' | 'thread'> & { actor: ResolversTypes['User'], thread: ResolversTypes['Thread'] }>>;
  SetUuidStateNotificationEvent: ResolverTypeWrapper<ModelOf<Omit<SetUuidStateNotificationEvent, 'actor' | 'object'> & { actor: ResolversTypes['User'], object: ResolversTypes['AbstractUuid'] }>>;
  String: ResolverTypeWrapper<ModelOf<Scalars['String']['output']>>;
  Subject: ResolverTypeWrapper<ModelOf<Omit<Subject, 'taxonomyTerm' | 'unrevisedEntities'> & { taxonomyTerm: ResolversTypes['TaxonomyTerm'], unrevisedEntities: ResolversTypes['AbstractEntityConnection'] }>>;
  SubjectQuery: ResolverTypeWrapper<ModelOf<Omit<SubjectQuery, 'subjects'> & { subjects: Array<ResolversTypes['Subject']> }>>;
  SubscriptionInfo: ResolverTypeWrapper<ModelOf<Omit<SubscriptionInfo, 'object'> & { object: ResolversTypes['AbstractUuid'] }>>;
  SubscriptionInfoConnection: ResolverTypeWrapper<ModelOf<Omit<SubscriptionInfoConnection, 'nodes'> & { nodes: Array<ResolversTypes['SubscriptionInfo']> }>>;
  SubscriptionMutation: ResolverTypeWrapper<ModelOf<Omit<SubscriptionMutation, 'set'> & { set: ResolversTypes['DefaultResponse'] }>>;
  SubscriptionQuery: ResolverTypeWrapper<ModelOf<Omit<SubscriptionQuery, 'getSubscriptions'> & { getSubscriptions: ResolversTypes['SubscriptionInfoConnection'] }>>;
  SubscriptionSetInput: ResolverTypeWrapper<ModelOf<SubscriptionSetInput>>;
  TaxonomyEntityLinksInput: ResolverTypeWrapper<ModelOf<TaxonomyEntityLinksInput>>;
  TaxonomyTerm: ResolverTypeWrapper<ModelOf<Omit<TaxonomyTerm, 'children' | 'parent' | 'path' | 'threads'> & { children: ResolversTypes['AbstractUuidConnection'], parent?: Maybe<ResolversTypes['TaxonomyTerm']>, path: Array<Maybe<ResolversTypes['TaxonomyTerm']>>, threads: ResolversTypes['ThreadConnection'] }>>;
  TaxonomyTermConnection: ResolverTypeWrapper<ModelOf<Omit<TaxonomyTermConnection, 'nodes'> & { nodes: Array<ResolversTypes['TaxonomyTerm']> }>>;
  TaxonomyTermCreateInput: ResolverTypeWrapper<ModelOf<TaxonomyTermCreateInput>>;
  TaxonomyTermCreateResponse: ResolverTypeWrapper<ModelOf<Omit<TaxonomyTermCreateResponse, 'query' | 'record'> & { query: ResolversTypes['Query'], record?: Maybe<ResolversTypes['TaxonomyTerm']> }>>;
  TaxonomyTermMutation: ResolverTypeWrapper<ModelOf<Omit<TaxonomyTermMutation, 'create' | 'createEntityLinks' | 'deleteEntityLinks' | 'setNameAndDescription' | 'sort'> & { create: ResolversTypes['TaxonomyTermCreateResponse'], createEntityLinks: ResolversTypes['DefaultResponse'], deleteEntityLinks: ResolversTypes['DefaultResponse'], setNameAndDescription: ResolversTypes['DefaultResponse'], sort: ResolversTypes['DefaultResponse'] }>>;
  TaxonomyTermSetNameAndDescriptionInput: ResolverTypeWrapper<ModelOf<TaxonomyTermSetNameAndDescriptionInput>>;
  TaxonomyTermSortInput: ResolverTypeWrapper<ModelOf<TaxonomyTermSortInput>>;
  TaxonomyTermType: ResolverTypeWrapper<ModelOf<TaxonomyTermType>>;
  TaxonomyTypeCreateOptions: ResolverTypeWrapper<ModelOf<TaxonomyTypeCreateOptions>>;
  Thread: ResolverTypeWrapper<ModelOf<Omit<Thread, 'comments' | 'object'> & { comments: ResolversTypes['CommentConnection'], object: ResolversTypes['AbstractUuid'] }>>;
  ThreadAware: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['ThreadAware']>;
  ThreadConnection: ResolverTypeWrapper<ModelOf<Omit<ThreadConnection, 'nodes'> & { nodes: Array<ResolversTypes['Thread']> }>>;
  ThreadCreateCommentInput: ResolverTypeWrapper<ModelOf<ThreadCreateCommentInput>>;
  ThreadCreateThreadInput: ResolverTypeWrapper<ModelOf<ThreadCreateThreadInput>>;
  ThreadEditCommentInput: ResolverTypeWrapper<ModelOf<ThreadEditCommentInput>>;
  ThreadMutation: ResolverTypeWrapper<ModelOf<Omit<ThreadMutation, 'createComment' | 'createThread' | 'editComment' | 'setCommentState' | 'setThreadArchived' | 'setThreadState' | 'setThreadStatus'> & { createComment: ResolversTypes['DefaultResponse'], createThread: ResolversTypes['DefaultResponse'], editComment: ResolversTypes['DefaultResponse'], setCommentState: ResolversTypes['DefaultResponse'], setThreadArchived: ResolversTypes['DefaultResponse'], setThreadState: ResolversTypes['DefaultResponse'], setThreadStatus: ResolversTypes['DefaultResponse'] }>>;
  ThreadQuery: ResolverTypeWrapper<ModelOf<Omit<ThreadQuery, 'allThreads'> & { allThreads: ResolversTypes['ThreadConnection'] }>>;
  ThreadSetCommentStateInput: ResolverTypeWrapper<ModelOf<ThreadSetCommentStateInput>>;
  ThreadSetThreadArchivedInput: ResolverTypeWrapper<ModelOf<ThreadSetThreadArchivedInput>>;
  ThreadSetThreadStateInput: ResolverTypeWrapper<ModelOf<ThreadSetThreadStateInput>>;
  ThreadSetThreadStatusInput: ResolverTypeWrapper<ModelOf<ThreadSetThreadStatusInput>>;
  User: ResolverTypeWrapper<ModelOf<Omit<User, 'activityByType' | 'threads' | 'unrevisedEntities'> & { activityByType: ResolversTypes['UserActivityByType'], threads: ResolversTypes['ThreadConnection'], unrevisedEntities: ResolversTypes['AbstractEntityConnection'] }>>;
  UserActivityByType: ResolverTypeWrapper<ModelOf<UserActivityByType>>;
  UserConnection: ResolverTypeWrapper<ModelOf<Omit<UserConnection, 'nodes'> & { nodes: Array<ResolversTypes['User']> }>>;
  UserDeleteBotsInput: ResolverTypeWrapper<ModelOf<UserDeleteBotsInput>>;
  UserDeleteRegularUsersInput: ResolverTypeWrapper<ModelOf<UserDeleteRegularUsersInput>>;
  UserDeleteRegularUsersResponse: ResolverTypeWrapper<ModelOf<UserDeleteRegularUsersResponse>>;
  UserMutation: ResolverTypeWrapper<ModelOf<Omit<UserMutation, 'addRole' | 'deleteBots' | 'deleteRegularUser' | 'removeRole' | 'setDescription'> & { addRole: ResolversTypes['DefaultResponse'], deleteBots: ResolversTypes['DefaultResponse'], deleteRegularUser: ResolversTypes['DefaultResponse'], removeRole: ResolversTypes['DefaultResponse'], setDescription: ResolversTypes['DefaultResponse'] }>>;
  UserQuery: ResolverTypeWrapper<ModelOf<Omit<UserQuery, 'potentialSpamUsers' | 'userByUsername' | 'usersByRole'> & { potentialSpamUsers: ResolversTypes['UserConnection'], userByUsername?: Maybe<ResolversTypes['User']>, usersByRole: ResolversTypes['UserConnection'] }>>;
  UserRoleInput: ResolverTypeWrapper<ModelOf<UserRoleInput>>;
  UserSetDescriptionInput: ResolverTypeWrapper<ModelOf<UserSetDescriptionInput>>;
  UuidMutation: ResolverTypeWrapper<ModelOf<Omit<UuidMutation, 'setState'> & { setState: ResolversTypes['DefaultResponse'] }>>;
  UuidSetStateInput: ResolverTypeWrapper<ModelOf<UuidSetStateInput>>;
  Video: ResolverTypeWrapper<ModelOf<Omit<Video, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversTypes['VideoRevision']>, revisions: ResolversTypes['VideoRevisionConnection'], taxonomyTerms: ResolversTypes['TaxonomyTermConnection'], threads: ResolversTypes['ThreadConnection'] }>>;
  VideoRevision: ResolverTypeWrapper<ModelOf<Omit<VideoRevision, 'author' | 'repository' | 'threads'> & { author: ResolversTypes['User'], repository: ResolversTypes['Video'], threads: ResolversTypes['ThreadConnection'] }>>;
  VideoRevisionConnection: ResolverTypeWrapper<ModelOf<Omit<VideoRevisionConnection, 'nodes'> & { nodes: Array<ResolversTypes['VideoRevision']> }>>;
  _cacheMutation: ResolverTypeWrapper<ModelOf<Omit<_CacheMutation, 'remove'> & { remove: ResolversTypes['DefaultResponse'] }>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AbstractEntity: ResolversInterfaceTypes<ResolversParentTypes>['AbstractEntity'];
  AbstractEntityConnection: ModelOf<Omit<AbstractEntityConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['AbstractEntity']> }>;
  AbstractEntityRevision: ResolversInterfaceTypes<ResolversParentTypes>['AbstractEntityRevision'];
  AbstractEntityRevisionConnection: ResolversInterfaceTypes<ResolversParentTypes>['AbstractEntityRevisionConnection'];
  AbstractNotificationEvent: ResolversInterfaceTypes<ResolversParentTypes>['AbstractNotificationEvent'];
  AbstractNotificationEventConnection: ModelOf<Omit<AbstractNotificationEventConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['AbstractNotificationEvent']> }>;
  AbstractRepository: ResolversInterfaceTypes<ResolversParentTypes>['AbstractRepository'];
  AbstractRevision: ResolversInterfaceTypes<ResolversParentTypes>['AbstractRevision'];
  AbstractTaxonomyTermChild: ResolversInterfaceTypes<ResolversParentTypes>['AbstractTaxonomyTermChild'];
  AbstractUuid: ResolversInterfaceTypes<ResolversParentTypes>['AbstractUuid'];
  AbstractUuidConnection: ModelOf<Omit<AbstractUuidConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['AbstractUuid']> }>;
  AiQuery: ModelOf<AiQuery>;
  AliasInput: ModelOf<AliasInput>;
  Applet: ModelOf<Omit<Applet, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversParentTypes['AppletRevision']>, revisions: ResolversParentTypes['AppletRevisionConnection'], taxonomyTerms: ResolversParentTypes['TaxonomyTermConnection'], threads: ResolversParentTypes['ThreadConnection'] }>;
  AppletRevision: ModelOf<Omit<AppletRevision, 'author' | 'repository' | 'threads'> & { author: ResolversParentTypes['User'], repository: ResolversParentTypes['Applet'], threads: ResolversParentTypes['ThreadConnection'] }>;
  AppletRevisionConnection: ModelOf<Omit<AppletRevisionConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['AppletRevision']> }>;
  Article: ModelOf<Omit<Article, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversParentTypes['ArticleRevision']>, revisions: ResolversParentTypes['ArticleRevisionConnection'], taxonomyTerms: ResolversParentTypes['TaxonomyTermConnection'], threads: ResolversParentTypes['ThreadConnection'] }>;
  ArticleRevision: ModelOf<Omit<ArticleRevision, 'author' | 'repository' | 'threads'> & { author: ResolversParentTypes['User'], repository: ResolversParentTypes['Article'], threads: ResolversParentTypes['ThreadConnection'] }>;
  ArticleRevisionConnection: ModelOf<Omit<ArticleRevisionConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['ArticleRevision']> }>;
  Boolean: ModelOf<Scalars['Boolean']['output']>;
  CacheRemoveInput: ModelOf<CacheRemoveInput>;
  ChatCompletionMessageParam: ModelOf<ChatCompletionMessageParam>;
  CheckoutRevisionInput: ModelOf<CheckoutRevisionInput>;
  CheckoutRevisionNotificationEvent: ModelOf<Omit<CheckoutRevisionNotificationEvent, 'actor' | 'repository' | 'revision'> & { actor: ResolversParentTypes['User'], repository: ResolversParentTypes['AbstractRepository'], revision: ResolversParentTypes['AbstractRevision'] }>;
  Comment: ModelOf<Omit<Comment, 'author' | 'events' | 'legacyObject'> & { author: ResolversParentTypes['User'], events: ResolversParentTypes['AbstractNotificationEventConnection'], legacyObject: ResolversParentTypes['AbstractUuid'] }>;
  CommentConnection: ModelOf<Omit<CommentConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['Comment']> }>;
  Course: ModelOf<Omit<Course, 'currentRevision' | 'pages' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversParentTypes['CourseRevision']>, pages: Array<ResolversParentTypes['CoursePage']>, revisions: ResolversParentTypes['CourseRevisionConnection'], taxonomyTerms: ResolversParentTypes['TaxonomyTermConnection'], threads: ResolversParentTypes['ThreadConnection'] }>;
  CoursePage: ModelOf<Omit<CoursePage, 'course' | 'currentRevision' | 'revisions' | 'threads'> & { course: ResolversParentTypes['Course'], currentRevision?: Maybe<ResolversParentTypes['CoursePageRevision']>, revisions: ResolversParentTypes['CoursePageRevisionConnection'], threads: ResolversParentTypes['ThreadConnection'] }>;
  CoursePageRevision: ModelOf<Omit<CoursePageRevision, 'author' | 'repository' | 'threads'> & { author: ResolversParentTypes['User'], repository: ResolversParentTypes['CoursePage'], threads: ResolversParentTypes['ThreadConnection'] }>;
  CoursePageRevisionConnection: ModelOf<Omit<CoursePageRevisionConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['CoursePageRevision']> }>;
  CourseRevision: ModelOf<Omit<CourseRevision, 'author' | 'repository' | 'threads'> & { author: ResolversParentTypes['User'], repository: ResolversParentTypes['Course'], threads: ResolversParentTypes['ThreadConnection'] }>;
  CourseRevisionConnection: ModelOf<Omit<CourseRevisionConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['CourseRevision']> }>;
  CreateCommentNotificationEvent: ModelOf<Omit<CreateCommentNotificationEvent, 'actor' | 'comment' | 'thread'> & { actor: ResolversParentTypes['User'], comment: ResolversParentTypes['Comment'], thread: ResolversParentTypes['Thread'] }>;
  CreateEntityLinkNotificationEvent: ModelOf<Omit<CreateEntityLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: ResolversParentTypes['User'], child: ResolversParentTypes['AbstractEntity'], parent: ResolversParentTypes['AbstractEntity'] }>;
  CreateEntityNotificationEvent: ModelOf<Omit<CreateEntityNotificationEvent, 'actor' | 'entity'> & { actor: ResolversParentTypes['User'], entity: ResolversParentTypes['AbstractEntity'] }>;
  CreateEntityRevisionNotificationEvent: ModelOf<Omit<CreateEntityRevisionNotificationEvent, 'actor' | 'entity' | 'entityRevision'> & { actor: ResolversParentTypes['User'], entity: ResolversParentTypes['AbstractRepository'], entityRevision: ResolversParentTypes['AbstractRevision'] }>;
  CreatePageInput: ModelOf<CreatePageInput>;
  CreateTaxonomyLinkNotificationEvent: ModelOf<Omit<CreateTaxonomyLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: ResolversParentTypes['User'], child: ResolversParentTypes['AbstractUuid'], parent: ResolversParentTypes['TaxonomyTerm'] }>;
  CreateTaxonomyTermNotificationEvent: ModelOf<Omit<CreateTaxonomyTermNotificationEvent, 'actor' | 'taxonomyTerm'> & { actor: ResolversParentTypes['User'], taxonomyTerm: ResolversParentTypes['TaxonomyTerm'] }>;
  CreateThreadNotificationEvent: ModelOf<Omit<CreateThreadNotificationEvent, 'actor' | 'object' | 'thread'> & { actor: ResolversParentTypes['User'], object: ResolversParentTypes['AbstractUuid'], thread: ResolversParentTypes['Thread'] }>;
  DateTime: ModelOf<Scalars['DateTime']['output']>;
  DefaultResponse: ModelOf<Omit<DefaultResponse, 'query'> & { query: ResolversParentTypes['Query'] }>;
  DeletedEntity: ModelOf<Omit<DeletedEntity, 'entity'> & { entity?: Maybe<ResolversParentTypes['AbstractEntity']> }>;
  DeletedEntityConnection: ModelOf<Omit<DeletedEntityConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['DeletedEntity']> }>;
  EntityMutation: ModelOf<Omit<EntityMutation, 'checkoutRevision' | 'rejectRevision' | 'setAbstractEntity' | 'updateLicense'> & { checkoutRevision: ResolversParentTypes['DefaultResponse'], rejectRevision: ResolversParentTypes['DefaultResponse'], setAbstractEntity: ResolversParentTypes['SetEntityResponse'], updateLicense: ResolversParentTypes['DefaultResponse'] }>;
  EntityQuery: ModelOf<Omit<EntityQuery, 'deletedEntities'> & { deletedEntities: ResolversParentTypes['DeletedEntityConnection'] }>;
  EntityUpdateLicenseInput: ModelOf<EntityUpdateLicenseInput>;
  Event: ModelOf<Omit<Event, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversParentTypes['EventRevision']>, revisions: ResolversParentTypes['EventRevisionConnection'], taxonomyTerms: ResolversParentTypes['TaxonomyTermConnection'], threads: ResolversParentTypes['ThreadConnection'] }>;
  EventRevision: ModelOf<Omit<EventRevision, 'author' | 'repository' | 'threads'> & { author: ResolversParentTypes['User'], repository: ResolversParentTypes['Event'], threads: ResolversParentTypes['ThreadConnection'] }>;
  EventRevisionConnection: ModelOf<Omit<EventRevisionConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['EventRevision']> }>;
  ExecutePromptResponse: ModelOf<ExecutePromptResponse>;
  Exercise: ModelOf<Omit<Exercise, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversParentTypes['ExerciseRevision']>, revisions: ResolversParentTypes['ExerciseRevisionConnection'], taxonomyTerms: ResolversParentTypes['TaxonomyTermConnection'], threads: ResolversParentTypes['ThreadConnection'] }>;
  ExerciseGroup: ModelOf<Omit<ExerciseGroup, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversParentTypes['ExerciseGroupRevision']>, revisions: ResolversParentTypes['ExerciseGroupRevisionConnection'], taxonomyTerms: ResolversParentTypes['TaxonomyTermConnection'], threads: ResolversParentTypes['ThreadConnection'] }>;
  ExerciseGroupRevision: ModelOf<Omit<ExerciseGroupRevision, 'author' | 'repository' | 'threads'> & { author: ResolversParentTypes['User'], repository: ResolversParentTypes['ExerciseGroup'], threads: ResolversParentTypes['ThreadConnection'] }>;
  ExerciseGroupRevisionConnection: ModelOf<Omit<ExerciseGroupRevisionConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['ExerciseGroupRevision']> }>;
  ExerciseRevision: ModelOf<Omit<ExerciseRevision, 'author' | 'repository' | 'threads'> & { author: ResolversParentTypes['User'], repository: ResolversParentTypes['Exercise'], threads: ResolversParentTypes['ThreadConnection'] }>;
  ExerciseRevisionConnection: ModelOf<Omit<ExerciseRevisionConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['ExerciseRevision']> }>;
  ExerciseSubmissionInput: ModelOf<ExerciseSubmissionInput>;
  ExperimentMutation: ModelOf<Omit<ExperimentMutation, 'createExerciseSubmission'> & { createExerciseSubmission: ResolversParentTypes['DefaultResponse'] }>;
  InstanceAware: ResolversInterfaceTypes<ResolversParentTypes>['InstanceAware'];
  Int: ModelOf<Scalars['Int']['output']>;
  JSON: ModelOf<Scalars['JSON']['output']>;
  JSONObject: ModelOf<Scalars['JSONObject']['output']>;
  MediaQuery: ModelOf<MediaQuery>;
  MediaUpload: ModelOf<MediaUpload>;
  MetadataQuery: ModelOf<MetadataQuery>;
  Mutation: {};
  Notification: ModelOf<Omit<Notification, 'event'> & { event?: Maybe<ResolversParentTypes['AbstractNotificationEvent']> }>;
  NotificationConnection: ModelOf<Omit<NotificationConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['Notification']> }>;
  NotificationMutation: ModelOf<Omit<NotificationMutation, 'setState'> & { setState?: Maybe<ResolversParentTypes['DefaultResponse']> }>;
  NotificationSetStateInput: ModelOf<NotificationSetStateInput>;
  OauthAcceptInput: ModelOf<OauthAcceptInput>;
  OauthAcceptResponse: ModelOf<OauthAcceptResponse>;
  OauthMutation: ModelOf<OauthMutation>;
  Page: ModelOf<Omit<Page, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversParentTypes['PageRevision']>, revisions: ResolversParentTypes['PageRevisionConnection'], taxonomyTerms: ResolversParentTypes['TaxonomyTermConnection'], threads: ResolversParentTypes['ThreadConnection'] }>;
  PageAddRevisionInput: ModelOf<PageAddRevisionInput>;
  PageInfo: ModelOf<PageInfo>;
  PageMutation: ModelOf<Omit<PageMutation, 'addRevision' | 'checkoutRevision' | 'create'> & { addRevision: ResolversParentTypes['DefaultResponse'], checkoutRevision: ResolversParentTypes['DefaultResponse'], create: ResolversParentTypes['DefaultResponse'] }>;
  PageQuery: ModelOf<Omit<PageQuery, 'pages'> & { pages: Array<ResolversParentTypes['Page']> }>;
  PageRevision: ModelOf<Omit<PageRevision, 'author' | 'repository' | 'threads'> & { author: ResolversParentTypes['User'], repository: ResolversParentTypes['Page'], threads: ResolversParentTypes['ThreadConnection'] }>;
  PageRevisionConnection: ModelOf<Omit<PageRevisionConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['PageRevision']> }>;
  Query: {};
  RejectRevisionInput: ModelOf<RejectRevisionInput>;
  RejectRevisionNotificationEvent: ModelOf<Omit<RejectRevisionNotificationEvent, 'actor' | 'repository' | 'revision'> & { actor: ResolversParentTypes['User'], repository: ResolversParentTypes['AbstractRepository'], revision: ResolversParentTypes['AbstractRevision'] }>;
  RemoveTaxonomyLinkNotificationEvent: ModelOf<Omit<RemoveTaxonomyLinkNotificationEvent, 'actor' | 'child' | 'parent'> & { actor: ResolversParentTypes['User'], child: ResolversParentTypes['AbstractUuid'], parent: ResolversParentTypes['TaxonomyTerm'] }>;
  ResourceMetadataConnection: ModelOf<ResourceMetadataConnection>;
  ScopedRole: ModelOf<ScopedRole>;
  ScopedRoleConnection: ModelOf<ScopedRoleConnection>;
  SetAbstractEntityInput: ModelOf<SetAbstractEntityInput>;
  SetEntityResponse: ModelOf<Omit<SetEntityResponse, 'entity' | 'query' | 'record' | 'revision'> & { entity?: Maybe<ResolversParentTypes['AbstractEntity']>, query: ResolversParentTypes['Query'], record?: Maybe<ResolversParentTypes['AbstractEntity']>, revision?: Maybe<ResolversParentTypes['AbstractEntityRevision']> }>;
  SetLicenseNotificationEvent: ModelOf<Omit<SetLicenseNotificationEvent, 'actor' | 'repository'> & { actor: ResolversParentTypes['User'], repository: ResolversParentTypes['AbstractRepository'] }>;
  SetTaxonomyParentNotificationEvent: ModelOf<Omit<SetTaxonomyParentNotificationEvent, 'actor' | 'child' | 'parent' | 'previousParent'> & { actor: ResolversParentTypes['User'], child: ResolversParentTypes['TaxonomyTerm'], parent?: Maybe<ResolversParentTypes['TaxonomyTerm']>, previousParent?: Maybe<ResolversParentTypes['TaxonomyTerm']> }>;
  SetTaxonomyTermNotificationEvent: ModelOf<Omit<SetTaxonomyTermNotificationEvent, 'actor' | 'taxonomyTerm'> & { actor: ResolversParentTypes['User'], taxonomyTerm: ResolversParentTypes['TaxonomyTerm'] }>;
  SetThreadStateNotificationEvent: ModelOf<Omit<SetThreadStateNotificationEvent, 'actor' | 'thread'> & { actor: ResolversParentTypes['User'], thread: ResolversParentTypes['Thread'] }>;
  SetUuidStateNotificationEvent: ModelOf<Omit<SetUuidStateNotificationEvent, 'actor' | 'object'> & { actor: ResolversParentTypes['User'], object: ResolversParentTypes['AbstractUuid'] }>;
  String: ModelOf<Scalars['String']['output']>;
  Subject: ModelOf<Omit<Subject, 'taxonomyTerm' | 'unrevisedEntities'> & { taxonomyTerm: ResolversParentTypes['TaxonomyTerm'], unrevisedEntities: ResolversParentTypes['AbstractEntityConnection'] }>;
  SubjectQuery: ModelOf<Omit<SubjectQuery, 'subjects'> & { subjects: Array<ResolversParentTypes['Subject']> }>;
  SubscriptionInfo: ModelOf<Omit<SubscriptionInfo, 'object'> & { object: ResolversParentTypes['AbstractUuid'] }>;
  SubscriptionInfoConnection: ModelOf<Omit<SubscriptionInfoConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['SubscriptionInfo']> }>;
  SubscriptionMutation: ModelOf<Omit<SubscriptionMutation, 'set'> & { set: ResolversParentTypes['DefaultResponse'] }>;
  SubscriptionQuery: ModelOf<Omit<SubscriptionQuery, 'getSubscriptions'> & { getSubscriptions: ResolversParentTypes['SubscriptionInfoConnection'] }>;
  SubscriptionSetInput: ModelOf<SubscriptionSetInput>;
  TaxonomyEntityLinksInput: ModelOf<TaxonomyEntityLinksInput>;
  TaxonomyTerm: ModelOf<Omit<TaxonomyTerm, 'children' | 'parent' | 'path' | 'threads'> & { children: ResolversParentTypes['AbstractUuidConnection'], parent?: Maybe<ResolversParentTypes['TaxonomyTerm']>, path: Array<Maybe<ResolversParentTypes['TaxonomyTerm']>>, threads: ResolversParentTypes['ThreadConnection'] }>;
  TaxonomyTermConnection: ModelOf<Omit<TaxonomyTermConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['TaxonomyTerm']> }>;
  TaxonomyTermCreateInput: ModelOf<TaxonomyTermCreateInput>;
  TaxonomyTermCreateResponse: ModelOf<Omit<TaxonomyTermCreateResponse, 'query' | 'record'> & { query: ResolversParentTypes['Query'], record?: Maybe<ResolversParentTypes['TaxonomyTerm']> }>;
  TaxonomyTermMutation: ModelOf<Omit<TaxonomyTermMutation, 'create' | 'createEntityLinks' | 'deleteEntityLinks' | 'setNameAndDescription' | 'sort'> & { create: ResolversParentTypes['TaxonomyTermCreateResponse'], createEntityLinks: ResolversParentTypes['DefaultResponse'], deleteEntityLinks: ResolversParentTypes['DefaultResponse'], setNameAndDescription: ResolversParentTypes['DefaultResponse'], sort: ResolversParentTypes['DefaultResponse'] }>;
  TaxonomyTermSetNameAndDescriptionInput: ModelOf<TaxonomyTermSetNameAndDescriptionInput>;
  TaxonomyTermSortInput: ModelOf<TaxonomyTermSortInput>;
  Thread: ModelOf<Omit<Thread, 'comments' | 'object'> & { comments: ResolversParentTypes['CommentConnection'], object: ResolversParentTypes['AbstractUuid'] }>;
  ThreadAware: ResolversInterfaceTypes<ResolversParentTypes>['ThreadAware'];
  ThreadConnection: ModelOf<Omit<ThreadConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['Thread']> }>;
  ThreadCreateCommentInput: ModelOf<ThreadCreateCommentInput>;
  ThreadCreateThreadInput: ModelOf<ThreadCreateThreadInput>;
  ThreadEditCommentInput: ModelOf<ThreadEditCommentInput>;
  ThreadMutation: ModelOf<Omit<ThreadMutation, 'createComment' | 'createThread' | 'editComment' | 'setCommentState' | 'setThreadArchived' | 'setThreadState' | 'setThreadStatus'> & { createComment: ResolversParentTypes['DefaultResponse'], createThread: ResolversParentTypes['DefaultResponse'], editComment: ResolversParentTypes['DefaultResponse'], setCommentState: ResolversParentTypes['DefaultResponse'], setThreadArchived: ResolversParentTypes['DefaultResponse'], setThreadState: ResolversParentTypes['DefaultResponse'], setThreadStatus: ResolversParentTypes['DefaultResponse'] }>;
  ThreadQuery: ModelOf<Omit<ThreadQuery, 'allThreads'> & { allThreads: ResolversParentTypes['ThreadConnection'] }>;
  ThreadSetCommentStateInput: ModelOf<ThreadSetCommentStateInput>;
  ThreadSetThreadArchivedInput: ModelOf<ThreadSetThreadArchivedInput>;
  ThreadSetThreadStateInput: ModelOf<ThreadSetThreadStateInput>;
  ThreadSetThreadStatusInput: ModelOf<ThreadSetThreadStatusInput>;
  User: ModelOf<Omit<User, 'activityByType' | 'threads' | 'unrevisedEntities'> & { activityByType: ResolversParentTypes['UserActivityByType'], threads: ResolversParentTypes['ThreadConnection'], unrevisedEntities: ResolversParentTypes['AbstractEntityConnection'] }>;
  UserActivityByType: ModelOf<UserActivityByType>;
  UserConnection: ModelOf<Omit<UserConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['User']> }>;
  UserDeleteBotsInput: ModelOf<UserDeleteBotsInput>;
  UserDeleteRegularUsersInput: ModelOf<UserDeleteRegularUsersInput>;
  UserDeleteRegularUsersResponse: ModelOf<UserDeleteRegularUsersResponse>;
  UserMutation: ModelOf<Omit<UserMutation, 'addRole' | 'deleteBots' | 'deleteRegularUser' | 'removeRole' | 'setDescription'> & { addRole: ResolversParentTypes['DefaultResponse'], deleteBots: ResolversParentTypes['DefaultResponse'], deleteRegularUser: ResolversParentTypes['DefaultResponse'], removeRole: ResolversParentTypes['DefaultResponse'], setDescription: ResolversParentTypes['DefaultResponse'] }>;
  UserQuery: ModelOf<Omit<UserQuery, 'potentialSpamUsers' | 'userByUsername' | 'usersByRole'> & { potentialSpamUsers: ResolversParentTypes['UserConnection'], userByUsername?: Maybe<ResolversParentTypes['User']>, usersByRole: ResolversParentTypes['UserConnection'] }>;
  UserRoleInput: ModelOf<UserRoleInput>;
  UserSetDescriptionInput: ModelOf<UserSetDescriptionInput>;
  UuidMutation: ModelOf<Omit<UuidMutation, 'setState'> & { setState: ResolversParentTypes['DefaultResponse'] }>;
  UuidSetStateInput: ModelOf<UuidSetStateInput>;
  Video: ModelOf<Omit<Video, 'currentRevision' | 'revisions' | 'taxonomyTerms' | 'threads'> & { currentRevision?: Maybe<ResolversParentTypes['VideoRevision']>, revisions: ResolversParentTypes['VideoRevisionConnection'], taxonomyTerms: ResolversParentTypes['TaxonomyTermConnection'], threads: ResolversParentTypes['ThreadConnection'] }>;
  VideoRevision: ModelOf<Omit<VideoRevision, 'author' | 'repository' | 'threads'> & { author: ResolversParentTypes['User'], repository: ResolversParentTypes['Video'], threads: ResolversParentTypes['ThreadConnection'] }>;
  VideoRevisionConnection: ModelOf<Omit<VideoRevisionConnection, 'nodes'> & { nodes: Array<ResolversParentTypes['VideoRevision']> }>;
  _cacheMutation: ModelOf<Omit<_CacheMutation, 'remove'> & { remove: ResolversParentTypes['DefaultResponse'] }>;
};

export type AbstractEntityResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractEntity'] = ResolversParentTypes['AbstractEntity']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'Course' | 'CoursePage' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'Page' | 'Video', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['AbstractEntityRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['AbstractEntityRevisionConnection'], ParentType, ContextType, Partial<AbstractEntityRevisionsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractEntityConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractEntityConnection'] = ResolversParentTypes['AbstractEntityConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['AbstractEntity']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractEntityRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractEntityRevision'] = ResolversParentTypes['AbstractEntityRevision']> = {
  __resolveType: TypeResolveFn<'AppletRevision' | 'ArticleRevision' | 'CoursePageRevision' | 'CourseRevision' | 'EventRevision' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'PageRevision' | 'VideoRevision', ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['AbstractEntity'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type AbstractEntityRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractEntityRevisionConnection'] = ResolversParentTypes['AbstractEntityRevisionConnection']> = {
  __resolveType: TypeResolveFn<'AppletRevisionConnection' | 'ArticleRevisionConnection' | 'CoursePageRevisionConnection' | 'CourseRevisionConnection' | 'EventRevisionConnection' | 'ExerciseGroupRevisionConnection' | 'ExerciseRevisionConnection' | 'PageRevisionConnection' | 'VideoRevisionConnection', ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['AbstractEntityRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type AbstractNotificationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractNotificationEvent'] = ResolversParentTypes['AbstractNotificationEvent']> = {
  __resolveType: TypeResolveFn<'CheckoutRevisionNotificationEvent' | 'CreateCommentNotificationEvent' | 'CreateEntityLinkNotificationEvent' | 'CreateEntityNotificationEvent' | 'CreateEntityRevisionNotificationEvent' | 'CreateTaxonomyLinkNotificationEvent' | 'CreateTaxonomyTermNotificationEvent' | 'CreateThreadNotificationEvent' | 'RejectRevisionNotificationEvent' | 'RemoveTaxonomyLinkNotificationEvent' | 'SetLicenseNotificationEvent' | 'SetTaxonomyParentNotificationEvent' | 'SetTaxonomyTermNotificationEvent' | 'SetThreadStateNotificationEvent' | 'SetUuidStateNotificationEvent', ParentType, ContextType>;
  actor?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  objectId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type AbstractNotificationEventConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractNotificationEventConnection'] = ResolversParentTypes['AbstractNotificationEventConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['AbstractNotificationEvent']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AbstractRepositoryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractRepository'] = ResolversParentTypes['AbstractRepository']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'Course' | 'CoursePage' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'Page' | 'Video', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<AbstractRepositoryThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractRevision'] = ResolversParentTypes['AbstractRevision']> = {
  __resolveType: TypeResolveFn<'AppletRevision' | 'ArticleRevision' | 'CoursePageRevision' | 'CourseRevision' | 'EventRevision' | 'ExerciseGroupRevision' | 'ExerciseRevision' | 'PageRevision' | 'VideoRevision', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<AbstractRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AbstractTaxonomyTermChildResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AbstractTaxonomyTermChild'] = ResolversParentTypes['AbstractTaxonomyTermChild']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'Course' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'Page' | 'Video', ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
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

export type AiQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AiQuery'] = ResolversParentTypes['AiQuery']> = {
  executePrompt?: Resolver<ResolversTypes['ExecutePromptResponse'], ParentType, ContextType, RequireFields<AiQueryExecutePromptArgs, 'messages'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppletResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Applet'] = ResolversParentTypes['Applet']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['AppletRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['AppletRevisionConnection'], ParentType, ContextType, Partial<AppletRevisionsArgs>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<AppletTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<AppletThreadsArgs>>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Applet'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<AppletRevisionThreadsArgs>>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ArticleRevisionConnection'], ParentType, ContextType, Partial<ArticleRevisionsArgs>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<ArticleTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<ArticleThreadsArgs>>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Article'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<ArticleRevisionThreadsArgs>>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pages?: Resolver<Array<ResolversTypes['CoursePage']>, ParentType, ContextType, Partial<CoursePagesArgs>>;
  revisions?: Resolver<ResolversTypes['CourseRevisionConnection'], ParentType, ContextType, Partial<CourseRevisionsArgs>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<CourseTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<CourseThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoursePageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CoursePage'] = ResolversParentTypes['CoursePage']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  course?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['CoursePageRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['CoursePageRevisionConnection'], ParentType, ContextType, Partial<CoursePageRevisionsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<CoursePageThreadsArgs>>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['CoursePage'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<CoursePageRevisionThreadsArgs>>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<CourseRevisionThreadsArgs>>;
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

export type DeletedEntityResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeletedEntity'] = ResolversParentTypes['DeletedEntity']> = {
  dateOfDeletion?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  entity?: Resolver<Maybe<ResolversTypes['AbstractEntity']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeletedEntityConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeletedEntityConnection'] = ResolversParentTypes['DeletedEntityConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['DeletedEntity']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EntityMutation'] = ResolversParentTypes['EntityMutation']> = {
  checkoutRevision?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<EntityMutationCheckoutRevisionArgs, 'input'>>;
  rejectRevision?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<EntityMutationRejectRevisionArgs, 'input'>>;
  setAbstractEntity?: Resolver<ResolversTypes['SetEntityResponse'], ParentType, ContextType, RequireFields<EntityMutationSetAbstractEntityArgs, 'input'>>;
  updateLicense?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<EntityMutationUpdateLicenseArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EntityQuery'] = ResolversParentTypes['EntityQuery']> = {
  deletedEntities?: Resolver<ResolversTypes['DeletedEntityConnection'], ParentType, ContextType, Partial<EntityQueryDeletedEntitiesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['EventRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['EventRevisionConnection'], ParentType, ContextType, Partial<EventRevisionsArgs>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<EventTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<EventThreadsArgs>>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  metaTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Event'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<EventRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EventRevisionConnection'] = ResolversParentTypes['EventRevisionConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['EventRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ExerciseRevisionConnection'], ParentType, ContextType, Partial<ExerciseRevisionsArgs>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<ExerciseTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<ExerciseThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseGroupResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseGroup'] = ResolversParentTypes['ExerciseGroup']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['ExerciseGroupRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['ExerciseGroupRevisionConnection'], ParentType, ContextType, Partial<ExerciseGroupRevisionsArgs>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<ExerciseGroupTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<ExerciseGroupThreadsArgs>>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['ExerciseGroup'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<ExerciseGroupRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseGroupRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseGroupRevisionConnection'] = ResolversParentTypes['ExerciseGroupRevisionConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['ExerciseGroupRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseRevision'] = ResolversParentTypes['ExerciseRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Exercise'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<ExerciseRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExerciseRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExerciseRevisionConnection'] = ResolversParentTypes['ExerciseRevisionConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['ExerciseRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ExperimentMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ExperimentMutation'] = ResolversParentTypes['ExperimentMutation']> = {
  createExerciseSubmission?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ExperimentMutationCreateExerciseSubmissionArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstanceAwareResolvers<ContextType = Context, ParentType extends ResolversParentTypes['InstanceAware'] = ResolversParentTypes['InstanceAware']> = {
  __resolveType: TypeResolveFn<'Applet' | 'Article' | 'CheckoutRevisionNotificationEvent' | 'Course' | 'CoursePage' | 'CreateCommentNotificationEvent' | 'CreateEntityLinkNotificationEvent' | 'CreateEntityNotificationEvent' | 'CreateEntityRevisionNotificationEvent' | 'CreateTaxonomyLinkNotificationEvent' | 'CreateTaxonomyTermNotificationEvent' | 'CreateThreadNotificationEvent' | 'Event' | 'Exercise' | 'ExerciseGroup' | 'Page' | 'RejectRevisionNotificationEvent' | 'RemoveTaxonomyLinkNotificationEvent' | 'SetLicenseNotificationEvent' | 'SetTaxonomyParentNotificationEvent' | 'SetTaxonomyTermNotificationEvent' | 'SetThreadStateNotificationEvent' | 'SetUuidStateNotificationEvent' | 'TaxonomyTerm' | 'Video', ParentType, ContextType>;
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
  publisher?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
  resources?: Resolver<ResolversTypes['ResourceMetadataConnection'], ParentType, ContextType, Partial<MetadataQueryResourcesArgs>>;
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
  nodes?: Resolver<Array<ResolversTypes['Notification']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotificationMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['NotificationMutation'] = ResolversParentTypes['NotificationMutation']> = {
  setState?: Resolver<Maybe<ResolversTypes['DefaultResponse']>, ParentType, ContextType, RequireFields<NotificationMutationSetStateArgs, 'input'>>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['PageRevisionConnection'], ParentType, ContextType, Partial<PageRevisionsArgs>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<PageTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<PageThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageMutation'] = ResolversParentTypes['PageMutation']> = {
  addRevision?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<PageMutationAddRevisionArgs, 'input'>>;
  checkoutRevision?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<PageMutationCheckoutRevisionArgs, 'input'>>;
  create?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<PageMutationCreateArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageQuery'] = ResolversParentTypes['PageQuery']> = {
  pages?: Resolver<Array<ResolversTypes['Page']>, ParentType, ContextType, Partial<PageQueryPagesArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageRevisionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageRevision'] = ResolversParentTypes['PageRevision']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  changes?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Page'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<PageRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageRevisionConnection'] = ResolversParentTypes['PageRevisionConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['PageRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  ai?: Resolver<ResolversTypes['AiQuery'], ParentType, ContextType>;
  authorization?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  entity?: Resolver<Maybe<ResolversTypes['EntityQuery']>, ParentType, ContextType>;
  events?: Resolver<ResolversTypes['AbstractNotificationEventConnection'], ParentType, ContextType, Partial<QueryEventsArgs>>;
  media?: Resolver<ResolversTypes['MediaQuery'], ParentType, ContextType>;
  metadata?: Resolver<ResolversTypes['MetadataQuery'], ParentType, ContextType>;
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

export type ResourceMetadataConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ResourceMetadataConnection'] = ResolversParentTypes['ResourceMetadataConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['JSONObject']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScopedRoleResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ScopedRole'] = ResolversParentTypes['ScopedRole']> = {
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  scope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScopedRoleConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ScopedRoleConnection'] = ResolversParentTypes['ScopedRoleConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['ScopedRole']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetEntityResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SetEntityResponse'] = ResolversParentTypes['SetEntityResponse']> = {
  entity?: Resolver<Maybe<ResolversTypes['AbstractEntity']>, ParentType, ContextType>;
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  record?: Resolver<Maybe<ResolversTypes['AbstractEntity']>, ParentType, ContextType>;
  revision?: Resolver<Maybe<ResolversTypes['AbstractEntityRevision']>, ParentType, ContextType>;
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

export type SubscriptionInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionInfo'] = ResolversParentTypes['SubscriptionInfo']> = {
  object?: Resolver<ResolversTypes['AbstractUuid'], ParentType, ContextType>;
  sendEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionInfoConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionInfoConnection'] = ResolversParentTypes['SubscriptionInfoConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['SubscriptionInfo']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionMutation'] = ResolversParentTypes['SubscriptionMutation']> = {
  set?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<SubscriptionMutationSetArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SubscriptionQuery'] = ResolversParentTypes['SubscriptionQuery']> = {
  currentUserHasSubscribed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<SubscriptionQueryCurrentUserHasSubscribedArgs, 'id'>>;
  getSubscriptions?: Resolver<ResolversTypes['SubscriptionInfoConnection'], ParentType, ContextType, Partial<SubscriptionQueryGetSubscriptionsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTerm'] = ResolversParentTypes['TaxonomyTerm']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  children?: Resolver<ResolversTypes['AbstractUuidConnection'], ParentType, ContextType, Partial<TaxonomyTermChildrenArgs>>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['TaxonomyTerm']>, ParentType, ContextType>;
  path?: Resolver<Array<Maybe<ResolversTypes['TaxonomyTerm']>>, ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<TaxonomyTermThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TaxonomyTermType'], ParentType, ContextType>;
  weight?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxonomyTermConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTermConnection'] = ResolversParentTypes['TaxonomyTermConnection']> = {
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

export type TaxonomyTermMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TaxonomyTermMutation'] = ResolversParentTypes['TaxonomyTermMutation']> = {
  create?: Resolver<ResolversTypes['TaxonomyTermCreateResponse'], ParentType, ContextType, RequireFields<TaxonomyTermMutationCreateArgs, 'input'>>;
  createEntityLinks?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<TaxonomyTermMutationCreateEntityLinksArgs, 'input'>>;
  deleteEntityLinks?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<TaxonomyTermMutationDeleteEntityLinksArgs, 'input'>>;
  setNameAndDescription?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<TaxonomyTermMutationSetNameAndDescriptionArgs, 'input'>>;
  sort?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<TaxonomyTermMutationSortArgs, 'input'>>;
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
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<ThreadAwareThreadsArgs>>;
};

export type ThreadConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadConnection'] = ResolversParentTypes['ThreadConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['Thread']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadMutation'] = ResolversParentTypes['ThreadMutation']> = {
  createComment?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationCreateCommentArgs, 'input'>>;
  createThread?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationCreateThreadArgs, 'input'>>;
  editComment?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationEditCommentArgs, 'input'>>;
  setCommentState?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationSetCommentStateArgs, 'input'>>;
  setThreadArchived?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationSetThreadArchivedArgs, 'input'>>;
  setThreadState?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationSetThreadStateArgs, 'input'>>;
  setThreadStatus?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<ThreadMutationSetThreadStatusArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ThreadQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ThreadQuery'] = ResolversParentTypes['ThreadQuery']> = {
  allThreads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<ThreadQueryAllThreadsArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  activityByType?: Resolver<ResolversTypes['UserActivityByType'], ParentType, ContextType>;
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  chatUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<UserThreadsArgs>>;
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
  nodes?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserDeleteRegularUsersResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserDeleteRegularUsersResponse'] = ResolversParentTypes['UserDeleteRegularUsersResponse']> = {
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserMutation'] = ResolversParentTypes['UserMutation']> = {
  addRole?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<UserMutationAddRoleArgs, 'input'>>;
  deleteBots?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<UserMutationDeleteBotsArgs, 'input'>>;
  deleteRegularUser?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<UserMutationDeleteRegularUserArgs, 'input'>>;
  removeRole?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<UserMutationRemoveRoleArgs, 'input'>>;
  setDescription?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<UserMutationSetDescriptionArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserQuery'] = ResolversParentTypes['UserQuery']> = {
  potentialSpamUsers?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, Partial<UserQueryPotentialSpamUsersArgs>>;
  userByUsername?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<UserQueryUserByUsernameArgs, 'username'>>;
  usersByRole?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<UserQueryUsersByRoleArgs, 'role'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UuidMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UuidMutation'] = ResolversParentTypes['UuidMutation']> = {
  setState?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<UuidMutationSetStateArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Video'] = ResolversParentTypes['Video']> = {
  alias?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentRevision?: Resolver<Maybe<ResolversTypes['VideoRevision']>, ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  instance?: Resolver<ResolversTypes['Instance'], ParentType, ContextType>;
  licenseId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  revisions?: Resolver<ResolversTypes['VideoRevisionConnection'], ParentType, ContextType, Partial<VideoRevisionsArgs>>;
  taxonomyTerms?: Resolver<ResolversTypes['TaxonomyTermConnection'], ParentType, ContextType, Partial<VideoTaxonomyTermsArgs>>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<VideoThreadsArgs>>;
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
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  metaDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metaTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  repository?: Resolver<ResolversTypes['Video'], ParentType, ContextType>;
  threads?: Resolver<ResolversTypes['ThreadConnection'], ParentType, ContextType, Partial<VideoRevisionThreadsArgs>>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trashed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoRevisionConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VideoRevisionConnection'] = ResolversParentTypes['VideoRevisionConnection']> = {
  nodes?: Resolver<Array<ResolversTypes['VideoRevision']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type _CacheMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['_cacheMutation'] = ResolversParentTypes['_cacheMutation']> = {
  remove?: Resolver<ResolversTypes['DefaultResponse'], ParentType, ContextType, RequireFields<_CacheMutationRemoveArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AbstractEntity?: AbstractEntityResolvers<ContextType>;
  AbstractEntityConnection?: AbstractEntityConnectionResolvers<ContextType>;
  AbstractEntityRevision?: AbstractEntityRevisionResolvers<ContextType>;
  AbstractEntityRevisionConnection?: AbstractEntityRevisionConnectionResolvers<ContextType>;
  AbstractNotificationEvent?: AbstractNotificationEventResolvers<ContextType>;
  AbstractNotificationEventConnection?: AbstractNotificationEventConnectionResolvers<ContextType>;
  AbstractRepository?: AbstractRepositoryResolvers<ContextType>;
  AbstractRevision?: AbstractRevisionResolvers<ContextType>;
  AbstractTaxonomyTermChild?: AbstractTaxonomyTermChildResolvers<ContextType>;
  AbstractUuid?: AbstractUuidResolvers<ContextType>;
  AbstractUuidConnection?: AbstractUuidConnectionResolvers<ContextType>;
  AiQuery?: AiQueryResolvers<ContextType>;
  Applet?: AppletResolvers<ContextType>;
  AppletRevision?: AppletRevisionResolvers<ContextType>;
  AppletRevisionConnection?: AppletRevisionConnectionResolvers<ContextType>;
  Article?: ArticleResolvers<ContextType>;
  ArticleRevision?: ArticleRevisionResolvers<ContextType>;
  ArticleRevisionConnection?: ArticleRevisionConnectionResolvers<ContextType>;
  CheckoutRevisionNotificationEvent?: CheckoutRevisionNotificationEventResolvers<ContextType>;
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
  DeletedEntity?: DeletedEntityResolvers<ContextType>;
  DeletedEntityConnection?: DeletedEntityConnectionResolvers<ContextType>;
  EntityMutation?: EntityMutationResolvers<ContextType>;
  EntityQuery?: EntityQueryResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventRevision?: EventRevisionResolvers<ContextType>;
  EventRevisionConnection?: EventRevisionConnectionResolvers<ContextType>;
  ExecutePromptResponse?: ExecutePromptResponseResolvers<ContextType>;
  Exercise?: ExerciseResolvers<ContextType>;
  ExerciseGroup?: ExerciseGroupResolvers<ContextType>;
  ExerciseGroupRevision?: ExerciseGroupRevisionResolvers<ContextType>;
  ExerciseGroupRevisionConnection?: ExerciseGroupRevisionConnectionResolvers<ContextType>;
  ExerciseRevision?: ExerciseRevisionResolvers<ContextType>;
  ExerciseRevisionConnection?: ExerciseRevisionConnectionResolvers<ContextType>;
  ExperimentMutation?: ExperimentMutationResolvers<ContextType>;
  InstanceAware?: InstanceAwareResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  MediaQuery?: MediaQueryResolvers<ContextType>;
  MediaUpload?: MediaUploadResolvers<ContextType>;
  MetadataQuery?: MetadataQueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Notification?: NotificationResolvers<ContextType>;
  NotificationConnection?: NotificationConnectionResolvers<ContextType>;
  NotificationMutation?: NotificationMutationResolvers<ContextType>;
  OauthAcceptResponse?: OauthAcceptResponseResolvers<ContextType>;
  OauthMutation?: OauthMutationResolvers<ContextType>;
  Page?: PageResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  PageMutation?: PageMutationResolvers<ContextType>;
  PageQuery?: PageQueryResolvers<ContextType>;
  PageRevision?: PageRevisionResolvers<ContextType>;
  PageRevisionConnection?: PageRevisionConnectionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RejectRevisionNotificationEvent?: RejectRevisionNotificationEventResolvers<ContextType>;
  RemoveTaxonomyLinkNotificationEvent?: RemoveTaxonomyLinkNotificationEventResolvers<ContextType>;
  ResourceMetadataConnection?: ResourceMetadataConnectionResolvers<ContextType>;
  ScopedRole?: ScopedRoleResolvers<ContextType>;
  ScopedRoleConnection?: ScopedRoleConnectionResolvers<ContextType>;
  SetEntityResponse?: SetEntityResponseResolvers<ContextType>;
  SetLicenseNotificationEvent?: SetLicenseNotificationEventResolvers<ContextType>;
  SetTaxonomyParentNotificationEvent?: SetTaxonomyParentNotificationEventResolvers<ContextType>;
  SetTaxonomyTermNotificationEvent?: SetTaxonomyTermNotificationEventResolvers<ContextType>;
  SetThreadStateNotificationEvent?: SetThreadStateNotificationEventResolvers<ContextType>;
  SetUuidStateNotificationEvent?: SetUuidStateNotificationEventResolvers<ContextType>;
  Subject?: SubjectResolvers<ContextType>;
  SubjectQuery?: SubjectQueryResolvers<ContextType>;
  SubscriptionInfo?: SubscriptionInfoResolvers<ContextType>;
  SubscriptionInfoConnection?: SubscriptionInfoConnectionResolvers<ContextType>;
  SubscriptionMutation?: SubscriptionMutationResolvers<ContextType>;
  SubscriptionQuery?: SubscriptionQueryResolvers<ContextType>;
  TaxonomyTerm?: TaxonomyTermResolvers<ContextType>;
  TaxonomyTermConnection?: TaxonomyTermConnectionResolvers<ContextType>;
  TaxonomyTermCreateResponse?: TaxonomyTermCreateResponseResolvers<ContextType>;
  TaxonomyTermMutation?: TaxonomyTermMutationResolvers<ContextType>;
  Thread?: ThreadResolvers<ContextType>;
  ThreadAware?: ThreadAwareResolvers<ContextType>;
  ThreadConnection?: ThreadConnectionResolvers<ContextType>;
  ThreadMutation?: ThreadMutationResolvers<ContextType>;
  ThreadQuery?: ThreadQueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserActivityByType?: UserActivityByTypeResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserDeleteRegularUsersResponse?: UserDeleteRegularUsersResponseResolvers<ContextType>;
  UserMutation?: UserMutationResolvers<ContextType>;
  UserQuery?: UserQueryResolvers<ContextType>;
  UuidMutation?: UuidMutationResolvers<ContextType>;
  Video?: VideoResolvers<ContextType>;
  VideoRevision?: VideoRevisionResolvers<ContextType>;
  VideoRevisionConnection?: VideoRevisionConnectionResolvers<ContextType>;
  _cacheMutation?: _CacheMutationResolvers<ContextType>;
};

