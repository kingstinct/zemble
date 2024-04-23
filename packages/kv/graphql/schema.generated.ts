// @ts-nocheck
  import '@zemble/core'
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  JSON: { input: any; output: any; }
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly clear: Scalars['Boolean']['output'];
  readonly delete: Scalars['Boolean']['output'];
  readonly set: Scalars['Boolean']['output'];
};


export type MutationClearArgs = {
  prefix: Scalars['String']['input'];
};


export type MutationDeleteArgs = {
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
};


export type MutationSetArgs = {
  expireAfterSeconds?: InputMaybe<Scalars['Int']['input']>;
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
  value: Scalars['JSON']['input'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly entries: ReadonlyArray<Scalars['JSON']['output']>;
  readonly get?: Maybe<Scalars['JSON']['output']>;
  readonly has: Scalars['Boolean']['output'];
  readonly keys: ReadonlyArray<Scalars['String']['output']>;
  readonly size: Scalars['Int']['output'];
  readonly values: ReadonlyArray<Scalars['JSON']['output']>;
};


export type QueryEntriesArgs = {
  prefix: Scalars['String']['input'];
};


export type QueryGetArgs = {
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
};


export type QueryHasArgs = {
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
};


export type QueryKeysArgs = {
  prefix: Scalars['String']['input'];
};


export type QuerySizeArgs = {
  prefix: Scalars['String']['input'];
};


export type QueryValuesArgs = {
  prefix: Scalars['String']['input'];
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
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  clear?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationClearArgs, 'prefix'>>;
  delete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteArgs, 'key' | 'prefix'>>;
  set?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSetArgs, 'key' | 'prefix' | 'value'>>;
}>;

export type QueryResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  entries?: Resolver<ReadonlyArray<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryEntriesArgs, 'prefix'>>;
  get?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryGetArgs, 'key' | 'prefix'>>;
  has?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryHasArgs, 'key' | 'prefix'>>;
  keys?: Resolver<ReadonlyArray<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryKeysArgs, 'prefix'>>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<QuerySizeArgs, 'prefix'>>;
  values?: Resolver<ReadonlyArray<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryValuesArgs, 'prefix'>>;
}>;

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

