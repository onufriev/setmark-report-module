import { createTheme } from '@material-ui/core/styles'
import { PaletteOptions } from '@material-ui/core/styles/createPalette'
import { shadows, shape, typography } from './base-theme'

const palette: PaletteOptions = {
    primary: {
        main: '#007ECB',
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
        paper: '#333639',
        default: '#26292C',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    text: {
        primary: '#fff',
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)',
    },
    action: {
        active: 'rgba(255, 255, 255, 0.7)',
        hover: 'rgba(255, 255, 255, 0.08)',
        selected: 'rgba(255, 255, 255, 0.16)',
        disabled: 'rgba(255, 255, 255, 0.3)',
        disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
    overlay: {
        type1: '#515459',
        type2: '#414548',
        type3: '#383C41',
        hover: '#3B5060',
    },
    type: 'dark',
}

const theme = {
    palette,
    shape,
    typography,
    shadows,
}

const darkTheme = createTheme(theme)

export default darkTheme
