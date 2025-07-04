import { describe, expect, test } from 'bun:test'

import compactFlatMap from './compactFlatMap'

describe('compactFlatMap', () => {
  test('flattens and filters nullish values', () => {
    const result = compactFlatMap([1, 2], (n) =>
      n === 1 ? [1, null] : [undefined, n * 2],
    )
    expect(result).toEqual([1, 4])
  })
})
