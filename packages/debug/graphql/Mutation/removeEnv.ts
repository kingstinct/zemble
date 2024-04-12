import type { MutationResolvers } from '../schema.generated'

export const removeEnv: NonNullable<MutationResolvers['removeEnv']> = async (_parent, { key }) => {
  // eslint-disable-next-line functional/immutable-data
  delete process.env[key]
  return process.env
}
