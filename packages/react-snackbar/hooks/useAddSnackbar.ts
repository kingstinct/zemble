import { useCallback } from 'react'

import useSnackbarStore from './useSnackbarStore'

import type { SnackbarConfig } from './useSnackbarStore'

export function useAddSnackbar<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap>(defaultSnackbarConfig?: Omit<SnackbarConfig<TMap, T>, 'title'>) {
  const addSnackbar = useSnackbarStore((state) => state.addSnackbar)

  return useCallback(function ShowSnackbar<TMapInner extends Record<string, unknown> = TMap, TInner extends keyof TMapInner = keyof TMapInner>(title: string, snackbarConfig?: Omit<SnackbarConfig<TMapInner, TInner>, 'title'>) {
    addSnackbar<TMapInner, TInner>({ ...defaultSnackbarConfig, ...snackbarConfig, title } as SnackbarConfig<TMapInner, TInner>)
  }, [addSnackbar, defaultSnackbarConfig])
}

export default useAddSnackbar
