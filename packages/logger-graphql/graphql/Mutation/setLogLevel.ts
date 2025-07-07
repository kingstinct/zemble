import type { MutationResolvers } from '../schema.generated'

export const setLogLevel: NonNullable<MutationResolvers['setLogLevel']> = (
  _,
  { level },
) => {
  // LogTape doesn't support runtime level changes without reconfiguration
  // This would require calling configure() again with new settings
  // For now, just return the requested level as a placeholder
  console.warn(
    'Runtime log level changes are not implemented. Consider restarting the application with LOG_LEVEL environment variable.',
  )

  return level
}

export default setLogLevel
