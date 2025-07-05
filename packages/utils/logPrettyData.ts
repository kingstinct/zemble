import stringify from 'fast-safe-stringify'

export function prettyData<T = unknown>(data: T, title?: string): string {
  const titleStr = title ? `${title}: ` : ''
  return `${titleStr}${stringify(data, undefined, 2)}`
}

function logPrettyData<T = unknown>(data: T, title?: string): T {
  console.log(prettyData(data, title))
  return data
}

export default logPrettyData
