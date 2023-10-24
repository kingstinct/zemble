#!/usr/bin/env node

import { copy } from 'fs-extra'
import { spawn } from 'node:child_process'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)

const defaultTemplate = 'graphql'

const name = args[0]
const template = args[1] ?? defaultTemplate

const dirName = import.meta.url.replace('file://', '')

if(!name || name === '--help' || name === '-h' || name === 'help') {
  console.log('Usage: create-zemble-plugin <name> [template]')
  const templates = readdirSync(join(dirName, '../../templates'))

  console.log('Available templates:\n', templates.map(t => '- ' + t + (t === defaultTemplate ? ' (default)' : '')).join('\n '))
  process.exit(0)
}

const validNpmPackageNameRegex = new RegExp('^[a-z0-9-]+$')

if(!validNpmPackageNameRegex.test(name)) {
  console.error('The plugin name must be a valid npm package name')
  process.exit(1)
}

const targetDir = join(process.cwd(), name)

console.log('Creating plugin', name)

const templatePath = join(dirName, '../../templates', template)

copy(templatePath, targetDir).then(() => {
  const packageJsonPath = join(targetDir, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath))
  packageJson.name = name
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

  const readmePath = join(targetDir, 'README.md')
  const readme = readFileSync(readmePath, 'utf-8')
  writeFileSync(readmePath, readme.replace(/pkgname/g, name))

  try {
    spawn('bun', ['install'], { cwd: targetDir, stdio: 'inherit' })
  } catch (error) {
    console.error('Failed to install dependencies, maybe you need to install bun? Check out https://bun.sh/', error)
    process.exit(1)
  }
})