import React, { forwardRef, useMemo } from 'react'
import IMask from 'imask'
import { MaskedInput, MaskedInputProps } from '../MaskedInput'

export type PhoneNumberInputProps = Omit<MaskedInputProps, 'options'> & {
    /** Массив кодов стран, согласно ISO 3166-1 */
    countries?: PhoneNumberCountryCode[]
}

export type PhoneNumberCountryCode = 'RU' | 'GR' | 'IN'

const masks = [
    {
        mask: '+0 (000) 000-00-00',
        startsWith: '7',
        singleMask: '+{7} (000) 000-00-00',
        lazy: false,
        country: 'RU' as PhoneNumberCountryCode, // Россия
    },
    {
        mask: '+00 {21} 0 000 0000',
        startsWith: '30',
        singleMask: '+{30} {21} 0 000 0000',
        lazy: false,
        country: 'GR' as PhoneNumberCountryCode, // Греция
    },
    {
        mask: '+00-0000-000000',
        startsWith: '91',
        singleMask: '+{91}-0000-000000',
        lazy: false,
        country: 'IN' as PhoneNumberCountryCode, // Индия
    },
    {
        mask: '0000000000000',
        startsWith: '',
        country: null,
    },
]

const PhoneNumberInput = forwardRef<HTMLDivElement, PhoneNumberInputProps>(
    function (props, forwardedRef) {
        const { countries = ['RU'], ...restProps } = props

        const options = useMemo(() => {
            if (countries.length > 1) {
                return {
                    mask: masks.filter(mask => countries.includes(mask.country!) || mask.country === null),
                    dispatch: (appended, dynamicMasked) => {
                        const number = (dynamicMasked.value + appended).replace(/\D/g, '')
                        // @ts-ignore
                        return dynamicMasked.compiledMasks.find(m => number.indexOf(m.startsWith) === 0)
                    },
                } as IMask.MaskedDynamicOptions
            }

            return {
                mask: masks.find(mask => mask.country === countries[0])!.singleMask,
                lazy: false,
            } as IMask.MaskedPatternOptions
        }, [countries])

        return (
            <MaskedInput
                ref={forwardedRef}
                options={options}
                {...restProps}
            />
        )
})

export default PhoneNumberInput
