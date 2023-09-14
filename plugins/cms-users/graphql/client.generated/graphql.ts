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
  JSONObject: { input: any; output: any; }
};

export type AuthOr = {
  includes?: InputMaybe<Scalars['JSONObject']['input']>;
  match?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  updatePermissions: User;
};


export type MutationUpdatePermissionsArgs = {
  permissions: Array<PermissionInput>;
  userId: Scalars['ID']['input'];
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
  users: Array<User>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastLoginAt: Scalars['DateTime']['output'];
  permissions: Array<Permission>;
};

export type UpdatePermissionsMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  permissions: Array<PermissionInput> | PermissionInput;
}>;


export type UpdatePermissionsMutation = { __typename?: 'Mutation', updatePermissions: { __typename?: 'User', id: string, permissions: Array<{ __typename?: 'Permission', type: string, scope: string }> } };


export const UpdatePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PermissionInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"permissions"},"value":{"kind":"Variable","name":{"kind":"Name","value":"permissions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"scope"}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePermissionsMutation, UpdatePermissionsMutationVariables>;