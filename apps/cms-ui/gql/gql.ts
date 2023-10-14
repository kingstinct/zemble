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
    "\n  query GetEntityByNamePlural($namePlural: String!) { \n    getEntityByNamePlural(namePlural: $namePlural) { \n      nameSingular\n      namePlural\n      fields { \n        __typename \n        name\n        isRequired\n        isRequiredInput\n\n        ... on EntityRelationField {\n          entityNamePlural\n        }\n\n        ... on StringField {\n          defaultValueString: defaultValue\n          isSearchable\n        }\n        \n        ... on NumberField {\n          defaultValueNumber: defaultValue\n        }\n        \n        ... on  BooleanField{\n          defaultValueBoolean: defaultValue\n        }\n        ... on ArrayField {\n          availableFields {\n            name\n            ... on EntityRelationField {\n              entityNamePlural\n            }\n            __typename\n          }\n        }\n      } \n    } \n  }\n": types.GetEntityByNamePluralDocument,
    "\n  query GetEntities {\n    getAllEntities {\n      nameSingular\n      namePlural\n      fields {\n        name\n        isRequired\n      }\n    }\n  }\n": types.GetEntitiesDocument,
    "\nmutation CreateEntity($nameSingular: String, $namePlural: String!) {\n  createEntity(nameSingular: $nameSingular, namePlural: $namePlural) {\n    nameSingular\n  }\n}\n": types.CreateEntityDocument,
    "\n  query GetUsers {\n    users {\n      email\n    }\n  }\n": types.GetUsersDocument,
    "\n  mutation AddFieldsToEntity($namePlural: String!, $fields: [FieldInput!]!) {\n    addFieldsToEntity(namePlural: $namePlural, fields: $fields) {\n      namePlural\n    }\n  }\n": types.AddFieldsToEntityDocument,
    "\n  mutation RemoveFieldsFromEntity($namePlural: String!, $fields: [String!]!) {\n    removeFieldsFromEntity(namePlural: $namePlural, fields: $fields) {\n      namePlural\n      fields {\n        __typename\n        name\n      }\n    }\n  }\n": types.RemoveFieldsFromEntityDocument,
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
export function graphql(source: "\n  query GetEntityByNamePlural($namePlural: String!) { \n    getEntityByNamePlural(namePlural: $namePlural) { \n      nameSingular\n      namePlural\n      fields { \n        __typename \n        name\n        isRequired\n        isRequiredInput\n\n        ... on EntityRelationField {\n          entityNamePlural\n        }\n\n        ... on StringField {\n          defaultValueString: defaultValue\n          isSearchable\n        }\n        \n        ... on NumberField {\n          defaultValueNumber: defaultValue\n        }\n        \n        ... on  BooleanField{\n          defaultValueBoolean: defaultValue\n        }\n        ... on ArrayField {\n          availableFields {\n            name\n            ... on EntityRelationField {\n              entityNamePlural\n            }\n            __typename\n          }\n        }\n      } \n    } \n  }\n"): (typeof documents)["\n  query GetEntityByNamePlural($namePlural: String!) { \n    getEntityByNamePlural(namePlural: $namePlural) { \n      nameSingular\n      namePlural\n      fields { \n        __typename \n        name\n        isRequired\n        isRequiredInput\n\n        ... on EntityRelationField {\n          entityNamePlural\n        }\n\n        ... on StringField {\n          defaultValueString: defaultValue\n          isSearchable\n        }\n        \n        ... on NumberField {\n          defaultValueNumber: defaultValue\n        }\n        \n        ... on  BooleanField{\n          defaultValueBoolean: defaultValue\n        }\n        ... on ArrayField {\n          availableFields {\n            name\n            ... on EntityRelationField {\n              entityNamePlural\n            }\n            __typename\n          }\n        }\n      } \n    } \n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEntities {\n    getAllEntities {\n      nameSingular\n      namePlural\n      fields {\n        name\n        isRequired\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEntities {\n    getAllEntities {\n      nameSingular\n      namePlural\n      fields {\n        name\n        isRequired\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation CreateEntity($nameSingular: String, $namePlural: String!) {\n  createEntity(nameSingular: $nameSingular, namePlural: $namePlural) {\n    nameSingular\n  }\n}\n"): (typeof documents)["\nmutation CreateEntity($nameSingular: String, $namePlural: String!) {\n  createEntity(nameSingular: $nameSingular, namePlural: $namePlural) {\n    nameSingular\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUsers {\n    users {\n      email\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    users {\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddFieldsToEntity($namePlural: String!, $fields: [FieldInput!]!) {\n    addFieldsToEntity(namePlural: $namePlural, fields: $fields) {\n      namePlural\n    }\n  }\n"): (typeof documents)["\n  mutation AddFieldsToEntity($namePlural: String!, $fields: [FieldInput!]!) {\n    addFieldsToEntity(namePlural: $namePlural, fields: $fields) {\n      namePlural\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveFieldsFromEntity($namePlural: String!, $fields: [String!]!) {\n    removeFieldsFromEntity(namePlural: $namePlural, fields: $fields) {\n      namePlural\n      fields {\n        __typename\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveFieldsFromEntity($namePlural: String!, $fields: [String!]!) {\n    removeFieldsFromEntity(namePlural: $namePlural, fields: $fields) {\n      namePlural\n      fields {\n        __typename\n        name\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;