import type { MutationResolvers } from '../schema.generated'

export const setEnv: NonNullable<MutationResolvers['setEnv']> = (_, { key, value }) => {
  // eslint-disable-next-line functional/immutable-data
  process.env[key] = value

  return process.env
}

export default setEnv
