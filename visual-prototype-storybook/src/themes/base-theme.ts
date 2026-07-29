import { TypographyOptions } from '@material-ui/core/styles/createTypography'
import { ShapeOptions } from '@material-ui/core/styles/shape'
import { PaletteOptions } from '@material-ui/core/styles/createPalette'
import { ThemeOptions } from '@material-ui/core'
import { IShadows } from '../typings/Theme'
import { ZIndex } from '@material-ui/core/styles/zIndex'

export const palette: PaletteOptions = {
    primary: {
        main: '#0091EA',
    },
    secondary: {
        main: '#0091EA',
    },
    success: {
        main: '#51B97D',
    },
    error: {
        main: '#EB5757',
    },
    background: {
        paper: '#FFFFFF',
        default: '#ECEEF0',
    },
    divider: '#D0D3D6',
    text: {
        primary: '#1D2023',
        secondary: '#7A7C7E',
        disabled: '#C0C3C6',
    },
    action: {
        active: 'rgba(0, 0, 0, 0.54)',
        hover: 'rgba(0, 0, 0, 0.04)',
        selected: 'rgba(0, 0, 0, 0.08)',
        disabled: 'rgba(0, 0, 0, 0.26)',
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
    overlay: {
        type1: '#DEE0E3',
        type2: '#F1F3F4',
        type3: '#F6F8F9',
        hover: '#EAF0F3',
    },
}

export const shape: ShapeOptions = {
    borderRadius: 4,
}

export const typography: TypographyOptions = {
    h4: {
        fontSize: 24,
        fontStyle: 'normal',
        lineHeight: '28px',
        fontWeight: 500,
    },
    h5: {
        fontWeight: 500,
        fontSize: 20,
        lineHeight: '28px',
        fontStyle: 'normal',
    },
    h6: {
        fontWeight: 500,
        fontSize: 16,
        lineHeight: '24px',
        fontStyle: 'normal',
    },
    caption: {
        fontWeight: 400,
        fontSize: 12,
        lineHeight: '14px',
        fontStyle: 'normal',
    },
    body1: {
        fontWeight: 400,
        fontSize: 14,
        lineHeight: '20px',
        fontStyle: 'normal',
    },
    button: {
        fontWeight: 500,
        fontSize: 14,
        lineHeight: '20px',
        fontStyle: 'normal',
        letterSpacing: 0.75,
    },
    subtitle1: {
        fontWeight: 700,
        fontSize: 14,
        lineHeight: '16px',
        fontStyle: 'normal',
    },
    inputText: {
        fontWeight: 400,
        fontSize: 14,
        lineHeight: '16px',
        fontStyle: 'normal',
    },
    fontFamily: ['Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif', '-apple-system'].join(','),
}

const shadowsTemplate = new Array(24).fill('none')
shadowsTemplate[1] = '0px 1px 2px 0px rgba(0, 0, 0, .25)'
shadowsTemplate[2] = '0px 8px 12px 0px rgba(0, 0, 0, .2)'
shadowsTemplate[3] = '0px 3px 4px 0px rgba(0, 75, 135, .24)'
export const shadows = [...shadowsTemplate] as IShadows

export const zIndex: ZIndex = {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
    max: 10000,
}

export const baseThemeOptions: ThemeOptions = {
    palette,
    shape,
    typography,
    shadows,
    zIndex,
}
