import IMask from 'imask'
import React, { forwardRef, useEffect, useState } from 'react'
import { useForkRef } from '../../../utils/useForkRef'
import useMaskedInput from '../../MaskedInput/hook'
import TextInput, { TextInputProps } from '../../TextInput/TextInput'
import { DateTimeInputDefaults } from '../constants'
import { useNow, useUtils } from '../hooks'
import { DateTimeInputVariant } from '../types'
import useControlled from '../../../utils/useControlled'

export type DateTimeInputError = 'invalidDate' | 'nullable' | null

export type DateTimeInputProps = {
    date?: Date | null
    onChange?: (date: Date | null) => void
    minDate?: Date
    maxDate?: Date
    variant?: DateTimeInputVariant
    nullable?: boolean
    error?: DateTimeInputError | true
    onError?: (error: DateTimeInputError) => void
    timePartModifyVariant?: 'start' | 'end'
} & Omit<TextInputProps, 'value' | 'children' | 'onChange' | 'defaultValue' | 'clearVisibled' | 'onClear' | 'onError' | 'error'>

const patterns = {
    date: 'dd.`MM.`yyyy',
    datetime: 'dd.`MM.`yyyy `HH:`mm',
    datetimeWithSeconds: 'dd.`MM.`yyyy `HH:`mm:`ss',
    time: 'HH:`mm',
    timeWithSeconds: 'HH:`mm:`ss',
}

export const formats = {
    date: 'dd.MM.yyyy',
    datetime: 'dd.MM.yyyy HH:mm',
    datetimeWithSeconds: 'dd.MM.yyyy HH:mm:ss',
    time: 'HH:mm',
    timeWithSeconds: 'HH:mm:ss',
}

