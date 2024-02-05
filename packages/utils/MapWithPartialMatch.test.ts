import MapWithPartialMatch from './MapWithPartialMatch'

describe('MapWithPartialMatch', () => {
  test('Should not match when partial key is null and existing is not', () => {
    const map = new MapWithPartialMatch()

    map.set('a#{"a": 1}', 'somestuff')

    const result = map.get('a#null')

    expect(result).toBe(undefined)
  })

  test('Should match on strict match when other key is null', () => {
    const map = new MapWithPartialMatch()

    map.set('a#null', 'somestuff')

    const result = map.get('a#{"a": 1}')

    expect(result).toBe('somestuff')
  })

  test('Should match on key containing all fields', () => {
    const map = new MapWithPartialMatch()

    const existing = JSON.stringify({
      b: 1, a: 1, c: 1, d: 1,
    })
    const lookFor = JSON.stringify({ a: 1, b: 1, c: 1 })

    map.set(`a#${existing}`, 'somestuff')

    const result = map.get(`a#${lookFor}`)

    expect(result).toBe('somestuff')
  })

  test('Should not match on key containing almost all fields', () => {
    const map = new MapWithPartialMatch()

    const existing = JSON.stringify({ a: 1, b: 1, c: 1 })
    const lookFor = JSON.stringify({
      a: 1, b: 1, c: 1, d: 1,
    })

    map.set(`a#${existing}`, 'somestuff')

    const result = map.get(`a#${lookFor}`)

    expect(result).toBe(undefined)
  })

  test('Should clear all with strict match key', () => {
    const map = new MapWithPartialMatch()

    const existing = JSON.stringify({ a: 1, b: 1, c: 1 })
    const lookFor = JSON.stringify({
      a: 1, b: 1, c: 1, d: 1,
    })

    map.set(`a#${existing}`, 'somestuff')
    map.set(`a#null`, 'somestuff')
    map.set(`a#${lookFor}`, 'somestuff')

    const result = map.delete(`a#${lookFor}`)

    expect(result).toBe(true)
    expect(map.size).toBe(0)
  })
})
