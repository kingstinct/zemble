/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  GraphQLObjectType,
  GraphQLString, GraphQLList,
  GraphQLID,
  GraphQLFloat, GraphQLBoolean,
  GraphQLUnionType, Kind,
  GraphQLInputObjectType,
} from 'graphql'

import {
  capitalize,
} from '../utils'

import type {
  ArrayFieldType,
  EntityRelationType,
  EntityType,
} from '../clients/papr'
import type {
  BooleanField,
  IdField,
  EntityRelationField,
  NumberField,
  ArrayField,
  StringField,
} from '../graphql/schema.generated'
import type {
  GraphQLOutputType,
  GraphQLScalarType,
  GraphQLInputObjectTypeConfig,
} from 'graphql'

type IField = NumberField | StringField | BooleanField | IdField | EntityRelationType | ArrayFieldType

let types: Record<string, GraphQLUnionType | GraphQLObjectType> = {}

function typeDeduper<T extends GraphQLUnionType | GraphQLObjectType>(type: T): T {
  if (types[type.name]) {
    return types[type.name] as T
  }
  // eslint-disable-next-line functional/immutable-data
  types[type.name] = type
  return type
}

export const resetTypes = () => {
  types = {}
}

const mapRelationField = (entityName: string, data: string) => ({ __typename: `${capitalize(entityName)}Relation`, externalId: data })

export const fieldToOutputType = (
  typePrefix: string,
  field: IField,
  relationTypes: Record<string, GraphQLObjectType>,
): GraphQLScalarType | GraphQLList<GraphQLOutputType> | GraphQLObjectType => {
  switch (field.__typename) {
    case 'NumberField':
      return GraphQLFloat
    case 'BooleanField':
      return GraphQLBoolean
    case 'IDField':
      return GraphQLID
    case 'ArrayField':
      // eslint-disable-next-line no-case-declarations
      const availableFields = field.availableFields.map((f) => {
        const resolvedType = fieldToOutputType(typePrefix, f as any, relationTypes)

        return typeDeduper(new GraphQLObjectType({
          name: `${capitalize(typePrefix)}${capitalize(field.name)}${capitalize(f.name)}`.replaceAll(' ', '_'),
          fields: {
            [f.name.replaceAll(' ', '_')]: {
              type: resolvedType,
            },
          },
        }))
      })

      // eslint-disable-next-line no-case-declarations
      const union = typeDeduper(new GraphQLUnionType({
        name: `${capitalize(typePrefix)}${capitalize(field.name)}Union`.replaceAll(' ', '_'),
        types: availableFields,
      }))
      return new GraphQLList(union)
    case 'EntityRelationField':
      // eslint-disable-next-line no-case-declarations
      const relatedType = relationTypes[field.entityName]

      // just fallback to something if there is no type, for now
      return relatedType ? typeDeduper(relatedType) : GraphQLString
    default:
      return GraphQLString
  }
}

export const fieldToInputType = (typePrefix: string, field: IField): GraphQLScalarType | GraphQLList<GraphQLInputObjectType> | GraphQLInputObjectType => {
  switch (field.__typename) {
    case 'NumberField':
      return GraphQLFloat
    case 'BooleanField':
      return GraphQLBoolean
    case 'IDField':
      return GraphQLID
    case 'EntityRelationField':
      return GraphQLID
    case 'ArrayField':
      // eslint-disable-next-line no-case-declarations
      const availableFields = field.availableFields.reduce<GraphQLInputObjectTypeConfig>((prev, f) => ({
        ...prev,
        fields: {
          ...prev.fields,
          [f.name.replaceAll(' ', '_')]: {
            type: fieldToInputType(typePrefix, f as any),
          },
        },
      }), {
        name: `${capitalize(typePrefix)}${capitalize(field.name)}Input`,
        fields: {},
        extensionASTNodes: [
          {
            name: {
              kind: Kind.NAME,
              value: 'extension',
            },
            directives: [
              {
                kind: Kind.DIRECTIVE,
                name: {
                  kind: Kind.NAME,
                  value: 'oneOf',
                },
              },
            ],
            kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
          },
        ],
      } as GraphQLInputObjectTypeConfig)
      return new GraphQLList(new GraphQLInputObjectType(availableFields))
    default:
      return GraphQLString
  }
}

// modifies input data so it can be saved to the db
export const createTraverser = (entity: EntityType) => {
  const fields = Object.values(entity.fields)

  const entityRelationFieldNamesWithEntity = {
    ...fields.filter((f) => f.__typename === 'EntityRelationField').reduce((prev, f) => ({
      ...prev,
      [f.name]: (f as EntityRelationField).entityName,
    }), {} as Record<string, string>),

    // get those deep entity relation fields, could probaby be cleaned up
    ...fields.filter((f) => f.__typename === 'ArrayField').reduce((prev, f) => ({
      ...(f as unknown as ArrayField).availableFields.filter((f) => (f as IField).__typename === 'EntityRelationField').reduce((prev, f) => ({
        ...prev,
        [f.name.replaceAll(' ', '_')]: (f as EntityRelationField).entityName,
      }), prev),
    }), {} as Record<string, string>),
  }

  // eslint-disable-next-line arrow-body-style
  const fieldValueMapper = (key: string, data: Record<string, unknown>) => {
    return Array.isArray(data[key])
      ? mapArrayFields(key, data[key] as Record<string, unknown> | readonly Record<string, unknown>[]) : (entityRelationFieldNamesWithEntity[key]
        ? mapRelationField(entityRelationFieldNamesWithEntity[key], data[key] as string)
        : data[key])
  }

  const traverseData = (data: Record<string, unknown>) => Object.keys(data).reduce((prev, key) => ({
    ...prev,
    [key]: fieldValueMapper(key, data),
  }), {} as Record<string, unknown>)

  const mapArrayFields = (
    fieldName: string,
    data: Record<string, unknown> | readonly Record<string, unknown>[],
  ) => (Array.isArray(data) ? data : [data]).map((el: Record<string, unknown>): Record<string, unknown> => ({
    __typename: (capitalize(entity.name) + capitalize(fieldName) + capitalize(Object.keys(el)[0])).replaceAll(' ', '_'),
    ...traverseData(el),
  }))

  return traverseData
}
