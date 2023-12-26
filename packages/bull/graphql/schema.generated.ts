// @ts-nocheck
import '@zemble/core'
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { Job, Queue } from 'bullmq';
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

export type BullJob = {
  readonly __typename?: 'BullJob';
  readonly data?: Maybe<Scalars['JSON']['output']>;
  readonly delay?: Maybe<Scalars['Int']['output']>;
  readonly id: Scalars['ID']['output'];
  readonly name: Scalars['String']['output'];
  readonly progress?: Maybe<Scalars['Float']['output']>;
  readonly repeatJobKey?: Maybe<Scalars['ID']['output']>;
  readonly state: JobState;
  readonly timestamp: Scalars['Int']['output'];
};

export type BullQueue = {
  readonly __typename?: 'BullQueue';
  readonly activeCount: Scalars['Int']['output'];
  readonly completedCount: Scalars['Int']['output'];
  readonly count: Scalars['Int']['output'];
  readonly delayedCount: Scalars['Int']['output'];
  readonly failedCount: Scalars['Int']['output'];
  readonly isPaused: Scalars['Boolean']['output'];
  readonly jobs: ReadonlyArray<BullJob>;
  readonly name: Scalars['String']['output'];
  readonly repeatableJobs: ReadonlyArray<RepeatableJob>;
  readonly waitingChildrenCount: Scalars['Int']['output'];
  readonly waitingCount: Scalars['Int']['output'];
};


export type BullQueueJobsArgs = {
  asc?: InputMaybe<Scalars['Boolean']['input']>;
  end?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<ReadonlyArray<JobTypeOrState>>;
};


export type BullQueueRepeatableJobsArgs = {
  asc?: InputMaybe<Scalars['Boolean']['input']>;
  end?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};

export enum CleanQueueType {
  Active = 'active',
  Completed = 'completed',
  Delayed = 'delayed',
  Failed = 'failed',
  Paused = 'paused',
  Prioritized = 'prioritized',
  Wait = 'wait'
}

export enum JobState {
  Active = 'active',
  Completed = 'completed',
  Delayed = 'delayed',
  Failed = 'failed',
  Prioritized = 'prioritized',
  Waiting = 'waiting',
  WaitingChildren = 'waiting_children'
}

export enum JobTypeOrState {
  Active = 'active',
  Completed = 'completed',
  Delayed = 'delayed',
  Failed = 'failed',
  Paused = 'paused',
  Prioritized = 'prioritized',
  Wait = 'wait',
  Waiting = 'waiting',
  WaitingChildren = 'waiting_children'
}

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly addJob: BullJob;
  readonly addRepeatableJob: BullJob;
  readonly cleanQueue: ReadonlyArray<Scalars['ID']['output']>;
  readonly drainQueue: Scalars['Boolean']['output'];
  readonly removeJob: Scalars['Boolean']['output'];
  readonly removeRepeatableJob: Scalars['Boolean']['output'];
};


export type MutationAddJobArgs = {
  data?: InputMaybe<Scalars['JSON']['input']>;
  jobId?: InputMaybe<Scalars['ID']['input']>;
  queue: Scalars['String']['input'];
};


export type MutationAddRepeatableJobArgs = {
  data?: InputMaybe<Scalars['JSON']['input']>;
  pattern: Scalars['String']['input'];
  queue: Scalars['String']['input'];
  repeatJobKey?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationCleanQueueArgs = {
  grace: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  queue: Scalars['String']['input'];
  type?: InputMaybe<CleanQueueType>;
};


export type MutationDrainQueueArgs = {
  delayed?: InputMaybe<Scalars['Boolean']['input']>;
  queue: Scalars['String']['input'];
};


export type MutationRemoveJobArgs = {
  jobId: Scalars['ID']['input'];
  queue: Scalars['String']['input'];
};


export type MutationRemoveRepeatableJobArgs = {
  queue: Scalars['String']['input'];
  repeatJobKey: Scalars['ID']['input'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly queues: ReadonlyArray<BullQueue>;
};

export type RepeatableJob = {
  readonly __typename?: 'RepeatableJob';
  readonly endDate?: Maybe<Scalars['Float']['output']>;
  readonly id?: Maybe<Scalars['String']['output']>;
  readonly key: Scalars['ID']['output'];
  readonly name: Scalars['String']['output'];
  readonly next: Scalars['DateTime']['output'];
  readonly pattern: Scalars['String']['output'];
  readonly tz?: Maybe<Scalars['String']['output']>;
};

export type Subscription = {
  readonly __typename?: 'Subscription';
  readonly jobUpdated: BullJob;
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
  BullJob: ResolverTypeWrapper<Job>;
  BullQueue: ResolverTypeWrapper<Queue>;
  CleanQueueType: CleanQueueType;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  JobState: JobState;
  JobTypeOrState: JobTypeOrState;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RepeatableJob: ResolverTypeWrapper<RepeatableJob>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  BullJob: Job;
  BullQueue: Queue;
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Mutation: {};
  Query: {};
  RepeatableJob: RepeatableJob;
  String: Scalars['String']['output'];
  Subscription: {};
}>;

export type BullJobResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['BullJob'] = ResolversParentTypes['BullJob']> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  delay?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  repeatJobKey?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['JobState'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BullQueueResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['BullQueue'] = ResolversParentTypes['BullQueue']> = ResolversObject<{
  activeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  delayedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  failedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isPaused?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  jobs?: Resolver<ReadonlyArray<ResolversTypes['BullJob']>, ParentType, ContextType, Partial<BullQueueJobsArgs>>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  repeatableJobs?: Resolver<ReadonlyArray<ResolversTypes['RepeatableJob']>, ParentType, ContextType, Partial<BullQueueRepeatableJobsArgs>>;
  waitingChildrenCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  waitingCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addJob?: Resolver<ResolversTypes['BullJob'], ParentType, ContextType, RequireFields<MutationAddJobArgs, 'queue'>>;
  addRepeatableJob?: Resolver<ResolversTypes['BullJob'], ParentType, ContextType, RequireFields<MutationAddRepeatableJobArgs, 'pattern' | 'queue'>>;
  cleanQueue?: Resolver<ReadonlyArray<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationCleanQueueArgs, 'grace' | 'limit' | 'queue'>>;
  drainQueue?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDrainQueueArgs, 'queue'>>;
  removeJob?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveJobArgs, 'jobId' | 'queue'>>;
  removeRepeatableJob?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveRepeatableJobArgs, 'queue' | 'repeatJobKey'>>;
}>;

export type QueryResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  queues?: Resolver<ReadonlyArray<ResolversTypes['BullQueue']>, ParentType, ContextType>;
}>;

export type RepeatableJobResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['RepeatableJob'] = ResolversParentTypes['RepeatableJob']> = ResolversObject<{
  endDate?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  next?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  pattern?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tz?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  jobUpdated?: SubscriptionResolver<ResolversTypes['BullJob'], "jobUpdated", ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  BullJob?: BullJobResolvers<ContextType>;
  BullQueue?: BullQueueResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RepeatableJob?: RepeatableJobResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
}>;

