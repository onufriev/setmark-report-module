import React, { forwardRef, useState } from 'react'
import styled from 'styled-components'
import { useNow, useUtils } from '../hooks'
import { YearPickerProps as CommonYearPickerProps } from '../types'
import { findClosestEnabledDate } from '../utils'
import YearButton from './YearButton'

export type YearPickerProps = CommonYearPickerProps & {
    id?: string
    autoFocus?: boolean
    readOnly?: boolean
    disabled?: boolean
}

const YearPicker = forwardRef<HTMLDivElement, YearPickerProps>(
    function (props, forwardedRef) {
        const {
            id,

            date,
            onChange,
            focusedDate,
            onFocusedDateChange,
            currentYear,
            onYearSelect,
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

        const [focusedYear, setFocusedYear] = useState<number>(utils.getYear(currentYear || focusedDate))

        const handleYearFocus = (year: number) => {
            if (readOnly) {
                return
            }

            setFocusedYear(year)
        }

        const handleYearSelect = (year: number) => {
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

                if (onYearSelect) {
                    onYearSelect(newDate)
                }
            }

            const newDate = utils.setYear(focusedDate || selectedDate || now, year)

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

        const shouldDisabledYear = (year: Date) => {
            return (disablePast && utils.isBeforeYear(year, now)) || (disableFuture && utils.isAfterYear(year, now))
        }

        const years = utils.getYearRange(minDate, maxDate)

        return (
            <StyledYearPicker
                ref={forwardedRef}
                id={id}
                data-testid="YearPicker"
                {...restProps}
            >{ years.map(year => {
                const yearNumber = utils.getYear(year)

                return (
                    <YearButton
                        key={year.toString()}
                        year={yearNumber}
                        onYearFocus={handleYearFocus}
                        onYearSelect={handleYearSelect}
                        today={utils.isSameYear(year, now)}
                        selected={selectedDate ? utils.isSameYear(year, selectedDate) : false}
                        disabled={disabled || shouldDisabledYear(year)}
                        autoFocus={autoFocus && yearNumber === focusedYear}
                    >{ utils.format(year, 'yyyy') }</YearButton>
                )
            }) }</StyledYearPicker>
        )
    }
)

const StyledYearPicker = styled.div<React.HTMLAttributes<HTMLDivElement>>`
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    max-height: 252px;
    overflow-y: auto;
`

export default YearPicker
