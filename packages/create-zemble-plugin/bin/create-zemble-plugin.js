#!/usr/bin/env bun

import { copy } from 'fs-extra'
import { spawn } from 'node:child_process'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {readdir,rename} from 'node:fs/promises'

/**
 * Recursively walks through a directory and returns all file paths.
 *
 * @param {string} dirPath - The path of the directory to walk through.
 * @returns {Promise<string[]>} A promise that resolves to an array of file paths.
 */
const walk = async (dirPath) => {
  const retVal = await Promise.all(
    await readdir(dirPath, { withFileTypes: true }).then((entries) => entries.map((entry) => {
      const childPath = join(dirPath, entry.name)
      return entry.isDirectory() ? walk(childPath) : childPath
    })),
  )

  return retVal.flat()
}

const args = process.argv.slice(2)

const defaultTemplate = 'graphql'

const name = args[0]
const template = args[1] ?? defaultTemplate


const dirName = import.meta.dir.replace('file://', '')

const templatePath = join(dirName, '../templates', template)
const targetDir = join(process.cwd(), name)

if(!name || name === '--help' || name === '-h' || name === 'help') {
  console.log('Usage: create-zemble-plugin <name> [template]')
  const templates = readdirSync(join(dirName, '../templates'))

  console.log('Available templates:\n', templates.map(t => '- ' + t + (t === defaultTemplate ? ' (default)' : '')).join('\n '))
  process.exit(0)
}

const validNpmPackageNameRegex = new RegExp('^[a-z0-9-]+$')

if(!validNpmPackageNameRegex.test(name)) {
  console.error('The plugin name must be a valid npm package name')
  process.exit(1)
}

console.log('Creating plugin', name)

copy(templatePath, targetDir).then(async () => {
  const packageJsonPath = join(targetDir, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath))
  packageJson.name = name
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

  const readmePath = join(targetDir, 'README.md')
  const readme = readFileSync(readmePath, 'utf-8')
  writeFileSync(readmePath, readme.replace(/pkgname/g, name))

  const allFiles = await walk(targetDir)
  const testFiles = allFiles.filter((file) => file.endsWith('.test-template.js') || file.endsWith('.test-template.ts'))

  if(testFiles.length > 0) {
    console.log('renaming ' + testFiles.length + ' test files from *.test-template.* to *.test.*')
    // rename files
    await Promise.all(testFiles.map((file) => {
      const newFile = file.replace('.test-template', '.test')
      return rename(file, newFile)
    }))
  }

  try {
    spawn('bun', ['install'], { cwd: targetDir, stdio: 'inherit' })
  } catch (error) {
    console.error('Failed to install dependencies, maybe you need to install bun? Check out https://bun.sh/', error)
    process.exit(1)
  }
})