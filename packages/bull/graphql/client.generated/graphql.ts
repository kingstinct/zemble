/* eslint-disable */
// @ts-nocheck
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

export type BullJob = {
  __typename?: 'BullJob';
  data?: Maybe<Scalars['JSON']['output']>;
  delay?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  progress?: Maybe<Scalars['Float']['output']>;
  repeatJobKey?: Maybe<Scalars['ID']['output']>;
  state: JobState;
  timestamp: Scalars['Int']['output'];
};

export type BullQueue = {
  __typename?: 'BullQueue';
  activeCount: Scalars['Int']['output'];
  completedCount: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  delayedCount: Scalars['Int']['output'];
  failedCount: Scalars['Int']['output'];
  isPaused: Scalars['Boolean']['output'];
  jobs: Array<BullJob>;
  name: Scalars['String']['output'];
  repeatableJobs: Array<RepeatableJob>;
  waitingChildrenCount: Scalars['Int']['output'];
  waitingCount: Scalars['Int']['output'];
};


export type BullQueueJobsArgs = {
  asc?: InputMaybe<Scalars['Boolean']['input']>;
  end?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Array<JobTypeOrState>>;
};


export type BullQueueRepeatableJobsArgs = {
  asc?: InputMaybe<Scalars['Boolean']['input']>;
  end?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Int']['input']>;
};

export enum CleanQueueType {
  Active = 'active',
  Completed = 'completed',
  Delayed = 'delayed',
  Failed = 'failed',
  Paused = 'paused',
  Prioritized = 'prioritized',
  Wait = 'wait'
}

export enum JobState {
  Active = 'active',
  Completed = 'completed',
  Delayed = 'delayed',
  Failed = 'failed',
  Prioritized = 'prioritized',
  Waiting = 'waiting',
  WaitingChildren = 'waiting_children'
}

export enum JobTypeOrState {
  Active = 'active',
  Completed = 'completed',
  Delayed = 'delayed',
  Failed = 'failed',
  Paused = 'paused',
  Prioritized = 'prioritized',
  Wait = 'wait',
  Waiting = 'waiting',
  WaitingChildren = 'waiting_children'
}

export type Mutation = {
  __typename?: 'Mutation';
  addJob: BullJob;
  addRepeatableJob: BullJob;
  cleanQueue: Array<Scalars['ID']['output']>;
  drainQueue: Scalars['Boolean']['output'];
  removeJob: Scalars['Boolean']['output'];
  removeRepeatableJob: Scalars['Boolean']['output'];
};


export type MutationAddJobArgs = {
  data?: InputMaybe<Scalars['JSON']['input']>;
  jobId?: InputMaybe<Scalars['ID']['input']>;
  queue: Scalars['String']['input'];
};


export type MutationAddRepeatableJobArgs = {
  data?: InputMaybe<Scalars['JSON']['input']>;
  pattern: Scalars['String']['input'];
  queue: Scalars['String']['input'];
  repeatJobKey?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationCleanQueueArgs = {
  grace: Scalars['Int']['input'];
  limit: Scalars['Int']['input'];
  queue: Scalars['String']['input'];
  type?: InputMaybe<CleanQueueType>;
};


export type MutationDrainQueueArgs = {
  delayed?: InputMaybe<Scalars['Boolean']['input']>;
  queue: Scalars['String']['input'];
};


export type MutationRemoveJobArgs = {
  jobId: Scalars['ID']['input'];
  queue: Scalars['String']['input'];
};


export type MutationRemoveRepeatableJobArgs = {
  queue: Scalars['String']['input'];
  repeatJobKey: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  queues: Array<BullQueue>;
};

export type RepeatableJob = {
  __typename?: 'RepeatableJob';
  endDate?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  key: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  next: Scalars['DateTime']['output'];
  pattern: Scalars['String']['output'];
  tz: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  jobUpdated: BullJob;
};
