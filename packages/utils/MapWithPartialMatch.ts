export class MapWithPartialMatch<V> extends Map<string, V> {
  // deals with keys with format: "myStrictKey#{myPartiallyMatchedObject:1}"
  get(key: string) {
    const [strictKey, partialKeyStr] = key.split('#'),
          partialKeyObject = partialKeyStr ? JSON.parse(partialKeyStr) : null,
          keysToLookFor = partialKeyObject ? Object.keys(partialKeyObject as object) : null

    if (!strictKey) {
      return undefined
    }

    // check for strict matches without involving expensive parsing
    const strictMatches = [...super.keys()].filter((k) => k.startsWith(`${strictKey}#`))

    const foundKey = strictMatches.find((keyStr) => {
      const [, pStr] = keyStr.split('#'),
            p = pStr ? JSON.parse(pStr) as object : null

      if (p === null) {
        return true
      } if (keysToLookFor === null) {
        return false
      }

      const pKeys = Object.keys(p)

      return keysToLookFor.every((k) => pKeys.includes(k))
    })

    if (foundKey) {
      return super.get(foundKey)
    }

    return undefined
  }

  delete(key: string) {
    const [strictKey] = key.split('#')

    if (!strictKey) {
      return false
    }

    const strictMatches = [...super.keys()].filter((k) => k.startsWith(`${strictKey}#`))

    strictMatches.forEach((k: string) => {
      super.delete(k)
    })

    return strictMatches.length > 0
  }
}

export default MapWithPartialMatch
