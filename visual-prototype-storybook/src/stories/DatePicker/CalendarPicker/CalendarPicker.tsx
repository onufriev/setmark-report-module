import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import styled from 'styled-components'
import { IconButton } from '../../IconButton'
import { Spacer } from '../../Spacer'
import { CalendarPickerDefaults } from '../constants'
import DayPicker from '../DayPicker/DayPicker'
import { useNow, useUtils } from '../hooks'
import MonthPicker from '../MonthPicker/MonthPicker'
import { CalendarPickerViewType } from '../types'
import YearPicker from '../YearPicker/YearPicker'
import { ChevronLeft, ChevronRight } from '../../icons'
import upperFirst from 'lodash/upperFirst'
import ButtonBase from '../../ButtonBase'
import { findClosestEnabledDate, validateDate } from '../utils'

export type CalendarPickerProps = {
    date?: Date | null
    onChange?: (date: Date) => void
    focusedDay?: Date

    /**
     * Отображаемые панели
     * @default ['day', 'month', 'year']
     */
    views?: CalendarPickerViewType[]

    disableFuture?: boolean
    disablePast?: boolean
    minDate?: Date
    maxDate?: Date
    shouldDisableDate?: (date: Date) => boolean

    timePartModifyVariant?: 'start' | 'end'

    id?: string
    autoFocus?: boolean
    readOnly?: boolean
    disabled?: boolean
}

