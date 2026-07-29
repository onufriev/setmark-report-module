import React, { forwardRef, useState } from 'react'
import styled from 'styled-components'
import { useNow, useUtils } from '../hooks'
import { MonthPickerProps as CommonMonthPickerProps } from '../types'
import { findClosestEnabledDate } from '../utils'
import MonthButton from './MonthButton'

export type MonthPickerProps = CommonMonthPickerProps & {
    id?: string
    autoFocus?: boolean
    readOnly?: boolean
    disabled?: boolean
}

const MonthPicker = forwardRef<HTMLDivElement, MonthPickerProps>(
    function (props, forwardedRef) {
        const {
            id,

            date,
            onChange,

            focusedDate,
            onFocusedDateChange,

            currentMonth,
            onMonthSelect,

            minDate,
            maxDate,
            disablePast,
            disableFuture,
            isDateDisabled,

            autoFocus,
            readOnly,
            disabled,

            children,
            ...restProps
        } = props

        const now = useNow()
        const utils = useUtils()

        const selectedDate = date

        const [focusedMonth, setFocusedMonth] = useState<number>(utils.getMonth(currentMonth || focusedDate))

        const handleMonthFocus = (month: number) => {
            if (readOnly) {
                return
            }

            setFocusedMonth(month)
        }

        const handleMonthSelect = (month: number) => {
            if (readOnly) {
                return
            }

            const submitDate = (newDate: Date) => {
                if (onFocusedDateChange) {
                    onFocusedDateChange(newDate)
                }

                if (onChange) {
                    onChange(newDate)
                }

                if (onMonthSelect) {
                    onMonthSelect(newDate)
                }
            }

            const newDate = utils.setMonth(focusedDate || selectedDate || now, month)

            if (isDateDisabled(newDate)) {
                const closestEnabledDate = findClosestEnabledDate({
                    utils,
                    date: newDate,
                    minDate,
                    maxDate,
                    disablePast,
                    disableFuture,
                    shouldDisableDate: isDateDisabled,
                })

                submitDate(closestEnabledDate)
            } else {
                submitDate(newDate)
            }
        }

        const shouldDisabledMonth = (month: Date) => {
            const firstEnabledMonth = utils.startOfMonth(
                disablePast && utils.isAfter(now, minDate) ? now : minDate,
            )

            const lastEnabledMonth = utils.startOfMonth(
                disableFuture && utils.isBefore(now, maxDate) ? now : maxDate,
            )

            const isBeforeFirstEnabled = utils.isBefore(month, firstEnabledMonth)
            const isAfterLastEnabled = utils.isAfter(month, lastEnabledMonth)

            return isBeforeFirstEnabled || isAfterLastEnabled
        }

        const months = utils.getMonthArray(focusedDate)

        return (
            <StyledMonthPicker
                ref={forwardedRef}
                id={id}
                data-testid="MonthPicker"
                {...restProps}
            >{ months.map(month => {
                const monthNumber = utils.getMonth(month)

                return (
                    <MonthButton
                        key={month.toString()}
                        month={monthNumber}
                        onMonthFocus={handleMonthFocus}
                        onMonthSelect={handleMonthSelect}
                        today={utils.isSameMonth(month, now)}
                        selected={selectedDate ? utils.isSameMonth(month, selectedDate) : false}
                        disabled={disabled || shouldDisabledMonth(month)}
                        autoFocus={autoFocus && monthNumber === focusedMonth}
                    >{ utils.format(month, 'LLLL') }</MonthButton>
                )
            }) }</StyledMonthPicker>
        )
    }
)

const StyledMonthPicker = styled.div<React.HTMLAttributes<HTMLDivElement>>`
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
`

export default MonthPicker
