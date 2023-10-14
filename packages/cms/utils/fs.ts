import fs from 'node:fs'

import type { EntitySchemaType } from '../clients/papr'

let fsPromised = fs.promises
let inMemoryDb: readonly EntitySchemaType[] | undefined

const entityFileDir = `${process.cwd()}/cms`
const entityFilePath = `${entityFileDir}/entities.json`

export const readEntities = async () => {
  if (inMemoryDb) {
    return inMemoryDb
  }
  try {
    const schemaStr = await fsPromised.readFile(entityFilePath, { encoding: 'utf-8' })
    const contents = JSON.parse(schemaStr as string) as readonly EntitySchemaType[]
    inMemoryDb = contents
    return contents
  } catch (e) {
    return []
  }
}

export const writeEntities = async (entities: readonly (EntitySchemaType)[]) => {
  inMemoryDb = entities
  await fsPromised.mkdir(entityFileDir, { recursive: true })
  await fsPromised.writeFile(entityFilePath, JSON.stringify(entities, null, 2), { encoding: 'utf-8', flag: 'w' })
}

export const mockAndReset = async () => {
  const memfs = await import('memfs')

  const vol = memfs.Volume.fromJSON({
    [entityFilePath]: JSON.stringify([]),
  })

  // @ts-expect-error seems types are out of sync?
  fsPromised = vol.promises
  inMemoryDb = undefined
}
