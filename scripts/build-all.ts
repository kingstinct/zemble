import { execSync } from 'child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const packagesDir = join(__dirname, '..', 'packages')

for (const dir of readdirSync(packagesDir)) {
  const pkgDir = join(packagesDir, dir)
  const pkgJsonPath = join(pkgDir, 'package.json')
  if (!existsSync(pkgJsonPath)) {
    continue
  }

  const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'))
  if (pkg.private) {
    continue
  }

  /* biome-ignore lint/suspicious/noConsole: progress logging */
  console.log(`\nBuilding ${pkg.name}`)

  execSync('bunx tsup --config ../../tsup.config.ts', {
    cwd: pkgDir,
    stdio: 'inherit',
    shell: '/bin/bash',
  })

  const entryTs = (pkg.module || pkg.main || 'index.ts') as string
  const base = entryTs.replace(/\.ts$/, '')
  pkg.main = `./dist/${base}.cjs`
  pkg.module = `./dist/${base}.js`
  pkg.types = `./dist/${base}.d.ts`
  pkg.exports = {
    '.': {
      import: pkg.module,
      require: pkg.main,
      types: pkg.types,
    },
  }
  writeFileSync(pkgJsonPath, `${JSON.stringify(pkg, null, 2)}\n`)
}
