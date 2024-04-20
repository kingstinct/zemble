import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
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
  DateTime: { input: Date | string; output: Date | string; }
  JSONObject: { input: Record<string, any>; output: Record<string, any>; }
};

export type AppleAuthenticationFullName = {
  readonly familyName?: InputMaybe<Scalars['String']['input']>;
  readonly givenName?: InputMaybe<Scalars['String']['input']>;
  readonly middleName?: InputMaybe<Scalars['String']['input']>;
  readonly namePrefix?: InputMaybe<Scalars['String']['input']>;
  readonly nameSuffix?: InputMaybe<Scalars['String']['input']>;
  readonly nickname?: InputMaybe<Scalars['String']['input']>;
};

export type AppleAuthenticationUserDetectionStatus =
  | 'LIKELY_REAL'
  | 'UNKNOWN'
  | 'UNSUPPORTED';

export type AppleLoginResponse = {
  readonly __typename?: 'AppleLoginResponse';
  readonly bearerToken: Scalars['String']['output'];
  readonly refreshToken: Scalars['String']['output'];
};

export type AuthOr = {
  readonly includes?: InputMaybe<Scalars['JSONObject']['input']>;
  readonly match?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type Error = {
  readonly message: Scalars['String']['output'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly loginWithApple: AppleLoginResponse;
  readonly logout: Scalars['DateTime']['output'];
  readonly logoutFromAllDevices: Scalars['DateTime']['output'];
  readonly refreshToken: NewTokenResponse;
};


export type MutationloginWithAppleArgs = {
  authorizationCode: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<AppleAuthenticationFullName>;
  identityToken: Scalars['String']['input'];
  realUserStatus: AppleAuthenticationUserDetectionStatus;
  state?: InputMaybe<Scalars['String']['input']>;
  userUUID: Scalars['String']['input'];
};


export type MutationrefreshTokenArgs = {
  bearerToken: Scalars['String']['input'];
  refreshToken: Scalars['String']['input'];
};

export type NewTokenResponse = NewTokenSuccessResponse | RefreshTokenInvalidError;

export type NewTokenSuccessResponse = {
  readonly __typename?: 'NewTokenSuccessResponse';
  readonly bearerToken: Scalars['String']['output'];
  readonly refreshToken: Scalars['String']['output'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly publicKey: Scalars['String']['output'];
  readonly readJWT: Scalars['JSONObject']['output'];
  readonly state: Scalars['String']['output'];
  readonly validateJWT: Scalars['Boolean']['output'];
};


export type QueryreadJWTArgs = {
  token: Scalars['String']['input'];
};


export type QueryvalidateJWTArgs = {
  token: Scalars['String']['input'];
};

export type RefreshTokenInvalidError = {
  readonly __typename?: 'RefreshTokenInvalidError';
  readonly message: Scalars['String']['output'];
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

/** Mapping of union types */
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  NewTokenResponse: ( NewTokenSuccessResponse & { __typename: 'NewTokenSuccessResponse' } ) | ( RefreshTokenInvalidError & { __typename: 'RefreshTokenInvalidError' } );
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Error: never;
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AppleAuthenticationFullName: AppleAuthenticationFullName;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  AppleAuthenticationUserDetectionStatus: AppleAuthenticationUserDetectionStatus;
  AppleLoginResponse: ResolverTypeWrapper<AppleLoginResponse>;
  AuthOr: AuthOr;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Error']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  NewTokenResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['NewTokenResponse']>;
  NewTokenSuccessResponse: ResolverTypeWrapper<NewTokenSuccessResponse>;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  RefreshTokenInvalidError: ResolverTypeWrapper<RefreshTokenInvalidError>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AppleAuthenticationFullName: AppleAuthenticationFullName;
  String: Scalars['String']['output'];
  AppleLoginResponse: AppleLoginResponse;
  AuthOr: AuthOr;
  DateTime: Scalars['DateTime']['output'];
  Error: ResolversInterfaceTypes<ResolversParentTypes>['Error'];
  JSONObject: Scalars['JSONObject']['output'];
  Mutation: {};
  NewTokenResponse: ResolversUnionTypes<ResolversParentTypes>['NewTokenResponse'];
  NewTokenSuccessResponse: NewTokenSuccessResponse;
  Query: {};
  Boolean: Scalars['Boolean']['output'];
  RefreshTokenInvalidError: RefreshTokenInvalidError;
}>;

export type authDirectiveArgs = {
  includes?: Maybe<Scalars['JSONObject']['input']>;
  match?: Maybe<Scalars['JSONObject']['input']>;
  or?: Maybe<ReadonlyArray<AuthOr>>;
  skip?: Maybe<Scalars['Boolean']['input']>;
};

export type authDirectiveResolver<Result, Parent, ContextType = Zemble.GraphQLContext, Args = authDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AppleLoginResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['AppleLoginResponse'] = ResolversParentTypes['AppleLoginResponse']> = ResolversObject<{
  bearerToken?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type ErrorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  __resolveType?: TypeResolveFn<null, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
}>;

export interface JSONObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  loginWithApple?: Resolver<ResolversTypes['AppleLoginResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationloginWithAppleArgs, 'authorizationCode' | 'identityToken' | 'realUserStatus' | 'userUUID'>>;
  logout?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  logoutFromAllDevices?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['NewTokenResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationrefreshTokenArgs, 'bearerToken' | 'refreshToken'>>;
}>;

export type NewTokenResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['NewTokenResponse'] = ResolversParentTypes['NewTokenResponse']> = ResolversObject<{
  __resolveType?: TypeResolveFn<'NewTokenSuccessResponse' | 'RefreshTokenInvalidError', ParentType, ContextType>;
}>;

export type NewTokenSuccessResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['NewTokenSuccessResponse'] = ResolversParentTypes['NewTokenSuccessResponse']> = ResolversObject<{
  bearerToken?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  publicKey?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  readJWT?: Resolver<ResolversTypes['JSONObject'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<QueryreadJWTArgs, 'token'>>;
  state?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  validateJWT?: Resolver<ResolversTypes['Boolean'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<QueryvalidateJWTArgs, 'token'>>;
}>;

export type RefreshTokenInvalidErrorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['RefreshTokenInvalidError'] = ResolversParentTypes['RefreshTokenInvalidError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  AppleLoginResponse?: AppleLoginResponseResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Error?: ErrorResolvers<ContextType>;
  JSONObject?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  NewTokenResponse?: NewTokenResponseResolvers<ContextType>;
  NewTokenSuccessResponse?: NewTokenSuccessResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RefreshTokenInvalidError?: RefreshTokenInvalidErrorResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  auth?: authDirectiveResolver<any, any, ContextType>;
}>;
