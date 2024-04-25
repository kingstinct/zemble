// @ts-nocheck
import '@zemble/core'
import type { GraphQLResolveInfo } from 'graphql';
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
};

export type AuthResponse = {
  readonly __typename?: 'AuthResponse';
  readonly bearerToken: Scalars['String']['output'];
  readonly refreshToken: Scalars['String']['output'];
};

export type FirebaseUser = {
  readonly __typename?: 'FirebaseUser';
  readonly disabled: Scalars['Boolean']['output'];
  readonly displayName?: Maybe<Scalars['String']['output']>;
  readonly email?: Maybe<Scalars['String']['output']>;
  readonly emailVerified: Scalars['Boolean']['output'];
  readonly phoneNumber?: Maybe<Scalars['String']['output']>;
  readonly photoURL?: Maybe<Scalars['String']['output']>;
  readonly uid: Scalars['ID']['output'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly createUserWithEmailAndPassword: AuthResponse;
  readonly signInWithEmailAndPassword: AuthResponse;
};


export type MutationCreateUserWithEmailAndPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignInWithEmailAndPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly firebaseListUsers: ReadonlyArray<FirebaseUser>;
  readonly firebaseUserById?: Maybe<FirebaseUser>;
};


export type QueryFirebaseListUsersArgs = {
  maxResults?: InputMaybe<Scalars['Int']['input']>;
  pageToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFirebaseUserByIdArgs = {
  uid: Scalars['ID']['input'];
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
  AuthResponse: ResolverTypeWrapper<AuthResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  FirebaseUser: ResolverTypeWrapper<FirebaseUser>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthResponse: AuthResponse;
  Boolean: Scalars['Boolean']['output'];
  FirebaseUser: FirebaseUser;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
}>;

export type AuthResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = ResolversObject<{
  bearerToken?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, Zemble.AuthContextWithToken<ContextType>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FirebaseUserResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['FirebaseUser'] = ResolversParentTypes['FirebaseUser']> = ResolversObject<{
  disabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  emailVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  photoURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uid?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createUserWithEmailAndPassword?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationCreateUserWithEmailAndPasswordArgs, 'email' | 'password'>>;
  signInWithEmailAndPassword?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignInWithEmailAndPasswordArgs, 'email' | 'password'>>;
}>;

export type QueryResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  firebaseListUsers?: Resolver<ReadonlyArray<ResolversTypes['FirebaseUser']>, ParentType, ContextType, Partial<QueryFirebaseListUsersArgs>>;
  firebaseUserById?: Resolver<Maybe<ResolversTypes['FirebaseUser']>, ParentType, ContextType, RequireFields<QueryFirebaseUserByIdArgs, 'uid'>>;
}>;

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  AuthResponse?: AuthResponseResolvers<ContextType>;
  FirebaseUser?: FirebaseUserResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

