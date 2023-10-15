import { ZembleQueueBull } from './ZembleQueueBull'
import ZembleQueueMock from './ZembleQueueMock'

export type { ZembleQueueConfig } from './ZembleQueueBull'

export const ZembleQueue = process.env.NODE_ENV === 'test' ? ZembleQueueMock : ZembleQueueBull

export default ZembleQueue
