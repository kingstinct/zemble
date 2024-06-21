import { renderHook, act } from '@testing-library/react-hooks'
import {
  mock, describe, expect, it, jest,
} from 'bun:test'

import useToggleWithHaptics from './useToggleWithHaptics'

describe('useToggleWithHaptics', () => {
  it('switch from false to true', async () => {
    await mock.module('react-native', () => ({ Platform: { OS: 'ios' } }))
    await mock.module('expo-haptics', () => ({ selectionAsync: jest.fn() }))

    const { result } = renderHook(useToggleWithHaptics)

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(true)
  })

  it('switch from true to false', async () => {
    await mock.module('react-native', () => ({ Platform: { OS: 'ios' } }))
    await mock.module('expo-haptics', () => ({ default: { selectionAsync: jest.fn() } }))

    const { result } = renderHook(() => useToggleWithHaptics(true))

    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(false)
  })
})
