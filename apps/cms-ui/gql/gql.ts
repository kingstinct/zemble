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
    "\n  mutation LoginConfirm($email: String!, $code: String!) {\n    loginConfirm(email: $email, code: $code) {\n      __typename\n      ... on LoginConfirmSuccessfulResponse {\n        accessToken\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.LoginConfirmDocument,
    "\n  mutation LoginRequest($email: String!) {\n    loginRequest(email: $email) {\n      __typename\n      ... on Error {\n        message\n      }\n    }\n  }\n": types.LoginRequestDocument,
    "\n  query GetEntityByPluralizedName($pluralizedName: String!) { getEntityByPluralizedName(pluralizedName: $pluralizedName) { \n    name\n    pluralizedName\n    fields { \n      name\n      __typename \n      isRequired\n      isRequiredInput\n\n      ... on StringField {\n        defaultValueString: defaultValue\n      }\n      \n      ... on NumberField {\n        defaultValueNumber: defaultValue\n      }\n      \n      ... on  BooleanField{\n        defaultValueBoolean: defaultValue\n      }\n      ... on ArrayField {\n        availableFields {\n          name\n          __typename\n        }\n      }\n   } } }\n": types.GetEntityByPluralizedNameDocument,
    "\nmutation CreateEntity($name: String!, $pluralizedName: String!) {\n  createEntity(name: $name, pluralizedName: $pluralizedName) {\n    name\n  }\n}\n": types.CreateEntityDocument,
    "\n  query GetEntities {\n    getAllEntities {\n      name\n      pluralizedName\n      fields {\n        name\n        isRequired\n      }\n    }\n  }\n": types.GetEntitiesDocument,
    "\n  query GetUsers {\n    users {\n      email\n    }\n  }\n": types.GetUsersDocument,
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
export function graphql(source: "\n  mutation LoginConfirm($email: String!, $code: String!) {\n    loginConfirm(email: $email, code: $code) {\n      __typename\n      ... on LoginConfirmSuccessfulResponse {\n        accessToken\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LoginConfirm($email: String!, $code: String!) {\n    loginConfirm(email: $email, code: $code) {\n      __typename\n      ... on LoginConfirmSuccessfulResponse {\n        accessToken\n      }\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LoginRequest($email: String!) {\n    loginRequest(email: $email) {\n      __typename\n      ... on Error {\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LoginRequest($email: String!) {\n    loginRequest(email: $email) {\n      __typename\n      ... on Error {\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEntityByPluralizedName($pluralizedName: String!) { getEntityByPluralizedName(pluralizedName: $pluralizedName) { \n    name\n    pluralizedName\n    fields { \n      name\n      __typename \n      isRequired\n      isRequiredInput\n\n      ... on StringField {\n        defaultValueString: defaultValue\n      }\n      \n      ... on NumberField {\n        defaultValueNumber: defaultValue\n      }\n      \n      ... on  BooleanField{\n        defaultValueBoolean: defaultValue\n      }\n      ... on ArrayField {\n        availableFields {\n          name\n          __typename\n        }\n      }\n   } } }\n"): (typeof documents)["\n  query GetEntityByPluralizedName($pluralizedName: String!) { getEntityByPluralizedName(pluralizedName: $pluralizedName) { \n    name\n    pluralizedName\n    fields { \n      name\n      __typename \n      isRequired\n      isRequiredInput\n\n      ... on StringField {\n        defaultValueString: defaultValue\n      }\n      \n      ... on NumberField {\n        defaultValueNumber: defaultValue\n      }\n      \n      ... on  BooleanField{\n        defaultValueBoolean: defaultValue\n      }\n      ... on ArrayField {\n        availableFields {\n          name\n          __typename\n        }\n      }\n   } } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateEntity($name: String!, $pluralizedName: String!) {\n  createEntity(name: $name, pluralizedName: $pluralizedName) {\n    name\n  }\n}\n"): (typeof documents)["\nmutation CreateEntity($name: String!, $pluralizedName: String!) {\n  createEntity(name: $name, pluralizedName: $pluralizedName) {\n    name\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEntities {\n    getAllEntities {\n      name\n      pluralizedName\n      fields {\n        name\n        isRequired\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEntities {\n    getAllEntities {\n      name\n      pluralizedName\n      fields {\n        name\n        isRequired\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers {\n    users {\n      email\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    users {\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddFieldsToEntity($name: String!, $fields: [FieldInput!]!) {\n    addFieldsToEntity(entityName: $name, fields: $fields) {\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation AddFieldsToEntity($name: String!, $fields: [FieldInput!]!) {\n    addFieldsToEntity(entityName: $name, fields: $fields) {\n      name\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;