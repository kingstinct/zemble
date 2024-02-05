import { renderHook, act } from '@testing-library/react-hooks'

import useBoolean from './useBoolean'

describe('useBoolean', () => {
  it('switch from false to true', () => {
    const { result } = renderHook(useBoolean)

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(true)
  })

  it('switch from true to false', () => {
    const { result } = renderHook(() => useBoolean(true))

    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[2]()
    })

    expect(result.current[0]).toBe(false)
  })
})
