import { isNotNullOrUndefined } from '..'

export function parseEnvNumber<
  T extends number,
  TDefault extends T | undefined
>(
  prop: string,
  defaultValue?: TDefault,
  env = process.env,
): T | TDefault {
  const rawValue = env[prop]
  if (!rawValue) {
    if (isNotNullOrUndefined(defaultValue)) {
      return defaultValue
    }
    return undefined as TDefault
  }
  try {
    return parseFloat(rawValue) as T
  } catch (e) {
    console.error(`Failed to parse environment variable "${prop}", expected number got "${rawValue}"`)
    return undefined as TDefault
  }
}

// todo [2024-02-01]: allow to only specify first type argument
export function parseEnvJSON<
  T,
  TDefault extends T | undefined
>(
  prop: string,
  defaultValue?: TDefault,
  env = process.env,
): T | TDefault {
  const rawValue = env[prop]
  if (!rawValue) {
    if (isNotNullOrUndefined(defaultValue)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return defaultValue as NonNullable<T>
    }
    return undefined as TDefault
  }
  try {
    return JSON.parse(rawValue)
  } catch (e) {
    console.error(`Failed to parse environment variable "${prop}", expected JSON got "${rawValue}"`)
    return undefined as TDefault
  }
}

export function parseEnvBoolean<T extends boolean>(
  prop: string,
  defaultValue?: T,
  env = process.env,
): T {
  const rawValue = env[prop]
  if (!rawValue) {
    if (isNotNullOrUndefined(defaultValue)) {
      return defaultValue
    }
    return false as T
  }
  try {
    const value = JSON.parse(rawValue) as boolean

    if (typeof value !== 'boolean') {
      if (value === 1) {
        return true as T
      }
      if (value === 0) {
        return false as T
      }
    } else {
      return value as T
    }

    return defaultValue as T
  } catch (e) {
    console.error(`Failed to parse environment variable "${prop}", expected boolean got "${rawValue}"`)
    return defaultValue ?? false as T
  }
}

type EnumOrArrayOfLiterals<T extends string> = ArrayLike<T> | { readonly [s: string]: T; }

export function parseEnvEnum<
  T extends string,
  TDefault extends T | undefined
>(
  prop: string,
  validValues: EnumOrArrayOfLiterals<T>,
  defaultValue?: TDefault,
  env = process.env,
): T | TDefault {
  const rawValue = env[prop]

  const enumOrArray = Object.values(validValues)
  // @ts-expect-error this is contained
  const isPartOfEnumOrArray = rawValue ? enumOrArray.includes(rawValue) : false

  if (isPartOfEnumOrArray) {
    return rawValue as T & TDefault
  }

  if (isNotNullOrUndefined(defaultValue) && enumOrArray.includes(defaultValue)) {
    return defaultValue
  }

  return undefined as unknown as T & TDefault
}
