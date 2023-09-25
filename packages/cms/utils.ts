export const pluralize = (str: string) => (str.endsWith('s') ? str : `${str}s`)
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
