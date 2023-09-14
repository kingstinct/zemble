/* eslint-disable react-hooks/rules-of-hooks */
import { Kind } from 'graphql'

import type {
  ExecutionArgs, FieldNode, GraphQLObjectType, ObjectValueNode, ValueNode,
} from 'graphql'

export const getVariableReferenceSimple = (
  referenceWithPrefix: string, {
    fieldNode,
    objectType,
    executionArgs,
  }: { readonly fieldNode: FieldNode; readonly objectType: GraphQLObjectType; readonly executionArgs: ExecutionArgs },
) => {
  const variableName = referenceWithPrefix.substring(1)

  const argument = fieldNode.arguments?.find(
    (arg) => arg.name.value === variableName,
  )

  if (!argument) {
    throw new Error(`Could not find argument '${variableName}' in '${objectType.name}.${fieldNode?.name.value}'`)
  }

  if ('value' in argument.value) {
    const valueToMatch = argument.value.value
    return valueToMatch
  } if (argument.value.kind === Kind.VARIABLE) {
    const valueFromVariable = executionArgs?.variableValues?.[argument.value.name.value]

    return valueFromVariable
  }

  // more to handle here
  return null
}

export const handleValueNode = (
  value: ValueNode, {
    fieldNode,
    objectType,
    executionArgs,
  }: { readonly fieldNode: FieldNode; readonly objectType: GraphQLObjectType; readonly executionArgs: ExecutionArgs },
): unknown => {
  if (value.kind === Kind.STRING) {
    if (value.value.startsWith('$')) {
      return getVariableReferenceSimple(value.value, { fieldNode, objectType, executionArgs })
    }
    return value.value
  }
  if (value.kind === Kind.OBJECT) {
    return transformObjectNode(value, { executionArgs, fieldNode, objectType })
  }
  if (value.kind === Kind.LIST) {
    return value.values.map((v) => handleValueNode(v, { executionArgs, fieldNode, objectType }))
  }
  if (value.kind === Kind.NULL) {
    return null
  }
  if (value.kind === Kind.BOOLEAN) {
    return value.value
  }
  if (value.kind === Kind.INT) {
    return parseInt(value.value, 10)
  }
  if (value.kind === Kind.FLOAT) {
    return parseFloat(value.value)
  }
  if (value.kind === Kind.ENUM) {
    return value.value
  }

  const valueFromVariable = executionArgs?.variableValues?.[value.name.value]
  return valueFromVariable
}

export const transformObjectNode = (
  objectNode: ObjectValueNode,
  {
    fieldNode,
    objectType,
    executionArgs,
  }: { readonly fieldNode: FieldNode; readonly objectType: GraphQLObjectType; readonly executionArgs: ExecutionArgs },
): Record<string, unknown> => {
  const { fields } = objectNode
  return fields.reduce((acc, field) => ({
    ...acc,
    [field.name.value]: handleValueNode(field.value, { executionArgs, fieldNode, objectType }),
  }), {})
}
