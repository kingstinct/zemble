// @ts-nocheck
import '@zemble/core'
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
import type { EntitySchemaType } from '../types'
export type Maybe<T> = T | null | undefined
export type InputMaybe<T> = T | null | undefined
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Date: { input: any; output: any }
  DateTime: { input: any; output: any }
  JSONObject: { input: any; output: any }
}

export type ArrayField = Field & {
  readonly __typename?: 'ArrayField'
  readonly availableFields: ReadonlyArray<Field>
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly maxItems?: Maybe<Scalars['Int']['output']>
  readonly minItems?: Maybe<Scalars['Int']['output']>
  readonly name: Scalars['String']['output']
}

export type ArrayFieldInput = {
  readonly availableFields: ReadonlyArray<FieldInputWithoutArray>
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>
  readonly maxItems?: InputMaybe<Scalars['Int']['input']>
  readonly minItems?: InputMaybe<Scalars['Int']['input']>
  readonly name: Scalars['String']['input']
}

export type AuthOr = {
  readonly includes?: InputMaybe<Scalars['JSONObject']['input']>
  readonly match?: InputMaybe<Scalars['JSONObject']['input']>
}

export type Author = {
  readonly __typename?: 'Author'
  readonly displayName?: Maybe<Scalars['String']['output']>
  readonly firstName?: Maybe<Scalars['String']['output']>
  readonly id?: Maybe<Scalars['ID']['output']>
  readonly lastName?: Maybe<Scalars['String']['output']>
}

export type AuthorFirstNameFilter = {
  readonly eq?: InputMaybe<Scalars['String']['input']>
}

export type AuthorIdFilter = {
  readonly eq?: InputMaybe<Scalars['ID']['input']>
}

export type AuthorLastNameFilter = {
  readonly eq?: InputMaybe<Scalars['String']['input']>
}

export type AuthorsRelation = {
  readonly __typename?: 'AuthorsRelation'
  readonly displayName?: Maybe<Scalars['String']['output']>
  readonly firstName: Scalars['String']['output']
  readonly id: Scalars['ID']['output']
  readonly lastName: Scalars['String']['output']
}

export type Book = {
  readonly __typename?: 'Book'
  readonly contributors?: Maybe<ReadonlyArray<Maybe<BookContributorsUnion>>>
  readonly description?: Maybe<Scalars['String']['output']>
  readonly displayName?: Maybe<Scalars['String']['output']>
  readonly hasKindleVersion?: Maybe<Scalars['Boolean']['output']>
  readonly id?: Maybe<Scalars['ID']['output']>
  readonly title?: Maybe<Scalars['String']['output']>
  readonly yo?: Maybe<Scalars['String']['output']>
}

export type BookContributorsAuthor = {
  readonly __typename?: 'BookContributorsAuthor'
  readonly author?: Maybe<AuthorsRelation>
}

export type BookContributorsEditor = {
  readonly __typename?: 'BookContributorsEditor'
  readonly editor?: Maybe<AuthorsRelation>
}

export type BookContributorsInput = { readonly author: Scalars['ID']['input']; readonly editor?: never } | { readonly author?: never; readonly editor: Scalars['ID']['input'] }

export type BookContributorsUnion = BookContributorsAuthor | BookContributorsEditor

export type BookDescriptionFilter = {
  readonly eq?: InputMaybe<Scalars['String']['input']>
}

export type BookHasKindleVersionFilter = {
  readonly eq?: InputMaybe<Scalars['Boolean']['input']>
}

export type BookIdFilter = {
  readonly eq?: InputMaybe<Scalars['ID']['input']>
}

export type BookTitleFilter = {
  readonly eq?: InputMaybe<Scalars['String']['input']>
}

export type BookYoFilter = {
  readonly eq?: InputMaybe<Scalars['ID']['input']>
}

export type BooleanField = Field & {
  readonly __typename?: 'BooleanField'
  readonly defaultValue?: Maybe<Scalars['Boolean']['output']>
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly name: Scalars['String']['output']
}

export type BooleanFieldInput = {
  readonly defaultValue?: InputMaybe<Scalars['Boolean']['input']>
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>
  readonly name: Scalars['String']['input']
}

export type Entity = {
  readonly __typename?: 'Entity'
  readonly fields: ReadonlyArray<Field>
  readonly isPublishable: Scalars['Boolean']['output']
  readonly namePlural: Scalars['String']['output']
  readonly nameSingular: Scalars['String']['output']
  readonly permissions?: Maybe<ReadonlyArray<EntityPermission>>
}

export type EntityPermission = {
  readonly __typename?: 'EntityPermission'
  readonly create: Scalars['Boolean']['output']
  readonly delete: Scalars['Boolean']['output']
  readonly granular: Scalars['Boolean']['output']
  readonly modify: Scalars['Boolean']['output']
  readonly publish: Scalars['Boolean']['output']
  readonly read: Scalars['Boolean']['output']
  readonly type?: Maybe<Scalars['String']['output']>
  readonly unpublish: Scalars['Boolean']['output']
}

export type EntityRelationField = Field & {
  readonly __typename?: 'EntityRelationField'
  readonly entity: Entity
  readonly entityNamePlural: Scalars['String']['output']
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly name: Scalars['String']['output']
}

export type EntityRelationFieldInput = {
  readonly entityNamePlural: Scalars['String']['input']
  readonly isRequired: Scalars['Boolean']['input']
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>
  readonly name: Scalars['String']['input']
}

export type Field = {
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly name: Scalars['String']['output']
}

export type FieldInput =
  | { readonly ArrayField: ArrayFieldInput; readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField?: never }
  | { readonly ArrayField?: never; readonly BooleanField: BooleanFieldInput; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField?: never }
  | { readonly ArrayField?: never; readonly BooleanField?: never; readonly EntityRelationField: EntityRelationFieldInput; readonly NumberField?: never; readonly StringField?: never }
  | { readonly ArrayField?: never; readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField: NumberFieldInput; readonly StringField?: never }
  | { readonly ArrayField?: never; readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField: StringFieldInput }

export type FieldInputWithoutArray =
  | { readonly BooleanField: BooleanFieldInput; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField?: never }
  | { readonly BooleanField?: never; readonly EntityRelationField: EntityRelationFieldInput; readonly NumberField?: never; readonly StringField?: never }
  | { readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField: NumberFieldInput; readonly StringField?: never }
  | { readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField: StringFieldInput }

