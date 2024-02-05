import { useCallback, useEffect, useRef } from 'react'

// https://gist.github.com/diegohaz/695097a06f038a707c3a1b11e4e40195

export function useEvent<T extends readonly unknown[], TRet extends Exclude<unknown, JSX.Element>>(handler: (...args: T) => TRet) {
  const handlerRef = useRef<(...args: T) => TRet>()

  // In a real implementation, this would run before layout effects
  useEffect(() => {
    handlerRef.current = handler
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return useCallback<(...args: T) => TRet>((...args) => handlerRef.current?.apply(null, args), [])
}

export default useEvent
