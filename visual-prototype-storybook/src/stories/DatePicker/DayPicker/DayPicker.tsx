import React, { forwardRef } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { useNow, useUtils } from '../hooks'
import { DayPickerWeekdayLable } from './components'
import DayButton from './DayButton'
import { DayPickerProps as CommonDayPickerProps } from '../types'

export type DayPickerProps = CommonDayPickerProps & {
    id?: string
    autoFocus?: boolean
    readOnly?: boolean
    disabled?: boolean
}

const DayPicker = forwardRef<HTMLDivElement, DayPickerProps>(
    function (props, forwardedRef) {
        const {
            id,

            date,
            onChange,
            focusedDate,
            onFocusedDateChange,
            isDateDisabled,
            currentMonth,

            autoFocus,
            readOnly,
            disabled,

            children,
            ...restProps
        } = props

        const now = useNow()
        const utils = useUtils()

        const selectedDate = date

        const currentMonthNumber = utils.getMonth(currentMonth)

        const weekdays = utils.getWeekdays()
        const weeks = utils.getWeekArray(currentMonth)

        const handleDayFocus = (day: Date) => {
            if (readOnly) {
                return
            }

            onFocusedDateChange(day)
        }

        const handleDaySelect = (day: Date) => {
            if (readOnly) {
                return
            }

            if (onChange) {
                onChange(utils.mergeDateAndTime(day, selectedDate || now))
            }
        }

        return (
            <StyledDayPicker
                ref={forwardedRef}
                id={id}
                data-testid="DayPicker"
                className={
                    classNames(
                        'day-picker',
                    )
                }
                {...restProps}
            >
                <div className="day-picker__weeks">
                    <div className="row">
                        { weekdays.map(weekday => (
                            <DayPickerWeekdayLable key={weekday} className="cell">{ weekday }</DayPickerWeekdayLable>
                        )) }
                    </div>
                </div>
                <div className="day-picker__days">
                    { weeks.map(week => {

                        return (
                            <div role="row" key={`week-${week[0]}`} className="row">
                                { week.map(day => {

                                    return (
                                        <div role="cell" key={day.toString()} className="cell">
                                            <DayButton
                                                day={day}
                                                today={utils.isSameDay(day, now)}
                                                selected={selectedDate ? utils.isSameDay(day, selectedDate) : false}
                                                disabled={disabled || isDateDisabled(day)}
                                                outsideCurrentMonth={utils.getMonth(day) !== currentMonthNumber}
                                                onDaySelect={handleDaySelect}
                                                onDayFocus={handleDayFocus}
                                                autoFocus={autoFocus && focusedDate !== null && utils.isSameDay(day, focusedDate)}
                                            />
                                        </div>
                                    )
                                }) }
                            </div>
                        )
                    }) }
                </div>
            </StyledDayPicker>
        )
    }
)

const StyledDayPicker = styled.div<React.HTMLAttributes<HTMLDivElement>>`
    .row {
        display: flex;
        flex-wrap: nowrap;
    }

    .cell {

    }

    .day-picker__weeks {

    }

    .day-picker__days {

    }
`

export default DayPicker
