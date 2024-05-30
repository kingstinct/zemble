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

export type Error = {
  readonly message: Scalars['String']['output'];
};

export type LoginConfirmResponse = CodeNotValidError | LoginConfirmSuccessfulResponse | LoginFailedError | PhoneNumNotValidError;

export type LoginConfirmSuccessfulResponse = {
  readonly __typename?: 'LoginConfirmSuccessfulResponse';
  readonly bearerToken: Scalars['String']['output'];
  readonly refreshToken: Scalars['String']['output'];
};

export type LoginFailedError = Error & {
  readonly __typename?: 'LoginFailedError';
  readonly message: Scalars['String']['output'];
};

export type LoginRequestResponse = LoginRequestSuccessResponse | PhoneNumNotValidError;

export type LoginRequestSuccessResponse = {
  readonly __typename?: 'LoginRequestSuccessResponse';
  readonly success: Scalars['Boolean']['output'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly loginConfirm: LoginConfirmResponse;
  readonly loginRequest: LoginRequestResponse;
};


export type MutationLoginConfirmArgs = {
  code: Scalars['String']['input'];
  phoneNum: Scalars['String']['input'];
};


export type MutationLoginRequestArgs = {
  phoneNum: Scalars['String']['input'];
};

export type PhoneNumNotValidError = Error & {
  readonly __typename?: 'PhoneNumNotValidError';
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
  LoginConfirmResponse: ( CodeNotValidError ) | ( LoginConfirmSuccessfulResponse ) | ( LoginFailedError ) | ( PhoneNumNotValidError );
  LoginRequestResponse: ( LoginRequestSuccessResponse ) | ( PhoneNumNotValidError );
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Error: ( CodeNotValidError ) | ( LoginFailedError ) | ( PhoneNumNotValidError );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthOr: AuthOr;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CodeNotValidError: ResolverTypeWrapper<CodeNotValidError>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Error']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>;
  LoginConfirmResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginConfirmResponse']>;
  LoginConfirmSuccessfulResponse: ResolverTypeWrapper<LoginConfirmSuccessfulResponse>;
  LoginFailedError: ResolverTypeWrapper<LoginFailedError>;
  LoginRequestResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginRequestResponse']>;
  LoginRequestSuccessResponse: ResolverTypeWrapper<LoginRequestSuccessResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  PhoneNumNotValidError: ResolverTypeWrapper<PhoneNumNotValidError>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthOr: AuthOr;
  Boolean: Scalars['Boolean']['output'];
  CodeNotValidError: CodeNotValidError;
  Error: ResolversInterfaceTypes<ResolversParentTypes>['Error'];
  JSONObject: Scalars['JSONObject']['output'];
  LoginConfirmResponse: ResolversUnionTypes<ResolversParentTypes>['LoginConfirmResponse'];
  LoginConfirmSuccessfulResponse: LoginConfirmSuccessfulResponse;
  LoginFailedError: LoginFailedError;
  LoginRequestResponse: ResolversUnionTypes<ResolversParentTypes>['LoginRequestResponse'];
  LoginRequestSuccessResponse: LoginRequestSuccessResponse;
  Mutation: {};
  PhoneNumNotValidError: PhoneNumNotValidError;
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

export type ErrorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeNotValidError' | 'LoginFailedError' | 'PhoneNumNotValidError', ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
}>;

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type LoginConfirmResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginConfirmResponse'] = ResolversParentTypes['LoginConfirmResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeNotValidError' | 'LoginConfirmSuccessfulResponse' | 'LoginFailedError' | 'PhoneNumNotValidError', ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<'LoginRequestSuccessResponse' | 'PhoneNumNotValidError', ParentType, ContextType>;
}>;

export type LoginRequestSuccessResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['LoginRequestSuccessResponse'] = ResolversParentTypes['LoginRequestSuccessResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  loginConfirm?: Resolver<ResolversTypes['LoginConfirmResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationLoginConfirmArgs, 'code' | 'phoneNum'>>;
  loginRequest?: Resolver<ResolversTypes['LoginRequestResponse'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationLoginRequestArgs, 'phoneNum'>>;
}>;

export type PhoneNumNotValidErrorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['PhoneNumNotValidError'] = ResolversParentTypes['PhoneNumNotValidError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  CodeNotValidError?: CodeNotValidErrorResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  JSONObject?: GraphQLScalarType;
  LoginConfirmResponse?: LoginConfirmResponseResolvers<ContextType>;
  LoginConfirmSuccessfulResponse?: LoginConfirmSuccessfulResponseResolvers<ContextType>;
  LoginFailedError?: LoginFailedErrorResolvers<ContextType>;
  LoginRequestResponse?: LoginRequestResponseResolvers<ContextType>;
  LoginRequestSuccessResponse?: LoginRequestSuccessResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PhoneNumNotValidError?: PhoneNumNotValidErrorResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>;
}>;
