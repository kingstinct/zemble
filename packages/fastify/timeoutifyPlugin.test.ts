import { describe, expect, jest, test } from 'bun:test'
import type { onRequestHookHandler } from 'fastify'
import { timeoutifyPlugin } from './timeoutifyPlugin'

const on = (_: string, handler: () => void) => {
  handler()
}

describe('timeoutifyPlugin', () => {
  test('addFastifyHook', () => {
    const fakeServer = { addHook: jest.fn() }

    // @ts-expect-error sdfsdf
    timeoutifyPlugin(fakeServer, { timeoutMS: 4000 }, () => {})
    expect(fakeServer.addHook).toHaveBeenCalled()
  })

  test('onRequest', () => {
    const req = { socket: { on } }
    const reply = { sent: true, raw: { on } }
    const done = jest.fn()
    let callback: onRequestHookHandler
    const fakeServer = {
      addHook: (_: string, handler: onRequestHookHandler) => {
        callback = handler
      },
    }

    // @ts-expect-error sdfsdf
    timeoutifyPlugin(fakeServer, { timeoutMS: 4000 }, () => {})

    // @ts-expect-error sdfsdf
    callback(req, reply, done)

    expect(req).toHaveProperty('timeoutify')
  })
})
