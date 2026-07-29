import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import DateTimeInput, { DateTimeInputError } from '../DateTimeInput/DateTimeInput'
import CalendarPicker, { CalendarPickerProps } from '../CalendarPicker/CalendarPicker'
import TimeInput from '../TimeInput/TimeInput'
import { useNow, useUtils } from '../hooks'
import { InsertInvitation } from '../../icons'
import { Popover } from '../../Popover'
import { InputAdornment } from '../../InputAdornment'
import { IconButton } from '../../IconButton'
import { Box } from '../../Box'
import { Button } from '../../Button'
import { useLocale } from '../../LocaleProvider'
import { Schedule } from '../../icons'
import { DateValidationError, validateDate } from '../utils'
import { InitialTimeStrategyType } from '../types'
import { TextInputProps } from '../../TextInput'
import useControlled from '../../../utils/useControlled'

export type DateTimePickerProps = {
    id?: string
    label?: string

    value?: Date | null
    onChange?: (value: Date | null) => void

    disableFuture?: boolean
    disablePast?: boolean
    minDate?: Date
    maxDate?: Date
    shouldDisableDate?: (date: Date) => boolean

    minTime?: Date
    maxTime?: Date
    /**
     * Настройка для управления первичным значением времени
     * при выборе даты в календаре
     **/
    initialTimeStrategy?: InitialTimeStrategyType
    shouldDisableTime?: (time: Date) => boolean
    /**
     * Проверка времени производится без привязки к дате.
     * Отключает это поведение, включает проверку времени по полной дате
     **/
    disableIgnoringDatePartForTimeValidation?: boolean
    /**
     * Отключает автоматическое выставление времени при выборе даты в календаре
     **/
    disableAutoTimeFilling?: boolean

    error?: DateValidationError | DateTimeInputError | true
    onError?: (error: DateValidationError | DateTimeInputError) => void

    autoFocus?: boolean
    readOnly?: boolean
    disabled?: boolean

    nullable?: boolean
    clearable?: boolean

    withTime?: boolean
    withSeconds?: boolean

    timePartModifyVariant?: 'start' | 'end'

    apiRef?: React.MutableRefObject<DateTimePickerApiRef>

    CalendarPickerProps?: Pick<CalendarPickerProps, 'focusedDay'>
} & Pick<TextInputProps, 'helperText' | 'error' | 'errorText'>

export interface DateTimePickerApiRef {
    openCalendar?(): void
    closeCalendar?(): void
}

