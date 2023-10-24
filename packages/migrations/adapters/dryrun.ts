import type { MigrationAdapter } from '../plugin'

export const dryRunAdapter: MigrationAdapter = {
  status: async () => [],
  up: async (status) => {
    console.log('Completed up migration', status)
  },
  down: async (name) => {
    console.log('Completed down migration', name)
  },
  progress: async (status) => {
    console.log('Migration progress', status)
  },
}

export default dryRunAdapter
