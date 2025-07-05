let originalEnv: NodeJS.ProcessEnv | undefined

export const setupEnvOverride = (
  overrideEnv: NodeJS.ProcessEnv,
  clear: boolean | readonly string[] = false,
) => {
  if (!originalEnv) {
    originalEnv = process.env
  }

  if (clear === true) {
    process.env = { ...overrideEnv }
  } else {
    process.env = { ...originalEnv, ...overrideEnv }
    if (Array.isArray(clear)) {
      clear.forEach((key) => {
        delete process.env[key]
      })
    }
  }
}

export const resetEnv = () => {
  if (originalEnv) {
    process.env = originalEnv
    originalEnv = undefined
  }
}
