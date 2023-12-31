import createLogger from './createLogger'

import type { IStandardKeyValueService } from '.'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
class ContextInstance implements Zemble.GlobalContext {
  // eslint-disable-next-line functional/prefer-readonly-type
  logger = createLogger()

  // eslint-disable-next-line class-methods-use-this
  kv<
    T extends Zemble.KVPrefixes[K],
    K extends keyof Zemble.KVPrefixes = keyof Zemble.KVPrefixes
  >(prefix: K): IStandardKeyValueService<T> {
    // @ts-expect-error fix sometime maybe :)
    return new KeyValue<T>(prefix) as unknown as IStandardKeyValueService<T>
  }
}

export default new ContextInstance()
