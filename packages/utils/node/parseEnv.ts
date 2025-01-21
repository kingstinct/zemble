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
    throw new Error(`Failed to parse environment variable "${prop}", expected number got "${rawValue}"`)
  }
}

export function parseEnvJSON<
  T,
  TDefault extends T | undefined = T | undefined
>(
  prop: string,
  defaultValue: TDefault,
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
    return JSON.parse(rawValue) as T
  } catch (e) {
    throw Error(`Failed to parse environment variable "${prop}", expected JSON got "${rawValue}"`)
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
    throw new Error(`Failed to parse environment variable "${prop}", expected boolean got "${rawValue}"`)
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

  const enumOrArray = Object.values(validValues) as readonly T[]

  const isPartOfEnumOrArray = rawValue ? enumOrArray.includes(rawValue as T) : false

  if (isPartOfEnumOrArray) {
    return rawValue as T & TDefault
  }

  if (isNotNullOrUndefined(defaultValue)) {
    if (enumOrArray.includes(defaultValue)) {
      return defaultValue
    }

    throw new Error(`Failed to parse environment variable "${prop}", expected one of ${JSON.stringify(enumOrArray)} got "${rawValue}"`)
  }

  return undefined as unknown as T & TDefault
}
