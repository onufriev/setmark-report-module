import React from 'react'
import { addDecorator } from '@storybook/react'; // <- or your storybook framework
import { MINIMAL_VIEWPORTS} from '@storybook/addon-viewport'
import { withThemes } from 'storybook-addon-themes/react'; // <- or your storybook framework
import { lightTheme } from '../src/themes'
import { darkTheme } from '../src/themes'
import { createGenerateClassName, StylesProvider, ThemeProvider } from '../src/stories/ThemeProvider'

import './storybook.css'

const themes = {
    'Light': {
        badgeColor: '#fff',
        class: 'light-theme',
        theme: lightTheme
    },
    'Dark': {
        badgeColor: '#1E2125',
        class: 'dark-theme',
        theme: darkTheme
    }
}

addDecorator(withThemes)

const generateClassName = createGenerateClassName({
    disableGlobal: true
})

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    viewport: {
        viewports: [
            {
                name: 'xs',
                styles: {
                    width: '320px',
                    height: '100%'
                }
            },
            {
                name: 'sm',
                styles: {
                    width: '640px',
                    height: '100%'
                }
            },
            {
                name: 'md',
                styles: {
                    width: '1024px',
                    height: '100%'
                }
            },
            {
                name: 'lg',
                styles: {
                    width: '1600px',
                    height: '100%'
                }
            }
        ]
    },
    themes: {
        default: 'Light',
        list: Object.keys(themes).map(themeName => ({
            name: themeName,
            color: themes[themeName].badgeColor,
            class: themes[themeName].class
        })),
        clearable: false,
        Decorator: (props) => {
            const { children, themeName } = props
            return (
                <StylesProvider generateClassName={generateClassName}>
                    <ThemeProvider theme={ themes[themeName].theme }>
                        { children }
                    </ThemeProvider>
                </StylesProvider>
            )
        }
    }
}
