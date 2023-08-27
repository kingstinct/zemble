/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react-hooks/rules-of-hooks */

import { useExtendContext } from '@envelop/core'
import { useGenericAuth } from '@envelop/generic-auth'
import { Plugin } from '@readapt/core'
import graphqlYoga from '@readapt/graphql-yoga'
import {
  getCookie,
} from 'hono/cookie'
import { decodeToken } from 'readapt-plugin-auth/utils/isValid'

type AnonymousAuthConfig = {
  readonly cookieName?: string
  readonly enableCookieAuth?: boolean
  readonly headerName?: string
}

// todo [>0.0.1]: can we do this dynamically?
declare global {
  namespace Readapt {
    interface ConfigPerPlugin {
      readonly ['readapt-plugin-anonymous-auth']: AnonymousAuthConfig
    }
  }
}

const defaultConfig = {
  cookieName: 'authorization',
  enableCookieAuth: true,
  headerName: 'authorization',
} satisfies AnonymousAuthConfig

export default new Plugin<AnonymousAuthConfig>(__dirname, {
  dependencies: ({ config }) => {
    const gql = graphqlYoga.configure({
      yoga: {
        plugins: [
          useExtendContext((context: Readapt.GraphQLContext) => {
            const headerName = config.headerName ?? 'authorization',
                  headerToken = context.request.headers.get(headerName)?.split(' ')[1],
                  cookieToken = config.enableCookieAuth && config.cookieName ? getCookie(context.honoContext)[config.cookieName] : undefined,
                  token = headerToken ?? cookieToken,
                  decodedToken = token ? decodeToken(token) : undefined

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
    })

    return [
      {
        plugin: gql,
      },
    ]
  },
  defaultConfig,
})
