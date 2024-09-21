/* eslint-disable import/no-extraneous-dependencies, no-param-reassign, functional/prefer-readonly-type, functional/immutable-data */
import ejs from 'ejs'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

import type {
  AppControllerRoute, AppViewRoute, BullBoardQueues, ControllerHandlerReturnType, HTTPMethod, IServerAdapter, UIConfig,
} from '@bull-board/api/dist/typings/app'
import type { Context, Env } from 'hono'

export default class HonoAdapter<HonoEnv extends Env> implements IServerAdapter {
  protected app: Hono<HonoEnv>

  protected basePath: string

  protected bullBoardQueues: BullBoardQueues | undefined

  protected errorHandler: ((error: Error) => ControllerHandlerReturnType) | undefined

  protected uiConfig?: UIConfig

  protected statics: { route?: string, path?: string } = {}

  protected entryRoute?: AppViewRoute

  protected viewPath?: string

  protected apiRoutes?: Hono<HonoEnv>

  protected nodeModulesRootPath: string = '.'

  constructor(app: Hono<HonoEnv>) {
    this.app = app
    this.basePath = ''
    this.uiConfig = {}
  }

  setBasePath(path: string): HonoAdapter<HonoEnv> {
    this.basePath = path
    this.app.basePath(path)
    return this
  }

  setNodeModulesRootPath(path: string): HonoAdapter<HonoEnv> {
    this.nodeModulesRootPath = path
    return this
  }

  setStaticPath(staticsRoute: string, staticsPath: string): HonoAdapter<HonoEnv> {
    staticsPath = staticsPath.replaceAll(/\/.*\/node_modules/gm, '/node_modules')
    this.statics = { route: staticsRoute, path: staticsPath }
    return this
  }

  setViewsPath(viewPath: string): HonoAdapter<HonoEnv> {
    this.viewPath = viewPath
    return this
  }

  setErrorHandler(handler: (error: Error) => ControllerHandlerReturnType): this {
    this.errorHandler = handler
    return this
  }

  setApiRoutes(routes: readonly AppControllerRoute[]): HonoAdapter<HonoEnv> {
    if (!this.errorHandler) {
      throw new Error(`Please call 'setErrorHandler' before using 'registerPlugin'`)
    } else if (!this.bullBoardQueues) {
      throw new Error(`Please call 'setQueues' before using 'registerPlugin'`)
    }

    const router = new Hono<HonoEnv>()
    routes.forEach((route) => {
      const routeMethod = route.method.toString().toLowerCase() as HTTPMethod
      const routePath = route.route.toString()

      router[routeMethod](routePath, async (c: Context) => {
        try {
          const bodyText = await c.req.text()
          const hasJSONBody = bodyText.includes('{') && bodyText.includes('}')
          const response = await route.handler({
            queues: this.bullBoardQueues as BullBoardQueues,
            params: c.req.param(),
            query: c.req.query(),
            body: hasJSONBody ? await c.req.json() : {},
          })
          return c.json(response.body, response.status || 200)
        } catch (e) {
          if (!this.errorHandler || !(e instanceof Error)) {
            throw e
          }

          const response = this.errorHandler(e)
          if (typeof response.body === 'string') {
            return c.text(response.body, response.status)
          }
          return c.json(response.body, response.status)
        }
      })
    })

    this.apiRoutes = router
    return this
  }

  setEntryRoute(routeDef: AppViewRoute): HonoAdapter<HonoEnv> {
    this.entryRoute = routeDef
    return this
  }

  setQueues(bullBoardQueues: BullBoardQueues): HonoAdapter<HonoEnv> {
    this.bullBoardQueues = bullBoardQueues
    return this
  }

  setUIConfig(config?: UIConfig): HonoAdapter<HonoEnv> {
    this.uiConfig = config as UIConfig
    return this
  }

  getRouter() {
    return this.app // Return the Hono application instance
  }

  registerPlugin() {
    if (!this.statics.path || !this.statics.route) {
      throw new Error(`Please call 'setStaticPath' before using 'registerPlugin'`)
    } else if (!this.entryRoute) {
      throw new Error(`Please call 'setEntryRoute' before using 'registerPlugin'`)
    } else if (!this.viewPath) {
      throw new Error(`Please call 'setViewsPath' before using 'registerPlugin'`)
    } else if (!this.apiRoutes) {
      throw new Error(`Please call 'setApiRoutes' before using 'registerPlugin'`)
    } else if (!this.bullBoardQueues) {
      throw new Error(`Please call 'setQueues' before using 'registerPlugin'`)
    } else if (!this.errorHandler) {
      throw new Error(`Please call 'setErrorHandler' before using 'registerPlugin'`)
    }

    this.app.basePath(this.basePath).get(
      `${this.statics.route}/*`,
      serveStatic({
        root: this.nodeModulesRootPath, // needs to be adjusted for monorepos with node_modules at another level
        rewriteRequestPath: (path) => {
          const newPath = path.replace([this.basePath, this.statics.route].join(''), this.statics.path as string)
          return newPath
        },
      }),
    )

    this.app.basePath(this.basePath).route('/', this.apiRoutes)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { method, handler } = this.entryRoute
    const routes = this.entryRoute.route as readonly string[]
    routes.forEach((route) => {
      this.app.basePath(this.basePath)[method](route, async (c: Context) => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const { name: fileName, params } = await handler({ basePath: this.basePath, uiConfig: this.uiConfig || {} })
        const template = await ejs.renderFile(`${this.viewPath}/${fileName}`, params)
        return c.html(template)
      })
    })

    return this
  }
}
