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
};

export type CodeNotValidError = Error & {
  __typename?: 'CodeNotValidError';
  message: Scalars['String']['output'];
};

export type EmailNotValidError = Error & {
  __typename?: 'EmailNotValidError';
  message: Scalars['String']['output'];
};

export type Error = {
  message: Scalars['String']['output'];
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
  loginConfirm: LoginConfirmResponse;
  loginRequest: LoginRequestResponse;
};


export type MutationLoginConfirmArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationLoginRequestArgs = {
  email: Scalars['String']['input'];
};
