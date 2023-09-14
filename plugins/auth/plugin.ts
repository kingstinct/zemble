/* eslint-disable react-hooks/rules-of-hooks */
import { useExtendContext } from '@envelop/core'
import { UnauthenticatedError, useGenericAuth } from '@envelop/generic-auth'
import {
  FilterRootFields,
} from '@graphql-tools/wrap'
import { Plugin } from '@readapt/core'
import graphqlYoga from '@readapt/graphql-yoga'
import type {
GraphQLError } from 'graphql';
import {
  Kind,
  type ExecutionArgs, type FieldNode, type GraphQLObjectType, type ObjectValueNode 
} from 'graphql'
import { getCookie } from 'hono/cookie'

import { decodeToken } from './utils/decodeToken'
import { handleValueNode, transformObjectNode } from './utils/graphqlToJSMappers'

import type { CookieOptions } from 'hono/utils/cookie'

const { PUBLIC_KEY, PRIVATE_KEY } = process.env
const ISSUER = process.env.ISSUER ?? 'readapt-plugin-auth'

interface AuthConfig extends Readapt.GlobalConfig {
  readonly PUBLIC_KEY?: string;
  readonly PRIVATE_KEY?: string;
  readonly ISSUER?: string;
  readonly headerName?: string
  readonly cookies?: {
    readonly name?: string
    readonly isEnabled?: boolean
    readonly opts?: () => CookieOptions
  }
}

const validateIncludes = (matchValueNode: ObjectValueNode, decodedToken: Record<string, unknown>,
  { executionArgs, fieldNode, objectType }: { readonly fieldNode: FieldNode; readonly objectType: GraphQLObjectType; readonly executionArgs: ExecutionArgs }) => {
  const matcher = transformObjectNode(matchValueNode, { executionArgs, fieldNode, objectType })

  let errors: readonly GraphQLError[] = []

  const isValid = decodedToken && Object.entries(matcher).every(([arrayName, value]) => {
    const arrayVal = decodedToken[arrayName]
    if (Array.isArray(arrayVal)) {
      const hasMatch = arrayVal.some((v) => {
        if (value && typeof value === 'object') {
          return Object.entries(value).every(([key, val]) => {
            const isPropValid = v[key] === val

            return isPropValid
          })
        }
        return v === value
      })

      if (!hasMatch) {
        errors = [...errors, new UnauthenticatedError(`Accessing '${objectType.name}.${fieldNode?.name.value}' requires token including arrays matching ${JSON.stringify(matcher)}.`)]
      }
      return hasMatch
    }
    errors = [...errors, new UnauthenticatedError(`Accessing '${objectType.name}.${fieldNode?.name.value}' requires token including array '${arrayName}'.`)]
    return false
  })

  return {
    isValid,
    errors,
  }
}

const validateMatch = (matchValueNode: ObjectValueNode, decodedToken: Record<string, unknown>,
  { executionArgs, fieldNode, objectType }: { readonly fieldNode: FieldNode; readonly objectType: GraphQLObjectType; readonly executionArgs: ExecutionArgs }) => {
  const matcher = transformObjectNode(matchValueNode, { executionArgs, fieldNode, objectType })
  const isValid = decodedToken && Object.entries(matcher).every(([key, value]) => decodedToken[key] === value)

  return {
    isValid,
    errors: isValid ? [] : [new UnauthenticatedError(`Accessing '${objectType.name}.${fieldNode?.name.value}' requires token matching ${JSON.stringify(matcher)}.`)],
  }
}

const defaultConfig = {
  PUBLIC_KEY,
  PRIVATE_KEY,
  ISSUER,
  headerName: 'authorization',
  graphqlSchemaTransforms: process.env.PLUGIN_DEV || process.env.NODE_ENV === 'test'
    ? []
    : [
      new FilterRootFields((
        op, opName,
      ) => op === 'Query' && [
        'validateJWT',
        'readJWT',
        'publicKey',
      ].includes(opName)),
    ],
  cookies: {
    name: 'authorization',
    isEnabled: true as boolean,
    opts: () => ({
      sameSite: 'Lax',
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days
    }),
  },
} satisfies AuthConfig