export type IdField = Field & {
  readonly __typename?: 'IDField'
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly name: Scalars['String']['output']
}

export type Mutation = {
  readonly __typename?: 'Mutation'
  readonly addFieldsToEntity: Entity
  readonly createAuthor?: Maybe<Author>
  readonly createBook?: Maybe<Book>
  readonly createEntity: Entity
  readonly deleteAuthor: Scalars['Boolean']['output']
  readonly deleteBook: Scalars['Boolean']['output']
  readonly removeEntity: Scalars['Boolean']['output']
  readonly removeFieldsFromEntity: Entity
  readonly renameEntity: Entity
}

export type MutationAddFieldsToEntityArgs = {
  fields: ReadonlyArray<FieldInput>
  namePlural: Scalars['String']['input']
}

export type MutationCreateAuthorArgs = {
  firstName?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['ID']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
}

export type MutationCreateBookArgs = {
  contributors?: InputMaybe<ReadonlyArray<InputMaybe<BookContributorsInput>>>
  description?: InputMaybe<Scalars['String']['input']>
  hasKindleVersion?: InputMaybe<Scalars['Boolean']['input']>
  id?: InputMaybe<Scalars['ID']['input']>
  title?: InputMaybe<Scalars['String']['input']>
  yo?: InputMaybe<Scalars['ID']['input']>
}

export type MutationCreateEntityArgs = {
  isPublishable?: InputMaybe<Scalars['Boolean']['input']>
  namePlural: Scalars['String']['input']
  nameSingular?: InputMaybe<Scalars['String']['input']>
}

export type MutationDeleteAuthorArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteBookArgs = {
  id: Scalars['ID']['input']
}

export type MutationRemoveEntityArgs = {
  namePlural: Scalars['String']['input']
}

export type MutationRemoveFieldsFromEntityArgs = {
  fields: ReadonlyArray<Scalars['String']['input']>
  namePlural: Scalars['String']['input']
}

export type MutationRenameEntityArgs = {
  fromNamePlural: Scalars['String']['input']
  toNamePlural: Scalars['String']['input']
  toNameSingular?: InputMaybe<Scalars['String']['input']>
}

export type NumberField = Field & {
  readonly __typename?: 'NumberField'
  readonly defaultValue?: Maybe<Scalars['Float']['output']>
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly max?: Maybe<Scalars['Float']['output']>
  readonly min?: Maybe<Scalars['Float']['output']>
  readonly name: Scalars['String']['output']
}

export type NumberFieldInput = {
  readonly defaultValue?: InputMaybe<Scalars['Float']['input']>
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>
  readonly max?: InputMaybe<Scalars['Float']['input']>
  readonly min?: InputMaybe<Scalars['Float']['input']>
  readonly name: Scalars['String']['input']
}

export type Query = {
  readonly __typename?: 'Query'
  readonly filterAuthors: ReadonlyArray<Author>
  readonly filterBooks: ReadonlyArray<Book>
  readonly getAllAuthors: ReadonlyArray<Author>
  readonly getAllBooks: ReadonlyArray<Book>
  readonly getAllEntities: ReadonlyArray<Entity>
  readonly getAuthorById: Author
  readonly getAuthorsById: ReadonlyArray<Author>
  readonly getBookById: Book
  readonly getBooksById: ReadonlyArray<Book>
  readonly getEntityByNamePlural?: Maybe<Entity>
  readonly getEntityByNameSingular?: Maybe<Entity>
  readonly searchAuthors: ReadonlyArray<Author>
  readonly searchBooks: ReadonlyArray<Book>
}

export type QueryFilterAuthorsArgs = {
  firstName?: InputMaybe<AuthorFirstNameFilter>
  id?: InputMaybe<AuthorIdFilter>
  lastName?: InputMaybe<AuthorLastNameFilter>
}

export type QueryFilterBooksArgs = {
  description?: InputMaybe<BookDescriptionFilter>
  hasKindleVersion?: InputMaybe<BookHasKindleVersionFilter>
  id?: InputMaybe<BookIdFilter>
  title?: InputMaybe<BookTitleFilter>
  yo?: InputMaybe<BookYoFilter>
}

export type QueryGetAuthorByIdArgs = {
  id: Scalars['ID']['input']
}

export type QueryGetAuthorsByIdArgs = {
  ids: ReadonlyArray<Scalars['ID']['input']>
}

export type QueryGetBookByIdArgs = {
  id: Scalars['ID']['input']
}

export type QueryGetBooksByIdArgs = {
  ids: ReadonlyArray<Scalars['ID']['input']>
}

export type QueryGetEntityByNamePluralArgs = {
  namePlural: Scalars['String']['input']
}

export type QueryGetEntityByNameSingularArgs = {
  name: Scalars['String']['input']
}

export type QuerySearchAuthorsArgs = {
  caseSensitive?: InputMaybe<Scalars['Boolean']['input']>
  diacriticSensitive?: InputMaybe<Scalars['Boolean']['input']>
  language?: InputMaybe<Scalars['String']['input']>
  query: Scalars['String']['input']
}

export type QuerySearchBooksArgs = {
  caseSensitive?: InputMaybe<Scalars['Boolean']['input']>
  diacriticSensitive?: InputMaybe<Scalars['Boolean']['input']>
  language?: InputMaybe<Scalars['String']['input']>
  query: Scalars['String']['input']
}

export type StringField = Field & {
  readonly __typename?: 'StringField'
  readonly defaultValue?: Maybe<Scalars['String']['output']>
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly isSearchable: Scalars['Boolean']['output']
  readonly maxLength?: Maybe<Scalars['Int']['output']>
  readonly minLength?: Maybe<Scalars['Int']['output']>
  readonly name: Scalars['String']['output']
}

