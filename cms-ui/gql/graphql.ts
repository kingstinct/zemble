/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  __typename?: 'ArrayField';
  availableFields: Array<Field>;
  isRequired: Scalars['Boolean']['output'];
  isRequiredInput: Scalars['Boolean']['output'];
  maxItems?: Maybe<Scalars['Int']['output']>;
  minItems?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type ArrayFieldInput = {
  availableFields: Array<FieldInputWithoutArray>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>;
  maxItems?: InputMaybe<Scalars['Int']['input']>;
  minItems?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type AuthOr = {
  includes?: InputMaybe<Scalars['JSONObject']['input']>;
  match?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type BooleanField = Field & {
  __typename?: 'BooleanField';
  defaultValue?: Maybe<Scalars['Boolean']['output']>;
  isRequired: Scalars['Boolean']['output'];
  isRequiredInput: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type BooleanFieldInput = {
  defaultValue?: InputMaybe<Scalars['Boolean']['input']>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type CodeNotValidError = Error & {
  __typename?: 'CodeNotValidError';
  message: Scalars['String']['output'];
};

export type EmailNotValidError = Error & {
  __typename?: 'EmailNotValidError';
  message: Scalars['String']['output'];
};

export type Entity = {
  __typename?: 'Entity';
  fields: Array<Field>;
  isPublishable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<EntityPermission>>;
  pluralizedName: Scalars['String']['output'];
};

export type EntityInput = {
  name: Scalars['String']['input'];
};

export type EntityPermission = {
  __typename?: 'EntityPermission';
  create: Scalars['Boolean']['output'];
  delete: Scalars['Boolean']['output'];
  granular: Scalars['Boolean']['output'];
  modify: Scalars['Boolean']['output'];
  publish: Scalars['Boolean']['output'];
  read: Scalars['Boolean']['output'];
  type?: Maybe<Scalars['String']['output']>;
  unpublish: Scalars['Boolean']['output'];
};

export type EntityRelationField = Field & {
  __typename?: 'EntityRelationField';
  entity: Entity;
  entityName: Scalars['String']['output'];
  isRequired: Scalars['Boolean']['output'];
  isRequiredInput: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type EntityRelationFieldInput = {
  entityName: Scalars['String']['input'];
  isRequired: Scalars['Boolean']['input'];
  isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type Error = {
  message: Scalars['String']['output'];
};

export type Field = {
  isRequired: Scalars['Boolean']['output'];
  isRequiredInput: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type FieldInput =
  { ArrayField: ArrayFieldInput; BooleanField?: never; EntityRelationField?: never; NumberField?: never; StringField?: never; }
  |  { ArrayField?: never; BooleanField: BooleanFieldInput; EntityRelationField?: never; NumberField?: never; StringField?: never; }
  |  { ArrayField?: never; BooleanField?: never; EntityRelationField: EntityRelationFieldInput; NumberField?: never; StringField?: never; }
  |  { ArrayField?: never; BooleanField?: never; EntityRelationField?: never; NumberField: NumberFieldInput; StringField?: never; }
  |  { ArrayField?: never; BooleanField?: never; EntityRelationField?: never; NumberField?: never; StringField: StringFieldInput; };

export type FieldInputWithoutArray =
  { BooleanField: BooleanFieldInput; EntityRelationField?: never; NumberField?: never; StringField?: never; }
  |  { BooleanField?: never; EntityRelationField: EntityRelationFieldInput; NumberField?: never; StringField?: never; }
  |  { BooleanField?: never; EntityRelationField?: never; NumberField: NumberFieldInput; StringField?: never; }
  |  { BooleanField?: never; EntityRelationField?: never; NumberField?: never; StringField: StringFieldInput; };

export type IdField = Field & {
  __typename?: 'IDField';
  isRequired: Scalars['Boolean']['output'];
  isRequiredInput: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type LoginConfirmResponse = CodeNotValidError | EmailNotValidError | LoginConfirmSuccessfulResponse | LoginFailedError;

export type LoginConfirmSuccessfulResponse = {
  __typename?: 'LoginConfirmSuccessfulResponse';
  accessToken: Scalars['String']['output'];
};

export type LoginFailedError = Error & {
  __typename?: 'LoginFailedError';
  message: Scalars['String']['output'];
};

export type LoginRequestResponse = EmailNotValidError | LoginRequestSuccessResponse;

export type LoginRequestSuccessResponse = {
  __typename?: 'LoginRequestSuccessResponse';
  success: Scalars['Boolean']['output'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addFieldsToEntity: Entity;
  createEntity: Entity;
  loginConfirm: LoginConfirmResponse;
  loginRequest: LoginRequestResponse;
  removeEntity: Scalars['Boolean']['output'];
  removeFieldsFromEntity: Entity;
  renameEntity: Entity;
  updatePermissions: User;
};


export type MutationAddFieldsToEntityArgs = {
  entityName: Scalars['String']['input'];
  fields: Array<FieldInput>;
};


export type MutationCreateEntityArgs = {
  isPublishable?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  pluralizedName: Scalars['String']['input'];
};


export type MutationLoginConfirmArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationLoginRequestArgs = {
  email: Scalars['String']['input'];
};


export type MutationRemoveEntityArgs = {
  name: Scalars['String']['input'];
};


export type MutationRemoveFieldsFromEntityArgs = {
  entityName: Scalars['String']['input'];
  fields: Array<Scalars['String']['input']>;
};


export type MutationRenameEntityArgs = {
  fromName: Scalars['String']['input'];
  pluralizedName: Scalars['String']['input'];
  toName: Scalars['String']['input'];
};


export type MutationUpdatePermissionsArgs = {
  permissions: Array<PermissionInput>;
  userId: Scalars['ID']['input'];
};

export type NumberField = Field & {
  __typename?: 'NumberField';
  defaultValue?: Maybe<Scalars['Float']['output']>;
  isRequired: Scalars['Boolean']['output'];
  isRequiredInput: Scalars['Boolean']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
};

export type NumberFieldInput = {
  defaultValue?: InputMaybe<Scalars['Float']['input']>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>;
  max?: InputMaybe<Scalars['Float']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
};

export type Permission = {
  __typename?: 'Permission';
  scope: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type PermissionInput = {
  scope: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getAllEntities: Array<Entity>;
  getEntityByName?: Maybe<Entity>;
  getEntityByPluralizedName?: Maybe<Entity>;
  users: Array<User>;
};


export type QueryGetEntityByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetEntityByPluralizedNameArgs = {
  pluralizedName: Scalars['String']['input'];
};

export type StringField = Field & {
  __typename?: 'StringField';
  defaultValue?: Maybe<Scalars['String']['output']>;
  isRequired: Scalars['Boolean']['output'];
  isRequiredInput: Scalars['Boolean']['output'];
  maxLength?: Maybe<Scalars['Int']['output']>;
  minLength?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type StringFieldInput = {
  defaultValue?: InputMaybe<Scalars['String']['input']>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  isRequiredInput?: InputMaybe<Scalars['Boolean']['input']>;
  maxLength?: InputMaybe<Scalars['Int']['input']>;
  minLength?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastLoginAt: Scalars['DateTime']['output'];
  permissions: Array<Permission>;
};

export type LoginConfirmMutationVariables = Exact<{
  email: Scalars['String']['input'];
  code: Scalars['String']['input'];
}>;


export type LoginConfirmMutation = { __typename?: 'Mutation', loginConfirm: { __typename: 'CodeNotValidError', message: string } | { __typename: 'EmailNotValidError', message: string } | { __typename: 'LoginConfirmSuccessfulResponse', accessToken: string } | { __typename: 'LoginFailedError', message: string } };

export type LoginRequestMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type LoginRequestMutation = { __typename?: 'Mutation', loginRequest: { __typename: 'EmailNotValidError', message: string } | { __typename: 'LoginRequestSuccessResponse' } };

export type GetEntityByPluralizedNameQueryVariables = Exact<{
  pluralizedName: Scalars['String']['input'];
}>;


export type GetEntityByPluralizedNameQuery = { __typename?: 'Query', getEntityByPluralizedName?: { __typename?: 'Entity', name: string, pluralizedName: string, fields: Array<{ __typename: 'ArrayField', name: string, isRequired: boolean, isRequiredInput: boolean } | { __typename: 'BooleanField', name: string, isRequired: boolean, isRequiredInput: boolean, defaultValueBoolean?: boolean | null } | { __typename: 'EntityRelationField', name: string, isRequired: boolean, isRequiredInput: boolean } | { __typename: 'IDField', name: string, isRequired: boolean, isRequiredInput: boolean } | { __typename: 'NumberField', name: string, isRequired: boolean, isRequiredInput: boolean, defaultValueNumber?: number | null } | { __typename: 'StringField', name: string, isRequired: boolean, isRequiredInput: boolean, defaultValueString?: string | null }> } | null };

export type CreateEntityMutationVariables = Exact<{
  name: Scalars['String']['input'];
  pluralizedName: Scalars['String']['input'];
}>;


export type CreateEntityMutation = { __typename?: 'Mutation', createEntity: { __typename?: 'Entity', name: string } };

export type GetEntitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntitiesQuery = { __typename?: 'Query', getAllEntities: Array<{ __typename?: 'Entity', name: string, pluralizedName: string, fields: Array<{ __typename?: 'ArrayField', name: string, isRequired: boolean } | { __typename?: 'BooleanField', name: string, isRequired: boolean } | { __typename?: 'EntityRelationField', name: string, isRequired: boolean } | { __typename?: 'IDField', name: string, isRequired: boolean } | { __typename?: 'NumberField', name: string, isRequired: boolean } | { __typename?: 'StringField', name: string, isRequired: boolean }> }> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', email: string }> };

export type AddFieldsToEntityMutationVariables = Exact<{
  name: Scalars['String']['input'];
  fields: Array<FieldInput> | FieldInput;
}>;


export type AddFieldsToEntityMutation = { __typename?: 'Mutation', addFieldsToEntity: { __typename?: 'Entity', name: string } };


export const LoginConfirmDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginConfirm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginConfirm"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginConfirmSuccessfulResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LoginConfirmMutation, LoginConfirmMutationVariables>;
export const LoginRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<LoginRequestMutation, LoginRequestMutationVariables>;
export const GetEntityByPluralizedNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEntityByPluralizedName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pluralizedName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEntityByPluralizedName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pluralizedName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pluralizedName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pluralizedName"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"isRequired"}},{"kind":"Field","name":{"kind":"Name","value":"isRequiredInput"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"StringField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"defaultValueString"},"name":{"kind":"Name","value":"defaultValue"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NumberField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"defaultValueNumber"},"name":{"kind":"Name","value":"defaultValue"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BooleanField"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"defaultValueBoolean"},"name":{"kind":"Name","value":"defaultValue"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetEntityByPluralizedNameQuery, GetEntityByPluralizedNameQueryVariables>;
export const CreateEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pluralizedName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"pluralizedName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pluralizedName"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateEntityMutation, CreateEntityMutationVariables>;
export const GetEntitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"pluralizedName"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isRequired"}}]}}]}}]}}]} as unknown as DocumentNode<GetEntitiesQuery, GetEntitiesQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const AddFieldsToEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFieldsToEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FieldInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFieldsToEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entityName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AddFieldsToEntityMutation, AddFieldsToEntityMutationVariables>;