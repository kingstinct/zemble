export const simpleTemplating = (
  template: string,
  values: Record<string, string>,
): string => {
  let result = template
  Object.entries(values).forEach(([key, value]) => {
    result = result.replaceAll(`{{${key}}}`, value)
  })
  return result
}