const plugin = new Plugin<AuthConfig, typeof defaultConfig>(__dirname, {
  dependencies: ({ config }) => {
    const gql = graphqlYoga.configure({
      yoga: {
        plugins: [
          useExtendContext((context: Readapt.GraphQLContext) => {
            const headerName = config.headerName ?? 'authorization',
                  headerToken = context.request.headers.get(headerName)?.split(' ')[1],
                  cookieToken = config.cookies.isEnabled !== false ? getCookie(context.honoContext)[config.cookies.name] : undefined,
                  token = headerToken ?? cookieToken,
                  decodedToken = token ? decodeToken(token) : undefined

            return {
              token,
              decodedToken,
            }
          }),
          useGenericAuth<Record<string, unknown>, Readapt.GraphQLContext>({
            resolveUserFn: (context) => context.decodedToken,
            validateUser: ({
              fieldAuthDirectiveNode, user: decodedToken, fieldNode, objectType, executionArgs,
            }) => {
              if (!decodedToken) {
                let skipValidation = false
                const skipArg = fieldAuthDirectiveNode?.arguments?.find(
                  (arg) => arg.name.value === 'skip',
                )

                if (skipArg?.value.kind === Kind.BOOLEAN) {
                  skipValidation = skipArg.value.value
                }

                if (!skipArg) {
                  return new UnauthenticatedError(`Accessing '${objectType.name}.${fieldNode?.name.value}' requires authentication.`)
                }
              }

              const matchArg = fieldAuthDirectiveNode?.arguments?.find(
                (arg) => arg.name.value === 'match',
              )

              if (matchArg?.value.kind === Kind.OBJECT) {
                const { errors } = validateMatch(matchArg.value, decodedToken, { executionArgs, fieldNode, objectType })

                if (errors.length > 0) {
                  return errors[0]
                }
              }

              const includesArg = fieldAuthDirectiveNode?.arguments?.find(
                (arg) => arg.name.value === 'includes',
              )

              if (includesArg?.value.kind === Kind.OBJECT) {
                const { errors } = validateIncludes(includesArg.value, decodedToken, { executionArgs, fieldNode, objectType })

                if (errors.length > 0) {
                  return errors[0]
                }
              }

              const orArg = fieldAuthDirectiveNode?.arguments?.find(
                (arg) => arg.name.value === 'or',
              )

              if (orArg?.value.kind === Kind.LIST) {
                const valid = orArg.value.values.some((value) => {
                  if (value.kind === Kind.OBJECT) {
                    const matchArg = value.fields.find(
                      (arg) => arg.name.value === 'match',
                    )
                    if (matchArg?.value.kind === Kind.OBJECT) {
                      const { isValid } = validateMatch(matchArg.value, decodedToken, { executionArgs, fieldNode, objectType })

                      if (!isValid) {
                        return false
                      }
                    }
                    const includesArg = value.fields.find(
                      (arg) => arg.name.value === 'includes',
                    )
                    if (includesArg?.value.kind === Kind.OBJECT) {
                      const { isValid } = validateIncludes(includesArg.value, decodedToken, { executionArgs, fieldNode, objectType })

                      if (!isValid) {
                        return false
                      }
                    }
                    return true
                  }
                  throw new Error(`'${objectType.name}.${fieldNode?.name.value}' auth directive malformed`)
                })
                if (!valid) {
                  const val = handleValueNode(orArg.value, { executionArgs, fieldNode, objectType })
                  return new UnauthenticatedError(`Accessing '${objectType.name}.${fieldNode?.name.value}' requires token including arrays matching one of ${JSON.stringify(val)}.`)
                }
              }

              return undefined
            },
            mode: 'protect-all',
            directiveOrExtensionFieldName: 'auth',
          }),
        ],
      },
    })

    return [
      {
        plugin: gql,
      },
    ]
  },
  defaultConfig,
})

export default plugin
