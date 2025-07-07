#!/usr/bin/env bun

import path from 'node:path'
import { Plugin, type ZembleApp } from '@zemble/core'
import zembleContext from '@zemble/core/zembleContext'

import {
  absoluteOrRelativeTo,
  absoluteOrRelativeToCwd,
  printMergedSchema,
} from '../middleware'
import type { GraphQLMiddlewareConfig } from '../plugin'
import plugin from '../plugin'
import buildMergedSchema from '../utils/buildMergedSchema'

const args = process.argv.slice(2)

const pathToApp = args[0]

if (
  !pathToApp ||
  pathToApp === '--help' ||
  pathToApp === '-h' ||
  pathToApp === 'help'
) {
  zembleContext.logger.info('Usage: zemble-app-graphql-codegen <path-to-app>')

  process.exit(0)
}

const absolutePathToApp = absoluteOrRelativeToCwd(pathToApp)

const codegenMergedSchema = async (
  app: ZembleApp,
  config: GraphQLMiddlewareConfig,
) => {
  const appDir = path.dirname(absolutePathToApp)

  const mergedSchema = await buildMergedSchema(
    {
      ...app,
      appPlugin: new Plugin(appDir),
    },
    config,
  )

  if (config.outputMergedSchemaPath) {
    const pathRelativeToApp = absoluteOrRelativeTo(
      config.outputMergedSchemaPath,
      appDir,
    )
    await printMergedSchema(mergedSchema, pathRelativeToApp)
  }
}

const loadApp = async () => {
  const module = (await import(absolutePathToApp)) as {
    readonly default?: Promise<ZembleApp>
  }

  if (!module.default) {
    zembleContext.logger.error(
      `App not exported as default from "${pathToApp}"`,
    )
    process.exit(1)
  }

  const appOrConfig = await module.default

  return appOrConfig
}

const app = await loadApp()

zembleContext.logger.info('Loaded app, proceeding with codegen..')

await codegenMergedSchema(app, plugin.config)

zembleContext.logger.info(
  `Successfully generated merged schema at ${plugin.config.outputMergedSchemaPath}`,
)

process.exit(0)