const CalendarPicker = forwardRef<HTMLDivElement, CalendarPickerProps>(
    function (props, forwardedRef) {
        const {
            id,

            date,
            onChange,
            disableFuture,
            disablePast,
            minDate = CalendarPickerDefaults.minDate,
            maxDate = CalendarPickerDefaults.maxDate,
            shouldDisableDate,

            focusedDay: focusedDayProps,

            views = ['day', 'month', 'year'],

            timePartModifyVariant,

            autoFocus,
            readOnly,
            disabled,

            children,
            ...restProps
        } = props

        const now = useNow()
        const utils = useUtils()

        const selectedDate = date || null

        const [focusedDay, setFocusedDay] = useState(utils.startOfDay(date || focusedDayProps || now))
        const [currentMonth, setCurrentMonth] = useState(utils.startOfMonth(focusedDay))
        const [currentYear, setCurrentYear] = useState(utils.startOfYear(focusedDay))

        useEffect(() => {
            const newFocusedDate = utils.startOfDay(date || focusedDayProps || now)

            setFocusedDay(newFocusedDate)
            setCurrentMonth(utils.startOfMonth(newFocusedDate))
            setCurrentYear(utils.startOfYear(newFocusedDate))
        }, [date, focusedDayProps])

        const isDateDisabled = useCallback(
            (date: Date) =>
                validateDate(utils, date, {
                    disableFuture,
                    disablePast,
                    minDate,
                    maxDate,
                    shouldDisableDate,
                }) !== null,
            [disableFuture, disablePast, minDate, maxDate, shouldDisableDate, utils]
        )

        React.useEffect(() => {
            if (date && isDateDisabled(date)) {
                const closestEnabledDate = findClosestEnabledDate({
                    utils,
                    date,
                    minDate,
                    maxDate,
                    disablePast,
                    disableFuture,
                    shouldDisableDate: isDateDisabled,
                })

                onChange?.(closestEnabledDate)
            }

            if (isDateDisabled(focusedDay)) {
                const closestEnabledDate = findClosestEnabledDate({
                    utils,
                    date: focusedDay,
                    minDate,
                    maxDate,
                    disablePast,
                    disableFuture,
                    shouldDisableDate: isDateDisabled,
                })

                setFocusedDay(closestEnabledDate)
                setCurrentMonth(utils.startOfMonth(closestEnabledDate))
                setCurrentYear(utils.startOfYear(closestEnabledDate))
            }
        }, [])

        const commonPickerProps = {
            date: selectedDate,
            focusedDate: focusedDay,
            isDateDisabled,
            autoFocus,
            readOnly,
            disabled,
        }

        const [currentView, setCurrentView] = useState<CalendarPickerViewType>('day')

        const handleMonthClick = () => {
            if (currentView === 'month') resetView()
            else setCurrentView('month')
        }

        const handleYearClick = () => {
            if (currentView === 'year') resetView()
            else setCurrentView('year')
        }

        const resetView = () => {
            setCurrentView('day')
        }

        const handlePrevMonthClick = () => {
            const prevMonth = utils.getPreviousMonth(currentMonth)
            setCurrentMonth(prevMonth)

            if (!utils.isSameYear(prevMonth, currentYear)) {
                setCurrentYear(utils.startOfYear(prevMonth))
            }
        }

        const handleNextMonthClick = () => {
            const nextMonth = utils.getNextMonth(currentMonth)
            setCurrentMonth(nextMonth)

            if (!utils.isSameYear(nextMonth, currentYear)) {
                setCurrentYear(utils.startOfYear(nextMonth))
            }
        }

        const handleMonthSelect = (date: Date) => {
            resetView()
        }

        const handleYearSelect = (date: Date) => {
            resetView()
        }

        const handleDayFocusedDateChange = (date: Date) => {
            setFocusedDay(date)
            if (!utils.isSameMonth(currentMonth, date)) {
                setCurrentMonth(utils.startOfMonth(date))
            }
            if (!utils.isSameYear(currentYear, date)) {
                setCurrentYear(utils.startOfYear(date))
            }
        }
        const handleMonthFocusedDateChange = (date: Date) => {
            setFocusedDay(date)
            setCurrentMonth(utils.startOfMonth(date))
            if (!utils.isSameYear(currentYear, date)) {
                setCurrentYear(utils.startOfYear(date))
            }
        }
        const handleYearFocusedDateChange = (date: Date) => {
            setFocusedDay(date)
            setCurrentMonth(utils.startOfMonth(date))
            setCurrentYear(utils.startOfYear(date))
        }

        const handleDayChange = (day: Date) => {
            switch (timePartModifyVariant) {
                case 'start':
                    onChange?.(utils.startOfDay(day))
                    break
                case 'end':
                    onChange?.(utils.endOfDay(day))
                    break
                default:
                    onChange?.(day)
            }
        }

        return (
            <StyledCalendarPicker
                ref={forwardedRef}
                id={id}
                data-testid="CalendarPicker"
                className={
                    classNames(
                        'calendar-picker',
                    )
                }
                {...restProps}
            >
                <div className="calendar-picker__header">
                    <ButtonBase
                        id={id && `${id}MonthButton`}
                        className="calendar-picker__header-month-button"
                        onClick={handleMonthClick}
                        focusRipple
                    >
                        { upperFirst(utils.format(currentMonth, 'LLLL')) }
                    </ButtonBase>
                    <ButtonBase
                        id={id && `${id}YearButton`}
                        className="calendar-picker__header-year-button"
                        onClick={handleYearClick}
                        focusRipple
                    >
                        { utils.format(currentYear, 'yyyy') }
                    </ButtonBase>
                    {
                        currentView === 'day' && (
                            <>
                                <Spacer />
                                <IconButton
                                    id={id && `${id}PrevMonthButton`}
                                    className="calendar-picker__header-left-button"
                                    size="small"
                                    onClick={handlePrevMonthClick}
                                >
                                    <ChevronLeft />
                                </IconButton>
                                <IconButton
                                    id={id && `${id}NextMonthButton`}
                                    className="calendar-picker__header-right-button"
                                    size="small"
                                    onClick={handleNextMonthClick}
                                >
                                    <ChevronRight />
                                </IconButton>
                            </>
                        )
                    }
                </div>
                { currentView === 'day' && (
                    <DayPicker
                        {...commonPickerProps}
                        id={id && `${id}DayPicker`}
                        currentMonth={currentMonth}
                        onChange={handleDayChange}
                        onFocusedDateChange={handleDayFocusedDateChange}
                    />
                ) }
                { currentView === 'month' && (
                    <MonthPicker
                        {...commonPickerProps}
                        id={id && `${id}MonthPicker`}
                        currentMonth={currentMonth}
                        onMonthSelect={handleMonthSelect}
                        minDate={minDate}
                        maxDate={maxDate}
                        disablePast={disablePast}
                        disableFuture={disableFuture}
                        onFocusedDateChange={handleMonthFocusedDateChange}
                    />
                ) }
                { currentView === 'year' && (
                    <YearPicker
                        {...commonPickerProps}
                        id={id && `${id}YearPicker`}
                        currentYear={currentYear}
                        onYearSelect={handleYearSelect}
                        minDate={minDate}
                        maxDate={maxDate}
                        disablePast={disablePast}
                        disableFuture={disableFuture}
                        onFocusedDateChange={handleYearFocusedDateChange}
                    />
                ) }
            </StyledCalendarPicker>
        )
    }
)

const StyledCalendarPicker = styled.div<CalendarPickerProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 268px;
    padding: ${(props) => props.theme.spacing(1)}px;

    .calendar-picker__header {
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 36px;
    }

    .calendar-picker__header-month-button {
        color: ${(props) => props.theme.palette.text.primary};
        font-size: ${(props) => props.theme.typography.subtitle1.fontSize}px;
        font-weight: ${(props) => props.theme.typography.fontWeightBold};
    }

    .calendar-picker__header-year-button {
        color: ${(props) => props.theme.palette.text.primary};
        font-size: ${(props) => props.theme.typography.body1.fontSize}px;
        font-weight: ${(props) => props.theme.typography.fontWeightBold};
    }

    .calendar-picker__header-month-button,
    .calendar-picker__header-year-button {
        padding: 7px 6px;
        border-radius: 4px;
    }

    .calendar-picker__header-right-button {
        margin-left: ${(props) => props.theme.spacing(0.5)};
    }
`

export default CalendarPicker
