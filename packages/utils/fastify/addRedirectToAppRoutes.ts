import Path from 'path'
import Url from 'url'

import type { FastifyInstance } from 'fastify'

export const addRedirectToAppRoutes = (app: FastifyInstance) => {
  app.route({
    url: '/redirect-to-app/:appScheme/:path',
    method: 'GET',
    handler: async (req, res) => {
      const queryStr = req.url.split('?')[1] // could be anything
      const queryStrPart = queryStr ? `?${queryStr}` : ''
      const params = req.params as {readonly appScheme: string, readonly path: string}
      const redirectTo = `${params.appScheme}://${params.path}${queryStrPart}`

      return res.redirect(redirectTo)
    },
  })

  app.route({
    url: `/redirect-to-app/:appScheme`,
    method: 'GET',
    handler: async (req, res) => {
      const queryStr = req.url.split('?')[1] // could be anything
      const queryStrPart = queryStr ? `?${queryStr}` : ''
      const params = req.params as {readonly appScheme: string}
      const redirectTo = `${params.appScheme}://${queryStrPart}`

      return res.redirect(redirectTo)
    },
  })
}

export const getRedirectUrl = (baseUrlToSelf: string, redirectUrlToAppOrWeb: string) => {
  const url = new Url.URL(baseUrlToSelf)

  const [scheme, path] = redirectUrlToAppOrWeb.split('://')

  if (!scheme) {
    throw new Error('redirectUrl must have a scheme specified')
  }

  if (scheme?.startsWith('http')) {
    return redirectUrlToAppOrWeb
  }
  // eslint-disable-next-line functional/immutable-data
  url.pathname = Path.join('redirect-to-app', scheme, path || '')
  return url.toString()
}

export default addRedirectToAppRoutes
