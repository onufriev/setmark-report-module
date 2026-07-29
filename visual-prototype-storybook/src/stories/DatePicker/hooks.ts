import { useRef } from 'react'
import { useLocale } from '../LocaleProvider'
import { DateUtils } from './utils'

export function useUtils () {
    const { locale } = useLocale()

    const utils = useRef<DateUtils>(new DateUtils(locale))

    return utils.current!
}

export const useNow = () => {
    const utils = useUtils()
    const now = useRef(utils.date())

    return now.current!
}