export type StringFieldInput = {
  readonly defaultValue?: InputMaybe<Scalars['String']['input']>
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>
  readonly isSearchable?: InputMaybe<Scalars['Boolean']['input']>
  readonly maxLength?: InputMaybe<Scalars['Int']['input']>
  readonly minLength?: InputMaybe<Scalars['Int']['input']>
  readonly name: Scalars['String']['input']
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  BookContributorsUnion: BookContributorsAuthor | BookContributorsEditor
}>

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  Field:
    | (Omit<ArrayField, 'availableFields'> & { availableFields: ReadonlyArray<_RefType['Field']> })
    | BooleanField
    | (Omit<EntityRelationField, 'entity'> & { entity: _RefType['Entity'] })
    | IdField
    | NumberField
    | StringField
}>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  ArrayField: ResolverTypeWrapper<Omit<ArrayField, 'availableFields'> & { availableFields: ReadonlyArray<ResolversTypes['Field']> }>
  ArrayFieldInput: ArrayFieldInput
  AuthOr: AuthOr
  Author: ResolverTypeWrapper<Author>
  AuthorFirstNameFilter: AuthorFirstNameFilter
  AuthorIdFilter: AuthorIdFilter
  AuthorLastNameFilter: AuthorLastNameFilter
  AuthorsRelation: ResolverTypeWrapper<AuthorsRelation>
  Book: ResolverTypeWrapper<Omit<Book, 'contributors'> & { contributors?: Maybe<ReadonlyArray<Maybe<ResolversTypes['BookContributorsUnion']>>> }>
  BookContributorsAuthor: ResolverTypeWrapper<BookContributorsAuthor>
  BookContributorsEditor: ResolverTypeWrapper<BookContributorsEditor>
  BookContributorsInput: BookContributorsInput
  BookContributorsUnion: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['BookContributorsUnion']>
  BookDescriptionFilter: BookDescriptionFilter
  BookHasKindleVersionFilter: BookHasKindleVersionFilter
  BookIdFilter: BookIdFilter
  BookTitleFilter: BookTitleFilter
  BookYoFilter: BookYoFilter
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  BooleanField: ResolverTypeWrapper<BooleanField>
  BooleanFieldInput: BooleanFieldInput
  Date: ResolverTypeWrapper<Scalars['Date']['output']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>
  Entity: ResolverTypeWrapper<EntitySchemaType>
  EntityPermission: ResolverTypeWrapper<EntityPermission>
  EntityRelationField: ResolverTypeWrapper<Omit<EntityRelationField, 'entity'> & { entity: ResolversTypes['Entity'] }>
  EntityRelationFieldInput: EntityRelationFieldInput
  Field: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Field']>
  FieldInput: FieldInput
  FieldInputWithoutArray: FieldInputWithoutArray
  Float: ResolverTypeWrapper<Scalars['Float']['output']>
  ID: ResolverTypeWrapper<Scalars['ID']['output']>
  IDField: ResolverTypeWrapper<IdField>
  Int: ResolverTypeWrapper<Scalars['Int']['output']>
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>
  Mutation: ResolverTypeWrapper<{}>
  NumberField: ResolverTypeWrapper<NumberField>
  NumberFieldInput: NumberFieldInput
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']['output']>
  StringField: ResolverTypeWrapper<StringField>
  StringFieldInput: StringFieldInput
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  ArrayField: Omit<ArrayField, 'availableFields'> & { availableFields: ReadonlyArray<ResolversParentTypes['Field']> }
  ArrayFieldInput: ArrayFieldInput
  AuthOr: AuthOr
  Author: Author
  AuthorFirstNameFilter: AuthorFirstNameFilter
  AuthorIdFilter: AuthorIdFilter
  AuthorLastNameFilter: AuthorLastNameFilter
  AuthorsRelation: AuthorsRelation
  Book: Omit<Book, 'contributors'> & { contributors?: Maybe<ReadonlyArray<Maybe<ResolversParentTypes['BookContributorsUnion']>>> }
  BookContributorsAuthor: BookContributorsAuthor
  BookContributorsEditor: BookContributorsEditor
  BookContributorsInput: BookContributorsInput
  BookContributorsUnion: ResolversUnionTypes<ResolversParentTypes>['BookContributorsUnion']
  BookDescriptionFilter: BookDescriptionFilter
  BookHasKindleVersionFilter: BookHasKindleVersionFilter
  BookIdFilter: BookIdFilter
  BookTitleFilter: BookTitleFilter
  BookYoFilter: BookYoFilter
  Boolean: Scalars['Boolean']['output']
  BooleanField: BooleanField
  BooleanFieldInput: BooleanFieldInput
  Date: Scalars['Date']['output']
  DateTime: Scalars['DateTime']['output']
  Entity: EntitySchemaType
  EntityPermission: EntityPermission
  EntityRelationField: Omit<EntityRelationField, 'entity'> & { entity: ResolversParentTypes['Entity'] }
  EntityRelationFieldInput: EntityRelationFieldInput
  Field: ResolversInterfaceTypes<ResolversParentTypes>['Field']
  FieldInput: FieldInput
  FieldInputWithoutArray: FieldInputWithoutArray
  Float: Scalars['Float']['output']
  ID: Scalars['ID']['output']
  IDField: IdField
  Int: Scalars['Int']['output']
  JSONObject: Scalars['JSONObject']['output']
  Mutation: {}
  NumberField: NumberField
  NumberFieldInput: NumberFieldInput
  Query: {}
  String: Scalars['String']['output']
  StringField: StringField
  StringFieldInput: StringFieldInput
}>

export type AuthDirectiveArgs = {
  includes?: Maybe<Scalars['JSONObject']['input']>
  match?: Maybe<Scalars['JSONObject']['input']>
  or?: Maybe<ReadonlyArray<AuthOr>>
  skip?: Maybe<Scalars['Boolean']['input']>
}

