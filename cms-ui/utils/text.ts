export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const pluralize = (singular: string) => `${singular}s`

export const singularize = (plural: string) => (plural.endsWith('s') ? plural.slice(0, -1) : plural)
