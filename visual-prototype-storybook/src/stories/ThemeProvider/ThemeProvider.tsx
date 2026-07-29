import React from 'react'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { CsiTheme } from '../../typings/Theme'
import { CssBaseline } from '../CssBaseline'
import { LocaleProvider } from '../LocaleProvider'
import { Locale } from '../../typings/Locale'

export type ThemeProviderProps = {
    children: React.ReactNode
    theme: CsiTheme
    /**
     * Локализация библиотеки
     * @values 'ru' | 'en'
     * @default 'ru'
     **/
    locale?: Locale
}

const ThemeProvider = (props: ThemeProviderProps): JSX.Element => {
    const { children, theme, locale } = props

    return (
        <MuiThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                <LocaleProvider locale={locale}>
                    <CssBaseline />
                    {children}
                </LocaleProvider>
            </StyledThemeProvider>
        </MuiThemeProvider>
    )
}

export default ThemeProvider
