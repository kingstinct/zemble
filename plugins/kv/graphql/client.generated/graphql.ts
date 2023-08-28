/* eslint-disable */
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
  JSON: { input: any; output: any; }
};

export type Mutation = {
  __typename?: 'Mutation';
  clear: Scalars['Boolean']['output'];
  delete: Scalars['Boolean']['output'];
  set: Scalars['Boolean']['output'];
};


export type MutationClearArgs = {
  prefix: Scalars['String']['input'];
};


export type MutationDeleteArgs = {
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
};


export type MutationSetArgs = {
  expireAfterSeconds?: InputMaybe<Scalars['Int']['input']>;
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
  value: Scalars['JSON']['input'];
};

export type Query = {
  __typename?: 'Query';
  entries: Array<Scalars['JSON']['output']>;
  get?: Maybe<Scalars['JSON']['output']>;
  has: Scalars['Boolean']['output'];
  keys: Array<Scalars['String']['output']>;
  size: Scalars['Int']['output'];
  values: Array<Scalars['JSON']['output']>;
};


export type QueryEntriesArgs = {
  prefix: Scalars['String']['input'];
};


export type QueryGetArgs = {
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
};


export type QueryHasArgs = {
  key: Scalars['String']['input'];
  prefix: Scalars['String']['input'];
};


export type QueryKeysArgs = {
  prefix: Scalars['String']['input'];
};


export type QuerySizeArgs = {
  prefix: Scalars['String']['input'];
};


export type QueryValuesArgs = {
  prefix: Scalars['String']['input'];
};
