import { ZembleQueueBull } from './ZembleQueueBull'

export type { ZembleQueueConfig } from './ZembleQueueBull'

// eslint-disable-next-line import/no-mutable-exports
let ZembleQueue = ZembleQueueBull

if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ZembleQueue = (require('./ZembleQueueMock').default)
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export { ZembleQueue }

export default ZembleQueue
