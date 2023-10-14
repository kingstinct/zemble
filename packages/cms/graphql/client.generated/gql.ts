/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation RemoveEntity($namePlural: String!) {\n    removeEntity(namePlural: $namePlural)\n  }\n": types.RemoveEntityDocument,
    "\n  mutation RemoveFieldsFromEntity($namePlural: String!, $fields: [String!]!) {\n    removeFieldsFromEntity(namePlural: $namePlural, fields: $fields) {\n      nameSingular\n      namePlural\n      fields {\n        __typename\n        name\n      }\n    }\n  }\n": types.RemoveFieldsFromEntityDocument,
    "\n  mutation RenameEntity($fromName: String!,$toName: String!, $namePlural: String!) {\n    renameEntity(fromNamePlural: $fromName, toNameSingular: $toName, toNamePlural: $namePlural) {\n      nameSingular\n      namePlural\n    }\n  }\n": types.RenameEntityDocument,
    "\n  mutation CreateEntity($nameSingular: String!, $namePlural: String!) {\n    createEntity(nameSingular: $nameSingular, namePlural: $namePlural) {\n      nameSingular\n      namePlural\n    }\n  }\n": types.CreateEntityDocument,
    "\n  mutation AddFieldsToEntity($namePlural: String!, $fields: [FieldInput!]!) {\n    addFieldsToEntity(namePlural: $namePlural, fields: $fields) {\n      nameSingular\n      namePlural\n    }\n  }\n": types.AddFieldsToEntityDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveEntity($namePlural: String!) {\n    removeEntity(namePlural: $namePlural)\n  }\n"): (typeof documents)["\n  mutation RemoveEntity($namePlural: String!) {\n    removeEntity(namePlural: $namePlural)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveFieldsFromEntity($namePlural: String!, $fields: [String!]!) {\n    removeFieldsFromEntity(namePlural: $namePlural, fields: $fields) {\n      nameSingular\n      namePlural\n      fields {\n        __typename\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveFieldsFromEntity($namePlural: String!, $fields: [String!]!) {\n    removeFieldsFromEntity(namePlural: $namePlural, fields: $fields) {\n      nameSingular\n      namePlural\n      fields {\n        __typename\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RenameEntity($fromName: String!,$toName: String!, $namePlural: String!) {\n    renameEntity(fromNamePlural: $fromName, toNameSingular: $toName, toNamePlural: $namePlural) {\n      nameSingular\n      namePlural\n    }\n  }\n"): (typeof documents)["\n  mutation RenameEntity($fromName: String!,$toName: String!, $namePlural: String!) {\n    renameEntity(fromNamePlural: $fromName, toNameSingular: $toName, toNamePlural: $namePlural) {\n      nameSingular\n      namePlural\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateEntity($nameSingular: String!, $namePlural: String!) {\n    createEntity(nameSingular: $nameSingular, namePlural: $namePlural) {\n      nameSingular\n      namePlural\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEntity($nameSingular: String!, $namePlural: String!) {\n    createEntity(nameSingular: $nameSingular, namePlural: $namePlural) {\n      nameSingular\n      namePlural\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddFieldsToEntity($namePlural: String!, $fields: [FieldInput!]!) {\n    addFieldsToEntity(namePlural: $namePlural, fields: $fields) {\n      nameSingular\n      namePlural\n    }\n  }\n"): (typeof documents)["\n  mutation AddFieldsToEntity($namePlural: String!, $fields: [FieldInput!]!) {\n    addFieldsToEntity(namePlural: $namePlural, fields: $fields) {\n      nameSingular\n      namePlural\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;