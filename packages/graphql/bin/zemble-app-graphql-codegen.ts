#!/usr/bin/env bun

import zembleContext from '@zemble/core/zembleContext'
import path from 'node:path'

import { absoluteOrRelativeTo, absoluteOrRelativeToCwd, printMergedSchema } from '../middleware'
import plugin from '../plugin'
import buildMergedSchema from '../utils/buildMergedSchema'

import type { GraphQLMiddlewareConfig } from '../plugin'
import type { Plugin, ZembleApp } from '@zemble/core'

const args = process.argv.slice(2)

const pathToApp = args[0]

if (!pathToApp || pathToApp === '--help' || pathToApp === '-h' || pathToApp === 'help') {
  zembleContext.logger.info('Usage: zemble-app-graphql-codegen <path-to-app>')

  process.exit(0)
}

const absolutePathToApp = absoluteOrRelativeToCwd(pathToApp)

const codegenMergedSchema = async (
  plugins: readonly Plugin<Zemble.GlobalConfig, Zemble.GlobalConfig, Zemble.GlobalConfig>[],
  config: GraphQLMiddlewareConfig,
) => {
  const mergedSchema = await buildMergedSchema(plugins, config)

  if (config.outputMergedSchemaPath) {
    const pathRelativeToApp = absoluteOrRelativeTo(config.outputMergedSchemaPath, path.dirname(absolutePathToApp))
    await printMergedSchema(mergedSchema, pathRelativeToApp)
  }
}

const loadApp = async () => {
  const module = await import(absolutePathToApp) as { readonly default?: Promise<ZembleApp> }

  if (!module.default) {
    zembleContext.logger.error(`App not exported as default from "${pathToApp}"`)
    process.exit(1)
  }

  const app = await module.default

  return app
}

const app = await loadApp()

zembleContext.logger.info('Loaded app, proceeding with codegen..')

await codegenMergedSchema(app.plugins, plugin.config)

zembleContext.logger.info(`Successfully generated merged schema at ${plugin.config.outputMergedSchemaPath}`)
