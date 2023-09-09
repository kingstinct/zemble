import { GraphQLResolveInfo } from 'graphql';
import { TokenContents } from '@readapt/core/types';
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
  readonly accessToken: Scalars['String']['output'];
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
  readonly loginConfirm: LoginConfirmResponse;
  readonly loginRequest: LoginRequestResponse;
};


export type MutationLoginConfirmArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationLoginRequestArgs = {
  email: Scalars['String']['input'];
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
  LoginRequestResponse: ( EmailNotValidError ) | ( LoginRequestSuccessResponse );
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Error: ( CodeNotValidError ) | ( EmailNotValidError ) | ( LoginFailedError );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CodeNotValidError: ResolverTypeWrapper<CodeNotValidError>;
  EmailNotValidError: ResolverTypeWrapper<EmailNotValidError>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Error']>;
  LoginConfirmResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginConfirmResponse']>;
  LoginConfirmSuccessfulResponse: ResolverTypeWrapper<LoginConfirmSuccessfulResponse>;
  LoginFailedError: ResolverTypeWrapper<LoginFailedError>;
  LoginRequestResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginRequestResponse']>;
  LoginRequestSuccessResponse: ResolverTypeWrapper<LoginRequestSuccessResponse>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CodeNotValidError: CodeNotValidError;
  EmailNotValidError: EmailNotValidError;
  Error: ResolversInterfaceTypes<ResolversParentTypes>['Error'];
  LoginConfirmResponse: ResolversUnionTypes<ResolversParentTypes>['LoginConfirmResponse'];
  LoginConfirmSuccessfulResponse: LoginConfirmSuccessfulResponse;
  LoginFailedError: LoginFailedError;
  LoginRequestResponse: ResolversUnionTypes<ResolversParentTypes>['LoginRequestResponse'];
  LoginRequestSuccessResponse: LoginRequestSuccessResponse;
  LoginResponse: LoginResponse;
  Mutation: {};
  String: Scalars['String']['output'];
}>;

export type SkipAuthDirectiveArgs = { };

export type SkipAuthDirectiveResolver<Result, Parent, ContextType = Readapt.GraphQLContext, Args = SkipAuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CodeNotValidErrorResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['CodeNotValidError'] = ResolversParentTypes['CodeNotValidError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, Readapt.NoAuth<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailNotValidErrorResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['EmailNotValidError'] = ResolversParentTypes['EmailNotValidError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, Readapt.NoAuth<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeNotValidError' | 'EmailNotValidError' | 'LoginFailedError', ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, Readapt.NoAuth<ContextType>>;
}>;

export type LoginConfirmResponseResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['LoginConfirmResponse'] = ResolversParentTypes['LoginConfirmResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CodeNotValidError' | 'EmailNotValidError' | 'LoginConfirmSuccessfulResponse' | 'LoginFailedError', ParentType, ContextType>;
}>;

export type LoginConfirmSuccessfulResponseResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['LoginConfirmSuccessfulResponse'] = ResolversParentTypes['LoginConfirmSuccessfulResponse']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, Readapt.NoAuth<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginFailedErrorResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['LoginFailedError'] = ResolversParentTypes['LoginFailedError']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, Readapt.NoAuth<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginRequestResponseResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['LoginRequestResponse'] = ResolversParentTypes['LoginRequestResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EmailNotValidError' | 'LoginRequestSuccessResponse', ParentType, ContextType>;
}>;

export type LoginRequestSuccessResponseResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['LoginRequestSuccessResponse'] = ResolversParentTypes['LoginRequestSuccessResponse']> = ResolversObject<{
  success?: Resolver<ResolversTypes['Boolean'], ParentType, Readapt.NoAuth<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginResponseResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, Readapt.NoAuth<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  loginConfirm?: Resolver<ResolversTypes['LoginConfirmResponse'], ParentType, Readapt.NoAuth<ContextType>, RequireFields<MutationLoginConfirmArgs, 'code' | 'email'>>;
  loginRequest?: Resolver<ResolversTypes['LoginRequestResponse'], ParentType, Readapt.NoAuth<ContextType>, RequireFields<MutationLoginRequestArgs, 'email'>>;
}>;

export type Resolvers<ContextType = Readapt.GraphQLContext> = ResolversObject<{
  CodeNotValidError?: CodeNotValidErrorResolvers<ContextType>;
  EmailNotValidError?: EmailNotValidErrorResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  LoginConfirmResponse?: LoginConfirmResponseResolvers<ContextType>;
  LoginConfirmSuccessfulResponse?: LoginConfirmSuccessfulResponseResolvers<ContextType>;
  LoginFailedError?: LoginFailedErrorResolvers<ContextType>;
  LoginRequestResponse?: LoginRequestResponseResolvers<ContextType>;
  LoginRequestSuccessResponse?: LoginRequestSuccessResponseResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Readapt.GraphQLContext> = ResolversObject<{
  skipAuth?: SkipAuthDirectiveResolver<any, any, ContextType>;
}>;
