

import React, { forwardRef, ReactNode, useEffect, useRef, useState } from 'react'
import { Stack, StackProps } from '../../Stack'
import DateTimePicker, { DateTimePickerApiRef, DateTimePickerProps } from '../DateTimePicker/DateTimePicker'
import { useNow, useUtils } from '../hooks'

export type DateRange = [Date | null, Date | null]

export type DateTimeRangePickerProps = Omit<StackProps, 'onChange'> & {
    id?: string

    lableStart?: string
    lableEnd?: string

    value?: DateRange | null
    onChange?: (value: DateRange) => void

    withTime?: boolean
    withSeconds?: boolean

    autoFocus?: boolean
    readOnly?: boolean
    disabled?: boolean

    clearable?: boolean

    renderStart?: ReactNode
    renderCenter?: ReactNode

    DatePickerStartProps?: Pick<DateTimePickerProps, 'autoFocus' | 'shouldDisableDate' | 'shouldDisableTime' | 'initialTimeStrategy'>
    DatePickerEndProps?: Pick<DateTimePickerProps, 'autoFocus' | 'shouldDisableDate' | 'shouldDisableTime' | 'initialTimeStrategy'>
}

const DateTimeRangePicker = forwardRef<HTMLDivElement, DateTimeRangePickerProps>(
    function (props, forwardedRef) {
        const {
            id,

            value,
            onChange,

            withTime,
            withSeconds,

            lableStart,
            lableEnd,

            autoFocus,
            readOnly,
            disabled,

            clearable,

            renderStart,
            renderCenter,

            DatePickerStartProps,
            DatePickerEndProps,

            ...restProps
        } = props

        const now = useNow()
        const utils = useUtils()

        const apiStartRef = useRef<DateTimePickerApiRef>({})
        const apiEndRef = useRef<DateTimePickerApiRef>({})

        const [startDate, setStartDate] = useState<Date | null>(value && Array.isArray(value) ? value[0] : null)
        const [endDate, setEndDate] = useState<Date | null>(value && Array.isArray(value) ? value[1] : null)

        useEffect(() => {
            if (value) {
                if (!utils.isEqual(value[0], startDate)) {
                    setStartDate(value[0])
                }

                if (!utils.isEqual(value[1], endDate)) {
                    setEndDate(value[1])
                }
            } else {
                if (startDate !== null) {
                    setStartDate(null)
                }

                if (endDate !== null) {
                    setEndDate(null)
                }
            }
        }, [value])

        const handlerStartDateChange = (date: Date | null) => {
            setStartDate(date)

            onChange?.([date, endDate])

            if (date !== null && !endDate && !disabled) {
                apiEndRef.current.openCalendar?.()
            }
        }

        const handlerEndDateChange = (date: Date | null) => {
            setEndDate(date)

            onChange?.([startDate, date])

            if (date !== null && !startDate && !disabled) {
                apiStartRef.current.openCalendar?.()
            }
        }

        return (
            <Stack id={id} spacing={2} {...restProps}>
                {renderStart}
                <DateTimePicker
                    id={id && `${id}StartDateTimePicker`}
                    label={lableStart}
                    value={startDate}
                    onChange={handlerStartDateChange}
                    withTime={withTime}
                    withSeconds={withSeconds}
                    CalendarPickerProps={{
                        focusedDay: endDate || undefined
                    }}
                    maxDate={endDate || undefined}
                    maxTime={endDate || undefined}
                    disableIgnoringDatePartForTimeValidation
                    timePartModifyVariant="start"
                    nullable
                    clearable={clearable}
                    apiRef={apiStartRef}
                    autoFocus={autoFocus}
                    readOnly={readOnly}
                    disabled={disabled}
                    {...DatePickerStartProps}
                />
                {renderCenter}
                <DateTimePicker
                    id={id && `${id}EndDateTimePicker`}
                    label={lableEnd}
                    value={endDate}
                    onChange={handlerEndDateChange}
                    withTime={withTime}
                    withSeconds={withSeconds}
                    CalendarPickerProps={{
                        focusedDay: startDate || undefined
                    }}
                    minDate={startDate || undefined}
                    minTime={startDate || undefined}
                    disableIgnoringDatePartForTimeValidation
                    timePartModifyVariant="end"
                    nullable
                    clearable={clearable}
                    apiRef={apiEndRef}
                    readOnly={readOnly}
                    disabled={disabled}
                    {...DatePickerEndProps}
                />
            </Stack>
        )
    }
)

export default DateTimeRangePicker
