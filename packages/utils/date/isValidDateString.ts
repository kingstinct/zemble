// allows for the following formats:
// YYYY
// YYYY-MM
// YYYY-MM-DD
export const DATE_STRING_REGEX = /^[0-9]{4}(-((0[1-9]|1[0-2])(-(0[1-9]|[12][0-9]|30|31))?))?$/

export function isValidDateString(date: string) {
  return DATE_STRING_REGEX.test(date)
}
