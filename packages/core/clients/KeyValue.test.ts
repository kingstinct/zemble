import { describe, expect, it } from 'bun:test'

import KeyValue from './KeyValue'

describe('KeyValue', () => {
  it('Should set and get', () => {
    const kv = new KeyValue('test')
    kv.set('test', 'testval')

    expect(kv.get('test')).toEqual('testval')
  })

  it('Namespace should persist between initializations', () => {
    const kv = new KeyValue('test')
    kv.set('test', 'testval')

    const kvAgain = new KeyValue('test')
    expect(kvAgain.get('test')).toEqual('testval')
  })

  it('Should not spill over between namespaces', () => {
    const kv = new KeyValue('test')
    kv.set('test', 'testval')

    const kv2 = new KeyValue('test2')

    expect(kv2.get('test')).toEqual(null)
  })
})