export type AuthDirectiveResolver<Result, Parent, ContextType = Zemble.GraphQLContext, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type ArrayFieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['ArrayField'] = ResolversParentTypes['ArrayField']> = ResolversObject<{
  availableFields?: Resolver<ReadonlyArray<ResolversTypes['Field']>, ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  maxItems?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  minItems?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AuthorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = ResolversObject<{
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AuthorsRelationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['AuthorsRelation'] = ResolversParentTypes['AuthorsRelation']> = ResolversObject<{
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type BookResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = ResolversObject<{
  contributors?: Resolver<Maybe<ReadonlyArray<Maybe<ResolversTypes['BookContributorsUnion']>>>, ParentType, ContextType>
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  hasKindleVersion?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  yo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type BookContributorsAuthorResolvers<
  ContextType = Zemble.GraphQLContext,
  ParentType extends ResolversParentTypes['BookContributorsAuthor'] = ResolversParentTypes['BookContributorsAuthor'],
> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['AuthorsRelation']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type BookContributorsEditorResolvers<
  ContextType = Zemble.GraphQLContext,
  ParentType extends ResolversParentTypes['BookContributorsEditor'] = ResolversParentTypes['BookContributorsEditor'],
> = ResolversObject<{
  editor?: Resolver<Maybe<ResolversTypes['AuthorsRelation']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type BookContributorsUnionResolvers<
  ContextType = Zemble.GraphQLContext,
  ParentType extends ResolversParentTypes['BookContributorsUnion'] = ResolversParentTypes['BookContributorsUnion'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<'BookContributorsAuthor' | 'BookContributorsEditor', ParentType, ContextType>
}>

export type BooleanFieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['BooleanField'] = ResolversParentTypes['BooleanField']> = ResolversObject<{
  defaultValue?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type EntityResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = ResolversObject<{
  fields?: Resolver<ReadonlyArray<ResolversTypes['Field']>, ParentType, ContextType>
  isPublishable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  namePlural?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  nameSingular?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  permissions?: Resolver<Maybe<ReadonlyArray<ResolversTypes['EntityPermission']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type EntityPermissionResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['EntityPermission'] = ResolversParentTypes['EntityPermission']> = ResolversObject<{
  create?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  delete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  granular?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  modify?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  publish?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  unpublish?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type EntityRelationFieldResolvers<
  ContextType = Zemble.GraphQLContext,
  ParentType extends ResolversParentTypes['EntityRelationField'] = ResolversParentTypes['EntityRelationField'],
> = ResolversObject<{
  entity?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>
  entityNamePlural?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type FieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Field'] = ResolversParentTypes['Field']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ArrayField' | 'BooleanField' | 'EntityRelationField' | 'IDField' | 'NumberField' | 'StringField', ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}>

export type IdFieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['IDField'] = ResolversParentTypes['IDField']> = ResolversObject<{
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject'
}

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addFieldsToEntity?: Resolver<ResolversTypes['Entity'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationAddFieldsToEntityArgs, 'fields' | 'namePlural'>>
  createAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, Partial<MutationCreateAuthorArgs>>
  createBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, Partial<MutationCreateBookArgs>>
  createEntity?: Resolver<ResolversTypes['Entity'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationCreateEntityArgs, 'namePlural'>>
  deleteAuthor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAuthorArgs, 'id'>>
  deleteBook?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBookArgs, 'id'>>
  removeEntity?: Resolver<ResolversTypes['Boolean'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationRemoveEntityArgs, 'namePlural'>>
  removeFieldsFromEntity?: Resolver<ResolversTypes['Entity'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationRemoveFieldsFromEntityArgs, 'fields' | 'namePlural'>>
  renameEntity?: Resolver<ResolversTypes['Entity'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationRenameEntityArgs, 'fromNamePlural' | 'toNamePlural'>>
}>

export type NumberFieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['NumberField'] = ResolversParentTypes['NumberField']> = ResolversObject<{
  defaultValue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  max?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  min?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  filterAuthors?: Resolver<ReadonlyArray<ResolversTypes['Author']>, ParentType, ContextType, Partial<QueryFilterAuthorsArgs>>
  filterBooks?: Resolver<ReadonlyArray<ResolversTypes['Book']>, ParentType, ContextType, Partial<QueryFilterBooksArgs>>
  getAllAuthors?: Resolver<ReadonlyArray<ResolversTypes['Author']>, ParentType, ContextType>
  getAllBooks?: Resolver<ReadonlyArray<ResolversTypes['Book']>, ParentType, ContextType>
  getAllEntities?: Resolver<ReadonlyArray<ResolversTypes['Entity']>, ParentType, Zemble.AuthContextWithToken<ContextType>>
  getAuthorById?: Resolver<ResolversTypes['Author'], ParentType, ContextType, RequireFields<QueryGetAuthorByIdArgs, 'id'>>
  getAuthorsById?: Resolver<ReadonlyArray<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<QueryGetAuthorsByIdArgs, 'ids'>>
  getBookById?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<QueryGetBookByIdArgs, 'id'>>
  getBooksById?: Resolver<ReadonlyArray<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<QueryGetBooksByIdArgs, 'ids'>>
  getEntityByNamePlural?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<QueryGetEntityByNamePluralArgs, 'namePlural'>>
  getEntityByNameSingular?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<QueryGetEntityByNameSingularArgs, 'name'>>
  searchAuthors?: Resolver<ReadonlyArray<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<QuerySearchAuthorsArgs, 'query'>>
  searchBooks?: Resolver<ReadonlyArray<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<QuerySearchBooksArgs, 'query'>>
}>

export type StringFieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['StringField'] = ResolversParentTypes['StringField']> = ResolversObject<{
  defaultValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isSearchable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  maxLength?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  minLength?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  ArrayField?: ArrayFieldResolvers<ContextType>
  Author?: AuthorResolvers<ContextType>
  AuthorsRelation?: AuthorsRelationResolvers<ContextType>
  Book?: BookResolvers<ContextType>
  BookContributorsAuthor?: BookContributorsAuthorResolvers<ContextType>
  BookContributorsEditor?: BookContributorsEditorResolvers<ContextType>
  BookContributorsUnion?: BookContributorsUnionResolvers<ContextType>
  BooleanField?: BooleanFieldResolvers<ContextType>
  Date?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  Entity?: EntityResolvers<ContextType>
  EntityPermission?: EntityPermissionResolvers<ContextType>
  EntityRelationField?: EntityRelationFieldResolvers<ContextType>
  Field?: FieldResolvers<ContextType>
  IDField?: IdFieldResolvers<ContextType>
  JSONObject?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  NumberField?: NumberFieldResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  StringField?: StringFieldResolvers<ContextType>
}>

export type DirectiveResolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>
}>

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  Date: { input: any; output: any }
  DateTime: { input: any; output: any }
  JSONObject: { input: any; output: any }
}

export type ArrayField = Field & {
  readonly __typename?: 'ArrayField'
  readonly availableFields: ReadonlyArray<Field>
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly maxItems?: Maybe<Scalars['Int']['output']>
  readonly minItems?: Maybe<Scalars['Int']['output']>
  readonly name: Scalars['String']['output']
}

export type ArrayFieldInput = {
  readonly availableFields: ReadonlyArray<FieldInputWithoutArray>
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>
  readonly maxItems?: InputMaybe<Scalars['Int']['input']>
  readonly minItems?: InputMaybe<Scalars['Int']['input']>
  readonly name: Scalars['String']['input']
}

export type AuthOr = {
  readonly includes?: InputMaybe<Scalars['JSONObject']['input']>
  readonly match?: InputMaybe<Scalars['JSONObject']['input']>
}

export type Author = {
  readonly __typename?: 'Author'
  readonly displayName?: Maybe<Scalars['String']['output']>
  readonly firstName?: Maybe<Scalars['String']['output']>
  readonly id?: Maybe<Scalars['ID']['output']>
  readonly lastName?: Maybe<Scalars['String']['output']>
}

export type AuthorFirstNameFilter = {
  readonly eq?: InputMaybe<Scalars['String']['input']>
}

export type AuthorIdFilter = {
  readonly eq?: InputMaybe<Scalars['ID']['input']>
}

export type AuthorLastNameFilter = {
  readonly eq?: InputMaybe<Scalars['String']['input']>
}

export type AuthorsRelation = {
  readonly __typename?: 'AuthorsRelation'
  readonly displayName?: Maybe<Scalars['String']['output']>
  readonly firstName: Scalars['String']['output']
  readonly id: Scalars['ID']['output']
  readonly lastName: Scalars['String']['output']
}

export type Book = {
  readonly __typename?: 'Book'
  readonly contributors?: Maybe<ReadonlyArray<Maybe<BookContributorsUnion>>>
  readonly description?: Maybe<Scalars['String']['output']>
  readonly displayName?: Maybe<Scalars['String']['output']>
  readonly hasKindleVersion?: Maybe<Scalars['Boolean']['output']>
  readonly id?: Maybe<Scalars['ID']['output']>
  readonly title?: Maybe<Scalars['String']['output']>
  readonly yo?: Maybe<Scalars['String']['output']>
}

export type BookContributorsAuthor = {
  readonly __typename?: 'BookContributorsAuthor'
  readonly author?: Maybe<AuthorsRelation>
}

export type BookContributorsEditor = {
  readonly __typename?: 'BookContributorsEditor'
  readonly editor?: Maybe<AuthorsRelation>
}

export type BookContributorsInput = { readonly author: Scalars['ID']['input']; readonly editor?: never } | { readonly author?: never; readonly editor: Scalars['ID']['input'] }

export type BookContributorsUnion = BookContributorsAuthor | BookContributorsEditor

export type BookDescriptionFilter = {
  readonly eq?: InputMaybe<Scalars['String']['input']>
}

export type BookHasKindleVersionFilter = {
  readonly eq?: InputMaybe<Scalars['Boolean']['input']>
}

export type BookIdFilter = {
  readonly eq?: InputMaybe<Scalars['ID']['input']>
}

export type BookTitleFilter = {
  readonly eq?: InputMaybe<Scalars['String']['input']>
}

export type BookYoFilter = {
  readonly eq?: InputMaybe<Scalars['ID']['input']>
}

export type BooleanField = Field & {
  readonly __typename?: 'BooleanField'
  readonly defaultValue?: Maybe<Scalars['Boolean']['output']>
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly name: Scalars['String']['output']
}

export type BooleanFieldInput = {
  readonly defaultValue?: InputMaybe<Scalars['Boolean']['input']>
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>
  readonly name: Scalars['String']['input']
}

export type Entity = {
  readonly __typename?: 'Entity'
  readonly fields: ReadonlyArray<Field>
  readonly isPublishable: Scalars['Boolean']['output']
  readonly namePlural: Scalars['String']['output']
  readonly nameSingular: Scalars['String']['output']
  readonly permissions?: Maybe<ReadonlyArray<EntityPermission>>
}

export type EntityPermission = {
  readonly __typename?: 'EntityPermission'
  readonly create: Scalars['Boolean']['output']
  readonly delete: Scalars['Boolean']['output']
  readonly granular: Scalars['Boolean']['output']
  readonly modify: Scalars['Boolean']['output']
  readonly publish: Scalars['Boolean']['output']
  readonly read: Scalars['Boolean']['output']
  readonly type?: Maybe<Scalars['String']['output']>
  readonly unpublish: Scalars['Boolean']['output']
}

export type EntityRelationField = Field & {
  readonly __typename?: 'EntityRelationField'
  readonly entity: Entity
  readonly entityNamePlural: Scalars['String']['output']
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly name: Scalars['String']['output']
}

export type EntityRelationFieldInput = {
  readonly entityNamePlural: Scalars['String']['input']
  readonly isRequired: Scalars['Boolean']['input']
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>
  readonly name: Scalars['String']['input']
}

export type Field = {
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly name: Scalars['String']['output']
}

export type FieldInput =
  | { readonly ArrayField: ArrayFieldInput; readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField?: never }
  | { readonly ArrayField?: never; readonly BooleanField: BooleanFieldInput; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField?: never }
  | { readonly ArrayField?: never; readonly BooleanField?: never; readonly EntityRelationField: EntityRelationFieldInput; readonly NumberField?: never; readonly StringField?: never }
  | { readonly ArrayField?: never; readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField: NumberFieldInput; readonly StringField?: never }
  | { readonly ArrayField?: never; readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField: StringFieldInput }

export type FieldInputWithoutArray =
  | { readonly BooleanField: BooleanFieldInput; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField?: never }
  | { readonly BooleanField?: never; readonly EntityRelationField: EntityRelationFieldInput; readonly NumberField?: never; readonly StringField?: never }
  | { readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField: NumberFieldInput; readonly StringField?: never }
  | { readonly BooleanField?: never; readonly EntityRelationField?: never; readonly NumberField?: never; readonly StringField: StringFieldInput }

export type IdField = Field & {
  readonly __typename?: 'IDField'
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly name: Scalars['String']['output']
}

export type Mutation = {
  readonly __typename?: 'Mutation'
  readonly addFieldsToEntity: Entity
  readonly createAuthor?: Maybe<Author>
  readonly createBook?: Maybe<Book>
  readonly createEntity: Entity
  readonly deleteAuthor: Scalars['Boolean']['output']
  readonly deleteBook: Scalars['Boolean']['output']
  readonly removeEntity: Scalars['Boolean']['output']
  readonly removeFieldsFromEntity: Entity
  readonly renameEntity: Entity
}

export type MutationAddFieldsToEntityArgs = {
  fields: ReadonlyArray<FieldInput>
  namePlural: Scalars['String']['input']
}

export type MutationCreateAuthorArgs = {
  firstName?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['ID']['input']>
  lastName?: InputMaybe<Scalars['String']['input']>
}

export type MutationCreateBookArgs = {
  contributors?: InputMaybe<ReadonlyArray<InputMaybe<BookContributorsInput>>>
  description?: InputMaybe<Scalars['String']['input']>
  hasKindleVersion?: InputMaybe<Scalars['Boolean']['input']>
  id?: InputMaybe<Scalars['ID']['input']>
  title?: InputMaybe<Scalars['String']['input']>
  yo?: InputMaybe<Scalars['ID']['input']>
}

export type MutationCreateEntityArgs = {
  isPublishable?: InputMaybe<Scalars['Boolean']['input']>
  namePlural: Scalars['String']['input']
  nameSingular?: InputMaybe<Scalars['String']['input']>
}

export type MutationDeleteAuthorArgs = {
  id: Scalars['ID']['input']
}

export type MutationDeleteBookArgs = {
  id: Scalars['ID']['input']
}

export type MutationRemoveEntityArgs = {
  namePlural: Scalars['String']['input']
}

export type MutationRemoveFieldsFromEntityArgs = {
  fields: ReadonlyArray<Scalars['String']['input']>
  namePlural: Scalars['String']['input']
}

export type MutationRenameEntityArgs = {
  fromNamePlural: Scalars['String']['input']
  toNamePlural: Scalars['String']['input']
  toNameSingular?: InputMaybe<Scalars['String']['input']>
}

export type NumberField = Field & {
  readonly __typename?: 'NumberField'
  readonly defaultValue?: Maybe<Scalars['Float']['output']>
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly max?: Maybe<Scalars['Float']['output']>
  readonly min?: Maybe<Scalars['Float']['output']>
  readonly name: Scalars['String']['output']
}

export type NumberFieldInput = {
  readonly defaultValue?: InputMaybe<Scalars['Float']['input']>
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>
  readonly max?: InputMaybe<Scalars['Float']['input']>
  readonly min?: InputMaybe<Scalars['Float']['input']>
  readonly name: Scalars['String']['input']
}

export type Query = {
  readonly __typename?: 'Query'
  readonly filterAuthors: ReadonlyArray<Author>
  readonly filterBooks: ReadonlyArray<Book>
  readonly getAllAuthors: ReadonlyArray<Author>
  readonly getAllBooks: ReadonlyArray<Book>
  readonly getAllEntities: ReadonlyArray<Entity>
  readonly getAuthorById: Author
  readonly getAuthorsById: ReadonlyArray<Author>
  readonly getBookById: Book
  readonly getBooksById: ReadonlyArray<Book>
  readonly getEntityByNamePlural?: Maybe<Entity>
  readonly getEntityByNameSingular?: Maybe<Entity>
  readonly searchAuthors: ReadonlyArray<Author>
  readonly searchBooks: ReadonlyArray<Book>
}

export type QueryFilterAuthorsArgs = {
  firstName?: InputMaybe<AuthorFirstNameFilter>
  id?: InputMaybe<AuthorIdFilter>
  lastName?: InputMaybe<AuthorLastNameFilter>
}

export type QueryFilterBooksArgs = {
  description?: InputMaybe<BookDescriptionFilter>
  hasKindleVersion?: InputMaybe<BookHasKindleVersionFilter>
  id?: InputMaybe<BookIdFilter>
  title?: InputMaybe<BookTitleFilter>
  yo?: InputMaybe<BookYoFilter>
}

export type QueryGetAuthorByIdArgs = {
  id: Scalars['ID']['input']
}

export type QueryGetAuthorsByIdArgs = {
  ids: ReadonlyArray<Scalars['ID']['input']>
}

export type QueryGetBookByIdArgs = {
  id: Scalars['ID']['input']
}

export type QueryGetBooksByIdArgs = {
  ids: ReadonlyArray<Scalars['ID']['input']>
}

export type QueryGetEntityByNamePluralArgs = {
  namePlural: Scalars['String']['input']
}

export type QueryGetEntityByNameSingularArgs = {
  name: Scalars['String']['input']
}

export type QuerySearchAuthorsArgs = {
  caseSensitive?: InputMaybe<Scalars['Boolean']['input']>
  diacriticSensitive?: InputMaybe<Scalars['Boolean']['input']>
  language?: InputMaybe<Scalars['String']['input']>
  query: Scalars['String']['input']
}

export type QuerySearchBooksArgs = {
  caseSensitive?: InputMaybe<Scalars['Boolean']['input']>
  diacriticSensitive?: InputMaybe<Scalars['Boolean']['input']>
  language?: InputMaybe<Scalars['String']['input']>
  query: Scalars['String']['input']
}

export type StringField = Field & {
  readonly __typename?: 'StringField'
  readonly defaultValue?: Maybe<Scalars['String']['output']>
  readonly isRequired: Scalars['Boolean']['output']
  readonly isRequiredInput: Scalars['Boolean']['output']
  readonly isSearchable: Scalars['Boolean']['output']
  readonly maxLength?: Maybe<Scalars['Int']['output']>
  readonly minLength?: Maybe<Scalars['Int']['output']>
  readonly name: Scalars['String']['output']
}

export type StringFieldInput = {
  readonly defaultValue?: InputMaybe<Scalars['String']['input']>
  readonly isRequired?: InputMaybe<Scalars['Boolean']['input']>
  readonly isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>
  readonly isSearchable?: InputMaybe<Scalars['Boolean']['input']>
  readonly maxLength?: InputMaybe<Scalars['Int']['input']>
  readonly minLength?: InputMaybe<Scalars['Int']['input']>
  readonly name: Scalars['String']['input']
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  BookContributorsUnion: BookContributorsAuthor | BookContributorsEditor
}>

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  Field:
    | (Omit<ArrayField, 'availableFields'> & { availableFields: ReadonlyArray<_RefType['Field']> })
    | BooleanField
    | (Omit<EntityRelationField, 'entity'> & { entity: _RefType['Entity'] })
    | IdField
    | NumberField
    | StringField
}>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  ArrayField: ResolverTypeWrapper<Omit<ArrayField, 'availableFields'> & { availableFields: ReadonlyArray<ResolversTypes['Field']> }>
  ArrayFieldInput: ArrayFieldInput
  AuthOr: AuthOr
  Author: ResolverTypeWrapper<Author>
  AuthorFirstNameFilter: AuthorFirstNameFilter
  AuthorIdFilter: AuthorIdFilter
  AuthorLastNameFilter: AuthorLastNameFilter
  AuthorsRelation: ResolverTypeWrapper<AuthorsRelation>
  Book: ResolverTypeWrapper<Omit<Book, 'contributors'> & { contributors?: Maybe<ReadonlyArray<Maybe<ResolversTypes['BookContributorsUnion']>>> }>
  BookContributorsAuthor: ResolverTypeWrapper<BookContributorsAuthor>
  BookContributorsEditor: ResolverTypeWrapper<BookContributorsEditor>
  BookContributorsInput: BookContributorsInput
  BookContributorsUnion: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['BookContributorsUnion']>
  BookDescriptionFilter: BookDescriptionFilter
  BookHasKindleVersionFilter: BookHasKindleVersionFilter
  BookIdFilter: BookIdFilter
  BookTitleFilter: BookTitleFilter
  BookYoFilter: BookYoFilter
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  BooleanField: ResolverTypeWrapper<BooleanField>
  BooleanFieldInput: BooleanFieldInput
  Date: ResolverTypeWrapper<Scalars['Date']['output']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>
  Entity: ResolverTypeWrapper<EntitySchemaType>
  EntityPermission: ResolverTypeWrapper<EntityPermission>
  EntityRelationField: ResolverTypeWrapper<Omit<EntityRelationField, 'entity'> & { entity: ResolversTypes['Entity'] }>
  EntityRelationFieldInput: EntityRelationFieldInput
  Field: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Field']>
  FieldInput: FieldInput
  FieldInputWithoutArray: FieldInputWithoutArray
  Float: ResolverTypeWrapper<Scalars['Float']['output']>
  ID: ResolverTypeWrapper<Scalars['ID']['output']>
  IDField: ResolverTypeWrapper<IdField>
  Int: ResolverTypeWrapper<Scalars['Int']['output']>
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>
  Mutation: ResolverTypeWrapper<{}>
  NumberField: ResolverTypeWrapper<NumberField>
  NumberFieldInput: NumberFieldInput
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']['output']>
  StringField: ResolverTypeWrapper<StringField>
  StringFieldInput: StringFieldInput
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  ArrayField: Omit<ArrayField, 'availableFields'> & { availableFields: ReadonlyArray<ResolversParentTypes['Field']> }
  ArrayFieldInput: ArrayFieldInput
  AuthOr: AuthOr
  Author: Author
  AuthorFirstNameFilter: AuthorFirstNameFilter
  AuthorIdFilter: AuthorIdFilter
  AuthorLastNameFilter: AuthorLastNameFilter
  AuthorsRelation: AuthorsRelation
  Book: Omit<Book, 'contributors'> & { contributors?: Maybe<ReadonlyArray<Maybe<ResolversParentTypes['BookContributorsUnion']>>> }
  BookContributorsAuthor: BookContributorsAuthor
  BookContributorsEditor: BookContributorsEditor
  BookContributorsInput: BookContributorsInput
  BookContributorsUnion: ResolversUnionTypes<ResolversParentTypes>['BookContributorsUnion']
  BookDescriptionFilter: BookDescriptionFilter
  BookHasKindleVersionFilter: BookHasKindleVersionFilter
  BookIdFilter: BookIdFilter
  BookTitleFilter: BookTitleFilter
  BookYoFilter: BookYoFilter
  Boolean: Scalars['Boolean']['output']
  BooleanField: BooleanField
  BooleanFieldInput: BooleanFieldInput
  Date: Scalars['Date']['output']
  DateTime: Scalars['DateTime']['output']
  Entity: EntitySchemaType
  EntityPermission: EntityPermission
  EntityRelationField: Omit<EntityRelationField, 'entity'> & { entity: ResolversParentTypes['Entity'] }
  EntityRelationFieldInput: EntityRelationFieldInput
  Field: ResolversInterfaceTypes<ResolversParentTypes>['Field']
  FieldInput: FieldInput
  FieldInputWithoutArray: FieldInputWithoutArray
  Float: Scalars['Float']['output']
  ID: Scalars['ID']['output']
  IDField: IdField
  Int: Scalars['Int']['output']
  JSONObject: Scalars['JSONObject']['output']
  Mutation: {}
  NumberField: NumberField
  NumberFieldInput: NumberFieldInput
  Query: {}
  String: Scalars['String']['output']
  StringField: StringField
  StringFieldInput: StringFieldInput
}>

export type AuthDirectiveArgs = {
  includes?: Maybe<Scalars['JSONObject']['input']>
  match?: Maybe<Scalars['JSONObject']['input']>
  or?: Maybe<ReadonlyArray<AuthOr>>
  skip?: Maybe<Scalars['Boolean']['input']>
}

export type AuthDirectiveResolver<Result, Parent, ContextType = Zemble.GraphQLContext, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>

export type ArrayFieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['ArrayField'] = ResolversParentTypes['ArrayField']> = ResolversObject<{
  availableFields?: Resolver<ReadonlyArray<ResolversTypes['Field']>, ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  maxItems?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  minItems?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AuthorResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = ResolversObject<{
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AuthorsRelationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['AuthorsRelation'] = ResolversParentTypes['AuthorsRelation']> = ResolversObject<{
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type BookResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = ResolversObject<{
  contributors?: Resolver<Maybe<ReadonlyArray<Maybe<ResolversTypes['BookContributorsUnion']>>>, ParentType, ContextType>
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  hasKindleVersion?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  yo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type BookContributorsAuthorResolvers<
  ContextType = Zemble.GraphQLContext,
  ParentType extends ResolversParentTypes['BookContributorsAuthor'] = ResolversParentTypes['BookContributorsAuthor'],
> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['AuthorsRelation']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type BookContributorsEditorResolvers<
  ContextType = Zemble.GraphQLContext,
  ParentType extends ResolversParentTypes['BookContributorsEditor'] = ResolversParentTypes['BookContributorsEditor'],
> = ResolversObject<{
  editor?: Resolver<Maybe<ResolversTypes['AuthorsRelation']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type BookContributorsUnionResolvers<
  ContextType = Zemble.GraphQLContext,
  ParentType extends ResolversParentTypes['BookContributorsUnion'] = ResolversParentTypes['BookContributorsUnion'],
> = ResolversObject<{
  __resolveType: TypeResolveFn<'BookContributorsAuthor' | 'BookContributorsEditor', ParentType, ContextType>
}>

export type BooleanFieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['BooleanField'] = ResolversParentTypes['BooleanField']> = ResolversObject<{
  defaultValue?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type EntityResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = ResolversObject<{
  fields?: Resolver<ReadonlyArray<ResolversTypes['Field']>, ParentType, ContextType>
  isPublishable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  namePlural?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  nameSingular?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  permissions?: Resolver<Maybe<ReadonlyArray<ResolversTypes['EntityPermission']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type EntityPermissionResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['EntityPermission'] = ResolversParentTypes['EntityPermission']> = ResolversObject<{
  create?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  delete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  granular?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  modify?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  publish?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  unpublish?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type EntityRelationFieldResolvers<
  ContextType = Zemble.GraphQLContext,
  ParentType extends ResolversParentTypes['EntityRelationField'] = ResolversParentTypes['EntityRelationField'],
> = ResolversObject<{
  entity?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>
  entityNamePlural?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type FieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Field'] = ResolversParentTypes['Field']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ArrayField' | 'BooleanField' | 'EntityRelationField' | 'IDField' | 'NumberField' | 'StringField', ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}>

export type IdFieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['IDField'] = ResolversParentTypes['IDField']> = ResolversObject<{
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export interface JsonObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject'
}

export type MutationResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addFieldsToEntity?: Resolver<ResolversTypes['Entity'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationAddFieldsToEntityArgs, 'fields' | 'namePlural'>>
  createAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, Partial<MutationCreateAuthorArgs>>
  createBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, Partial<MutationCreateBookArgs>>
  createEntity?: Resolver<ResolversTypes['Entity'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationCreateEntityArgs, 'namePlural'>>
  deleteAuthor?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAuthorArgs, 'id'>>
  deleteBook?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteBookArgs, 'id'>>
  removeEntity?: Resolver<ResolversTypes['Boolean'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationRemoveEntityArgs, 'namePlural'>>
  removeFieldsFromEntity?: Resolver<ResolversTypes['Entity'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationRemoveFieldsFromEntityArgs, 'fields' | 'namePlural'>>
  renameEntity?: Resolver<ResolversTypes['Entity'], ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<MutationRenameEntityArgs, 'fromNamePlural' | 'toNamePlural'>>
}>

export type NumberFieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['NumberField'] = ResolversParentTypes['NumberField']> = ResolversObject<{
  defaultValue?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  max?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  min?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  filterAuthors?: Resolver<ReadonlyArray<ResolversTypes['Author']>, ParentType, ContextType, Partial<QueryFilterAuthorsArgs>>
  filterBooks?: Resolver<ReadonlyArray<ResolversTypes['Book']>, ParentType, ContextType, Partial<QueryFilterBooksArgs>>
  getAllAuthors?: Resolver<ReadonlyArray<ResolversTypes['Author']>, ParentType, ContextType>
  getAllBooks?: Resolver<ReadonlyArray<ResolversTypes['Book']>, ParentType, ContextType>
  getAllEntities?: Resolver<ReadonlyArray<ResolversTypes['Entity']>, ParentType, Zemble.AuthContextWithToken<ContextType>>
  getAuthorById?: Resolver<ResolversTypes['Author'], ParentType, ContextType, RequireFields<QueryGetAuthorByIdArgs, 'id'>>
  getAuthorsById?: Resolver<ReadonlyArray<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<QueryGetAuthorsByIdArgs, 'ids'>>
  getBookById?: Resolver<ResolversTypes['Book'], ParentType, ContextType, RequireFields<QueryGetBookByIdArgs, 'id'>>
  getBooksById?: Resolver<ReadonlyArray<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<QueryGetBooksByIdArgs, 'ids'>>
  getEntityByNamePlural?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<QueryGetEntityByNamePluralArgs, 'namePlural'>>
  getEntityByNameSingular?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, Zemble.AuthContextWithToken<ContextType>, RequireFields<QueryGetEntityByNameSingularArgs, 'name'>>
  searchAuthors?: Resolver<ReadonlyArray<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<QuerySearchAuthorsArgs, 'query'>>
  searchBooks?: Resolver<ReadonlyArray<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<QuerySearchBooksArgs, 'query'>>
}>

export type StringFieldResolvers<ContextType = Zemble.GraphQLContext, ParentType extends ResolversParentTypes['StringField'] = ResolversParentTypes['StringField']> = ResolversObject<{
  defaultValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  isRequired?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isRequiredInput?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isSearchable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  maxLength?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  minLength?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  ArrayField?: ArrayFieldResolvers<ContextType>
  Author?: AuthorResolvers<ContextType>
  AuthorsRelation?: AuthorsRelationResolvers<ContextType>
  Book?: BookResolvers<ContextType>
  BookContributorsAuthor?: BookContributorsAuthorResolvers<ContextType>
  BookContributorsEditor?: BookContributorsEditorResolvers<ContextType>
  BookContributorsUnion?: BookContributorsUnionResolvers<ContextType>
  BooleanField?: BooleanFieldResolvers<ContextType>
  Date?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  Entity?: EntityResolvers<ContextType>
  EntityPermission?: EntityPermissionResolvers<ContextType>
  EntityRelationField?: EntityRelationFieldResolvers<ContextType>
  Field?: FieldResolvers<ContextType>
  IDField?: IdFieldResolvers<ContextType>
  JSONObject?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  NumberField?: NumberFieldResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  StringField?: StringFieldResolvers<ContextType>
}>

export type DirectiveResolvers<ContextType = Zemble.GraphQLContext> = ResolversObject<{
  auth?: AuthDirectiveResolver<any, any, ContextType>
}>
