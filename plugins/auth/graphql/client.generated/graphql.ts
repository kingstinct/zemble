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

export type Query = {
  __typename?: 'Query';
  privateShit: Scalars['String']['output'];
  privateShitWithRole: Scalars['String']['output'];
  publicKey: Scalars['String']['output'];
  publicShit: Scalars['String']['output'];
  readJWT: Scalars['JSONObject']['output'];
  validateJWT: Scalars['Boolean']['output'];
};


export type QueryReadJwtArgs = {
  token: Scalars['String']['input'];
};


export type QueryValidateJwtArgs = {
  token: Scalars['String']['input'];
};

export type PrivateShitQueryVariables = Exact<{ [key: string]: never; }>;


export type PrivateShitQuery = { __typename?: 'Query', privateShit: string };

export type PrivateShitWithRoleQueryVariables = Exact<{ [key: string]: never; }>;


export type PrivateShitWithRoleQuery = { __typename?: 'Query', privateShitWithRole: string };

export type PublicShitQueryVariables = Exact<{ [key: string]: never; }>;


export type PublicShitQuery = { __typename?: 'Query', publicShit: string };


export const PrivateShitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PrivateShit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"privateShit"}}]}}]} as unknown as DocumentNode<PrivateShitQuery, PrivateShitQueryVariables>;
export const PrivateShitWithRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PrivateShitWithRole"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"privateShitWithRole"}}]}}]} as unknown as DocumentNode<PrivateShitWithRoleQuery, PrivateShitWithRoleQueryVariables>;
export const PublicShitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicShit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicShit"}}]}}]} as unknown as DocumentNode<PublicShitQuery, PublicShitQueryVariables>;