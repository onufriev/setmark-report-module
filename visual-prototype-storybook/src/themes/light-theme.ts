import { createTheme } from '@material-ui/core/styles'
import { PaletteOptions } from '@material-ui/core/styles/createPalette'
import { shadows, shape, typography } from './base-theme'

const palette: PaletteOptions = {
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
        type1: '#DEE0E3', // 'rgba(59, 73, 94, .24)',
        type2: '#F1F3F4', // 'rgba(195, 204, 208, .24)',
        type3: '#F6F8F9', // 'rgba(215, 221, 223, .24)',
        hover: '#EAF0F3', // 'rgba(176, 193, 201, .24)',
    },
    type: 'light',
}

const theme = {
    palette,
    shape,
    typography,
    shadows,
}

const lightTheme = createTheme(theme)

export default lightTheme
