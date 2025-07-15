import type { Timeoutify } from '@zemble/timeoutify'
import type { Statistic } from '@zemble/utils/statHelpers'
import {
  getNumericPercentile,
  getNumericTop,
  isPercentile,
  isTop,
} from '@zemble/utils/statHelpers'
import type {
  Collection,
  Join,
  NestedPaths,
  StrictFilter,
  WithId,
} from 'mongodb'
import { match } from 'ts-pattern'

type Result = Record<`p${number}`, number> &
  Record<`top${number}`, number> & {
    readonly max: number
    readonly min: number
    readonly avg: number
    readonly sum: number
    readonly count: number
    readonly stdDevPop: number
    readonly stdDevSamp: number
  }

export class StatsPipeline<
  T extends Record<string, unknown>,
  TS extends Statistic,
  TGroupBy extends Record<string, `$${Join<NestedPaths<WithId<T>, []>, '.'>}`>,
  TRes extends Record<keyof TGroupBy, unknown> & Result,
  TKey extends Join<NestedPaths<WithId<T>, []>, '.'> = Join<
    NestedPaths<WithId<T>, []>,
    '.'
  >,
> {
  readonly stats: readonly TS[]

  readonly collection: Collection<T>

  readonly prop: TKey

  readonly preGroupStages: readonly Record<string, unknown>[]

  readonly groupBy: TGroupBy

  constructor(
    collection: Collection<T>,
    stats: readonly TS[],
    prop: TKey,
    groupBy: TGroupBy,
    preGroupStages?: readonly Record<string, unknown>[],
  ) {
    this.stats = stats
    this.collection = collection
    this.prop = prop
    this.groupBy = groupBy
    this.preGroupStages = preGroupStages ?? []
  }

  get statisticsGroupStage() {
    return {
      $group: this.stats.reduce(
        (prev, stat) => ({
          ...prev,
          ...match(stat as Statistic)
            .with('COUNT', () => ({ count: { $sum: 1 } }))
            .with('MAX', () => ({ max: { $max: `$${this.prop}` } }))
            .with('MIN', () => ({ min: { $min: `$${this.prop}` } }))
            .with('SUM', () => ({ sum: { $sum: `$${this.prop}` } }))
            .with('STD_DEV_POP', () => ({
              stdDevPop: { $stdDevPop: `$${this.prop}` },
            }))
            .with('STD_DEV_SAMPLE', () => ({
              stdDevSamp: { $stdDevSamp: `$${this.prop}` },
            }))
            .with('AVG', () => ({ avg: { $avg: `$${this.prop}` } }))
            .otherwise((statType) => {
              // just for typechecking that we have all cases covered
              if (statType === 'TOP_3_AVG') {
                // looks good
              } else if (isTop(statType)) {
                getNumericTop(statType)
              } else {
                getNumericPercentile(statType)
              }

              return {
                rawValue: {
                  $push: `$${this.prop}`,
                },
              }
            }),
        }),
        { _id: this.groupBy } as Record<string, unknown>,
      ),
    }
  }

  get percentileSetStage() {
    return this.stats.some(isPercentile)
      ? [
          {
            $set: {
              rawValue: {
                $sortArray: {
                  input: '$rawValue',
                  sortBy: -1,
                },
              },
            },
          },
        ]
      : []
  }

  matchStage($match: StrictFilter<T>) {
    return {
      $match,
    }
  }

  get statisticsProjectStage() {
    return {
      $project: {
        _id: 0,
        // @ts-expect-error we know that we have all the stats
        ...(this.stats.includes('MAX') ? { max: 1 } : {}),
        // @ts-expect-error we know that we have all the stats
        ...(this.stats.includes('MIN') ? { min: 1 } : {}),
        // @ts-expect-error we know that we have all the stats
        ...(this.stats.includes('AVG') ? { avg: 1 } : {}),
        // @ts-expect-error we know that we have all the stats
        ...(this.stats.includes('SUM') ? { sum: 1 } : {}),
        // @ts-expect-error we know that we have all the stats
        ...(this.stats.includes('COUNT') ? { count: 1 } : {}),
        // @ts-expect-error we know that we have all the stats
        ...(this.stats.includes('STD_DEV_POP') ? { stdDevPop: 1 } : {}),
        // @ts-expect-error we know that we have all the stats
        ...(this.stats.includes('STD_DEV_SAMPLE') ? { stdDevSamp: 1 } : {}),
        ...Object.keys(this.groupBy).reduce(
          (prev, key) => ({
            ...prev,
            [key]: `$_id.${key}`,
          }),
          {} as Record<string, unknown>,
        ),
        // @ts-expect-error we know that we have all the stats
        ...(this.stats.includes('TOP_3_AVG')
          ? { top1: 1, top2: 1, top3: 1 }
          : {}),
        ...this.stats.reduce(
          (prev, stat) => ({
            ...prev,
            ...(isPercentile(stat)
              ? {
                  [`p${getNumericPercentile(stat)}`]: {
                    $arrayElemAt: [
                      '$rawValue',
                      {
                        $floor: {
                          $multiply: [
                            1 - getNumericPercentile(stat) / 100,
                            {
                              $size: '$rawValue',
                            },
                          ],
                        },
                      },
                    ],
                  },
                }
              : {}),
            ...(isTop(stat)
              ? {
                  [`top${getNumericTop(stat)}`]: [
                    '$rawValue',
                    {
                      $arrayElemAt: getNumericTop(stat) - 1,
                    },
                  ],
                }
              : {}),
          }),
          {} as Record<string, unknown>,
        ),
      },
    }
  }

  getScalarValue(entry: Result | null | undefined, stat: TS): number | null {
    const val = match(stat as Statistic)
      .with('AVG', () => entry?.avg ?? null)
      .with('MEDIAN', () => entry?.['p50'] ?? null)
      .with('COUNT', () => entry?.count ?? null)
      .with('MAX', () => entry?.max ?? null)
      .with('MIN', () => entry?.min ?? null)
      .with('SUM', () => entry?.sum ?? null)
      .with('STD_DEV_POP', () => entry?.stdDevPop ?? null)
      .with('STD_DEV_SAMPLE', () => entry?.stdDevSamp ?? null)
      .with('TOP_3_AVG', () => {
        const top1 = entry?.['top1'] ?? null
        const top2 = entry?.['top2'] ?? null
        const top3 = entry?.['top3'] ?? null

        if (top1 !== null && top2 !== null && top3 !== null) {
          return (top1 + top2 + top3) / 3
        }
        return null
      })
      .otherwise((statType) => {
        if (isPercentile(statType)) {
          const percentile = getNumericPercentile(statType)
          return entry?.[`p${percentile}`] ?? null
        }

        return entry?.[`top${getNumericTop(statType)}`] ?? null
      })

    return val
  }

  async execute(pipe: Record<string, unknown>[], timeoutify: Timeoutify) {
    return timeoutify.runMongoOpWithTimeout(
      this.collection.aggregate(pipe),
    ) as Promise<readonly TRes[]>
  }

  async executeWithMatch($match: StrictFilter<T>, timeoutify: Timeoutify) {
    return timeoutify.runMongoOpWithTimeout(
      this.collection.aggregate(this.getPipeline($match), {
        allowDiskUse: true,
      }),
    ) as Promise<readonly TRes[]>
  }

  getPipeline($match: StrictFilter<T>) {
    return [
      this.matchStage($match),
      ...this.preGroupStages,
      this.statisticsGroupStage,
      ...this.percentileSetStage,
      this.statisticsProjectStage,
    ]
  }

  async executeWithMatchAndExplain($match: StrictFilter<T>) {
    return this.collection.aggregate(this.getPipeline($match)).explain()
  }
}

export default StatsPipeline
