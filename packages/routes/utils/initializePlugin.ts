import { stream } from 'hono/streaming'
import * as fs from 'node:fs'
import * as path from 'node:path'

import readRoutes from './readRoutes'

import type { RoutesGlobalConfig } from '../plugin'
import type { IStandardLogger } from '@zemble/core'
import type { MiddlewareHandler } from 'hono'

const httpVerbs = [
  'get', 'post', 'put', 'delete', 'patch',
] as const

const fileExtensionToMimeType: Record<string, string> = {
  '.aac': 'audio/aac',
  '.abw': 'application/x-abiword',
  '.arc': 'application/x-freearc',
  '.avi': 'video/x-msvideo',
  '.azw': 'application/vnd.amazon.ebook',
  '.bin': 'application/octet-stream',
  '.bmp': 'image/bmp',
  '.bz': 'application/x-bzip',
  '.bz2': 'application/x-bzip2',
  '.csh': 'application/x-csh',
  '.css': 'text/css',
  '.csv': 'text/csv',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.eot': 'application/vnd.ms-fontobject',
  '.epub': 'application/epub+zip',
  '.gz': 'application/gzip',
  '.gif': 'image/gif',
  '.htm': 'text/html',
  '.html': 'text/html',
  '.ico': 'image/vnd.microsoft.icon',
  '.ics': 'text/calendar',
  '.jar': 'application/java-archive',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.jsonld': 'application/ld+json',
  '.mid': 'audio/midi',
  '.midi': 'audio/midi',
  '.mjs': 'text/javascript',
  '.mp3': 'audio/mpeg',
  '.mpeg': 'video/mpeg',
  '.mpkg': 'application/vnd.apple.installer+xml',
  '.odp': 'application/vnd.oasis.opendocument.presentation',
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.oga': 'audio/ogg',
  '.ogv': 'video/ogg',
  '.ogx': 'application/ogg',
  '.opus': 'audio/opus',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.php': 'application/x-httpd-php',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.rar': 'application/vnd.rar',
  '.rtf': 'application/rtf',
  '.sh': 'application/x-sh',
  '.svg': 'image/svg+xml',
  '.swf': 'application/x-shockwave-flash',
  '.tar': 'application/x-tar',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.ts': 'video/mp2t',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
  '.vsd': 'application/vnd.visio',
  '.wav': 'audio/wav',
  '.weba': 'audio/webm',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xhtml': 'application/xhtml+xml',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xml': 'application/xml',
  '.xul': 'application/vnd.mozilla.xul+xml',
  '.zip': 'application/zip',
  '.3gp': 'video/3gpp',
  '.3g2': 'video/3gpp2',
  '.7z': 'application/x-7z-compressed',
}

const initializeRoutes = async (
  routePath: string,
  app: Pick<Zemble.App, 'hono'>,
  config: Omit<RoutesGlobalConfig, 'disable'>,
  logger: IStandardLogger,
) => {
  const hasRoutes = fs.existsSync(routePath)
  const { hono } = app

  if (hasRoutes) {
    const routesAndFilenames = await readRoutes({ rootDir: routePath, logger })

    const routePromises = Object.keys(routesAndFilenames).map(async (route) => {
      const val = routesAndFilenames[route]!
      const relativePath = path.join(config.rootUrl ?? '', val.relativePath.toLowerCase())
      const filename = val.filename.toLowerCase()

      const is404 = filename.startsWith('404')

      if (relativePath.endsWith('.js') || relativePath.endsWith('.ts') || relativePath.endsWith('.jsx') || relativePath.endsWith('.tsx')) {
        const code = await import(route)
        const relativePathNoExt = relativePath.substring(0, relativePath.length - 3)

        if (code.default) {
          const foundVerb = httpVerbs.some((verb) => {
            if (relativePathNoExt.endsWith(`.${verb}`)) {
              hono[verb](relativePathNoExt.replace(new RegExp(`\\.${verb}$`), ''), code.default)
              return true
            }

            return false
          })

          if (is404) {
            hono.notFound(code.default)
          } else if (!foundVerb) {
            hono.all(relativePathNoExt, code.default as MiddlewareHandler)
          }
        }

        httpVerbs.forEach((verb) => {
          if (code[verb]) {
            hono[verb](relativePathNoExt, code[verb])
          }
        })
      } else {
        const registerFileRoute = (url: string) => {
          hono.get(url, async (context) => {
            const fileStream = fs.createReadStream(route)

            const conentType = fileExtensionToMimeType[path.extname(route)]

            context.header('X-Content-Type-Options', 'nosniff')
            context.header('Content-Length', fileStream.readableLength.toString())
            context.header('Transfer-Encoding', 'chunked')
            context.header('Content-Type', conentType!)

            return stream(context, async (stream) => {
              fileStream.on('data', async (data) => {
                const typedData = typeof data === 'string' ? data : data as unknown as Uint8Array
                void stream.write(typedData)
              })
              fileStream.on('end', async () => {
                await stream.close()
              })
            })
          })
        }

        if (relativePath.endsWith('.json')) {
          registerFileRoute(relativePath.replace(/\.json$/, ''))
          registerFileRoute(relativePath)
        } else if (relativePath.endsWith('.html')) {
          const pathWithoutExt = relativePath.replace('.html', '')

          if (pathWithoutExt.endsWith('index')) {
            registerFileRoute(pathWithoutExt.replace(/index$/, ''))
          } else {
            registerFileRoute(pathWithoutExt)
          }
        } else {
          registerFileRoute(relativePath)
        }
      }
    })

    await Promise.all(routePromises)
  }
}

export async function initializePlugin(
  {
    pluginPath,
    app,
    config,
    logger,
  }: {
    readonly pluginPath: string;
    readonly app: Pick<Zemble.App, 'hono'>
    readonly config: Omit<RoutesGlobalConfig, 'disable'>;
    readonly logger: IStandardLogger;
  },
) {
  const routePath = path.join(pluginPath, config.rootPath ?? 'routes')
  await initializeRoutes(routePath, app, config, logger)
}

export default initializePlugin
