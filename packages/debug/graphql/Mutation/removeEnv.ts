import type { MutationResolvers } from '../schema.generated'

export const removeEnv: NonNullable<MutationResolvers['removeEnv']> = async (
  _parent,
  { key },
) => {
  delete process.env[key]
  return process.env
}
