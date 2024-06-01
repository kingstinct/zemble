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

export type EmailLoginConfirmResponse = CodeNotValidError | EmailNotValidError | LoginConfirmSuccessfulResponse | LoginFailedError;

export type EmailLoginRequestResponse = EmailNotValidError | LoginRequestSuccessResponse;

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

export type LoginFailedError = Error & {
  readonly __typename?: 'LoginFailedError';
  readonly message: Scalars['String']['output'];
};

export type LoginRequestResponse = EmailNotValidError | LoginRequestSuccessResponse;

export type LoginRequestSuccessResponse = {
  readonly __typename?: 'LoginRequestSuccessResponse';
  readonly success: Scalars['Boolean']['output'];
};

export type LoginResponse = {
  readonly __typename?: 'LoginResponse';
  readonly token: Scalars['String']['output'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly clear: Scalars['Boolean']['output'];
  readonly delete: Scalars['Boolean']['output'];
  readonly emailLoginConfirm: EmailLoginConfirmResponse;
  readonly emailLoginRequest: EmailLoginRequestResponse;
  readonly loginConfirm: LoginConfirmResponse;
  readonly loginRequest: LoginRequestResponse;
  readonly logout: LoginRequestSuccessResponse;
  readonly set: Scalars['Boolean']['output'];
  readonly smsLoginConfirm: SmsLoginConfirmResponse;
  readonly smsLoginRequest: SmsLoginRequestResponse;
};


export type MutationClearArgs = {
  prefix: Scalars['String']['input'];
};


export type MutationDeleteArgs = {
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
};


export type MutationEmailLoginConfirmArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationEmailLoginRequestArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginConfirmArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationLoginRequestArgs = {
  email: Scalars['String']['input'];
};


export type MutationSetArgs = {
  expireAfterSeconds?: InputMaybe<Scalars['Int']['input']>;
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
  value: Scalars['JSON']['input'];
};


export type MutationSmsLoginConfirmArgs = {
  code: Scalars['String']['input'];
  phoneNum: Scalars['String']['input'];
};


export type MutationSmsLoginRequestArgs = {
  phoneNum: Scalars['String']['input'];
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
  readonly publicKey: Scalars['String']['output'];
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

export type SmsLoginConfirmResponse = CodeNotValidError | LoginConfirmSuccessfulResponse | LoginFailedError | PhoneNumNotValidError;

export type SmsLoginRequestResponse = LoginRequestSuccessResponse | PhoneNumNotValidError;

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
  EmailLoginConfirmResponse: ( CodeNotValidError ) | ( EmailNotValidError ) | ( LoginConfirmSuccessfulResponse ) | ( LoginFailedError );
  EmailLoginRequestResponse: ( EmailNotValidError ) | ( LoginRequestSuccessResponse );
  LoginConfirmResponse: ( CodeNotValidError ) | ( EmailNotValidError ) | ( LoginConfirmSuccessfulResponse ) | ( LoginFailedError );
  LoginRequestResponse: ( EmailNotValidError ) | ( LoginRequestSuccessResponse );
  SmsLoginConfirmResponse: ( CodeNotValidError ) | ( LoginConfirmSuccessfulResponse ) | ( LoginFailedError ) | ( PhoneNumNotValidError );
  SmsLoginRequestResponse: ( LoginRequestSuccessResponse ) | ( PhoneNumNotValidError );
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
  EmailLoginConfirmResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['EmailLoginConfirmResponse']>;
  EmailLoginRequestResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['EmailLoginRequestResponse']>;
  EmailNotValidError: ResolverTypeWrapper<EmailNotValidError>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Error']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>;
  LoginConfirmResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginConfirmResponse']>;
  LoginConfirmSuccessfulResponse: ResolverTypeWrapper<LoginConfirmSuccessfulResponse>;
  LoginFailedError: ResolverTypeWrapper<LoginFailedError>;
  LoginRequestResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginRequestResponse']>;
  LoginRequestSuccessResponse: ResolverTypeWrapper<LoginRequestSuccessResponse>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  PhoneNumNotValidError: ResolverTypeWrapper<PhoneNumNotValidError>;
  Query: ResolverTypeWrapper<{}>;
  SmsLoginConfirmResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SmsLoginConfirmResponse']>;
  SmsLoginRequestResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SmsLoginRequestResponse']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthOr: AuthOr;
  Boolean: Scalars['Boolean']['output'];
  CodeNotValidError: CodeNotValidError;
  EmailLoginConfirmResponse: ResolversUnionTypes<ResolversParentTypes>['EmailLoginConfirmResponse'];
  EmailLoginRequestResponse: ResolversUnionTypes<ResolversParentTypes>['EmailLoginRequestResponse'];
  EmailNotValidError: EmailNotValidError;
  Error: ResolversInterfaceTypes<ResolversParentTypes>['Error'];
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  JSONObject: Scalars['JSONObject']['output'];
  LoginConfirmResponse: ResolversUnionTypes<ResolversParentTypes>['LoginConfirmResponse'];
  LoginConfirmSuccessfulResponse: LoginConfirmSuccessfulResponse;
  LoginFailedError: LoginFailedError;
  LoginRequestResponse: ResolversUnionTypes<ResolversParentTypes>['LoginRequestResponse'];
  LoginRequestSuccessResponse: LoginRequestSuccessResponse;
  LoginResponse: LoginResponse;
  Mutation: {};
  PhoneNumNotValidError: PhoneNumNotValidError;
  Query: {};
  SmsLoginConfirmResponse: ResolversUnionTypes<ResolversParentTypes>['SmsLoginConfirmResponse'];
  SmsLoginRequestResponse: ResolversUnionTypes<ResolversParentTypes>['SmsLoginRequestResponse'];
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

export type EmailLoginConfirmResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['EmailLoginConfirmResponse'] = ResolversParentTypes['EmailLoginConfirmResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeNotValidError' | 'EmailNotValidError' | 'LoginConfirmSuccessfulResponse' | 'LoginFailedError', ParentType, ContextType>;
}>;

export type EmailLoginRequestResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['EmailLoginRequestResponse'] = ResolversParentTypes['EmailLoginRequestResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EmailNotValidError' | 'LoginRequestSuccessResponse', ParentType, ContextType>;
}>;

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

export type LoginResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  clear?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationClearArgs, 'prefix'>>;
  delete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteArgs, 'key' | 'prefix'>>;
  emailLoginConfirm?: Resolver<ResolversTypes['EmailLoginConfirmResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationEmailLoginConfirmArgs, 'code' | 'email'>>;
  emailLoginRequest?: Resolver<ResolversTypes['EmailLoginRequestResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationEmailLoginRequestArgs, 'email'>>;
  loginConfirm?: Resolver<ResolversTypes['LoginConfirmResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationLoginConfirmArgs, 'code' | 'email'>>;
  loginRequest?: Resolver<ResolversTypes['LoginRequestResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationLoginRequestArgs, 'email'>>;
  logout?: Resolver<ResolversTypes['LoginRequestSuccessResponse'], ParentType, ContextType>;
  set?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSetArgs, 'key' | 'prefix' | 'value'>>;
  smsLoginConfirm?: Resolver<ResolversTypes['SmsLoginConfirmResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationSmsLoginConfirmArgs, 'code' | 'phoneNum'>>;
  smsLoginRequest?: Resolver<ResolversTypes['SmsLoginRequestResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationSmsLoginRequestArgs, 'phoneNum'>>;
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
  publicKey?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  readJWT?: Resolver<ResolversTypes['JSONObject'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<QueryReadJwtArgs, 'token'>>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<QuerySizeArgs, 'prefix'>>;
  validateJWT?: Resolver<ResolversTypes['Boolean'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<QueryValidateJwtArgs, 'token'>>;
  values?: Resolver<ReadonlyArray<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryValuesArgs, 'prefix'>>;
}>;

export type SmsLoginConfirmResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['SmsLoginConfirmResponse'] = ResolversParentTypes['SmsLoginConfirmResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeNotValidError' | 'LoginConfirmSuccessfulResponse' | 'LoginFailedError' | 'PhoneNumNotValidError', ParentType, ContextType>;
}>;

export type SmsLoginRequestResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['SmsLoginRequestResponse'] = ResolversParentTypes['SmsLoginRequestResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LoginRequestSuccessResponse' | 'PhoneNumNotValidError', ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  CodeNotValidError?: CodeNotValidErrorResolvers<ContextType>;
  EmailLoginConfirmResponse?: EmailLoginConfirmResponseResolvers<ContextType>;
  EmailLoginRequestResponse?: EmailLoginRequestResponseResolvers<ContextType>;
  EmailNotValidError?: EmailNotValidErrorResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  LoginConfirmResponse?: LoginConfirmResponseResolvers<ContextType>;
  LoginConfirmSuccessfulResponse?: LoginConfirmSuccessfulResponseResolvers<ContextType>;
  LoginFailedError?: LoginFailedErrorResolvers<ContextType>;
  LoginRequestResponse?: LoginRequestResponseResolvers<ContextType>;
  LoginRequestSuccessResponse?: LoginRequestSuccessResponseResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PhoneNumNotValidError?: PhoneNumNotValidErrorResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SmsLoginConfirmResponse?: SmsLoginConfirmResponseResolvers<ContextType>;
  SmsLoginRequestResponse?: SmsLoginRequestResponseResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>;
}>;
