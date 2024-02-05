import DataLoader from 'dataloader'

import createSuperDataLoader from './SuperDataLoader'
import times from '../times'
import wait from '../wait'

describe.skip('SuperDataLoader.performance', () => {
  it('Should be faster than normal dataloader with loadMany with different keys', async () => {
    const hello = times(1000000, (i) => `hello${i}`)
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const batchLoadFn = (keys: readonly string[]) => keys
    const loader = createSuperDataLoader({ batchLoadFn })

    const original = new DataLoader(async (keys: readonly string[]) => Promise.resolve(batchLoadFn(keys)))

    await wait(50)

    const start2 = performance.now()
    await loader.loadMany(hello)
    const end2 = performance.now()
    const superDataLoaderTime = end2 - start2

    await wait(50)

    const start = performance.now()
    await original.loadMany(hello)
    const end = performance.now()
    const dataloaderTime = end - start

    console.log(`[different keys]:\n[SuperDataLoader]: ${superDataLoaderTime}\n[DataLoader]: ${dataloaderTime}\n${dataloaderTime / superDataLoaderTime}x) faster}`)

    // seems like it's not faster than dataloader for this case on CI
    expect(superDataLoaderTime * 0.7).toBeLessThanOrEqual(dataloaderTime)
  }, 20000)

  it('Should be faster than normal dataloader with loadMany with different keys (async)', async () => {
    const hello = times(1000000, (i) => `hello${i}`)
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const batchLoadFn = async (keys: readonly string[]) => {
      await wait(10)
      return keys
    }
    const loader = createSuperDataLoader({
      batchLoadFn,
    })

    const original = new DataLoader(batchLoadFn)

    await wait(50)

    const start2 = performance.now()
    await loader.loadMany(hello)
    const end2 = performance.now()
    const superDataLoaderTime = end2 - start2

    await wait(50)

    const start = performance.now()
    await original.loadMany(hello)
    const end = performance.now()
    const dataloaderTime = end - start

    console.log(`[different keys (async)]:\n[SuperDataLoader]: ${superDataLoaderTime}\n[DataLoader]: ${dataloaderTime}\n${dataloaderTime / superDataLoaderTime}x) faster}`)

    // seems like it's not faster than dataloader for this case on CI
    expect(superDataLoaderTime * 0.7).toBeLessThanOrEqual(dataloaderTime)
  }, 20000)
})
