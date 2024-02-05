import type { PropsWithChildren } from 'react'
import type { Insets, ViewProps } from 'react-native'

export type Props = PropsWithChildren<{ readonly pointerEvents?: ViewProps['pointerEvents'], readonly insets?: Insets, readonly colorize?: boolean }>
