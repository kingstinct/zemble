// @ts-nocheck
import '@zemble/core'
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
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
};

export type AuthOr = {
  readonly includes?: InputMaybe<Scalars['JSONObject']['input']>;
  readonly match?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type CodeNotValidError = Error & {
  readonly __typename?: 'CodeNotValidError';
  readonly message: Scalars['String']['output'];
};

export type EmailNotValidError = Error & {
  readonly __typename?: 'EmailNotValidError';
  readonly message: Scalars['String']['output'];
};

export type Error = {
  readonly message: Scalars['String']['output'];
};

export type LoginConfirmResponse = CodeNotValidError | EmailNotValidError | LoginConfirmSuccessfulResponse | LoginFailedError;

export type LoginConfirmSuccessfulResponse = {
  readonly __typename?: 'LoginConfirmSuccessfulResponse';
  readonly bearerToken: Scalars['String']['output'];
  readonly refreshToken: Scalars['String']['output'];
};

export type LoginConfirmWithEmailResponse = CodeNotValidError | EmailNotValidError | LoginConfirmSuccessfulResponse | LoginFailedError;

export type LoginConfirmWithSmsResponse = CodeNotValidError | LoginConfirmSuccessfulResponse | LoginFailedError | PhoneNumNotValidError;

export type LoginFailedError = Error & {
  readonly __typename?: 'LoginFailedError';
  readonly message: Scalars['String']['output'];
};

export type LoginRequestResponse = EmailNotValidError | LoginRequestSuccessResponse;

export type LoginRequestSuccessResponse = {
  readonly __typename?: 'LoginRequestSuccessResponse';
  readonly success: Scalars['Boolean']['output'];
};

export type LoginRequestWithEmailResponse = EmailNotValidError | LoginRequestSuccessResponse;

export type LoginRequestWithSmsResponse = LoginRequestSuccessResponse | PhoneNumNotValidError;

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly clear: Scalars['Boolean']['output'];
  readonly delete: Scalars['Boolean']['output'];
  readonly loginConfirm: LoginConfirmResponse;
  readonly loginConfirmWithEmail: LoginConfirmWithEmailResponse;
  readonly loginConfirmWithSms: LoginConfirmWithSmsResponse;
  readonly loginRequest: LoginRequestResponse;
  readonly loginRequestWithEmail: LoginRequestWithEmailResponse;
  readonly loginRequestWithSms: LoginRequestWithSmsResponse;
  readonly logout: Scalars['DateTime']['output'];
  readonly logoutFromAllDevices: Scalars['DateTime']['output'];
  readonly refreshToken: NewTokenResponse;
  readonly set: Scalars['Boolean']['output'];
};


export type MutationClearArgs = {
  prefix: Scalars['String']['input'];
};


export type MutationDeleteArgs = {
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
};


export type MutationLoginConfirmArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationLoginConfirmWithEmailArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationLoginConfirmWithSmsArgs = {
  code: Scalars['String']['input'];
  phoneNumberWithCountryCode: Scalars['String']['input'];
};


export type MutationLoginRequestArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginRequestWithEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginRequestWithSmsArgs = {
  phoneNumberWithCountryCode: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  bearerToken: Scalars['String']['input'];
  refreshToken: Scalars['String']['input'];
};


export type MutationSetArgs = {
  expireAfterSeconds?: InputMaybe<Scalars['Int']['input']>;
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
  value: Scalars['JSON']['input'];
};

export type NewTokenResponse = NewTokenSuccessResponse | RefreshTokenInvalidError;

export type NewTokenSuccessResponse = {
  readonly __typename?: 'NewTokenSuccessResponse';
  readonly bearerToken: Scalars['String']['output'];
  readonly refreshToken: Scalars['String']['output'];
};

