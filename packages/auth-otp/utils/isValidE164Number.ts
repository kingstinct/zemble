const e164Regex = /^\+?[1-9]\d{1,14}$/

export const isValidE164Number = (input: string) => e164Regex.test(input)
