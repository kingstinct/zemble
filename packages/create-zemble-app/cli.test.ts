import {
  afterAll,
  beforeAll, expect, test,
} from 'bun:test'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const testDirectory = join(import.meta.dir, 'test-output')

beforeAll(() => {
  spawnSync('rm', ['-rf', testDirectory], { stdio: 'inherit' })
  spawnSync('mkdir', [testDirectory], { stdio: 'inherit' })
})

afterAll(() => {
  spawnSync('rm', ['-rf', testDirectory], { stdio: 'inherit' })
})

const testTemplate = (template: string) => {
  const name = `${template}-test`

  const createRes = spawnSync('bun', ['../bin/create-zemble-app.js', name, template], { cwd: testDirectory })
  expect(createRes.status).toBe(0)

  const testRes = spawnSync('bun', ['test'], { cwd: join(testDirectory, name) })
  expect(testRes.status).toBe(0)

  // const typecheckRes = spawnSync('bun', ['typecheck'], { cwd: join(testDirectory, name) })
  // expect(typecheckRes.status).toBe(0)
}

test('test graphql', () => {
  testTemplate('graphql')
}, {
  timeout: 30000,
})

test('test bare', () => {
  testTemplate('bare')
}, {
  timeout: 30000,
})
