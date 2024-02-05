import logPrettyData, { prettyData } from './logPrettyData'

describe('logPrettyData', () => {
  test('logs data', () => {
    const data = {
      a: 1,
      b: 2,
      c: 3,
    }
    const title = 'test'
    const spy = jest.spyOn(console, 'log')
    logPrettyData(data, title)
    expect(spy).toHaveBeenCalledWith(`test: {
  "a": 1,
  "b": 2,
  "c": 3
}`)
  })

  test('gets string to log', () => {
    const data = {
      a: 1,
      b: 2,
      c: 3,
    }
    const title = 'test'

    const dataAsString = prettyData(data, title)
    expect(dataAsString).toEqual(`test: {
  "a": 1,
  "b": 2,
  "c": 3
}`)
  })
})