const DateTimeInput = forwardRef<HTMLDivElement, DateTimeInputProps>(
    function (props, forwardedRef) {
        const {
            date,
            onChange,
            minDate,
            maxDate,
            variant = DateTimeInputDefaults.variant,

            placeholder,
            inputRef: inputRefProps,
            error: errorProps,
            onError,

            nullable,

            timePartModifyVariant,

            InputLabelProps,

            ...restProps
        } = props

        const now = useNow()
        const utils = useUtils()

        let pattern = patterns[variant]
        let format = formats[variant]

        const options = {
            mask: pattern,
            lazy: false,
            // autofix: false,
            overwrite: true,
            blocks: {
                'dd': {
                    mask: IMask.MaskedRange,
                    placeholderChar: '_',
                    from: 1,
                    to: 31,
                    maxLength: 2,
                },
                'MM': {
                    mask: IMask.MaskedRange,
                    placeholderChar: '_',
                    from: 1,
                    to: 12,
                    maxLength: 2,
                },
                'yyyy': {
                    mask: IMask.MaskedRange,
                    placeholderChar: '_',
                    from: minDate ? utils.getYear(minDate) : 1900,
                    to: maxDate ? utils.getYear(maxDate) : 2999,
                    maxLength: 4,
                },
                'HH': {
                    mask: IMask.MaskedRange,
                    placeholderChar: '_',
                    from: 0,
                    to: 23,
                    maxLength: 2,
                },
                'mm': {
                    mask: IMask.MaskedRange,
                    placeholderChar: '_',
                    from: 0,
                    to: 59,
                    maxLength: 2,
                },
                'ss': {
                    mask: IMask.MaskedRange,
                    placeholderChar: '_',
                    from: 0,
                    to: 59,
                    maxLength: 2,
                },
            },
        }

        const {
            ref: inputRef,
            maskRef,
            value,
            changeValue,
            unmaskedValue,
            changeUnmaskedValue,
            typedValue,
            changeTypedValue,
        } = useMaskedInput(options)

        const prepareValue = (initialValue?: Date | null) => {
            if (nullable && !initialValue) return null

            const newValue = initialValue || now

            if (timePartModifyVariant === 'start') {
                if (variant === 'date') {
                    return utils.startOfDay(newValue)
                }
                if (variant === 'datetime' || variant === 'time') {
                    return utils.startOfMinute(newValue)
                }
                if (variant === 'datetimeWithSeconds' || variant === 'timeWithSeconds') {
                    return utils.startOfSecond(newValue)
                }
            }

            if (timePartModifyVariant === 'end') {
                if (variant === 'date') {
                    return utils.endOfDay(newValue)
                }
                if (variant === 'datetime' || variant === 'time') {
                    return utils.endOfMinute(newValue)
                }
                if (variant === 'datetimeWithSeconds' || variant === 'timeWithSeconds') {
                    return utils.endOfSecond(newValue)
                }
            }

            return newValue
        }

        const [currentDate, setCurrentDate] = useState<Date | null>(prepareValue(date))

        const [error, setError] = useControlled<DateTimeInputError | true>({
            controlled: errorProps,
            default: null,
        })

        // В IMask есть механизм инициализации первого значения через передачу defaultValue инпуту.
        // Но мы на это полагаться не будем. Нам нужно получить обновление unmaskedValue.
        // Поэтому если внутреннее значение есть, вставляем его в ипут.
        // Если оно отличается от значения в props, будет вызван onChange.
        // Такое поведение необходимо, если nullable === false, а пользователь не передал валидное в props
        useEffect(() => {
            if (currentDate) {
                changeValue(utils.format(currentDate, format))
            }
        }, [])

        useEffect(() => {
            if (currentDate === null) {
                if (nullable) {
                    setError(null)
                    onError?.(null)
                } else {
                    setError('nullable')
                    onError?.('nullable')
                }
            }
        }, [nullable])

        // обрабатываем изменение входного значения
        useEffect(() => {
            if (date !== undefined && !utils.isEqual(date, currentDate)) {
                setCurrentDate(date)

                if (date) {
                    changeValue(utils.format(date, format))
                } else {
                    if (unmaskedValue) changeUnmaskedValue('')
                }
            }

            // TODO хорошенько обдумать и возможно пересмотреть
            if (date === null && nullable) {
                setError(null)
                onError?.(null)
            }
        }, [date])

        // эдакий onChange на MaskedInput
        useEffect(() => {
            // пустой value при инициализации masked input, поэтому отсекаем его
            // поскольку мы используем отрисовываемую маску, пустого value быть не может
            if (!value) return

            // пользователь полностью стер значение в инпуте
            if (!unmaskedValue) {
                if (nullable) {
                    setCurrentDate(null)
                    setError(null)
                    onError?.(null)

                    if (date !== null) {
                        onChange?.(null)
                    }
                } else {
                    setError('nullable')
                    onError?.('nullable')
                }
            // пользователь что-то ввел
            } else {
                const parsedDate = utils.parse(value, format)

                // если введенное значение валидно
                if (parsedDate && utils.isValid(parsedDate)) {
                    let newDate = parsedDate

                    // мержить нужно дату с временем полностью
                    if (variant === 'date') {
                        newDate = utils.mergeDateAndTime(parsedDate, currentDate || now)
                    }
                    // мержить нужно секунды и миллисекунды
                    if (variant === 'datetime') {
                        newDate = utils.mergeDateAndSMsTimeParts(parsedDate, currentDate || now)
                    }
                    // мержить нужно только миллисекунды
                    if (variant === 'datetimeWithSeconds') {
                        newDate = utils.mergeDateAndMsTimeParts(parsedDate, currentDate || now)
                    }

                    // парсинг времени выдаёт сегодняшнюю дату (возможно нам неподходящую),
                    // поэтому если работаем со временем,
                    // нужно мержить текущую дату с распарсенным временем

                    // мержить нужно часы и минуты
                    if (variant === 'time') {
                        newDate = utils.mergeDateAndTimeHMParts(currentDate || now, parsedDate)
                    }
                    // мержить нужно часы, минуты и секунды
                    if (variant === 'timeWithSeconds') {
                        newDate = utils.mergeDateAndTimeHMSParts(currentDate || now, parsedDate)
                    }

                    // далее пост обработка "с начала" или "с конца"

                    if (timePartModifyVariant === 'start') {
                        if (variant === 'date') {
                            newDate = utils.startOfDay(newDate)
                        }
                        if (variant === 'datetime' || variant === 'time') {
                            newDate = utils.startOfMinute(newDate)
                        }
                        if (variant === 'datetimeWithSeconds' || variant === 'timeWithSeconds') {
                            newDate = utils.startOfSecond(newDate)
                        }
                    }

                    if (timePartModifyVariant === 'end') {
                        if (variant === 'date') {
                            newDate = utils.endOfDay(newDate)
                        }
                        if (variant === 'datetime' || variant === 'time') {
                            newDate = utils.endOfMinute(newDate)
                        }
                        if (variant === 'datetimeWithSeconds' || variant === 'timeWithSeconds') {
                            newDate = utils.endOfSecond(newDate)
                        }
                    }

                    setCurrentDate(newDate)

                    setError(null)
                    onError?.(null)

                    if (!utils.isEqual(date, newDate)) {
                        onChange?.(newDate)
                    }
                } else {
                    setError('invalidDate')
                    onError?.('invalidDate')
                }
            }
            // завязывается на typedValue, т.к. он меняется после изменения value и maskedValue
        }, [typedValue])

        const handleInputRef = useForkRef(inputRef, inputRefProps)

        return (
            <TextInput
                ref={forwardedRef}
                autoComplete="off"
                autoCorrect="off"
                {...restProps}
                inputRef={handleInputRef}
                data-testid="DateTimeInput"
                error={!!error}
                clearVisibled={Boolean(unmaskedValue)}
                InputLabelProps={{
                    shrink: true,
                    ...InputLabelProps
                }}
                onClear={() => changeUnmaskedValue('')}
                placeholder={placeholder || format.toLowerCase()}
            />
        )
    }
)

export default DateTimeInput
