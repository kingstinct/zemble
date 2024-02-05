export const REGEX_TIMEZONE_OFFSET_FORMAT = /^.*([+-]\d{2}:?\d{2}|[+-]\d{2}|Z)$/

export function isValidDateWithTimeString(date: string) {
  return REGEX_TIMEZONE_OFFSET_FORMAT.test(date)
}
