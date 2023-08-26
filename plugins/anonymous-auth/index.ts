/* eslint-disable react-hooks/rules-of-hooks */

import { useEngine, useExtendContext } from '@envelop/core'
import { useGenericAuth } from '@envelop/generic-auth'
import { PluginConfig } from '@readapt/core/types'
import graphqlYoga from '@readapt/graphql-yoga'
import {
  execute, parse, specifiedRules, subscribe, validate,
} from 'graphql'
import {
  getCookie,
} from 'hono/cookie'
import { decodeToken } from 'readapt-plugin-auth/utils/isValid'

export default new PluginConfig(__dirname, {
  middlewareDependencies: [
    {
      middleware: graphqlYoga.configureMiddleware({
        yoga: {
          plugins: [
            useEngine({
              parse, validate, specifiedRules, execute, subscribe,
            }),
            useExtendContext(async (context: Readapt.GraphQLContext) => {
              const headerToken = context.request.headers.get('authorization')?.split(' ')[1],
                    cookieToken = getCookie(context.honoContext).authorization,
                    token = headerToken ?? cookieToken,
                    decodedToken = token ? decodeToken(token) : undefined

              console.log({
                headerToken, cookieToken, token, decodedToken,
              })
              return {
                token,
                decodedToken,
              }
            }),
            useGenericAuth<Readapt.TokenContents, Readapt.GraphQLContext>({
              resolveUserFn: (context) => context.decodedToken,
              mode: 'protect-all',
            }),
          ],
        },
      }),
    },
  ],
})
