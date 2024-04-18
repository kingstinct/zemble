import { renderHook, act } from '@testing-library/react-hooks'
import {
  mock, describe, test, expect, jest,
} from 'bun:test'

import useBooleanWithHaptics from './useBooleanWithHaptics'

describe('useBooleanWithHaptics', () => {
  test('switch from false to true', async () => {
    await mock.module('react-native', () => ({ Platform: { OS: 'ios' } }))
    await mock.module('expo-haptics', () => ({ selectionAsync: jest.fn() }))

    const { result } = renderHook(useBooleanWithHaptics)

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(true)
  })

  test('switch from true to false', async () => {
    await mock.module('react-native', () => ({ Platform: { OS: 'ios' } }))
    await mock.module('expo-haptics', () => ({ default: { selectionAsync: jest.fn() } }))

    const { result } = renderHook(() => useBooleanWithHaptics(true))

    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[2]()
    })

    expect(result.current[0]).toBe(false)
  })
})
