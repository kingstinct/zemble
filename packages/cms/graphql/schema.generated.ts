// @ts-nocheck
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { EntitySchemaType } from '../types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
};

export type ArrayField = Field & {
  readonly __typename?: 'ArrayField';
  readonly availableFields: ReadonlyArray<Field>;
  readonly isRequired: Scalars['Boolean']['output'];
  readonly isRequiredInput: Scalars['Boolean']['output'];
  readonly maxItems?: Maybe<Scalars['Int']['output']>;
  readonly minItems?: Maybe<Scalars['Int']['output']>;
  readonly name: Scalars['String']['output'];
};

export type ArrayFieldInput = {
  readonly availableFields: ReadonlyArray<FieldInputWithoutArray>;
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>;
  readonly maxItems?: InputMaybe<Scalars['Int']['input']>;
  readonly minItems?: InputMaybe<Scalars['Int']['input']>;
  readonly name: Scalars['String']['input'];
};

export type AuthOr = {
  readonly includes?: InputMaybe<Scalars['JSONObject']['input']>;
  readonly match?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type BooleanField = Field & {
  readonly __typename?: 'BooleanField';
  readonly defaultValue?: Maybe<Scalars['Boolean']['output']>;
  readonly isRequired: Scalars['Boolean']['output'];
  readonly isRequiredInput: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
};

export type BooleanFieldInput = {
  readonly defaultValue?: InputMaybe<Scalars['Boolean']['input']>;
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>;
  readonly name: Scalars['String']['input'];
};

export type Entity = {
  readonly __typename?: 'Entity';
  readonly fields: ReadonlyArray<Field>;
  readonly isPublishable: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
  readonly permissions?: Maybe<ReadonlyArray<EntityPermission>>;
  readonly pluralizedName: Scalars['String']['output'];
};

export type EntityInput = {
  readonly name: Scalars['String']['input'];
};

export type EntityPermission = {
  readonly __typename?: 'EntityPermission';
  readonly create: Scalars['Boolean']['output'];
  readonly delete: Scalars['Boolean']['output'];
  readonly granular: Scalars['Boolean']['output'];
  readonly modify: Scalars['Boolean']['output'];
  readonly publish: Scalars['Boolean']['output'];
  readonly read: Scalars['Boolean']['output'];
  readonly type?: Maybe<Scalars['String']['output']>;
  readonly unpublish: Scalars['Boolean']['output'];
};

export type EntityRelationField = Field & {
  readonly __typename?: 'EntityRelationField';
  readonly entity: Entity;
  readonly entityName: Scalars['String']['output'];
  readonly isRequired: Scalars['Boolean']['output'];
  readonly isRequiredInput: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
};

export type EntityRelationFieldInput = {
  readonly entityName: Scalars['String']['input'];
  readonly isRequired: Scalars['Boolean']['input'];
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>;
  readonly name: Scalars['String']['input'];
};

export type Field = {
  readonly isRequired: Scalars['Boolean']['output'];
  readonly isRequiredInput: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
};

export type FieldInput =
  { readonly ArrayField: ArrayFieldInput; readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField?: never; }
  |  { readonly ArrayField?: never; readonly BooleanField: BooleanFieldInput; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField?: never; }
  |  { readonly ArrayField?: never; readonly BooleanField?: never; readonly EntityRelationField: EntityRelationFieldInput; readonly NumberField?: never; readonly StringField?: never; }
  |  { readonly ArrayField?: never; readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField: NumberFieldInput; readonly StringField?: never; }
  |  { readonly ArrayField?: never; readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField: StringFieldInput; };

export type FieldInputWithoutArray =
  { readonly BooleanField: BooleanFieldInput; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField?: never; }
  |  { readonly BooleanField?: never; readonly EntityRelationField: EntityRelationFieldInput; readonly NumberField?: never; readonly StringField?: never; }
  |  { readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField: NumberFieldInput; readonly StringField?: never; }
  |  { readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField: StringFieldInput; };

export type IdField = Field & {
  readonly __typename?: 'IDField';
  readonly isRequired: Scalars['Boolean']['output'];
  readonly isRequiredInput: Scalars['Boolean']['output'];
  readonly name: Scalars['String']['output'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly addFieldsToEntity: Entity;
  readonly createEntity: Entity;
  readonly removeEntity: Scalars['Boolean']['output'];
  readonly removeFieldsFromEntity: Entity;
  readonly renameEntity: Entity;
};


export type MutationAddFieldsToEntityArgs = {
  entityName: Scalars['String']['input'];
  fields: ReadonlyArray<FieldInput>;
};


export type MutationCreateEntityArgs = {
  isPublishable?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  pluralizedName: Scalars['String']['input'];
};


export type MutationRemoveEntityArgs = {
  name: Scalars['String']['input'];
};


export type MutationRemoveFieldsFromEntityArgs = {
  entityName: Scalars['String']['input'];
  fields: ReadonlyArray<Scalars['String']['input']>;
};


export type MutationRenameEntityArgs = {
  fromName: Scalars['String']['input'];
  pluralizedName: Scalars['String']['input'];
  toName: Scalars['String']['input'];
};

export type NumberField = Field & {
  readonly __typename?: 'NumberField';
  readonly defaultValue?: Maybe<Scalars['Float']['output']>;
  readonly isRequired: Scalars['Boolean']['output'];
  readonly isRequiredInput: Scalars['Boolean']['output'];
  readonly max?: Maybe<Scalars['Float']['output']>;
  readonly min?: Maybe<Scalars['Float']['output']>;
  readonly name: Scalars['String']['output'];
};

export type NumberFieldInput = {
  readonly defaultValue?: InputMaybe<Scalars['Float']['input']>;
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>;
  readonly max?: InputMaybe<Scalars['Float']['input']>;
  readonly min?: InputMaybe<Scalars['Float']['input']>;
  readonly name: Scalars['String']['input'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly getAllEntities: ReadonlyArray<Entity>;
  readonly getEntityByName?: Maybe<Entity>;
  readonly getEntityByPluralizedName?: Maybe<Entity>;
};


export type QueryGetEntityByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetEntityByPluralizedNameArgs = {
  pluralizedName: Scalars['String']['input'];
};

export type StringField = Field & {
  readonly __typename?: 'StringField';
  readonly defaultValue?: Maybe<Scalars['String']['output']>;
  readonly isRequired: Scalars['Boolean']['output'];
  readonly isRequiredInput: Scalars['Boolean']['output'];
  readonly isSearchable: Scalars['Boolean']['output'];
  readonly maxLength?: Maybe<Scalars['Int']['output']>;
  readonly minLength?: Maybe<Scalars['Int']['output']>;
  readonly name: Scalars['String']['output'];
};

export type StringFieldInput = {
  readonly defaultValue?: InputMaybe<Scalars['String']['input']>;
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>;
  readonly isSearchable?: InputMaybe<Scalars['Boolean']['input']>;
  readonly maxLength?: InputMaybe<Scalars['Int']['input']>;
  readonly minLength?: InputMaybe<Scalars['Int']['input']>;
  readonly name: Scalars['String']['input'];
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


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Field: ( ArrayField ) | ( BooleanField ) | ( Omit<EntityRelationField, 'entity'> & { entity: RefType['Entity'] } ) | ( IdField ) | ( NumberField ) | ( StringField );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  ArrayField: ResolverTypeWrapper<ArrayField>;
  ArrayFieldInput: ArrayFieldInput;
  AuthOr: AuthOr;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BooleanField: ResolverTypeWrapper<BooleanField>;
  BooleanFieldInput: BooleanFieldInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Entity: ResolverTypeWrapper<EntitySchemaType>;
  EntityInput: EntityInput;
  EntityPermission: ResolverTypeWrapper<EntityPermission>;
  EntityRelationField: ResolverTypeWrapper<Omit<EntityRelationField, 'entity'> & { entity: ResolversTypes['Entity'] }>;
  EntityRelationFieldInput: EntityRelationFieldInput;
  Field: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Field']>;
  FieldInput: FieldInput;
  FieldInputWithoutArray: FieldInputWithoutArray;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  IDField: ResolverTypeWrapper<IdField>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  NumberField: ResolverTypeWrapper<NumberField>;
  NumberFieldInput: NumberFieldInput;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  StringField: ResolverTypeWrapper<StringField>;
  StringFieldInput: StringFieldInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  ArrayField: ArrayField;
  ArrayFieldInput: ArrayFieldInput;
  AuthOr: AuthOr;
  Boolean: Scalars['Boolean']['output'];
  BooleanField: BooleanField;
  BooleanFieldInput: BooleanFieldInput;
  Date: Scalars['Date']['output'];
  DateTime: Scalars['DateTime']['output'];
  Entity: EntitySchemaType;
  EntityInput: EntityInput;
  EntityPermission: EntityPermission;
  EntityRelationField: Omit<EntityRelationField, 'entity'> & { entity: ResolversParentTypes['Entity'] };
  EntityRelationFieldInput: EntityRelationFieldInput;
  Field: ResolversInterfaceTypes<ResolversParentTypes>['Field'];
  FieldInput: FieldInput;
  FieldInputWithoutArray: FieldInputWithoutArray;
  Float: Scalars['Float']['output'];
  IDField: IdField;
  Int: Scalars['Int']['output'];
  JSONObject: Scalars['JSONObject']['output'];
  Mutation: {};
  NumberField: NumberField;
  NumberFieldInput: NumberFieldInput;
  Query: {};
  String: Scalars['String']['output'];
  StringField: StringField;
  StringFieldInput: StringFieldInput;
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

export type ArrayFieldResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['ArrayField'] = ResolversParentTypes['ArrayField']> = ResolversObject<{
  availableFields?: Resolver<ReadonlyArray<ResolversTypes['Field']>, ParentType, ContextType>;
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  maxItems?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  minItems?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BooleanFieldResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['BooleanField'] = ResolversParentTypes['BooleanField']> = ResolversObject<{
  defaultValue?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EntityResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = ResolversObject<{
  fields?: Resolver<ReadonlyArray<ResolversTypes['Field']>, ParentType, ContextType>;
  isPublishable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<Maybe<ReadonlyArray<ResolversTypes['EntityPermission']>>, ParentType, ContextType>;
  pluralizedName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EntityPermissionResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['EntityPermission'] = ResolversParentTypes['EntityPermission']> = ResolversObject<{
  create?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  delete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  granular?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  modify?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  publish?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unpublish?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EntityRelationFieldResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['EntityRelationField'] = ResolversParentTypes['EntityRelationField']> = ResolversObject<{
  entity?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  entityName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FieldResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Field'] = ResolversParentTypes['Field']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ArrayField' | 'BooleanField' | 'EntityRelationField' | 'IDField' | 'NumberField' | 'StringField', ParentType, ContextType>;
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type IdFieldResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['IDField'] = ResolversParentTypes['IDField']> = ResolversObject<{
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type MutationResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addFieldsToEntity?: Resolver<ResolversTypes['Entity'], ParentType, Readapt.AuthContextWithToken<ContextType>, RequireFields<MutationAddFieldsToEntityArgs, 'entityName' | 'fields'>>;
  createEntity?: Resolver<ResolversTypes['Entity'], ParentType, Readapt.AuthContextWithToken<ContextType>, RequireFields<MutationCreateEntityArgs, 'name' | 'pluralizedName'>>;
  removeEntity?: Resolver<ResolversTypes['Boolean'], ParentType, Readapt.AuthContextWithToken<ContextType>, RequireFields<MutationRemoveEntityArgs, 'name'>>;
  removeFieldsFromEntity?: Resolver<ResolversTypes['Entity'], ParentType, Readapt.AuthContextWithToken<ContextType>, RequireFields<MutationRemoveFieldsFromEntityArgs, 'entityName' | 'fields'>>;
  renameEntity?: Resolver<ResolversTypes['Entity'], ParentType, Readapt.AuthContextWithToken<ContextType>, RequireFields<MutationRenameEntityArgs, 'fromName' | 'pluralizedName' | 'toName'>>;
}>;

export type NumberFieldResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['NumberField'] = ResolversParentTypes['NumberField']> = ResolversObject<{
  defaultValue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getAllEntities?: Resolver<ReadonlyArray<ResolversTypes['Entity']>, ParentType, ContextType>;
  getEntityByName?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<QueryGetEntityByNameArgs, 'name'>>;
  getEntityByPluralizedName?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<QueryGetEntityByPluralizedNameArgs, 'pluralizedName'>>;
}>;

export type StringFieldResolvers<ContextType = Readapt.GraphQLContext, ParentType extends ResolversParentTypes['StringField'] = ResolversParentTypes['StringField']> = ResolversObject<{
  defaultValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isSearchable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  maxLength?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  minLength?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Readapt.GraphQLContext> = ResolversObject<{
  ArrayField?: ArrayFieldResolvers<ContextType>;
  BooleanField?: BooleanFieldResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Entity?: EntityResolvers<ContextType>;
  EntityPermission?: EntityPermissionResolvers<ContextType>;
  EntityRelationField?: EntityRelationFieldResolvers<ContextType>;
  Field?: FieldResolvers<ContextType>;
  IDField?: IdFieldResolvers<ContextType>;
  JSONObject?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  NumberField?: NumberFieldResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  StringField?: StringFieldResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = Readapt.GraphQLContext> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>;
  oneOf?: OneOfDirectiveResolver<any, any, ContextType>;
}>;
