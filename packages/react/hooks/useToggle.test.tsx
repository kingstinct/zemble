import { renderHook, act } from '@testing-library/react-hooks'

import useToggle from './useToggle'

describe('useToggle', () => {
  it('switch from false to true', () => {
    const { result } = renderHook(useToggle)

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(true)
  })

  it('switch from true to false', () => {
    const { result } = renderHook(() => useToggle(true))

    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(false)
  })
})
