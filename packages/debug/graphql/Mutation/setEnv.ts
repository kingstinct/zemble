import type { MutationResolvers } from '../schema.generated'

export const setEnv: NonNullable<MutationResolvers['setEnv']> = (
  _,
  { key, value },
) => {
  process.env[key] = value

  return process.env
}

export default setEnv
