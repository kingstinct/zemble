/* eslint-disable no-console */
import type { Collection, Document } from 'mongodb'

// Be aware of issues
export const debugPipeline = async <TRetVal extends Document = Document, TSchema extends Document = Document, TPipelineStage extends Document = Document>(
  collection: Collection<TSchema>,
  pipeline: readonly TPipelineStage[],
  verbose = false,
  startAtStep = 0,
  exampleCount = 4,
) => {
  type Acc = { readonly stages: readonly TPipelineStage[]; readonly result: readonly TRetVal[] }

  const res = await pipeline.reduce<Promise<Acc>>(
    async (acc, stage, index) => {
      const { stages, result } = await acc
      const allStages = [...stages, stage as TPipelineStage]

      if (index < startAtStep) {
        return { result, stages: allStages }
      }

      const startTime = Date.now()
      const _examples = await collection
        .aggregate<TRetVal>([...allStages, { $limit: exampleCount }], {
          maxTimeMS: 20000,
        })
        .toArray()

      const _duration = Date.now() - startTime

      const res = await collection
        .aggregate<{ readonly count: number }>([...allStages, { $count: 'count' }], {
          maxTimeMS: 20000,
        })
        .toArray()

      const count = res[0]?.count || 0

      const isNoticable = count === 0

      if (verbose || isNoticable) {
        const _explain = await collection.aggregate(allStages).explain()
      } else {
      }
      if (index === pipeline.length - 1) {
        const result = await collection
          .aggregate<TRetVal>(allStages, {
            maxTimeMS: 600000,
          })
          .toArray()
        return { stages: allStages, result }
      }
      return { stages: allStages, result: [] }
    },
    Promise.resolve({ stages: [] as readonly TPipelineStage[], result: {} as readonly TRetVal[] }),
  )

  return res.result
}
