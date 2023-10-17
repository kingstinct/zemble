import * as fs from 'node:fs'
import * as path from 'node:path'

type PathsWithMetadata = Record<string, {readonly filename: string, readonly relativePath: string}>

export const readRoutes = async (rootDir: string, prefix = ''): Promise<PathsWithMetadata> => fs.readdirSync(path.join(rootDir, prefix)).reduce(async (prev, filename) => {
  const route = path.join(rootDir, prefix, filename)

  const tat = fs.statSync(route)

  if (tat.isDirectory()) {
    const newRoutes = await readRoutes(rootDir, path.join(prefix, filename))
    return { ...await prev, ...newRoutes }
  }

  try {
    const newRoutes = { ...await prev, [route]: { filename, relativePath: path.join(prefix, filename) } }

    return newRoutes
  } catch (error) {
    console.log(error)

    return prev
  }
}, Promise.resolve({} as PathsWithMetadata))

export default readRoutes
