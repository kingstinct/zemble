#!/usr/bin/env bun
import { $ } from 'bun'

const args = process.argv.slice(2)

await $`bunx add-dependencies ${args.join(' ')}`

await $`bun install`
