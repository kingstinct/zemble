import { AbstractCursor } from 'mongodb'

export const LOG_PREFIX = '[Timeoutify]'

export enum TimeoutifyStatus {
  Aborted,
  TimedOut,
  Running,
  Finished
}

export class Timeoutify {
  readonly startedAt: number

  private readonly timeoutMS: number

  private readonly abortController: AbortController

  private readonly logPrefix: string

  // eslint-disable-next-line functional/prefer-readonly-type
  private statusInternal: TimeoutifyStatus

  private readonly logger: Pick<Console, 'debug'>

  private readonly handle: ReturnType<typeof setTimeout> | undefined

  constructor({
    timeoutMS,
    logPrefix = LOG_PREFIX,
    logger = console,
  }: { readonly timeoutMS: number; readonly logPrefix?: string; readonly logger?: Pick<Console, 'debug'> }) {
    this.startedAt = Date.now()
    this.timeoutMS = timeoutMS
    this.abortController = new AbortController()
    this.logPrefix = logPrefix
    this.statusInternal = TimeoutifyStatus.Running
    this.logger = logger

    if (timeoutMS > 0) {
      this.handle = setTimeout(() => {
        if (process.env.DEBUG) {
          this.logger.debug(`${this.logPrefix} setTimeout called`)
        }

        if (!this.abortController.signal.aborted) {
          this.statusInternal = TimeoutifyStatus.TimedOut
          this.abortController.abort()
        }
      }, timeoutMS)
    }
  }

  /**
   * This is the time left in milliseconds before the timeout is reached. Used for handling MongoDB timeouts.
   */
  get timeLeftMS(): number {
    return Math.max(this.timeoutMS - (Date.now() - this.startedAt), 0)
  }

  /**
   * Pass this AbortSignal to your async functions to abort them when the request is aborted or times out.
   * */
  get abortSignal(): AbortSignal {
    return this.abortController.signal
  }

  /**
   * This is the status of the Timeoutify instance. It's usually `Running`. If the timeout is reached, it's `Timeout`.
   * If the request is aborted in some other way, it's `Aborted`. If the request is marked as finished, it's `Finished`.
   */
  get status(): TimeoutifyStatus {
    return this.statusInternal
  }

  /**
   * Call this when you want to abort the request, for example when the client closes the connection.
   * */
  abort() {
    if (this.statusInternal === TimeoutifyStatus.Running) {
      // eslint-disable-next-line functional/immutable-data
      this.statusInternal = TimeoutifyStatus.Aborted
    }
    clearTimeout(this.handle)
    if (!this.abortController.signal.aborted) {
      this.abortController.abort()
    }
    return this
  }

  /**
   * Call this when the request has finished, to prevent triggering of aborts that you don't want.
   * */
  finished() {
    // eslint-disable-next-line functional/immutable-data
    this.statusInternal = TimeoutifyStatus.Finished
    clearTimeout(this.handle)
    return this
  }

  /**
   * This ensures the MongoDB Operation is never running for longer than the timeout.
   * */
  async runMongoOpWithTimeout<T>(cursor: AbstractCursor<T>): Promise<readonly T[]> {
    if (process.env.DEBUG) {
      this.logger.debug(`${this.logPrefix} runMongoOpWithTimeout called`)
    }
    if (this.status === TimeoutifyStatus.Aborted || this.status === TimeoutifyStatus.TimedOut) {
      throw new Error(`${this.logPrefix} runMongoOpWithTimeout: AbortSignal already aborted`)
    }

    const isNoop = this.timeoutMS <= 0

    if (isNoop || this.timeLeftMS > 0) {
      return cursor.maxTimeMS(this.timeLeftMS).toArray()
    }

    throw new Error(`${this.logPrefix} runMongoOpWithTimeout: Timed out before query started`)
  }

  static patchMongoCursorWithTimeout<T>(maxTimeMs: number) {
    /* @ts-expect-error  This is a hack to get around the fact that the type definitions for MongoDB are wrong. */
    // eslint-disable-next-line functional/immutable-data, no-underscore-dangle
    AbstractCursor.prototype._toArray = AbstractCursor.prototype.toArray.bind(AbstractCursor.prototype)

    // eslint-disable-next-line functional/immutable-data, @typescript-eslint/require-await
    AbstractCursor.prototype.toArray = async function toArrayWithTimeoutify(this: AbstractCursor<T>) {
      // @ts-expect-error dfgdfg
      // eslint-disable-next-line no-underscore-dangle
      return this.maxTimeMS(maxTimeMs)._toArray()
    }
  }

  static noop() {
    return new Timeoutify({ timeoutMS: 0, logger: { debug: () => {} } })
  }
}

export default Timeoutify
