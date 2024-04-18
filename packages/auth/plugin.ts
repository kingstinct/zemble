/* eslint-disable react-hooks/rules-of-hooks */
import { useExtendContext } from '@envelop/core'
import { useGenericAuth } from '@envelop/generic-auth'
import { Plugin, type TokenContents } from '@zemble/core'
import graphqlYoga from '@zemble/graphql'
import kv from '@zemble/kv'
import {
  Kind,
  GraphQLError,
} from 'graphql'
import { getCookie } from 'hono/cookie'

import { refreshToken, refreshTokensFromPrevious } from './graphql/Mutation/refreshToken'
import { decodeToken, decodeToken as defaultDecodeToken } from './utils/decodeToken'
import { handleValueNode, transformObjectNode } from './utils/graphqlToJSMappers'
import { setTokenCookies } from './utils/setBearerTokenCookie'

import type {
  ExecutionArgs, FieldNode, GraphQLObjectType, ObjectValueNode,
} from 'graphql'
import type { Context } from 'hono'
import type { CookieOptions } from 'hono/utils/cookie'
import type { JWTPayload } from 'jose'

const ISSUER = process.env.ISSUER ?? '@zemble/auth'

interface AuthConfig extends Zemble.GlobalConfig {
  readonly bearerTokenExpiryInSeconds?: number
  readonly refreshTokenExpiryInSeconds?: number
  readonly PUBLIC_KEY?: string;
  readonly PRIVATE_KEY?: string;
  readonly ISSUER?: string;
  readonly headerName?: string
  readonly decodeToken?: typeof defaultDecodeToken
  /**
   * Extra custom logic to check if a token invalid, for example if it needs refreshing (after authorization change) or if the user has "signed out of all devices"
   * @param bearerToken
   * @returns
   */
  readonly checkIfBearerTokenIsValid?: (bearerToken: TokenContents) => Promise<true | GraphQLError> | true | GraphQLError
  readonly invalidateToken?: (sub: string, token: string) => Promise<void> | void
  readonly invalidateAllTokens?: (sub: string) => Promise<void> | void
  readonly checkTokenValidity?: (token: string, decodedToken: TokenContents) => Promise<boolean> | boolean
  readonly reissueBearerToken?: (
    bearerToken: TokenContents
  ) => Promise<TokenContents> | TokenContents
  readonly cookies?: {
    readonly bearerTokenCookieName?: string
    readonly refreshTokenCookieName?: string
    readonly isEnabled?: boolean
    readonly opts?: (expiresInMs: number) => CookieOptions
  }
}

function isGraphQlWsContext(context: Context | Zemble.GraphQlWsContext): context is Zemble.GraphQlWsContext {
  return 'connectionParams' in context
}

const validateIncludes = (matchValueNode: ObjectValueNode, decodedToken: Record<string, unknown>,
  { executionArgs, fieldNode, objectType }: { readonly fieldNode: FieldNode; readonly objectType: GraphQLObjectType; readonly executionArgs: ExecutionArgs }) => {
  const matcher = transformObjectNode(matchValueNode, { executionArgs, fieldNode, objectType })

  let errors: readonly GraphQLError[] = []

  const isValid = decodedToken && Object.entries(matcher).every(([arrayName, value]) => {
    const arrayVal = decodedToken[arrayName]
    if (Array.isArray(arrayVal)) {
      const hasMatch = arrayVal.some((v) => {
        if (value && typeof value === 'object' && typeof v === 'object' && v != null) {
          return Object.entries(value).every(([key, val]) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const isPropValid = v[key] === val

            return isPropValid
          })
        }
        return v === value
      })

      if (!hasMatch) {
        errors = [...errors, new GraphQLError(`Accessing '${objectType.name}.${fieldNode?.name.value}' requires token including arrays matching ${JSON.stringify(matcher)}.`)]
      }
      return hasMatch
    }
    errors = [...errors, new GraphQLError(`Accessing '${objectType.name}.${fieldNode?.name.value}' requires token including array '${arrayName}'.`)]
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
    errors: isValid ? [] : [new GraphQLError(`Accessing '${objectType.name}.${fieldNode?.name.value}' requires token matching ${JSON.stringify(matcher)}.`)],
  }
}

