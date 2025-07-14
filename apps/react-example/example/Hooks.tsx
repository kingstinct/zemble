import useEvent from '@zemble/react/hooks/useEvent'

export const useOnClick = () => {
  const testing = useEvent(() => {})

  return testing
}

export const useOnClick10 = () => {
  const testing = useEvent((a: number) => a)

  return testing
}

export const useRender = () => {
  const testing = useEvent((a: number) => <div>{a}</div>)

  return testing
}

export const useOnClickWithPromise = () => {
  const testing = useEvent(
    async (a: number) =>
      new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(a)
        }, 1000)
      }),
  )

  return testing
}
