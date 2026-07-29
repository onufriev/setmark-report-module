import React from 'react'
import { ThemeProvider } from '../stories/ThemeProvider'
import { lightTheme, darkTheme } from '../themes'

export const withTheme = (component: React.ReactNode, theme: 'light' | 'dark' = 'light') => {
    return React.createElement(
        ThemeProvider,
        {
            theme: theme === 'light' ? lightTheme : darkTheme,
            children: component
        }
    )
}
