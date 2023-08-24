import * as fs from 'node:fs'
import * as path from 'node:path'
import readDir from '@readapt/core/utils/readDir'
import { Job, Queue, Worker } from "bullmq";
import redis from './redis';
import pubSub from '../pubsub';

export type QueueConfig<DataType = any, ReturnType = any> = {
  worker: (job: Job<DataType, ReturnType>) => Promise<void>
}

let queues: Queue[] = []

const setupQueues = (pluginPath: string) => {

  const queuePath = path.join(pluginPath, '/queues')

  const hasQueues = fs.existsSync(queuePath)

  if (hasQueues) {
    const filenames = readDir(queuePath)

    filenames.forEach(async (filename) => {
      const fileNameWithoutExtension = filename.substring(0, filename.length - 3);
      const queueConfig = (await import(path.join(queuePath, filename))).default as QueueConfig

      const queue = new Queue(fileNameWithoutExtension, {
        connection: redis,
      })

      const worker = new Worker(fileNameWithoutExtension, queueConfig.worker, {
        connection: redis,
      })

      const jobUpdated = (job: Job) => {
        pubSub.publish('jobUpdated', job)
      }

      worker.on('completed', jobUpdated)
      worker.on('active', jobUpdated)
      
      worker.on('progress', jobUpdated)
      worker.on('failed', (job) => job ? jobUpdated(job) : null)

      queues.push(queue)
    })
  }
}

export const getQueues = () => queues

export default setupQueues