const defaultConfig = {
  ISSUER,
  headerName: 'authorization',
  bearerTokenExpiryInSeconds: 60 * 60 * 1, // 1 hour
  refreshTokenExpiryInSeconds: 60 * 60 * 24, // 24 hours
  checkTokenValidity: async (token, decodedToken) => {
    // we need to force sub to be set for all tokens for this to work
    const isInvalid = await plugin.providers.kv('invalid-tokens').get(`${(decodedToken as JWTPayload).sub}:${token}`)
    if (isInvalid) {
      return false
    }

    const wasInvalidatedAt = await plugin.providers.kv('tokens-invalidated-at').get(decodedToken.sub)
    if (wasInvalidatedAt) {
      return new Date(wasInvalidatedAt) > new Date()
    }

    return true
  },
  invalidateAllTokens: async (sub) => {
    await plugin.providers.kv('tokens-invalidated-at').set(sub, new Date().toString())
  },
  invalidateToken: async (sub, token) => {
    await plugin.providers.kv('invalid-tokens').set(`${sub}:${token}`, true)
  },
  reissueBearerToken: (decodedToken) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('reissueBearerToken not implemented, just reissuing the same token in dev - will crash in production!')
      return decodedToken
    }

    throw new Error('reissueBearerToken not implemented')
  },
  cookies: {
    bearerTokenCookieName: 'authorization',
    refreshTokenCookieName: 'refresh',
    isEnabled: true as boolean,
    opts: (expiresInMs: number) => ({
      sameSite: 'Lax',
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(Date.now() + expiresInMs),
    }),
  },
} satisfies AuthConfig

type ResolveTokensArgs = {
  readonly config: AuthConfig & typeof defaultConfig,
  readonly context: Context | Zemble.GraphQlWsContext,
  readonly decodeToken?: typeof defaultDecodeToken
}

const resolveTokens = async ({ config, context, decodeToken = defaultDecodeToken }: ResolveTokensArgs) => {
  const isWs = isGraphQlWsContext(context),

        headerName = config.headerName ?? 'authorization',
        headerToken = isWs ? context.connectionParams?.authorization.split(' ')[1] : context.req.header(headerName)?.split(' ')[1],
        cookieToken = config.cookies.isEnabled && !isWs !== false ? getCookie(context)[config.cookies.bearerTokenCookieName] : undefined,
        refreshToken = config.cookies.isEnabled && !isWs !== false ? getCookie(context)[config.cookies.refreshTokenCookieName] : undefined,
        token = headerToken ?? cookieToken

  return {
    token,
    refreshToken,
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface HonoVariables {
      // eslint-disable-next-line functional/prefer-readonly-type
      token: string | undefined
      // eslint-disable-next-line functional/prefer-readonly-type
      decodedToken: TokenContents | undefined
    }
  }
}

const plugin = new Plugin<AuthConfig, typeof defaultConfig>(
  import.meta.dir,
  {
    middleware: ({ config, app: { hono } }) => {
      hono.use('*', async (context, next) => {
        const { token, refreshToken } = await resolveTokens({
          config,
          context,
          decodeToken: plugin.config.decodeToken,
        })

        let bearerToken = token

        if (plugin.config.cookies.isEnabled && token && refreshToken) {
          const { bearerToken: newBearerToken, refreshToken: newRefreshToken } = await refreshTokensFromPrevious(token, refreshToken)
          bearerToken = newBearerToken
          setTokenCookies(context, newBearerToken, newRefreshToken)
        }

        const decodedToken = token ? await decodeToken(token) : undefined

        context.set('token', token)
        context.set('decodedToken', decodedToken)

        await next()
      })
    },
    dependencies: ({ config }) => {
      const gql = graphqlYoga.configure({
        yoga: {
          plugins: [
            useExtendContext(async (context: Zemble.GraphQLContext | Zemble.GraphQlWsContext) => {
              const isGraphQLContext = 'honoContext' in context

              const { token } = await resolveTokens({
                config,
                context: isGraphQLContext ? context.honoContext : context,
                decodeToken: plugin.config.decodeToken,
              })

              return {
                token,
                decodedToken: token ? await decodeToken(token) : undefined,
              }
            }),
            useGenericAuth<{ readonly decodedToken: Record<string, unknown> | null, readonly error?: GraphQLError }, Zemble.GraphQLContext>({
              resolveUserFn: async (context) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { decodedToken } = context as any

                if (!decodedToken) {
                  return { decodedToken: null, error: undefined }
                }

                if (decodedToken && plugin.config.checkIfBearerTokenIsValid) {
                  const error = await plugin.config.checkIfBearerTokenIsValid?.(decodedToken)
                  if (error !== true) {
                    return { decodedToken, error }
                  }
                }
                return { decodedToken }
              },
              validateUser: ({
                fieldAuthDirectiveNode, user, fieldNode, objectType, executionArgs,
              }) => {
                const { decodedToken, error } = user
                if (error) {
                  return error
                }
                if (!decodedToken) {
                  let skipValidation = false
                  const skipArg = fieldAuthDirectiveNode?.arguments?.find(
                    (arg) => arg.name.value === 'skip',
                  )

                  if (skipArg?.value.kind === Kind.BOOLEAN) {
                    skipValidation = skipArg.value.value
                  }

                  if (!skipValidation) {
                    return new GraphQLError(`Accessing '${objectType.name}.${fieldNode?.name.value}' requires authentication.`)
                  }
                } else {
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
                      return new GraphQLError(`Accessing '${objectType.name}.${fieldNode?.name.value}' requires token including arrays matching one of ${JSON.stringify(val)}.`)
                    }
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
        {
          plugin: kv,
        },
      ]
    },
    defaultConfig,
  },
)

export default plugin
