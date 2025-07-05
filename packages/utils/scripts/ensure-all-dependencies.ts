#!/usr/bin/env bun

import Path from 'node:path'
import { readdir } from 'fs/promises'

type JsonWithDeps = {
  dependencies: Record<string, string>
  workspaces: string[]
}

const readFileJson = async (path: string) => {
  const file = Bun.file(path)

  const contents = await file.text()

  const json = JSON.parse(contents) as JsonWithDeps

  return json
}

const writeFileJson = async (path: string, contents: JsonWithDeps) => {
  await Bun.write(path, `${JSON.stringify(contents, null, 2)}\n`)
}

const targetDirectory = Path.join(
  import.meta.dir,
  '..',
  '..',
  '..',
  'apps',
  'lifeline',
)

const targetPackageJson = Path.join(targetDirectory, 'package.json')

const targetJson = await readFileJson(targetPackageJson)

const ensureAllDependenciesAreInstalledIn = async (
  sourcePackageJson: string,
) => {
  const json = await readFileJson(sourcePackageJson)

  const { dependencies } = json

  let hasWrittenTitle = false

  if (dependencies) {
    Object.entries(dependencies).forEach(([pkg, version]) => {
      const prev = targetJson.dependencies[pkg]
      targetJson.dependencies[pkg] = version

      if (prev !== version) {
        if (!hasWrittenTitle) {
          hasWrittenTitle = true
          console.log(
            `Updating ${Path.relative(process.cwd(), targetPackageJson)}:`,
          )
        }

        console.log(` - ${pkg}@${version}`)
      }
    })
  }

  const sortedDependencies = Object.entries(targetJson.dependencies)
    .sort((a, b) => a[0].localeCompare(b[0])) // Sort by key
    .reduce(
      (acc, [key, value]) => {
        acc[key] = value
        return acc
      },
      {} as JsonWithDeps['dependencies'],
    )

  targetJson.dependencies = sortedDependencies
}

console.log({ targetPackageJson })

const rootPackageJson = await readFileJson(
  Path.join(process.cwd(), './package.json'),
)

const getDirectories = async (source: string) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

const ignorePackages = [
  'apps/healthcloud',
  'packages/health-gpt',
  'packages/scripts',
]

await Promise.all(
  rootPackageJson.workspaces.flatMap(async (directoryWithSuffix) => {
    const directory = directoryWithSuffix.replace(/\/\*$/, '')
    const allDirectoriesInDirectory = await getDirectories(directory)

    return Promise.all(
      allDirectoriesInDirectory.map(async (packageDirectory) => {
        const packageJson = Path.join(
          process.cwd(),
          directory,
          packageDirectory,
          'package.json',
        )
        if (!ignorePackages.some((p) => packageJson.includes(p))) {
          await ensureAllDependenciesAreInstalledIn(packageJson)
        }
      }),
    )
  }),
)

await writeFileJson(targetPackageJson, targetJson)
