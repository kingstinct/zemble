import React from 'react'

import { ThemeContext } from '../contexts/Theme'

export const useTheme = () => React.useContext(ThemeContext).theme

export default useTheme
