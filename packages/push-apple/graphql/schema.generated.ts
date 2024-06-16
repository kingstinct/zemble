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
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
};

export enum ApplePushPlatform {
  Ios = 'ios',
  Ipados = 'ipados',
  Macos = 'macos',
  Watchos = 'watchos'
}

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly registerApplePushToken: Scalars['Boolean']['output'];
  readonly registerAppleStartLiveActivityPushToken: Scalars['Boolean']['output'];
  readonly registerAppleUpdateLiveActivityPushToken: Scalars['Boolean']['output'];
  readonly sendPushNotification: Scalars['Boolean']['output'];
  readonly sendSilentPushNotification: Scalars['Boolean']['output'];
  readonly startLiveActivity: StartLiveActivityResponse;
  readonly updateLiveActivity: Scalars['Boolean']['output'];
};


export type MutationRegisterApplePushTokenArgs = {
  appBundleId: Scalars['String']['input'];
  isSandbox?: InputMaybe<Scalars['Boolean']['input']>;
  platform: ApplePushPlatform;
  token: Scalars['String']['input'];
};


export type MutationRegisterAppleStartLiveActivityPushTokenArgs = {
  appBundleId: Scalars['String']['input'];
  isSandbox?: InputMaybe<Scalars['Boolean']['input']>;
  token: Scalars['String']['input'];
};


export type MutationRegisterAppleUpdateLiveActivityPushTokenArgs = {
  appBundleId: Scalars['String']['input'];
  isSandbox?: InputMaybe<Scalars['Boolean']['input']>;
  liveActivityType: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationSendPushNotificationArgs = {
  body: Scalars['String']['input'];
  pushToken: Scalars['String']['input'];
  subtitle?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSendSilentPushNotificationArgs = {
  data: Scalars['JSONObject']['input'];
  pushToken: Scalars['String']['input'];
};


export type MutationStartLiveActivityArgs = {
  data: Scalars['JSONObject']['input'];
  liveActivityType: Scalars['String']['input'];
  pushToken: Scalars['String']['input'];
};


export type MutationUpdateLiveActivityArgs = {
  data: Scalars['JSONObject']['input'];
  liveActivityAttributes: Scalars['JSONObject']['input'];
  pushToken: Scalars['String']['input'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly hello: Scalars['String']['output'];
};

export type StartLiveActivityResponse = {
  readonly __typename?: 'StartLiveActivityResponse';
  readonly liveActivityId: Scalars['ID']['output'];
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
  ApplePushPlatform: ApplePushPlatform;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  StartLiveActivityResponse: ResolverTypeWrapper<StartLiveActivityResponse>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  ID: Scalars['ID']['output'];
  JSONObject: Scalars['JSONObject']['output'];
  Mutation: {};
  Query: {};
  StartLiveActivityResponse: StartLiveActivityResponse;
  String: Scalars['String']['output'];
}>;

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  registerApplePushToken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRegisterApplePushTokenArgs, 'appBundleId' | 'platform' | 'token'>>;
  registerAppleStartLiveActivityPushToken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRegisterAppleStartLiveActivityPushTokenArgs, 'appBundleId' | 'token'>>;
  registerAppleUpdateLiveActivityPushToken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRegisterAppleUpdateLiveActivityPushTokenArgs, 'appBundleId' | 'liveActivityAttributes' | 'liveActivityType' | 'token'>>;
  sendPushNotification?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendPushNotificationArgs, 'body' | 'pushToken'>>;
  sendSilentPushNotification?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendSilentPushNotificationArgs, 'data' | 'pushToken'>>;
  startLiveActivity?: Resolver<ResolversTypes['StartLiveActivityResponse'], ParentType, ContextType, RequireFields<MutationStartLiveActivityArgs, 'data' | 'liveActivityType' | 'pushToken'>>;
  updateLiveActivity?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateLiveActivityArgs, 'data' | 'liveActivityAttributes' | 'pushToken'>>;
}>;

export type QueryResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  hello?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type StartLiveActivityResponseResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['StartLiveActivityResponse'] = ResolversParentTypes['StartLiveActivityResponse']> = ResolversObject<{
  liveActivityId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  JSONObject?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  StartLiveActivityResponse?: StartLiveActivityResponseResolvers<ContextType>;
}>;

