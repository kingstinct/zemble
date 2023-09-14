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
  JSONObject: { input: any; output: any; }
};

export type AuthOr = {
  includes?: InputMaybe<Scalars['JSONObject']['input']>;
  match?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type Query = {
  __typename?: 'Query';
  advancedWithOr: Scalars['String']['output'];
  includes: Scalars['String']['output'];
  privateShit: Scalars['String']['output'];
  privateShitWithRole: Scalars['String']['output'];
  publicKey: Scalars['String']['output'];
  publicShit: Scalars['String']['output'];
  readJWT: Scalars['JSONObject']['output'];
  validateJWT: Scalars['Boolean']['output'];
  variableReference: Scalars['String']['output'];
};


export type QueryAdvancedWithOrArgs = {
  organisationId: Scalars['String']['input'];
};


export type QueryIncludesArgs = {
  organisationId: Scalars['String']['input'];
};


export type QueryReadJwtArgs = {
  token: Scalars['String']['input'];
};


export type QueryValidateJwtArgs = {
  token: Scalars['String']['input'];
};


export type QueryVariableReferenceArgs = {
  organisationId: Scalars['String']['input'];
};

export type AdvancedWithOrQueryVariables = Exact<{
  organisationId: Scalars['String']['input'];
}>;


export type AdvancedWithOrQuery = { __typename?: 'Query', advancedWithOr: string };

export type IncludesQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type IncludesQuery = { __typename?: 'Query', includes: string };

export type PrivateShitQueryVariables = Exact<{ [key: string]: never; }>;


export type PrivateShitQuery = { __typename?: 'Query', privateShit: string };

export type PrivateShitWithRoleQueryVariables = Exact<{ [key: string]: never; }>;


export type PrivateShitWithRoleQuery = { __typename?: 'Query', privateShitWithRole: string };

export type PublicShitQueryVariables = Exact<{ [key: string]: never; }>;


export type PublicShitQuery = { __typename?: 'Query', publicShit: string };

export type VariableReferenceQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type VariableReferenceQuery = { __typename?: 'Query', variableReference: string };


export const AdvancedWithOrDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"advancedWithOr"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organisationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advancedWithOr"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organisationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organisationId"}}}]}]}}]} as unknown as DocumentNode<AdvancedWithOrQuery, AdvancedWithOrQueryVariables>;
export const IncludesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Includes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"includes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organisationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<IncludesQuery, IncludesQueryVariables>;
export const PrivateShitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PrivateShit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"privateShit"}}]}}]} as unknown as DocumentNode<PrivateShitQuery, PrivateShitQueryVariables>;
export const PrivateShitWithRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PrivateShitWithRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"privateShitWithRole"}}]}}]} as unknown as DocumentNode<PrivateShitWithRoleQuery, PrivateShitWithRoleQueryVariables>;
export const PublicShitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicShit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicShit"}}]}}]} as unknown as DocumentNode<PublicShitQuery, PublicShitQueryVariables>;
export const VariableReferenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VariableReference"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"variableReference"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organisationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<VariableReferenceQuery, VariableReferenceQueryVariables>;