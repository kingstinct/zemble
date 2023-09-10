/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-nocheck
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
};

export type ArrayField = Field & {
  __typename?: 'ArrayField';
  availableFields: Array<Field>;
  isRequired: Scalars['Boolean']['output'];
  maxItems?: Maybe<Scalars['Int']['output']>;
  minItems?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type ArrayFieldInput = {
  availableFields: Array<FieldInputWithoutArray>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  maxItems?: InputMaybe<Scalars['Int']['input']>;
  minItems?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type BooleanField = Field & {
  __typename?: 'BooleanField';
  defaultValue?: Maybe<Scalars['Boolean']['output']>;
  isRequired: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type BooleanFieldInput = {
  defaultValue?: InputMaybe<Scalars['Boolean']['input']>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type Entity = {
  __typename?: 'Entity';
  fields: Array<Field>;
  name: Scalars['String']['output'];
};

export type EntityInput = {
  name: Scalars['String']['input'];
};

export type EntityRelationField = Field & {
  __typename?: 'EntityRelationField';
  entity: Entity;
  entityName: Scalars['String']['output'];
  isRequired: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type EntityRelationFieldInput = {
  entityName: Scalars['String']['input'];
  isRequired: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type Field = {
  isRequired: Scalars['Boolean']['output'];
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
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addFieldsToEntity: Entity;
  createEntity: Entity;
  removeEntity: Scalars['Boolean']['output'];
  removeFieldsFromEntity: Entity;
};


export type MutationAddFieldsToEntityArgs = {
  entityName: Scalars['String']['input'];
  fields: Array<FieldInput>;
};


export type MutationCreateEntityArgs = {
  name: Scalars['String']['input'];
};


export type MutationRemoveEntityArgs = {
  name: Scalars['String']['input'];
};


export type MutationRemoveFieldsFromEntityArgs = {
  entityName: Scalars['String']['input'];
  fields: Array<Scalars['String']['input']>;
};

export type NumberField = Field & {
  __typename?: 'NumberField';
  defaultValue?: Maybe<Scalars['Float']['output']>;
  isRequired: Scalars['Boolean']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
};

export type NumberFieldInput = {
  defaultValue?: InputMaybe<Scalars['Float']['input']>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  max?: InputMaybe<Scalars['Float']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  entities: Array<Entity>;
  entity?: Maybe<Entity>;
};


export type QueryEntityArgs = {
  name: Scalars['String']['input'];
};

export type StringField = Field & {
  __typename?: 'StringField';
  defaultValue?: Maybe<Scalars['String']['output']>;
  isRequired: Scalars['Boolean']['output'];
  maxLength?: Maybe<Scalars['Int']['output']>;
  minLength?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
};

export type StringFieldInput = {
  defaultValue?: InputMaybe<Scalars['String']['input']>;
  isRequired?: InputMaybe<Scalars['Boolean']['input']>;
  maxLength?: InputMaybe<Scalars['Int']['input']>;
  minLength?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type AddFieldsToEntityMutationVariables = Exact<{
  name: Scalars['String']['input'];
  fields: Array<FieldInput> | FieldInput;
}>;


export type AddFieldsToEntityMutation = { __typename?: 'Mutation', addFieldsToEntity: { __typename?: 'Entity', name: string } };

export type CreateEntityMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateEntityMutation = { __typename?: 'Mutation', createEntity: { __typename?: 'Entity', name: string } };

export type RemoveEntityMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type RemoveEntityMutation = { __typename?: 'Mutation', removeEntity: boolean };

export type RemoveFieldsFromEntityMutationVariables = Exact<{
  name: Scalars['String']['input'];
  fields: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RemoveFieldsFromEntityMutation = { __typename?: 'Mutation', removeFieldsFromEntity: { __typename?: 'Entity', name: string, fields: Array<{ __typename: 'ArrayField', name: string } | { __typename: 'BooleanField', name: string } | { __typename: 'EntityRelationField', name: string } | { __typename: 'IDField', name: string } | { __typename: 'NumberField', name: string } | { __typename: 'StringField', name: string }> } };


export const AddFieldsToEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFieldsToEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FieldInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFieldsToEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entityName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<AddFieldsToEntityMutation, AddFieldsToEntityMutationVariables>;
export const CreateEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateEntityMutation, CreateEntityMutationVariables>;
export const RemoveEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<RemoveEntityMutation, RemoveEntityMutationVariables>;
export const RemoveFieldsFromEntityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFieldsFromEntity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFieldsFromEntity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entityName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveFieldsFromEntityMutation, RemoveFieldsFromEntityMutationVariables>;