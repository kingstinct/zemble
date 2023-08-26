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
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Job = {
  __typename?: 'Job';
  data: Scalars['JSON']['output'];
  delay?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  progress?: Maybe<Scalars['Float']['output']>;
  state: JobState;
  timestamp: Scalars['Int']['output'];
};

export enum JobState {
  Active = 'active',
  Completed = 'completed',
  Delayed = 'delayed',
  Failed = 'failed',
  Prioritized = 'prioritized',
  Waiting = 'waiting',
  WaitingChildren = 'waiting_children'
}

export enum JobType {
  Active = 'active',
  Completed = 'completed',
  Delayed = 'delayed',
  Failed = 'failed',
  Paused = 'paused',
  Prioritized = 'prioritized',
  Repeat = 'repeat',
  Wait = 'wait',
  Waiting = 'waiting',
  WaitingChildren = 'waiting_children'
}

export type Mutation = {
  __typename?: 'Mutation';
  addJob: Job;
};


export type MutationAddJobArgs = {
  queue: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  queues: Array<Queue>;
};

export type Queue = {
  __typename?: 'Queue';
  activeCount: Scalars['Int']['output'];
  completedCount: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  delayedCount: Scalars['Int']['output'];
  failedCount: Scalars['Int']['output'];
  isPaused: Scalars['Boolean']['output'];
  jobs: Array<Job>;
  name: Scalars['String']['output'];
  waitingChildrenCount: Scalars['Int']['output'];
  waitingCount: Scalars['Int']['output'];
};


export type QueueJobsArgs = {
  asc?: InputMaybe<Scalars['Boolean']['input']>;
  end?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Array<JobType>>;
};

export type Subscription = {
  __typename?: 'Subscription';
  jobUpdated: Job;
};

export type Todo = {
  __typename?: 'Todo';
  completed: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};
