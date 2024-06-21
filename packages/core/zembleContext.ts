import { KeyValue, type IStandardKeyValueService } from '.'
import createLogger from './createLogger'

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
    return new KeyValue<T>(prefix as string) as unknown as IStandardKeyValueService<T>
  }
}

const context = new ContextInstance()

export const defaultMultiProviders = {
  logger: {
    '@zemble/core': context.logger,
  },
  kv: {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    '@zemble/core': context.kv.bind(context.kv),
  },
} as Pick<Zemble.MultiProviders, 'kv' | 'logger'>

export default context
