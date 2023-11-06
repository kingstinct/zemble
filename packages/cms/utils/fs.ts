import memfs from 'memfs'
import * as fs from 'node:fs'

import type { EntitySchemaType } from '../types'

let fsPromised = fs.promises
let fileInMemory: { readonly entities: readonly EntitySchemaType[] } | undefined

const entityFileDir = `${process.cwd()}/cms`
const entityFilePath = `${entityFileDir}/entities.json`

export const readEntities = async (): Promise<readonly EntitySchemaType[]> => {
  if (fileInMemory) {
    return fileInMemory.entities
  }
  try {
    const schemaStr = await fsPromised.readFile(entityFilePath, { encoding: 'utf-8' })
    const contents = JSON.parse(schemaStr as string) as {readonly entities: readonly EntitySchemaType[]}
    if (process.env.NODE_ENV === 'production') {
      fileInMemory = contents
    }
    return contents.entities ?? []
  } catch (e) {
    return []
  }
}

export const writeEntities = async (entities: readonly (EntitySchemaType)[]) => {
  if (process.env.NODE_ENV === 'production') {
    fileInMemory = { ...fileInMemory, entities }
  }
  await fsPromised.mkdir(entityFileDir, { recursive: true })
  await fsPromised.writeFile(entityFilePath, `${JSON.stringify({ entities, $schema: '../entities-json-schema.json' }, null, 2)}\n`, { encoding: 'utf-8', flag: 'w' })
}

export const mockAndReset = async () => {
  const { Volume } = await import('memfs/lib/volume')

  const vol = Volume.fromJSON({
    [entityFilePath]: JSON.stringify([]),
  })

  // @ts-expect-error seems types are out of sync?
  fsPromised = vol.promises
  fileInMemory = undefined
}
