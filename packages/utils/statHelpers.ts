import { match } from 'ts-pattern'

export type Statistic = 'AVG' | 'COUNT' | 'MAX' | 'MEDIAN' | 'MIN' | 'PERCENTILE_1' | 'PERCENTILE_2' | 'PERCENTILE_5' | 'PERCENTILE_10' | 'PERCENTILE_15' | 'PERCENTILE_20' | 'PERCENTILE_25' | 'PERCENTILE_30' | 'PERCENTILE_35' | 'PERCENTILE_40' | 'PERCENTILE_45' | 'PERCENTILE_50' | 'PERCENTILE_55' | 'PERCENTILE_60' | 'PERCENTILE_65' | 'PERCENTILE_70' | 'PERCENTILE_75' | 'PERCENTILE_80' | 'PERCENTILE_85' | 'PERCENTILE_90' | 'PERCENTILE_95' | 'PERCENTILE_98' | 'PERCENTILE_99' | 'STD_DEV_POP' | 'STD_DEV_SAMPLE' | 'SUM' | 'TOP_1' | 'TOP_2' | 'TOP_3_AVG' | 'TOP_3'

// eslint-disable-next-line functional/prefer-readonly-type, functional/immutable-data
export const asc = (arr: number[]) => arr.sort((a, b) => a - b)

// eslint-disable-next-line functional/prefer-readonly-type, functional/immutable-data
export const desc = (arr: number[]) => arr.sort((a, b) => b - a)

export const sum = (arr: readonly number[]) => arr.reduce((a, b) => a + b, 0)

export const mean = (arr: readonly number[]) => sum(arr) / arr.length

function take<T>(x: number, y: readonly T[]): readonly T[] {
  return y.slice(0, x)
}

export const std = (arr: readonly number[], usePopulation = false) => {
  const arrMean = mean(arr)
  return Math.sqrt(
    arr
      .reduce((acc, val) => acc.concat((val - arrMean) ** 2), [] as readonly number[])
      .reduce((acc, val) => acc + val, 0)
      / (arr.length - (usePopulation ? 0 : 1)),
  )
}

export const quantile = (arr: readonly number[], q: number) => {
  const sorted = asc([...arr])

  const pos = (sorted.length - 1) * q

  const base = Math.floor(pos)
  const rest = pos - base
  const next = sorted[base + 1]
  const cur = sorted[base]

  if (next !== undefined && cur !== undefined) {
    return cur + rest * (next - cur)
  }
  return cur
}

export const getStat = (arr: readonly number[], type: Statistic): number | null => match(type)
  .with('AVG', () => {
    const total = arr.reduce((acc, num) => acc + num, 0)
    return arr.length > 0 ? total / arr.length : null
  })
  .with('COUNT', () => arr.length)
  .with('MAX', () => {
    const max = arr.reduce((acc, num) => Math.max(acc, num), 0)
    return max
  })
  .with('MIN', () => {
    const min = arr.reduce((acc, num) => Math.min(acc, num), 0)
    return min
  })
  .with('SUM', () => {
    const total = arr.reduce((acc, num) => acc + num, 0)
    return total
  })
  .with('STD_DEV_POP', () => {
    const stdDev = std(arr, true)
    return stdDev
  })
  .with('STD_DEV_SAMPLE', () => {
    const stdDev = std(arr)
    return stdDev
  })
  .with('TOP_1', () => {
    const top = Math.max(...arr)

    return top
  })
  .with('TOP_2', () => {
    const sorted = desc([...arr])

    return sorted[1] ?? null
  })
  .with('TOP_3', () => {
    const sorted = desc([...arr])

    return sorted[2] ?? null
  })
  .with('TOP_3_AVG', () => {
    const sorted = desc([...arr])
    const top = take(3, sorted)
    const avg = mean(top)
    return avg
  })
  .otherwise((percentile) => {
    const numeric = getNumericPercentile(percentile)
    return quantile(arr, numeric / 100) ?? null
  })

  type AnyPercentile =
  'MEDIAN' | 'PERCENTILE_1' | 'PERCENTILE_2' | 'PERCENTILE_5' | 'PERCENTILE_10' | 'PERCENTILE_15' | 'PERCENTILE_20' | 'PERCENTILE_25' | 'PERCENTILE_30' | 'PERCENTILE_35' | 'PERCENTILE_40' | 'PERCENTILE_45' | 'PERCENTILE_50' | 'PERCENTILE_55' | 'PERCENTILE_60' | 'PERCENTILE_65' | 'PERCENTILE_70' | 'PERCENTILE_75' | 'PERCENTILE_80' |
  'PERCENTILE_85' | 'PERCENTILE_90' | 'PERCENTILE_95' | 'PERCENTILE_98' | 'PERCENTILE_99'

  type AnyPercentileOrTop =
  AnyPercentile | 'TOP_1' | 'TOP_2' | 'TOP_3'

