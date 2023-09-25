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
    "\n  mutation RemoveEntity($name: String!) {\n    removeEntity(name: $name)\n  }\n": types.RemoveEntityDocument,
    "\n  mutation RemoveFieldsFromEntity($name: String!, $fields: [String!]!) {\n    removeFieldsFromEntity(entityName: $name, fields: $fields) {\n      name\n      fields {\n        __typename\n        name\n      }\n    }\n  }\n": types.RemoveFieldsFromEntityDocument,
    "\n  mutation RenameEntity($fromName: String!,$toName: String!, $pluralizedName: String!) {\n    renameEntity(fromName: $fromName, toName: $toName, pluralizedName: $pluralizedName) {\n      name\n      pluralizedName\n    }\n  }\n": types.RenameEntityDocument,
    "\n  mutation CreateEntity($name: String!, $pluralizedName: String!) {\n    createEntity(name: $name, pluralizedName: $pluralizedName) {\n      name\n    }\n  }\n": types.CreateEntityDocument,
    "\n  mutation AddFieldsToEntity($name: String!, $fields: [FieldInput!]!) {\n    addFieldsToEntity(entityName: $name, fields: $fields) {\n      name\n    }\n  }\n": types.AddFieldsToEntityDocument,
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
export function graphql(source: "\n  mutation RemoveEntity($name: String!) {\n    removeEntity(name: $name)\n  }\n"): (typeof documents)["\n  mutation RemoveEntity($name: String!) {\n    removeEntity(name: $name)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveFieldsFromEntity($name: String!, $fields: [String!]!) {\n    removeFieldsFromEntity(entityName: $name, fields: $fields) {\n      name\n      fields {\n        __typename\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveFieldsFromEntity($name: String!, $fields: [String!]!) {\n    removeFieldsFromEntity(entityName: $name, fields: $fields) {\n      name\n      fields {\n        __typename\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RenameEntity($fromName: String!,$toName: String!, $pluralizedName: String!) {\n    renameEntity(fromName: $fromName, toName: $toName, pluralizedName: $pluralizedName) {\n      name\n      pluralizedName\n    }\n  }\n"): (typeof documents)["\n  mutation RenameEntity($fromName: String!,$toName: String!, $pluralizedName: String!) {\n    renameEntity(fromName: $fromName, toName: $toName, pluralizedName: $pluralizedName) {\n      name\n      pluralizedName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateEntity($name: String!, $pluralizedName: String!) {\n    createEntity(name: $name, pluralizedName: $pluralizedName) {\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEntity($name: String!, $pluralizedName: String!) {\n    createEntity(name: $name, pluralizedName: $pluralizedName) {\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddFieldsToEntity($name: String!, $fields: [FieldInput!]!) {\n    addFieldsToEntity(entityName: $name, fields: $fields) {\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation AddFieldsToEntity($name: String!, $fields: [FieldInput!]!) {\n    addFieldsToEntity(entityName: $name, fields: $fields) {\n      name\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;