export type PhoneNumNotValidError = Error & {
  readonly __typename?: 'PhoneNumNotValidError';
  readonly message: Scalars['String']['output'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly entries: ReadonlyArray<Scalars['JSON']['output']>;
  readonly get?: Maybe<Scalars['JSON']['output']>;
  readonly has: Scalars['Boolean']['output'];
  readonly keys: ReadonlyArray<Scalars['String']['output']>;
  readonly publicKey?: Maybe<Scalars['String']['output']>;
  readonly readJWT: Scalars['JSONObject']['output'];
  readonly size: Scalars['Int']['output'];
  readonly validateJWT: Scalars['Boolean']['output'];
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


export type QueryReadJwtArgs = {
  token: Scalars['String']['input'];
};


export type QuerySizeArgs = {
  prefix: Scalars['String']['input'];
};


export type QueryValidateJwtArgs = {
  token: Scalars['String']['input'];
};


export type QueryValuesArgs = {
  prefix: Scalars['String']['input'];
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
  LoginConfirmResponse: ( CodeNotValidError ) | ( EmailNotValidError ) | ( LoginConfirmSuccessfulResponse ) | ( LoginFailedError );
  LoginConfirmWithEmailResponse: ( CodeNotValidError ) | ( EmailNotValidError ) | ( LoginConfirmSuccessfulResponse ) | ( LoginFailedError );
  LoginConfirmWithSmsResponse: ( CodeNotValidError ) | ( LoginConfirmSuccessfulResponse ) | ( LoginFailedError ) | ( PhoneNumNotValidError );
  LoginRequestResponse: ( EmailNotValidError ) | ( LoginRequestSuccessResponse );
  LoginRequestWithEmailResponse: ( EmailNotValidError ) | ( LoginRequestSuccessResponse );
  LoginRequestWithSmsResponse: ( LoginRequestSuccessResponse ) | ( PhoneNumNotValidError );
  NewTokenResponse: ( NewTokenSuccessResponse ) | ( RefreshTokenInvalidError );
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Error: ( CodeNotValidError ) | ( EmailNotValidError ) | ( LoginFailedError ) | ( PhoneNumNotValidError );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthOr: AuthOr;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CodeNotValidError: ResolverTypeWrapper<CodeNotValidError>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  EmailNotValidError: ResolverTypeWrapper<EmailNotValidError>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Error']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>;
  LoginConfirmResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginConfirmResponse']>;
  LoginConfirmSuccessfulResponse: ResolverTypeWrapper<LoginConfirmSuccessfulResponse>;
  LoginConfirmWithEmailResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginConfirmWithEmailResponse']>;
  LoginConfirmWithSmsResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginConfirmWithSmsResponse']>;
  LoginFailedError: ResolverTypeWrapper<LoginFailedError>;
  LoginRequestResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginRequestResponse']>;
  LoginRequestSuccessResponse: ResolverTypeWrapper<LoginRequestSuccessResponse>;
  LoginRequestWithEmailResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginRequestWithEmailResponse']>;
  LoginRequestWithSmsResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginRequestWithSmsResponse']>;
  Mutation: ResolverTypeWrapper<{}>;
  NewTokenResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['NewTokenResponse']>;
  NewTokenSuccessResponse: ResolverTypeWrapper<NewTokenSuccessResponse>;
  PhoneNumNotValidError: ResolverTypeWrapper<PhoneNumNotValidError>;
  Query: ResolverTypeWrapper<{}>;
  RefreshTokenInvalidError: ResolverTypeWrapper<RefreshTokenInvalidError>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthOr: AuthOr;
  Boolean: Scalars['Boolean']['output'];
  CodeNotValidError: CodeNotValidError;
  DateTime: Scalars['DateTime']['output'];
  EmailNotValidError: EmailNotValidError;
  Error: ResolversInterfaceTypes<ResolversParentTypes>['Error'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  JSONObject: Scalars['JSONObject']['output'];
  LoginConfirmResponse: ResolversUnionTypes<ResolversParentTypes>['LoginConfirmResponse'];
  LoginConfirmSuccessfulResponse: LoginConfirmSuccessfulResponse;
  LoginConfirmWithEmailResponse: ResolversUnionTypes<ResolversParentTypes>['LoginConfirmWithEmailResponse'];
  LoginConfirmWithSmsResponse: ResolversUnionTypes<ResolversParentTypes>['LoginConfirmWithSmsResponse'];
  LoginFailedError: LoginFailedError;
  LoginRequestResponse: ResolversUnionTypes<ResolversParentTypes>['LoginRequestResponse'];
  LoginRequestSuccessResponse: LoginRequestSuccessResponse;
  LoginRequestWithEmailResponse: ResolversUnionTypes<ResolversParentTypes>['LoginRequestWithEmailResponse'];
  LoginRequestWithSmsResponse: ResolversUnionTypes<ResolversParentTypes>['LoginRequestWithSmsResponse'];
  Mutation: {};
  NewTokenResponse: ResolversUnionTypes<ResolversParentTypes>['NewTokenResponse'];
  NewTokenSuccessResponse: NewTokenSuccessResponse;
  PhoneNumNotValidError: PhoneNumNotValidError;
  Query: {};
  RefreshTokenInvalidError: RefreshTokenInvalidError;
  String: Scalars['String']['output'];
}>;

export type AuthDirectiveArgs = {
  includes?: Maybe<Scalars['JSONObject']['input']>;
  match?: Maybe<Scalars['JSONObject']['input']>;
  or?: Maybe<ReadonlyArray<AuthOr>>;
  skip?: Maybe<Scalars['Boolean']['input']>;
};

export type AuthDirectiveResolver<Result, Parent, ContextType = Zemble.GraphQLContext, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CodeNotValidErrorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['CodeNotValidError'] = ResolversParentTypes['CodeNotValidError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EmailNotValidErrorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['EmailNotValidError'] = ResolversParentTypes['EmailNotValidError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeNotValidError' | 'EmailNotValidError' | 'LoginFailedError' | 'PhoneNumNotValidError', ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
}>;

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type LoginConfirmResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginConfirmResponse'] = ResolversParentTypes['LoginConfirmResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeNotValidError' | 'EmailNotValidError' | 'LoginConfirmSuccessfulResponse' | 'LoginFailedError', ParentType, ContextType>;
}>;

export type LoginConfirmSuccessfulResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginConfirmSuccessfulResponse'] = ResolversParentTypes['LoginConfirmSuccessfulResponse']> = ResolversObject<{
  bearerToken?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginConfirmWithEmailResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginConfirmWithEmailResponse'] = ResolversParentTypes['LoginConfirmWithEmailResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeNotValidError' | 'EmailNotValidError' | 'LoginConfirmSuccessfulResponse' | 'LoginFailedError', ParentType, ContextType>;
}>;

export type LoginConfirmWithSmsResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginConfirmWithSmsResponse'] = ResolversParentTypes['LoginConfirmWithSmsResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeNotValidError' | 'LoginConfirmSuccessfulResponse' | 'LoginFailedError' | 'PhoneNumNotValidError', ParentType, ContextType>;
}>;