export const isPercentile = (type: Statistic): type is AnyPercentile => match(type)
  .with('AVG', () => false)
  .with('COUNT', () => false)
  .with('MAX', () => false)
  .with('MIN', () => false)
  .with('SUM', () => false)
  .with('STD_DEV_POP', () => false)
  .with('STD_DEV_SAMPLE', () => false)
  .with('TOP_1', () => false)
  .with('TOP_2', () => false)
  .with('TOP_3', () => false)
  .with('TOP_3_AVG', () => false)
  .otherwise((hello) => {
    getNumericPercentile(hello) // type check only
    return true
  })

export const isPercentileOrTop = (type: Statistic): type is AnyPercentileOrTop => match(type)
  .with('AVG', () => false)
  .with('COUNT', () => false)
  .with('MAX', () => false)
  .with('MIN', () => false)
  .with('SUM', () => false)
  .with('STD_DEV_POP', () => false)
  .with('STD_DEV_SAMPLE', () => false)
  .with('TOP_3_AVG', () => false)
  .with('TOP_1', () => true)
  .with('TOP_2', () => true)
  .with('TOP_3', () => true)
  .otherwise((hello) => {
    getNumericPercentile(hello) // type check only
    return true
  })

export const getNumericPercentile = (
  type: AnyPercentile,
) => match(type)
  .with('PERCENTILE_1', () => 1)
  .with('PERCENTILE_2', () => 2)
  .with('PERCENTILE_5', () => 5)
  .with('PERCENTILE_10', () => 10)
  .with('PERCENTILE_15', () => 15)
  .with('PERCENTILE_20', () => 20)
  .with('PERCENTILE_25', () => 25)
  .with('PERCENTILE_30', () => 30)
  .with('PERCENTILE_35', () => 35)
  .with('PERCENTILE_40', () => 40)
  .with('PERCENTILE_45', () => 45)
  .with('PERCENTILE_50', () => 50)
  .with('MEDIAN', () => 50)
  .with('PERCENTILE_55', () => 55)
  .with('PERCENTILE_60', () => 60)
  .with('PERCENTILE_65', () => 65)
  .with('PERCENTILE_70', () => 70)
  .with('PERCENTILE_75', () => 75)
  .with('PERCENTILE_80', () => 80)
  .with('PERCENTILE_85', () => 85)
  .with('PERCENTILE_90', () => 90)
  .with('PERCENTILE_95', () => 95)
  .with('PERCENTILE_98', () => 98)
  .with('PERCENTILE_99', () => 99)
  .exhaustive()

export const getNumericTop = (
  type: 'TOP_1' | 'TOP_2' | 'TOP_3',
) => match(type)
  .with('TOP_1', () => 1)
  .with('TOP_2', () => 2)
  .with('TOP_3', () => 3)
  .exhaustive()

export const isTop = (type: Statistic): type is 'TOP_1' | 'TOP_2' | 'TOP_3' => match(type)
  .with('TOP_1', () => true)
  .with('TOP_2', () => true)
  .with('TOP_3', () => true)
  .otherwise(() => false)
