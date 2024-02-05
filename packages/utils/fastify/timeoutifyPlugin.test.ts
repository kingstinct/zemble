import { timeoutifyPlugin } from './timeoutifyPlugin'

import type { onRequestHookHandler } from 'fastify'

const on = (evt: string, handler: () => void) => {
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
      addHook: (eventType: string, handler: onRequestHookHandler) => {
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
