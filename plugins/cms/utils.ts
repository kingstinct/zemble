import { kv } from 'readapt-plugin-kv'

import type { Entity } from './graphql/schema.generated'

export const pluralize = (str: string) => (str.endsWith('s') ? str : `${str}s`)
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const EntityStore = kv<Entity>('cms-entities')
export const EntityEntryStore = (entityName: string) => kv<unknown>(`cms-entries-${entityName}`)

export const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
