import { afterAll, beforeAll, expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import zembleContext from '@zemble/core/zembleContext'

const testDirectory = join(import.meta.dir, 'test-output')

const binPath = join(import.meta.dir, 'bin/create-zemble-app.js')

beforeAll(() => {
  spawnSync('rm', ['-rf', testDirectory], { stdio: 'inherit' })
  spawnSync('mkdir', [testDirectory], { stdio: 'inherit' })
})

afterAll(() => {
  spawnSync('rm', ['-rf', testDirectory], { stdio: 'inherit' })
})

const testTemplate = (template: string) => {
  const name = `${template}-test`

  const createRes = spawnSync('bun', [binPath, name, template], {
    cwd: testDirectory,
  })
  if (createRes.stderr) {
    console.error(createRes.stderr.toString('utf-8'))
  }
  if (createRes.stdout) {
    console.info(createRes.stdout.toString('utf-8'))
  }
  expect(createRes.status).toBe(0)

  const testRes = spawnSync('bun', ['run', 'test'], {
    cwd: join(testDirectory, name),
  })
  if (testRes.error) {
    zembleContext.logger.error(testRes.error.message)
  }
  if (testRes.stdout && process.env['DEBUG']) {
    zembleContext.logger.info(testRes.stdout.toString('utf-8'))
  }
  expect(testRes.status).toBe(0)

  // const typecheckRes = spawnSync('bun', ['typecheck'], { cwd: join(testDirectory, name) })
  // expect(typecheckRes.status).toBe(0)
}

// fix later sometime
test.skip(
  'test graphql',
  () => {
    testTemplate('graphql')
  },
  {
    timeout: 30000,
  },
)

test(
  'test bare',
  () => {
    testTemplate('bare')
  },
  {
    timeout: 30000,
  },
)
