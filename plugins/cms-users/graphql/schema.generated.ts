import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { UserType, Permission } from '../clients/papr';
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
  Date: { input: any; output: any; }
  DateTime: { input: string; output: string; }
  JSONObject: { input: any; output: any; }
};

export type AuthOr = {
  readonly includes?: InputMaybe<Scalars['JSONObject']['input']>;
  readonly match?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly updatePermissions: User;
};


export type MutationUpdatePermissionsArgs = {
  permissions: ReadonlyArray<PermissionInput>;
  userId: Scalars['ID']['input'];
};

export type Permission = {
  readonly __typename?: 'Permission';
  readonly scope: Scalars['String']['output'];
  readonly type: Scalars['String']['output'];
};

export type PermissionInput = {
  readonly scope: Scalars['String']['input'];
  readonly type: Scalars['String']['input'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly users: ReadonlyArray<User>;
};

export type User = {
  readonly __typename?: 'User';
  readonly email: Scalars['String']['output'];
  readonly id: Scalars['ID']['output'];
  readonly lastLoginAt: Scalars['DateTime']['output'];
  readonly permissions: ReadonlyArray<Permission>;
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
  AuthOr: AuthOr;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Permission: ResolverTypeWrapper<Permission>;
  PermissionInput: ResolverTypeWrapper<Permission>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<UserType>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthOr: AuthOr;
  Boolean: Scalars['Boolean']['output'];
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  JSONObject: Scalars['JSONObject']['output'];
  Mutation: {};
  Permission: Permission;
  PermissionInput: Permission;
  Query: {};
  String: Scalars['String']['output'];
  User: UserType;
}>;

export type AuthDirectiveArgs = {
  includes?: Maybe<Scalars['JSONObject']['input']>;
  match?: Maybe<Scalars['JSONObject']['input']>;
  or?: Maybe<ReadonlyArray<AuthOr>>;
  skip?: Maybe<Scalars['Boolean']['input']>;
};

export type AuthDirectiveResolver<Result, Parent, ContextType = Readapt.GraphQLContext, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type OneOfDirectiveArgs = { };

export type OneOfDirectiveResolver<Result, Parent, ContextType = Readapt.GraphQLContext, Args = OneOfDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type MutationResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  updatePermissions?: Resolver<ResolversTypes['User'], ParentType, Readapt.AuthContextWithToken<ContextType, {"includes":{"permissions":{"type":"user-admin"}}}>, RequireFields<MutationUpdatePermissionsArgs, 'permissions' | 'userId'>>;
}>;

export type PermissionResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Permission'] = ResolversParentTypes['Permission']> = ResolversObject<{
  scope?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  users?: Resolver<ReadonlyArray<ResolversTypes['User']>, ParentType, Readapt.AuthContextWithToken<ContextType, {"includes":{"permissions":{"type":"user-admin"}}}>>;
}>;

export type UserResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastLoginAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  permissions?: Resolver<ReadonlyArray<ResolversTypes['Permission']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Readapt.GraphQLContext> = ResolversObject<{
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Permission?: PermissionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Readapt.GraphQLContext> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>;
  oneOf?: OneOfDirectiveResolver<any, any, ContextType>;
}>;
