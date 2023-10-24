#!/usr/bin/env bun

import { join } from 'node:path'

import { migrateUp } from '../plugin'

const args = process.argv.slice(2)

const appFile = args[0] ?? '.'

const appModule = await import(join(process.cwd(), appFile))
const appOrServe = await appModule.default as Zemble.App | undefined

if (appOrServe && 'runBeforeServe' in appOrServe) {
  await migrateUp()
} else {
  console.warn(`Usage: migrate-up [app-file]
Will default to "." i.e. the main file in package.json.`)
}

// let's keep it lazy for now, it's running the migrations just by importing the app
// process.exit(0)
