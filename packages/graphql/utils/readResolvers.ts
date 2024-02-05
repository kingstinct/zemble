import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import type { IStandardLogger } from '@zemble/core'

export const readResolvers = async (path: string, logger: IStandardLogger, isRunningLocally: boolean) => {
  try {
    const resolvedPaths = new Set<string>()
    const erroredPaths: Record<string, unknown> = {}

    const resolvers = await readdirSync(path).reduce(async (prev, filename) => {
      if (filename.includes('.test.') || filename.endsWith('.graphql') || (!isRunningLocally && filename.includes('.local.'))) {
        return prev
      }

      const route = join(path, filename)

      const fileNameWithoutExtension = filename.replace('.local.', '.').replace(/\.[^/.]+$/, '')
      const routeWithoutExtension = route.replace('.local.', '.').replace(/\.[^/.]+$/, '')
      if (resolvedPaths.has(routeWithoutExtension)) {
        return prev
      }

      try {
        const item = await import(route)
        resolvedPaths.add(routeWithoutExtension)
        return { ...await prev, [fileNameWithoutExtension]: item.default }
      } catch (error) {
        // eslint-disable-next-line functional/immutable-data
        erroredPaths[route] = error
        return prev
      }
    }, Promise.resolve({}))

    Object.keys(erroredPaths).forEach((route) => {
      if (!resolvedPaths.has(route)) {
        const error = erroredPaths[route]
        logger.error(error)
      }
    })

    return resolvers
  } catch (error) {
    return {}
  }
}

export default readResolvers
