import { renderHook, act } from '@testing-library/react-hooks'
import {
  describe, test, expect, jest,
} from 'bun:test'

import {
  createAtom, persistAtom, useAtom,
} from './atom'

import type {
  AtomAsyncStorage,
  AtomStorage,
} from './atom'

describe('createAtom', () => {
  test('get initial value', () => {
    const counter = createAtom(1)

    expect(counter.get()).toBe(1)
  })

  test('set value', () => {
    const counter = createAtom(1)

    counter.set(2)

    expect(counter.get()).toBe(2)
  })

  test('set value with setter', () => {
    const counter = createAtom(1)

    counter.set((val) => val + 1)

    expect(counter.get()).toBe(2)
  })
})

describe('persistence', () => {
  test('should read null store', () => {
    const storage: AtomStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    }
    const counter = createAtom(1)
    const val = persistAtom(counter, 'counter', storage)

    expect(val).toBe(null)
    expect(counter.value).toBe(1)

    expect(storage.getItem).toHaveBeenCalledWith('counter')
    expect(storage.getItem).toHaveBeenCalledTimes(1)
  })

  test('should await null store', async () => {
    const storage: AtomAsyncStorage = {
      getItem: jest.fn(async () => Promise.resolve('3')),
      setItem: jest.fn(),
    }
    const counter = createAtom(1)
    const val = await persistAtom(counter, 'counter', storage)

    expect(val).toBe(3)
    expect(counter.value).toBe(3)

    expect(storage.getItem).toHaveBeenCalledWith('counter')
    expect(storage.getItem).toHaveBeenCalledTimes(1)
  })

  test('should read store with value', () => {
    const storage: AtomStorage = {
      getItem: jest.fn(() => '2'),
      setItem: jest.fn(),
    }
    const counter = createAtom(1)
    const val = persistAtom(counter, 'counter', storage)

    expect(val).toBe(2)
    expect(counter.value).toBe(2)

    expect(storage.getItem).toHaveBeenCalledWith('counter')
    expect(storage.getItem).toHaveBeenCalledTimes(1)
  })

  test('should write store with value', async () => {
    const storage: AtomStorage = {
      getItem: jest.fn(() => '2'),
      setItem: jest.fn(),
    }
    const counter = createAtom(1)
    persistAtom(counter, 'counter', storage)

    counter.set(3)

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    expect(storage.setItem).toHaveBeenCalledWith('counter', '3')
    expect(storage.setItem).toHaveBeenCalledTimes(1)
  })
})

describe('listener', () => {
  test('addListener', () => {
    const counter = createAtom(1)

    const spy = jest.fn()
    counter.addListener(spy)

    counter.set((val) => val + 1)

    expect(spy).toHaveBeenCalledWith(2, 1)
  })

  test('remove listener', () => {
    const counter = createAtom(1)

    const spy = jest.fn()
    const { remove } = counter.addListener(spy)

    counter.set((val) => val + 1)

    remove()

    counter.set((val) => val + 1)

    expect(spy).toHaveBeenCalledWith(2, 1)
    expect(spy).not.toHaveBeenCalledWith(3, 2)
  })
})

describe('useAtom', () => {
  test('initial value', () => {
    const counter = createAtom(1)

    const { result } = renderHook(() => useAtom(counter))

    expect(result.current).toBe(1)
  })

  test('increment value', () => {
    const counter = createAtom(1)

    const { result } = renderHook(() => useAtom(counter))

    expect(result.current).toBe(1)

    act(() => {
      counter.set((val) => val + 1)
    })

    expect(result.current).toBe(2)
  })
})
