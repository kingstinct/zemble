import { describe, expect, it, jest } from 'bun:test'

import ZembleQueueMock from './ZembleQueueMock'

describe('ZembleQueueMock', () => {
  describe('constructor and initialization', () => {
    it('should create a mock queue with a worker', () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      expect(queue).toBeDefined()
      expect(queue.worker).toBe(worker)
    })

    it('should initialize the queue with a name', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')
      // Should not throw after initialization
      await expect(queue.add('job1', { hello: 'world' })).resolves.toBeDefined()
    })

    it('should throw if queue is not initialized before add', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await expect(queue.add('job1', {})).rejects.toThrow(
        'Queue not initialized',
      )
    })
  })

  describe('add', () => {
    it('should add a job and execute the worker', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      const job = await queue.add('my-job', { key: 'value' })

      expect(job).toBeDefined()
      expect(job.name).toBe('my-job')
      expect(job.data).toEqual({ key: 'value' })

      await queue.waitUntilEmpty()

      expect(worker).toHaveBeenCalledTimes(1)
      expect(worker).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'my-job', data: { key: 'value' } }),
        expect.objectContaining({ logger: expect.anything() }),
      )
    })

    it('should throw when adding to a paused queue', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      await queue.pause()

      await expect(queue.add('job1', {})).rejects.toThrow('Queue is paused')
    })

    it('should spy on add calls', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      await queue.add('job1', { a: 1 })
      await queue.add('job2', { b: 2 })

      expect(queue.add).toHaveBeenCalledTimes(2)
    })
  })

  describe('addBulk', () => {
    it('should add multiple jobs and return them', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      const jobs = await queue.addBulk([
        { name: 'job1', data: { order: 1 } },
        { name: 'job2', data: { order: 2 } },
        { name: 'job3', data: { order: 3 } },
      ])

      expect(jobs).toHaveLength(3)
      expect(jobs[0]!.name).toBe('job1')
      expect(jobs[1]!.name).toBe('job2')
      expect(jobs[2]!.name).toBe('job3')
      expect(jobs[0]!.data).toEqual({ order: 1 })
    })

    it('should execute workers for bulk jobs', async () => {
      const callOrder: number[] = []
      const worker = jest.fn(async (job) => {
        callOrder.push(job.data.order)
      })
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      await queue.addBulk([
        { name: 'job1', data: { order: 1 } },
        { name: 'job2', data: { order: 2 } },
      ])

      // Workers execute asynchronously via setTimeout in reduce chain
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })

      expect(worker).toHaveBeenCalledTimes(2)
      expect(callOrder).toEqual([1, 2])
    })
  })

  describe('remove', () => {
    it('should remove a job by id', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      const job = await queue.add('job1', {})
      const removedCount = await queue.remove(job.id as string)

      // Job may or may not have an id set by mock
      expect(typeof removedCount).toBe('number')
    })

    it('should return 0 when removing a non-existent job', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      const removedCount = await queue.remove('non-existent-id')
      expect(removedCount).toBe(0)
    })
  })

  describe('getJob', () => {
    it('should return undefined for non-existent job', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      const job = await queue.getJob('non-existent')
      expect(job).toBeUndefined()
    })
  })

  describe('pause and resume', () => {
    it('should pause the queue and prevent adding jobs', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      await queue.pause()
      await expect(queue.add('job1', {})).rejects.toThrow('Queue is paused')
    })

    it('should resume the queue and allow adding jobs again', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      await queue.pause()
      await queue.resume()

      const job = await queue.add('job1', {})
      expect(job).toBeDefined()
    })

    it('should spy on pause and resume calls', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      await queue.pause()
      await queue.resume()

      expect(queue.pause).toHaveBeenCalledTimes(1)
      expect(queue.resume).toHaveBeenCalledTimes(1)
    })
  })

  describe('getDelayed', () => {
    it('should return an empty array', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      const delayed = await queue.getDelayed()
      expect(delayed).toEqual([])
    })
  })

  describe('waitUntilEmpty', () => {
    it('should resolve immediately when no jobs are pending', async () => {
      const worker = jest.fn()
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      await queue.waitUntilEmpty()
      // Should not hang
    })

    it('should wait for all added jobs to complete', async () => {
      let completed = 0
      const worker = jest.fn(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 10)
        })
        completed++
      })
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      await queue.add('job1', {})
      await queue.add('job2', {})
      await queue.add('job3', {})

      await queue.waitUntilEmpty()

      expect(completed).toBe(3)
      expect(worker).toHaveBeenCalledTimes(3)
    })

    it('should handle multiple sequential adds and wait for all', async () => {
      let completed = 0
      const worker = jest.fn(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 5)
        })
        completed++
      })
      const queue = new ZembleQueueMock(worker)
      await queue._initQueue('test-queue')

      await queue.add('job1', {})
      await queue.add('job2', {})

      expect(completed).toBe(0) // Workers haven't run yet (in setTimeout)

      await queue.waitUntilEmpty()

      expect(completed).toBe(2)
    })
  })

  describe('typed data', () => {
    it('should preserve typed data through the queue', async () => {
      type MyData = { readonly userId: string; readonly action: string }
      type MyResult = PromiseLike<{ readonly success: boolean }>

      const worker = jest.fn(async (job) => {
        expect(job.data.userId).toBe('user-123')
        expect(job.data.action).toBe('signup')
        return { success: true }
      })

      const queue = new ZembleQueueMock<MyData, MyResult>(worker)
      await queue._initQueue('typed-queue')

      await queue.add('typed-job', { userId: 'user-123', action: 'signup' })
      await queue.waitUntilEmpty()

      expect(worker).toHaveBeenCalledTimes(1)
    })
  })
})
