import type { IStandardKeyValueService } from '.'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore fix later
class ContextInstance implements Readapt.GlobalContext {
  // eslint-disable-next-line functional/prefer-readonly-type
  logger = process.env.NODE_ENV === 'test' ? {
    debug: () => {},
    info: () => {},
    time: () => {},
    timeEnd: () => {},
    warn: () => {},
    error: console.error,
    log: () => {},
  } : console

  // eslint-disable-next-line class-methods-use-this
  kv<T extends Readapt.KVPrefixes[K], K extends keyof Readapt.KVPrefixes = keyof Readapt.KVPrefixes>(prefix: K): IStandardKeyValueService<T> {
    // @ts-expect-error fix sometime maybe :)
    return new KeyValue<T>(prefix) as unknown as IStandardKeyValueService<T>
  }
}

export default new ContextInstance()
