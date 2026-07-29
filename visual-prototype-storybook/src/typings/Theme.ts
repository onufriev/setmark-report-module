import React from 'react'
import { Theme, ThemeOptions } from '@material-ui/core/styles'
import { Palette, PaletteOptions } from '@material-ui/core/styles/createPalette'
import { Typography, TypographyOptions } from '@material-ui/core/styles/createTypography'

export type IShadows = [
    'none', // соответствует 0
    string,
    string,
    string,
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none'
]

export interface IPalette {
    overlay: {
        type1: React.CSSProperties['color']
        type2: React.CSSProperties['color']
        type3: React.CSSProperties['color']
        hover: React.CSSProperties['color']
    }
}
export interface IPaletteOptions {
    overlay?: {
        type1: React.CSSProperties['color']
        type2: React.CSSProperties['color']
        type3: React.CSSProperties['color']
        hover: React.CSSProperties['color']
    }
}

export interface ITypography {
    inputText: React.CSSProperties
}
export interface ITypographyOptions {
    inputText?: React.CSSProperties
}

// TODO убрать если не будет использоваться
// export interface ITheme {
//     palette: IPalette
//     typography: ITypography
//     shadows: IShadows
// }
// export interface IThemeOptions {
//     palette: IPaletteOptions
//     typography: ITypographyOptions | ((palette: Palette) => ITypographyOptions)
//     shadows: IShadows
// }

declare module "@material-ui/core/styles/createPalette" {
    interface Palette extends IPalette {}
    interface PaletteOptions extends IPaletteOptions {}
}

declare module "@material-ui/core/styles/createTypography" {
    interface Typography extends ITypography {}
    interface TypographyOptions extends ITypographyOptions {}
}

declare module "@material-ui/core/styles/zIndex" {
    interface ZIndex {
        max: number
    }
}

// TODO убрать если не будет использоваться
// declare module "@material-ui/core/styles/createTheme" {
//     interface Theme extends ITheme {}
//     interface ThemeOptions extends IThemeOptions {}
// }

export type CsiTheme = Theme
export type CsiThemeOptions = ThemeOptions
