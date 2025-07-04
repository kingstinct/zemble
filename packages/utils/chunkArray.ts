export function chunkArray<T>(
  array: readonly T[],
  chunkSize: number,
): readonly (readonly T[])[] {
  const arrayLength = array.length
  const chunksCount = Math.ceil(arrayLength / chunkSize)
  const tempArray = new Array(chunksCount)

  for (let index = 0; index < arrayLength; index += chunkSize) {
    const chunk = array.slice(index, index + chunkSize)
    // eslint-disable-next-line functional/immutable-data
    tempArray[index / chunkSize] = chunk
  }

  return tempArray
}
