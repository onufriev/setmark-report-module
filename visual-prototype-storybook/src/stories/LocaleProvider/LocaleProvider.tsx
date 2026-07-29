
import React, { createContext, useContext } from 'react'
import { Locale } from '../../typings/Locale'
import localeDictionary from '../../locale'
import get from 'lodash/get'

export interface ILocaleContext {
    locale: Locale
    t: (path: string, interpolation?: LocaleInterpolationDict) => string
}

export interface LocaleInterpolationDict {
    [key: string]: string | number
}

export const LocaleContext = createContext<ILocaleContext>({
    locale: 'ru',
    t: () => ''
})

export type LocaleProviderProps = {
    locale?: Locale
    children: React.ReactNode
}

export const LocaleProvider = (props: LocaleProviderProps): JSX.Element => {
    const { children, locale = 'ru' } = props

    const dictionary = localeDictionary[locale]

    const value = {
        locale,
        t: (path: string, interpolation?: LocaleInterpolationDict) => {
            let value: string = get(dictionary, path)

            if (interpolation != null && typeof interpolation === 'object') {
                value = value.replace(/{{\s*(\w+)\s*}}/g, (substring) => {
                    const key = substring.slice(2, -2).trim()
                    const value = interpolation[key]
                    if (value == null) {
                        console.warn(`CSI UI localizer: not found interpolation value for ${substring}`)
                        return substring
                    }
                    return value.toString()
                })
            }

            value = value.trim()

            return value
        }
    }

    return (
        <LocaleContext.Provider value={value}>
            { children }
        </LocaleContext.Provider>
    )
}

export const useLocale = () => {
    const contextValue = useContext(LocaleContext)

    if (!contextValue) {
        throw new Error(
            'CSI UI: useLocale should only be used inside the LocaleProvider component.',
        );
    }

    return contextValue
}

export default LocaleProvider
