import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'
// import https from 'node:https'
import * as tls from 'node:tls'

import type { PostHogOptions } from 'posthog-node'

type PhRegion = 'us' | 'eu'

interface Config extends Zemble.GlobalConfig {
  readonly PH_API_KEY: string
  readonly PH_REGION?: PhRegion
  readonly PH_HOST?: string,
  readonly PH_API_HOST?: string,
  readonly PH_ASSET_HOST?: string,
  readonly PH_INGEST_PATH?: string

  readonly postHogOptions?: PostHogOptions
}

const defaultConfig = {
  PH_REGION: process.env.PH_REGION as PhRegion ?? 'us',
  PH_HOST: process.env.PH_HOST,
  PH_API_KEY: process.env.PH_API_KEY ?? '',
  PH_API_HOST: process.env.PH_API_HOST,
  PH_ASSET_HOST: process.env.PH_ASSET_HOST,
  PH_INGEST_PATH: process.env.PH_INGEST_PATH ?? '/ph-ingest',
} satisfies Config

// const agent = new https.Agent({
//   rejectUnauthorized: false,
// })

export default new Plugin<Config, typeof defaultConfig>(
  import.meta.dir,
  {
    defaultConfig,
    middleware: async ({ app, config, logger }) => {
      const {
        PH_REGION, PH_API_KEY, PH_API_HOST, PH_ASSET_HOST, PH_INGEST_PATH,
      } = config

      if (!PH_API_KEY || PH_API_KEY === '') {
        throw new Error('PH_API_KEY not set')
      }

      if (!['us', 'eu'].includes(PH_REGION)) {
        logger.warn('Expected PH_REGION to be either "us" or "eu"')
      }

      const phHost = PH_API_HOST ?? `${PH_REGION}.i.posthog.com`
      const phAssetHost = PH_ASSET_HOST ?? `${PH_REGION}-assets.i.posthog.com`

      console.log('phHost', phHost)

      app.hono.all(`${PH_INGEST_PATH}/static/*`, async (ctx) => {
        const path = ctx.req.path.replace(PH_INGEST_PATH, '')

        console.log('path', path)
        console.log('headers', ctx.req.header())

        const res = await fetch(`https://${phAssetHost}${path}`, {
          method: ctx.req.method,
          body: ctx.req.raw.body,
          headers: {
            ...ctx.req.header(),
            host: phAssetHost.replace('https://', ''),
          },
          /* tls: {
            rejectUnauthorized: false,
            checkServerIdentity: (hostname: string, cert: tls.PeerCertificate): Error | undefined => {
              console.log('checkServerIdentity', hostname)
              if (hostname.includes('posthog.com')) {
                return undefined
              }
              /// here you can add a custom check for specific cert and/or hostname
              return tls.checkServerIdentity(hostname, cert)
            },
          },
          cache: 'no-cache', */
        }).catch((err) => {
          console.error(err)
          throw err
        })

        const resHeaders = res.headers.toJSON()

        console.log('resHeaders', resHeaders)
        delete resHeaders['content-encoding']
        return ctx.newResponse(res.body, res.status as 200, resHeaders)
      })

      app.hono.all(`${PH_INGEST_PATH}/*`, async (ctx) => {
        const url = new URL(ctx.req.url)
        // eslint-disable-next-line functional/immutable-data
        url.pathname = url.pathname.replace(PH_INGEST_PATH, '')
        // eslint-disable-next-line functional/immutable-data
        url.host = phHost
        url.port = '443'
        // eslint-disable-next-line functional/immutable-data
        url.protocol = 'https:'

        // console.log('url.host', url.host.toString())
        console.log('url', url.toString())
        console.log('data', await ctx.req.text())

        const res = await fetch(url, {
          method: ctx.req.method,
          body: ctx.req.raw.body,
          headers: {
            ...ctx.req.header(),
            host: phHost.replace('https://', ''),
          },
          /* tls: {
            rejectUnauthorized: false,
            checkServerIdentity: (hostname: string, cert: tls.PeerCertificate): Error | undefined => {
              console.log('checkServerIdentity', hostname)
              if (hostname.includes('posthog.com')) {
                return undefined
              }
              /// here you can add a custom check for specific cert and/or hostname
              return tls.checkServerIdentity(hostname, cert)
            },
          },
          cache: 'no-cache', */
        }).catch((err) => {
          console.error(url.toString(), err)
          throw err
        })

        const resHeaders = res.headers.toJSON()

        console.log(`${url.toString()}: ${res.statusText}`, await res.text())
        delete resHeaders['content-encoding']
        return ctx.newResponse(res.body, res.status as 200, resHeaders)
      })
    },
    dependencies: [{ plugin: GraphQL }, { plugin: Routes }],
  },
)
