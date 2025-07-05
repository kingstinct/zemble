import { ZembleQueueBull } from './ZembleQueueBull'

export type { ZembleQueueConfig } from './ZembleQueueBull'

let ZembleQueue = ZembleQueueBull

if (process.env.NODE_ENV === 'test') {
  ZembleQueue = require('./ZembleQueueMock').default
}

export { ZembleQueue }

export default ZembleQueue
