// @ts-nocheck
import '@zemble/core'
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
export type Maybe<T> = T | null | undefined
export type InputMaybe<T> = T | null | undefined
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  JSONObject: { input: any; output: any }
}

export type AuthOr = {
  readonly includes?: InputMaybe<Scalars['JSONObject']['input']>
  readonly match?: InputMaybe<Scalars['JSONObject']['input']>
}

export enum LogLevel {
  Debug = 'debug',
  Error = 'error',
  Fatal = 'fatal',
  Info = 'info',
  Silent = 'silent',
  Trace = 'trace',
  Warn = 'warn',
}

export type LogOutput = {
  readonly __typename?: 'LogOutput'
  readonly message: Scalars['String']['output']
  readonly severity: Scalars['String']['output']
  readonly timestamp: Scalars['String']['output']
}

export type Mutation = {
  readonly __typename?: 'Mutation'
  readonly setLogLevel: LogLevel
}

export type MutationSetLogLevelArgs = {
  level: LogLevel
}

export type Query = {
  readonly __typename?: 'Query'
  readonly logLevel: LogLevel
  readonly logs: ReadonlyArray<LogOutput>
}

export type Subscription = {
  readonly __typename?: 'Subscription'
  readonly logs: LogOutput
}

export type SubscriptionLogsArgs = {
  minLevel?: InputMaybe<LogLevel>
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthOr: AuthOr
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>
  LogLevel: LogLevel
  LogOutput: ResolverTypeWrapper<LogOutput>
  Mutation: ResolverTypeWrapper<{}>
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']['output']>
  Subscription: ResolverTypeWrapper<{}>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthOr: AuthOr
  Boolean: Scalars['Boolean']['output']
  JSONObject: Scalars['JSONObject']['output']
  LogOutput: LogOutput
  Mutation: {}
  Query: {}
  String: Scalars['String']['output']
  Subscription: {}
}>

export type AuthDirectiveArgs = {
  includes?: Maybe<Scalars['JSONObject']['input']>
  match?: Maybe<Scalars['JSONObject']['input']>
  or?: Maybe<ReadonlyArray<AuthOr>>
  skip?: Maybe<Scalars['Boolean']['input']>
}

export type AuthDirectiveResolver<Result, Parent, ContextType = Zemble.GraphQLContext, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type StreamDirectiveArgs = {}

export type StreamDirectiveResolver<Result, Parent, ContextType = Zemble.GraphQLContext, Args = StreamDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject'
}

export type LogOutputResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LogOutput'] = ResolversParentTypes['LogOutput']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  severity?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  setLogLevel?: Resolver<ResolversTypes['LogLevel'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationSetLogLevelArgs, 'level'>>
}>

export type QueryResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  logLevel?: Resolver<ResolversTypes['LogLevel'], ParentType, Zemble.AuthContextWithToken<ContextType>>
  logs?: Resolver<ReadonlyArray<ResolversTypes['LogOutput']>, ParentType, Zemble.AuthContextWithToken<ContextType>>
}>

export type SubscriptionResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  logs?: SubscriptionResolver<ResolversTypes['LogOutput'], 'logs', ParentType, Zemble.AuthContextWithToken<ContextType>, Partial<SubscriptionLogsArgs>>
}>

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  JSONObject?: GraphQLScalarType
  LogOutput?: LogOutputResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Subscription?: SubscriptionResolvers<ContextType>
}>

export type DirectiveResolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>
  stream?: StreamDirectiveResolver<any, any, ContextType>
}>
