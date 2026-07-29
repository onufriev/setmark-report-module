import merge from 'lodash/merge'
import { createTheme as createThemeMui } from '@material-ui/core/styles'
import { CsiTheme, CsiThemeOptions } from '../typings/Theme'
import { baseThemeOptions } from './base-theme'

export const createTheme = (theme: CsiThemeOptions): CsiTheme => {
    const newTheme = merge({}, baseThemeOptions, theme)

    return createThemeMui(newTheme)
}
