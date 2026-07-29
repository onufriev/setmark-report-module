import '@material-ui/core/styles'
import lightTheme from '../themes/light-theme'

export type themeMui = typeof lightTheme

declare module 'styled-components' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends themeMui {}
}
