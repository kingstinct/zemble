// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Job, Queue } from 'bullmq';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Job = {
  readonly __typename?: 'Job';
  readonly data: Scalars['JSON']['output'];
  readonly delay?: Maybe<Scalars['Int']['output']>;
  readonly id?: Maybe<Scalars['ID']['output']>;
  readonly name: Scalars['String']['output'];
  readonly progress?: Maybe<Scalars['Float']['output']>;
  readonly state: JobState;
  readonly timestamp: Scalars['Int']['output'];
};

export enum JobState {
  Active = 'active',
  Completed = 'completed',
  Delayed = 'delayed',
  Failed = 'failed',
  Prioritized = 'prioritized',
  Waiting = 'waiting',
  WaitingChildren = 'waiting_children'
}

export enum JobType {
  Active = 'active',
  Completed = 'completed',
  Delayed = 'delayed',
  Failed = 'failed',
  Paused = 'paused',
  Prioritized = 'prioritized',
  Repeat = 'repeat',
  Wait = 'wait',
  Waiting = 'waiting',
  WaitingChildren = 'waiting_children'
}

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly addJob: Job;
};


export type MutationAddJobArgs = {
  queue: Scalars['String']['input'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly queues: ReadonlyArray<Queue>;
};

export type Queue = {
  readonly __typename?: 'Queue';
  readonly activeCount: Scalars['Int']['output'];
  readonly completedCount: Scalars['Int']['output'];
  readonly count: Scalars['Int']['output'];
  readonly delayedCount: Scalars['Int']['output'];
  readonly failedCount: Scalars['Int']['output'];
  readonly isPaused: Scalars['Boolean']['output'];
  readonly jobs: ReadonlyArray<Job>;
  readonly name: Scalars['String']['output'];
  readonly waitingChildrenCount: Scalars['Int']['output'];
  readonly waitingCount: Scalars['Int']['output'];
};


export type QueueJobsArgs = {
  asc?: InputMaybe<Scalars['Boolean']['input']>;
  end?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<ReadonlyArray<JobType>>;
};

export type Subscription = {
  readonly __typename?: 'Subscription';
  readonly jobUpdated: Job;
};

export type Todo = {
  readonly __typename?: 'Todo';
  readonly completed: Scalars['Boolean']['output'];
  readonly id: Scalars['ID']['output'];
  readonly title: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

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
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Job: ResolverTypeWrapper<Job>;
  JobState: JobState;
  JobType: JobType;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Queue: ResolverTypeWrapper<Queue>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  Todo: ResolverTypeWrapper<Todo>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Job: Job;
  Mutation: {};
  Query: {};
  Queue: Queue;
  String: Scalars['String']['output'];
  Subscription: {};
  Todo: Todo;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type JobResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Job'] = ResolversParentTypes['Job']> = ResolversObject<{
  data?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  delay?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['JobState'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addJob?: Resolver<ResolversTypes['Job'], ParentType, ContextType, RequireFields<MutationAddJobArgs, 'queue'>>;
}>;

export type QueryResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  queues?: Resolver<ReadonlyArray<ResolversTypes['Queue']>, ParentType, ContextType>;
}>;

export type QueueResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Queue'] = ResolversParentTypes['Queue']> = ResolversObject<{
  activeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  delayedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  failedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isPaused?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  jobs?: Resolver<ReadonlyArray<ResolversTypes['Job']>, ParentType, ContextType, Partial<QueueJobsArgs>>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  waitingChildrenCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  waitingCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  jobUpdated?: SubscriptionResolver<ResolversTypes['Job'], "jobUpdated", ParentType, ContextType>;
}>;

export type TodoResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Todo'] = ResolversParentTypes['Todo']> = ResolversObject<{
  completed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Readapt.GraphQLContext> = ResolversObject<{
  DateTime?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Job?: JobResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Queue?: QueueResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Todo?: TodoResolvers<ContextType>;
}>;

