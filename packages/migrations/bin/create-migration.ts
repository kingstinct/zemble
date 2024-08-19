#!/usr/bin/env bun

import {
  copyFile, mkdir,
} from 'node:fs/promises'
import { join } from 'node:path'

const dirName = import.meta.url.replace('file://', '')

// how to make this properly configurable - point out app.js somehow?
const targetFolder = 'migrations'

void mkdir(join(process.cwd(), targetFolder)).catch((_) => {}).finally(async () => {
  const args = process.argv.slice(2)

  const migrationName = args[0]
  const template = args[1] ?? 'default.ts'

  if (!migrationName) {
    console.error('Usage: create-migration <migration-name> [template]')
    process.exit(1)
  }

  const validNpmPackageNameRegex = /^[a-zA-Z0-9-_]+$/

  if (!validNpmPackageNameRegex.test(migrationName)) {
    console.error('The migration name must be a valid file name')
    process.exit(1)
  }

  const templateFileExtension = template.split('.').at(-1)

  // format like 2020-01-10_00:12, no seconds
  const dateAndTimeFormatted = new Date().toISOString().replace(/T/, '_').replace(/:/g, '')
    .split('.')[0]?.substring(0, 15)

  const targetPath = join(process.cwd(), targetFolder, `${dateAndTimeFormatted}_${migrationName}.${templateFileExtension}`)

  const templatePath = join(dirName, '../../templates', template)

  await copyFile(templatePath, targetPath)
})