export type LoginFailedErrorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginFailedError'] = ResolversParentTypes['LoginFailedError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginRequestResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginRequestResponse'] = ResolversParentTypes['LoginRequestResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EmailNotValidError' | 'LoginRequestSuccessResponse', ParentType, ContextType>;
}>;

export type LoginRequestSuccessResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginRequestSuccessResponse'] = ResolversParentTypes['LoginRequestSuccessResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginRequestWithEmailResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginRequestWithEmailResponse'] = ResolversParentTypes['LoginRequestWithEmailResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EmailNotValidError' | 'LoginRequestSuccessResponse', ParentType, ContextType>;
}>;

export type LoginRequestWithSmsResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginRequestWithSmsResponse'] = ResolversParentTypes['LoginRequestWithSmsResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LoginRequestSuccessResponse' | 'PhoneNumNotValidError', ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  clear?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationClearArgs, 'prefix'>>;
  delete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteArgs, 'key' | 'prefix'>>;
  loginConfirm?: Resolver<ResolversTypes['LoginConfirmResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationLoginConfirmArgs, 'code' | 'email'>>;
  loginConfirmWithEmail?: Resolver<ResolversTypes['LoginConfirmWithEmailResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationLoginConfirmWithEmailArgs, 'code' | 'email'>>;
  loginConfirmWithSms?: Resolver<ResolversTypes['LoginConfirmWithSmsResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationLoginConfirmWithSmsArgs, 'code' | 'phoneNumberWithCountryCode'>>;
  loginRequest?: Resolver<ResolversTypes['LoginRequestResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationLoginRequestArgs, 'email'>>;
  loginRequestWithEmail?: Resolver<ResolversTypes['LoginRequestWithEmailResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationLoginRequestWithEmailArgs, 'email'>>;
  loginRequestWithSms?: Resolver<ResolversTypes['LoginRequestWithSmsResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationLoginRequestWithSmsArgs, 'phoneNumberWithCountryCode'>>;
  logout?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  logoutFromAllDevices?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['NewTokenResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationRefreshTokenArgs, 'bearerToken' | 'refreshToken'>>;
  set?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSetArgs, 'key' | 'prefix' | 'value'>>;
}>;

export type NewTokenResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['NewTokenResponse'] = ResolversParentTypes['NewTokenResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'NewTokenSuccessResponse' | 'RefreshTokenInvalidError', ParentType, ContextType>;
}>;

export type NewTokenSuccessResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['NewTokenSuccessResponse'] = ResolversParentTypes['NewTokenSuccessResponse']> = ResolversObject<{
  bearerToken?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PhoneNumNotValidErrorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['PhoneNumNotValidError'] = ResolversParentTypes['PhoneNumNotValidError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  entries?: Resolver<ReadonlyArray<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryEntriesArgs, 'prefix'>>;
  get?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryGetArgs, 'key' | 'prefix'>>;
  has?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryHasArgs, 'key' | 'prefix'>>;
  keys?: Resolver<ReadonlyArray<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryKeysArgs, 'prefix'>>;
  publicKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, Zemble.AuthContextWithToken<ContextType>>;
  readJWT?: Resolver<ResolversTypes['JSONObject'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<QueryReadJwtArgs, 'token'>>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<QuerySizeArgs, 'prefix'>>;
  validateJWT?: Resolver<ResolversTypes['Boolean'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<QueryValidateJwtArgs, 'token'>>;
  values?: Resolver<ReadonlyArray<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryValuesArgs, 'prefix'>>;
}>;

export type RefreshTokenInvalidErrorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['RefreshTokenInvalidError'] = ResolversParentTypes['RefreshTokenInvalidError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  CodeNotValidError?: CodeNotValidErrorResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  EmailNotValidError?: EmailNotValidErrorResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  LoginConfirmResponse?: LoginConfirmResponseResolvers<ContextType>;
  LoginConfirmSuccessfulResponse?: LoginConfirmSuccessfulResponseResolvers<ContextType>;
  LoginConfirmWithEmailResponse?: LoginConfirmWithEmailResponseResolvers<ContextType>;
  LoginConfirmWithSmsResponse?: LoginConfirmWithSmsResponseResolvers<ContextType>;
  LoginFailedError?: LoginFailedErrorResolvers<ContextType>;
  LoginRequestResponse?: LoginRequestResponseResolvers<ContextType>;
  LoginRequestSuccessResponse?: LoginRequestSuccessResponseResolvers<ContextType>;
  LoginRequestWithEmailResponse?: LoginRequestWithEmailResponseResolvers<ContextType>;
  LoginRequestWithSmsResponse?: LoginRequestWithSmsResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NewTokenResponse?: NewTokenResponseResolvers<ContextType>;
  NewTokenSuccessResponse?: NewTokenSuccessResponseResolvers<ContextType>;
  PhoneNumNotValidError?: PhoneNumNotValidErrorResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RefreshTokenInvalidError?: RefreshTokenInvalidErrorResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>;
}>;
