import { expect, test } from 'bun:test'
import createPubSub from '../createPubSub'
import { onPubSub } from './onPubSub'

test('should subscribe', async () => {
  const pubsub = await createPubSub()

  let calls: readonly unknown[] = []

  onPubSub(pubsub, 'todoUpdated', (hey) => {
    calls = [...calls, hey]
  })

  pubsub.publish('todoUpdated', { titile: 'sdf' })

  await new Promise((resolve) => {
    setTimeout(resolve, 1)
  })

  expect(calls).toEqual([{ titile: 'sdf' }])
})

test('should unsubscribe', async () => {
  const pubsub = await createPubSub()

  let calls: readonly unknown[] = []

  const unsubscribe = onPubSub(pubsub, 'todoUpdated', (hey) => {
    calls = [...calls, hey]
  })

  const res = await unsubscribe()

  pubsub.publish('todoUpdated', { titile: 'sdf' })
  pubsub.publish('todoUpdated', { titile: 'sdf' })
  pubsub.publish('todoUpdated', { titile: 'sdf' })
  pubsub.publish('todoUpdated', { titile: 'sdf' })

  await new Promise((resolve) => {
    setTimeout(resolve, 1)
  })

  expect(calls).toEqual([])
  // @ts-ignore
  expect(res).toEqual({ done: true })
})

test('should unsubscribe in the middle', async () => {
  const pubsub = await createPubSub()

  let calls: readonly unknown[] = []

  const unsubscribe = onPubSub(pubsub, 'todoUpdated', (hey) => {
    calls = [...calls, hey]
  })

  pubsub.publish('todoUpdated', { titile: 'call 1' })
  pubsub.publish('todoUpdated', { titile: 'call 2' })

  await new Promise((resolve) => {
    setTimeout(resolve, 1)
  })

  const res = await unsubscribe()

  pubsub.publish('todoUpdated', { titile: 'call 3' })
  pubsub.publish('todoUpdated', { titile: 'call 4' })

  await new Promise((resolve) => {
    setTimeout(resolve, 1)
  })

  expect(calls).toEqual([{ titile: 'call 1' }, { titile: 'call 2' }])
  // @ts-ignore
  expect(res).toEqual({ done: true })
})
