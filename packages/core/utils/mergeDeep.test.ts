import { expect, test } from 'bun:test'

import mergeDeep from './mergeDeep'

test('should merge objects', () => {
  const a = {
    a: 1,
    b: {
      c: 2,
    },
  }

  const b = {
    a: 2,
    b: {
      d: 3,
    },
  }

  expect(mergeDeep<object>(a, b)).toEqual({
    a: 2,
    b: {
      c: 2,
      d: 3,
    },
  })
})

test('should merge objects', () => {
  const a = {
    yoga: {
      c: 2,
    },
  }

  const b = {
    outputPath: 'some path',
    yoga: {
      d: 3,
    },
  }

  const c = {}

  expect(mergeDeep(a, b, c)).toEqual({
    outputPath: 'some path',
    yoga: {
      c: 2,
      d: 3,
    },
  })
})
