import { getStat, quantile } from './statHelpers'

describe('statHelpers', () => {
  it('should return the 80th quantile', () => {
    const values = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]
    const res = quantile(values, 0.8)

    expect(res).toEqual(7.2)
  })

  it('should return the 75th quantile', () => {
    const values = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]
    const res = quantile(values, 0.75)

    expect(res).toEqual(6.75)
  })

  it('should return the 10th quantile', () => {
    const values = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]
    const res = quantile(values, 0.1)

    expect(res).toEqual(0.9)
  })

  it('Should get avg', () => {
    const values = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]
    const res = getStat(values, 'AVG')

    expect(res).toEqual(4.5)
  })

  it('Should get median', () => {
    const values = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]
    const res = getStat(values, 'MEDIAN')

    expect(res).toEqual(4.5)
  })

  it('Should get std dev pop', () => {
    const values = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]
    const res = getStat(values, 'STD_DEV_POP')

    expect(res).toEqual(2.8722813232690143)
  })

  it('Should get std dev sample', () => {
    const values = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]
    const res = getStat(values, 'STD_DEV_SAMPLE')

    expect(res).toEqual(3.0276503540974917)
  })
})
