import createSuperDataLoader from './SuperDataLoader'

describe('SuperDataLoader', () => {
  it('should be called multiple times', async () => {
    const batchLoadFn = jest.fn((keys) => keys)
    const loader = createSuperDataLoader({ batchLoadFn })

    const promise1 = await loader.load('key1')
    const promise2 = await loader.load('key2')
    const promise3 = await loader.load('key3')

    expect(promise1).toBe('key1')
    expect(promise2).toBe('key2')
    expect(promise3).toBe('key3')

    expect(batchLoadFn).toHaveBeenCalledTimes(3)
  })

  it('should be called one time', async () => {
    const batchLoadFn = jest.fn((keys) => keys)
    const loader = createSuperDataLoader({ batchLoadFn })

    const [promise1, promise2, promise3] = await Promise.all([
      loader.load('key1'),
      loader.load('key2'),
      loader.load('key3'),
    ])

    expect(promise1).toBe('key1')
    expect(promise2).toBe('key2')
    expect(promise3).toBe('key3')

    expect(batchLoadFn).toHaveBeenCalledTimes(1)
  })

  it('should be called one time even', async () => {
    const batchLoadFn = jest.fn((keys) => keys)
    const loader = createSuperDataLoader({ batchLoadFn })

    await Promise.all([
      loader.load('key1'),
      loader.load('key2'),
      loader.load('key3'),
    ])

    const [promise1, promise2, promise3] = await Promise.all([
      loader.load('key1'),
      loader.load('key2'),
      loader.load('key3'),
    ])

    expect(promise1).toBe('key1')
    expect(promise2).toBe('key2')
    expect(promise3).toBe('key3')

    expect(batchLoadFn).toHaveBeenCalledTimes(1)
  })
})
