import { test, expect } from 'bun:test'

import { onPubSub } from './onPubSub'
import createPubSub from '../createPubSub'

test('should subscribe', async () => {
  const pubsub = createPubSub()

  let calls = []

  onPubSub(pubsub, 'todoUpdated', (hey) => {
    // @ts-expect-error sdfasdf
    calls = [...calls, hey]
  })

  pubsub.publish('todoUpdated', { titile: 'sdf' })

  await new Promise((resolve) => { setTimeout(resolve, 1) })

  expect(calls).toEqual([{ titile: 'sdf' }])
})

test('should unsubscribe', async () => {
  const pubsub = createPubSub()

  let calls = []

  const unsubscribe = onPubSub(pubsub, 'todoUpdated', (hey) => {
    // @ts-expect-error sdfasdf
    calls = [...calls, hey]
  })

  const res = await unsubscribe()

  pubsub.publish('todoUpdated', { titile: 'sdf' })
  pubsub.publish('todoUpdated', { titile: 'sdf' })
  pubsub.publish('todoUpdated', { titile: 'sdf' })
  pubsub.publish('todoUpdated', { titile: 'sdf' })

  await new Promise((resolve) => { setTimeout(resolve, 1) })

  expect(calls).toEqual([])
  expect(res).toEqual({ done: true })
})

test('should unsubscribe in the middle', async () => {
  const pubsub = createPubSub()

  let calls = []

  const unsubscribe = onPubSub(pubsub, 'todoUpdated', (hey) => {
    // @ts-expect-error sdfasdf
    calls = [...calls, hey]
  })

  pubsub.publish('todoUpdated', { titile: 'call 1' })
  pubsub.publish('todoUpdated', { titile: 'call 2' })

  await new Promise((resolve) => { setTimeout(resolve, 1) })

  const res = await unsubscribe()

  pubsub.publish('todoUpdated', { titile: 'call 3' })
  pubsub.publish('todoUpdated', { titile: 'call 4' })

  await new Promise((resolve) => { setTimeout(resolve, 1) })

  expect(calls).toEqual([
    { titile: 'call 1' },
    { titile: 'call 2' },
  ])
  expect(res).toEqual({ done: true })
})
