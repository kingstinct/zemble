import * as SystemUI from 'expo-system-ui'
import React, { useEffect, useMemo } from 'react'
import {
  Platform, useColorScheme,
} from 'react-native'

import type { PropsWithChildren } from 'react'

declare global {
  interface KingstinctTheme {
    readonly colors: {
      readonly primary: string;
      readonly background: string;
      readonly surface: string;
      readonly accent: string;
      readonly error: string;
      readonly text: string;
      readonly onSurface: string;
      readonly disabled: string;
      readonly placeholder: string;
      readonly backdrop: string;
      readonly notification: string;
    };
  }
}

export const DefaultTheme: KingstinctTheme = {
  colors: {
    accent: '#03dac4',
    backdrop: '#00000088',
    background: '#f6f6f6',
    disabled: '#00000044',
    error: '#B00020',
    notification: '#f50057',
    onSurface: '#000000',
    placeholder: '#00000099',
    primary: '#6200ee',
    surface: 'white',
    text: 'black',
  },
}

type ThemeContextData = {
  readonly theme: KingstinctTheme
}

export const ThemeContext = React.createContext<ThemeContextData>({ theme: DefaultTheme })

type ThemeProviderProps = PropsWithChildren<{
  readonly theme: KingstinctTheme
  readonly darkTheme?: KingstinctTheme
}>

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children, theme, darkTheme,
}) => {
  const colorScheme = useColorScheme()

  useEffect(() => {
    if (Platform.OS === 'android') {
      void SystemUI.setBackgroundColorAsync(theme.colors.background)
    }
  }, [colorScheme, theme])

  const value = useMemo<ThemeContextData>(() => ({
    theme: colorScheme === 'dark' ? darkTheme || theme : theme,
  }), [colorScheme, darkTheme, theme])

  return (
    <ThemeContext.Provider value={value}>
      { children }
    </ThemeContext.Provider>
  )
}

export default { ThemeProvider }
