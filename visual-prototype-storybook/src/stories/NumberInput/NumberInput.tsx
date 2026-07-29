import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import isNil from 'lodash/isNil'
import { isValidNumber, minmax, NUMBER_INPUT_REGEX, NumberInputDataType, parseStringToNumber, truncate } from './utils'
import { TextInput, TextInputProps } from '../TextInput'
import { useLocale } from '../LocaleProvider'
import { InputAdornment } from '../InputAdornment'

export type NumberInputProps = Omit<TextInputProps,
    'type' | 'onValueChange' | 'value' | 'defaultValue' | 'startAdornment' | 'endAdornment' | 'multiline'
> & {
    defaultValue?: number
    value?: number | null
    /** Эмиттит последнее валидное введенное значение */
    onValueChange?: (value: number | null) => void
    /** Тип данных
     * "int"      - целочисленные
     * "decimal"  - с плавающей точкой
     * "currency" - валюта
     * "unit"     - единицы измерения
     **/
    type?: NumberInputDataType
    /** Максимальное значение */
    max?: number
    /** Минимальное значение */
    min?: number
    /**
     * Эмиттит null, если пользователь стер значение в инпуте
     * Если false, тогда пустое поле считается невалидным
     **/
    nullable?: boolean
    /** Текстовый префикс */
    prefix?: string
    /** Текстовый постфикс */
    postfix?: string
    /**
     * Количество знаков после запятой
     * Работает только для type="decimal"
     * Для целочисленных значений используйте type="int"
     */
    rounding?: number
    /**
     * Форматирования числа в локализованный вид "1 000 000,00" (в момент когда нет редактирования)
     * Если задан type="int", будет "1 000 000"
     */
    formatting?: boolean
    /** Код валюты ISO 4217, если type="currency" */
    currency?: string
    /** Наименование "единицы измерения" согласно https://unicode.org/reports/tr35/tr35-general.html#6-unit-elements */
    unit?: string
    /** Событие возникновения внутренней ошибки */
    onError?: (reason: NumberInputErrorReason) => void
}

export type NumberInputErrorReason = 'invalid' | 'required'

export interface NumberInputState {
    stringValue: string
    editing: boolean
}

/**
 * Поле ввода чисел
 * Для форматирования и анализа введенного значения использует браузерный апи Intl.NumberFormat
 */
const NumberInput = forwardRef<HTMLDivElement, NumberInputProps>(
    function (props, forwardedRef) {
        const {
            defaultValue: defaultValueProps,
            value: valueProps,
            onValueChange: onValueChangeProps,

            type = 'int',
            max,
            min,
            nullable,
            prefix,
            postfix,
            formatting,
            rounding: roundingProps = 2,

            currency,
            unit,

            onError,

            error: errorProps,
            errorText,
            readOnly,
            onFocus,
            onBlur,
            onClear,

            ...restProps
        } = props


        const { locale } = useLocale()

        const formatter = useMemo(() => {
            let opts: Intl.NumberFormatOptions = {}

            if (type === 'currency') {
                if (!currency) {
                    console.error('CSI UI: prop "currency" must be defined!')
                } else {
                    opts = {
                        style: 'currency',
                        currency,
                    }
                }
            }

            if (type === 'unit') {
                if (!unit) {
                    console.error('CSI UI: prop "unit" must be defined!')
                } else {
                    opts = {
                        style: 'unit',
                        unit,
                    }
                }
            }

            return new Intl.NumberFormat(locale, opts)
        }, [locale, roundingProps, type])

        const [focused, setFocused] = useState<boolean>(false)
        const [error, setError] = useState<boolean>(false)

        const format = useCallback((value: number) => {
            return formatter.format(value)
        }, [formatter])

        const [valueNum, setValueNum] = useState<number | null>(() => {
            if (!isNil(defaultValueProps) && isValidNumber(defaultValueProps)) return defaultValueProps
            if (!isNil(valueProps) && isValidNumber(valueProps)) return valueProps
            return null
        })

        const [valueStr, setValueStr] = useState<string>(() => {
            if (valueNum === null) return ''
            return formatting ? format(valueNum) : String(valueNum)
        })

        useEffect(() => {
            if (focused) {
                return
            }

            if (isNil(valueProps) && isNil(valueNum) || valueProps === valueNum) {
                return
            }

            if (isNil(valueProps)) {
                if (nullable) {
                    setValueNum(null)
                    setValueStr('')
                }

                return
            }

            if (isValidNumber(valueProps)) {
                setValueNum(valueProps)
                setValueStr(formatting ? format(valueProps) : String(valueProps))
            }
        }, [valueProps])

        const postProcess = (value: number) => {
            if (type === 'int') {
                value = truncate(value, 0)
            }

            if (type === 'decimal') {
                value = truncate(value, roundingProps)
            }

            return value
        }

        const handleValueChange = (value: string) => {
            if (!NUMBER_INPUT_REGEX.test(value)) return

            setValueStr(value)
            setError(false)

            if (value === '') {
                if (nullable) {
                    setValueNum(null)
                    onValueChangeProps?.(null)

                    return null
                } else {
                    // таким образом мы исключаем состояние без ввода для не nullable
                    value = '0'
                }
            }

            const parsedNum = parseStringToNumber(value, type)

            if (parsedNum === null) {
                setError(true)
                onError?.('invalid')
                return
            }

            const newValueNum: number = postProcess(minmax(parsedNum, min, max) as number)

            if (valueNum !== newValueNum) {
                setValueNum(newValueNum)
                onValueChangeProps?.(newValueNum)
            }

            return newValueNum
        }

        const handleFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
            setFocused(true)

            if (readOnly) {
                onFocus?.(evt)
                return
            }

            if (formatting) {
                setValueStr(valueNum !== null ? String(valueNum) : '')
            }

            onFocus?.(evt)
        }

        const handleBlur = (evt: React.FocusEvent<HTMLInputElement>) => {
            setFocused(false)

            if (readOnly) {
                onBlur?.(evt)
                return
            }

            resetDisplayValue(valueNum)

            onBlur?.(evt)
        }

        const resetDisplayValue = (validValue: number | null) => {
            if (validValue === null) {
                if (nullable) {
                    setValueStr('')
                    setError(false)
                } else {
                    setError(true)
                    onError?.('required')
                }

                return
            }

            setValueStr(String(validValue))
            setError(false)

            if (formatting) {
                setValueStr(format(validValue))
            }
        }

        const handleClear = () => {
            const newValueNum = handleValueChange('')!
            resetDisplayValue(newValueNum)
            onClear?.()
        }

        return (
            <TextInput
                ref={forwardedRef}
                {...restProps}
                value={valueStr}
                onValueChange={handleValueChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={error || errorProps}
                errorText={errorText}
                readOnly={readOnly}
                startAdornment={prefix && (
                    <InputAdornment position="start">
                        { prefix }
                    </InputAdornment>
                )}
                endAdornment={postfix && (
                    <InputAdornment position="end">
                        { postfix }
                    </InputAdornment>
                )}
                onClear={handleClear}
            />
        )
})

export default NumberInput