const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
    function (props, forwardedRef) {
        const {
            id,
            label,

            value: valueProps,
            onChange,

            disableFuture,
            disablePast,
            minDate,
            maxDate,
            shouldDisableDate,

            minTime,
            maxTime,
            initialTimeStrategy = 'now',
            shouldDisableTime,
            disableIgnoringDatePartForTimeValidation,

            disableAutoTimeFilling,

            autoFocus,
            readOnly,
            disabled,

            nullable,
            clearable,

            withTime,
            withSeconds,

            timePartModifyVariant = 'start',

            apiRef,

            CalendarPickerProps = {},

            helperText,
            error: errorProps,
            onError,
            errorText,
        } = props

        const { t } = useLocale()
        const now = useNow()
        const utils = useUtils()

        useImperativeHandle(apiRef, () => ({
            openCalendar: () => setCalendarOpened(true),
            closeCalendar: () => setCalendarOpened(false),
        }), [apiRef]);

        const inputRef = useRef<HTMLInputElement>(null)
        const timeInputRef = useRef<HTMLInputElement>(null)

        const prepareValue = (initialValue?: Date | null) => {
            if (nullable && !initialValue) return null

            const newValue = initialValue || now

            if (timePartModifyVariant === 'end') {
                if (!withTime) return utils.endOfDay(newValue)
                if (!withSeconds) return utils.endOfMinute(newValue)
                return utils.endOfSecond(newValue)
            }

            if (timePartModifyVariant === 'start') {
                if (!withTime) return utils.startOfDay(newValue)
                if (!withSeconds) return utils.startOfMinute(newValue)
                return utils.startOfSecond(newValue)
            }

            return newValue
        }

        const [inputDate, setInputDate] = useState<Date | null>(prepareValue(valueProps))
        const [calendarDate, setCalendarDate] = useState<Date | null>(prepareValue(valueProps))
        const [time, setTime] = useState<Date | null>(prepareValue(valueProps))

        useEffect(() => {
            if (!nullable && !valueProps) {
                onChange?.(inputDate)
            }
        }, [])

        // TODO добавить динамику
        // useEffect(() => {
        //     const newValue = prepareValue(valueProps)

        //     if (!utils.isEqual(newValue, calendarDate)) {
        //         setCalendarDate(newValue)
        //     }

        //     if (!utils.isEqual(newValue, inputDate)) {
        //         setInputDate(newValue)
        //     }

        //     if (!utils.isEqual(newValue, inputDate)) {
        //         onChange?.(newValue)
        //     }
        // }, [nullable, withTime, withSeconds])

        const [error, setError] = useControlled<DateValidationError | DateTimeInputError | true>({
            controlled: errorProps,
            default: null,
        })

        const [calendarOpened, setCalendarOpened] = useState<boolean>(false)

        const validateDay = useCallback(
            (date: Date) =>
                validateDate(utils, date, {
                    disableFuture,
                    disablePast,
                    minDate,
                    maxDate,
                    shouldDisableDate,
                }),
            [disableFuture, disablePast, minDate, maxDate, shouldDisableDate, utils]
        )

        const validateTime = useCallback(
            (date: Date) =>
                validateDate(utils, date, {
                    minTime,
                    maxTime,
                    shouldDisableTime,
                    disableIgnoringDatePartForTimeValidation,
                }),
            [minTime, maxTime, shouldDisableTime, utils]
        )

        const getDateError = (date: Date) => validateDay(date) || validateTime(date)

        useEffect(() => {
            if (valueProps || (nullable && valueProps === null)) {
                setInputDate(valueProps)
                setCalendarDate(valueProps)
                setTime(valueProps)
            }
        }, [valueProps])

        const handleDateTimeChange = (date: Date | null) => {
            if (date === null) {
                if (nullable) {
                    setError(null)
                    onError?.(null)
                    setInputDate(null)
                    setCalendarDate(null)
                    setTime(null)
                    if (!utils.isEqual(inputDate, date)) {
                        onChange?.(null)
                    }
                }
            } else {
                const dateErrorType = getDateError(date)
                setError(dateErrorType)
                onError?.(dateErrorType)
                if (!dateErrorType) {
                    setCalendarDate(date)
                    setTime(date)
                    if (!utils.isEqual(inputDate, date)) {
                        setInputDate(date)
                        onChange?.(date)
                    }
                }
            }
        }

        const handleCalendarChange = (date: Date) => {

            setCalendarDate(date)

            if (!disableAutoTimeFilling && !time) {
                let newDate = date

                if (initialTimeStrategy === 'end') {
                    newDate = utils.endOfDay(date)
                }

                if (initialTimeStrategy === 'start') {
                    newDate = utils.startOfDay(date)
                }

                setTime(newDate)
            }

            if (!withTime) {
                setInputDate(date)
                onChange?.(date)
                setCalendarOpened(false)
            } else {
                timeInputRef.current?.focus()
                timeInputRef.current?.setSelectionRange(0, 0)
            }
        }

        const handleTimeChange = (time: Date | null) => {
            setTime(time)
        }

        const handleApply = () => {
            if (!readOnly) {
                const newDate = utils.mergeDateAndTime(calendarDate!, time!)
                setInputDate(newDate)
                setError(null)
                onError?.(null)
                onChange?.(newDate)
            }
            setCalendarOpened(false)
        }

        const handleOpenCalendar = () => {
            setCalendarOpened(true)
        }

        const handleTimeInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                if (!applyDisabled) {
                    handleApply()
                }
            }
        }

        const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'ArrowDown') {
                setCalendarOpened(true)
            }
        }

        const applyDisabled = !time || !calendarDate || validateTime(time) !== null

        return (
            <DateTimeInput
                ref={forwardedRef}
                id={id}
                label={label}
                date={inputDate}
                onChange={handleDateTimeChange}
                onKeyDown={handleKeyDown}
                nullable={nullable}
                inputRef={inputRef}
                autoFocus={autoFocus}
                readOnly={readOnly}
                disabled={disabled}
                error={(errorText || error) ? true : null}
                onError={(inputError) => {
                    setError(inputError)
                    onError?.(inputError)
                }}
                clearable={clearable}
                variant={withTime ? withSeconds ? 'datetimeWithSeconds' : 'datetime' : 'date'}
                timePartModifyVariant={timePartModifyVariant}
                helperText={helperText}
                errorText={errorText}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            id={id && `${id}OpenCalendarButton`}
                            edge="end"
                            onClick={handleOpenCalendar}
                            disabled={disabled}
                        >
                            <InsertInvitation />
                        </IconButton>
                        <Popover
                            id={id && `${id}CalendarPopover`}
                            anchorEl={inputRef.current}
                            open={calendarOpened}
                            onClose={() => {
                                setCalendarOpened(false)
                            }}
                            elevation={2}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                            }}
                        >
                            <CalendarPicker
                                id={id && `${id}Calendar`}
                                date={calendarDate}
                                onChange={handleCalendarChange}
                                timePartModifyVariant={!withTime ? timePartModifyVariant : undefined}
                                autoFocus
                                disableFuture={disableFuture}
                                disablePast={disablePast}
                                minDate={minDate}
                                maxDate={maxDate}
                                shouldDisableDate={shouldDisableDate}
                                readOnly={readOnly}
                                disabled={disabled}
                                {...CalendarPickerProps}
                            />
                            { withTime && (
                                <Box display="flex" justifyContent="space-between" px={1} pb={1}>
                                    <TimeInput
                                        id={id && `${id}TimeInput`}
                                        inputRef={timeInputRef}
                                        style={{ width: '120px' }}
                                        time={time}
                                        onChange={handleTimeChange}
                                        timePartModifyVariant={timePartModifyVariant}
                                        readOnly={readOnly}
                                        disabled={disabled}
                                        withSeconds={withSeconds}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Schedule color="action" />
                                            </InputAdornment>
                                        }
                                        onKeyPress={handleTimeInputKeyPress}
                                        nullable
                                        error={(time ? validateTime(time) : null) ? true : null}
                                    />
                                    <Button
                                        id={id && `${id}ApplyButton`}
                                        color="primary"
                                        onClick={handleApply}
                                        disabled={applyDisabled}
                                    >
                                        { t('datePicker.apply') }
                                    </Button>
                                </Box>
                            )}
                        </Popover>
                    </InputAdornment>
                }
            />
        )
    }
)

export default DateTimePicker
