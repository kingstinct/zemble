import { type IStandardKeyValueService, KeyValue } from '.'
import createLogger from './createLogger'

// @ts-ignore
class ContextInstance implements Zemble.GlobalContext {
  logger = createLogger()

  kv<
    T extends Zemble.KVPrefixes[K],
    K extends keyof Zemble.KVPrefixes = keyof Zemble.KVPrefixes,
  >(prefix: K): IStandardKeyValueService<T> {
    return new KeyValue<T>(
      prefix as string,
    ) as unknown as IStandardKeyValueService<T>
  }
}

const context = new ContextInstance()

export const defaultMultiProviders = {
  logger: {
    '@zemble/core': context.logger,
  },
  kv: {
    '@zemble/core': context.kv.bind(context.kv),
  },
} as Pick<Zemble.MultiProviders, 'kv' | 'logger'>

export default context
