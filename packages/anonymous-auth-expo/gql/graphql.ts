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
  JSONObject: { input: any; output: any; }
};

export type AuthOr = {
  includes?: InputMaybe<Scalars['JSONObject']['input']>;
  match?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type Error = {
  message: Scalars['String']['output'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResponse;
  refreshToken: NewTokenResponse;
};


export type MutationLoginArgs = {
  username: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  bearerToken: Scalars['String']['input'];
  refreshToken: Scalars['String']['input'];
};

export type NewTokenResponse = NewTokenSuccessResponse | RefreshTokenInvalidError;

export type NewTokenSuccessResponse = {
  __typename?: 'NewTokenSuccessResponse';
  bearerToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  me: User;
  publicKey: Scalars['String']['output'];
  readJWT: Scalars['JSONObject']['output'];
  validateJWT: Scalars['Boolean']['output'];
};


export type QueryReadJwtArgs = {
  token: Scalars['String']['input'];
};


export type QueryValidateJwtArgs = {
  token: Scalars['String']['input'];
};

export type RefreshTokenInvalidError = {
  __typename?: 'RefreshTokenInvalidError';
  message: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  userId: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token: string } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;