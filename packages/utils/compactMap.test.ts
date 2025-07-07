import { describe, expect, test } from 'bun:test'

import compactMap from './compactMap'

describe('compactMap', () => {
  test('filters out nullish values', () => {
    const result = compactMap([1, 2, 3], (n) => (n % 2 === 0 ? n * 2 : null))
    expect(result).toEqual([4])
  })
})
