import {
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    isBefore,
    getDay,
    addDays,
    format,
    Locale as DateFnsLocale,
    isSameDay,
    getMonth,
    addHours,
    addMinutes,
    addMonths,
    addSeconds,
    addWeeks,
    endOfDay,
    getDaysInMonth,
    getHours,
    getSeconds,
    getYear,
    isAfter,
    isEqual,
    isSameHour,
    isSameMonth,
    isSameYear,
    isValid,
    parseISO,
    setHours,
    setMinutes,
    setMonth,
    setSeconds,
    setYear,
    startOfDay,
    differenceInDays,
    differenceInHours,
    differenceInMilliseconds,
    differenceInMinutes,
    differenceInMonths,
    differenceInQuarters,
    differenceInSeconds,
    differenceInWeeks,
    differenceInYears,
    endOfYear,
    formatISO,
    isWithinInterval,
    startOfYear,
    parse,
    addYears,
    isSameMinute,
    isSameSecond,
    startOfMinute,
    startOfSecond,
    endOfMinute,
    endOfSecond,
    getMilliseconds,
    setMilliseconds,
} from 'date-fns'
import { Locale } from '../../typings/Locale'
import locale_ru from 'date-fns/locale/ru'
import locale_en from 'date-fns/locale/en-US'
import { Unit } from './types'
import { DateTimePickerProps } from './DateTimePicker/DateTimePicker'

export class DateUtils {
    locale?: DateFnsLocale
    formats: any

    constructor (locale?: Locale) {
        switch (locale) {
            case 'en':
                this.locale = locale_en
                break
            case 'ru':
            default:
                this.locale = locale_ru
        }
    }

    public parseISO = (isoString: string) => {
        return parseISO(isoString)
    }

    public toISO = (value: Date) => {
        return formatISO(value, { format: 'extended' })
    }

    public getCurrentLocaleCode = () => {
        return this.locale?.code || 'en-US'
    }

    public addSeconds = (value: Date, count: number) => {
        return addSeconds(value, count)
    }

    public addMinutes = (value: Date, count: number) => {
        return addMinutes(value, count)
    }

    public addHours = (value: Date, count: number) => {
        return addHours(value, count)
    }

    public addDays = (value: Date, count: number) => {
        return addDays(value, count)
    }

    public addWeeks = (value: Date, count: number) => {
        return addWeeks(value, count)
    }

    public addMonths = (value: Date, count: number) => {
        return addMonths(value, count)
    }

    public addYears = (value: Date, count: number) => {
        return addYears(value, count)
    }

    public isValid = (value: any) => {
        return isValid(this.date(value))
    }

    public getDiff = (value: Date, comparing: Date | string, unit?: Unit) => {
        switch (unit) {
            case 'years':
                return differenceInYears(value, this.date(comparing))
            case 'quarters':
                return differenceInQuarters(value, this.date(comparing))
            case 'months':
                return differenceInMonths(value, this.date(comparing))
            case 'weeks':
                return differenceInWeeks(value, this.date(comparing))
            case 'days':
                return differenceInDays(value, this.date(comparing))
            case 'hours':
                return differenceInHours(value, this.date(comparing))
            case 'minutes':
                return differenceInMinutes(value, this.date(comparing))
            case 'seconds':
                return differenceInSeconds(value, this.date(comparing))
            default: {
                return differenceInMilliseconds(value, this.date(comparing))
            }
        }
    }

    public isAfter = (value: Date, comparing: Date) => {
        return isAfter(value, comparing)
    }

    public isBefore = (value: Date, comparing: Date) => {
        return isBefore(value, comparing)
    }

    public startOfDay = (value: Date) => {
        return startOfDay(value)
    }

    public startOfMinute = (value: Date) => {
        return startOfMinute(value)
    }

    public startOfSecond = (value: Date) => {
        return startOfSecond(value)
    }

    public endOfDay = (value: Date) => {
        return endOfDay(value)
    }

    public endOfMinute = (value: Date) => {
        return endOfMinute(value)
    }

    public endOfSecond = (value: Date) => {
        return endOfSecond(value)
    }

    public getHours = (value: Date) => {
        return getHours(value)
    }

    public setHours = (value: Date, count: number) => {
        return setHours(value, count)
    }

    public setMinutes = (value: Date, count: number) => {
        return setMinutes(value, count)
    }

    public getSeconds = (value: Date) => {
        return getSeconds(value)
    }

    public setSeconds = (value: Date, count: number) => {
        return setSeconds(value, count)
    }

    public getMilliseconds = (value: Date) => {
        return getMilliseconds(value)
    }

    public setMilliseconds = (value: Date, count: number) => {
        return setMilliseconds(value, count)
    }

    public isSameDay = (value: Date, comparing: Date) => {
        return isSameDay(value, comparing)
    }

    public isSameMonth = (value: Date, comparing: Date) => {
        return isSameMonth(value, comparing)
    }

    public isSameYear = (value: Date, comparing: Date) => {
        return isSameYear(value, comparing)
    }

    public isSameHour = (value: Date, comparing: Date) => {
        return isSameHour(value, comparing)
    }

    public isSameMinute = (value: Date, comparing: Date) => {
        return isSameMinute(value, comparing)
    }

    public isSameSecond = (value: Date, comparing: Date) => {
        return isSameSecond(value, comparing)
    }

    public startOfYear = (value: Date) => {
        return startOfYear(value)
    }

    public endOfYear = (value: Date) => {
        return endOfYear(value)
    }

    public startOfMonth = (value: Date) => {
        return startOfMonth(value)
    }

    public endOfMonth = (value: Date) => {
        return endOfMonth(value)
    }

    public startOfWeek = (value: Date) => {
        return startOfWeek(value, { locale: this.locale })
    }

    public endOfWeek = (value: Date) => {
        return endOfWeek(value, { locale: this.locale })
    }

    public getYear = (value: Date) => {
        return getYear(value)
    }

    public setYear = (value: Date, count: number) => {
        return setYear(value, count)
    }

    public date = (value?: Date | number | string) => {
        if (typeof value === 'undefined' || value === null) {
            return new Date()
        }

        // if (value === null) {
        //     return null
        // }

        return new Date(value)
    }

    public toJsDate = (value: Date) => {
        return value
    }

    public parse = (value: string, formatString: string) => {
        if (value === '') {
            return null
        }

        return parse(value, formatString, new Date(), { locale: this.locale })
    }

    public format = (date: Date, formatString: string) => {
        return format(date, formatString, { locale: this.locale })
    }

    public isEqual = (date: any, comparing: any) => {
        if (date === null && comparing === null) {
            return true
        }

        return isEqual(date, comparing)
    }

    public isNull = (date: Date) => {
        return date === null
    }

    public isAfterDay = (date: Date, value: Date) => {
        return isAfter(date, endOfDay(value))
    }

    public isBeforeDay = (date: Date, value: Date) => {
        return isBefore(date, startOfDay(value))
    }

    public isBeforeYear = (date: Date, value: Date) => {
        return isBefore(date, startOfYear(value))
    }

    public isAfterYear = (date: Date, value: Date) => {
        return isAfter(date, endOfYear(value))
    }

    public isWithinRange = (date: Date, [start, end]: [Date, Date]) => {
        return isWithinInterval(date, { start, end })
    }

    public formatNumber = (numberToFormat: string) => {
        return numberToFormat
    }

    public getMinutes = (date: Date) => {
        return date.getMinutes()
    }

    public getMonth = (date: Date) => {
        return date.getMonth()
    }

    public getDaysInMonth = (date: Date) => {
        return getDaysInMonth(date)
    }

    public setMonth = (date: Date, count: number) => {
        return setMonth(date, count)
    }

    public getMeridiemText = (ampm: 'am' | 'pm') => {
        return ampm === 'am' ? 'AM' : 'PM'
    }

    public getNextMonth = (date: Date) => {
        return addMonths(date, 1)
    }

    public getPreviousMonth = (date: Date) => {
        return addMonths(date, -1)
    }

    public getMonthArray = (date: Date) => {
        const firstMonth = startOfYear(date)
        const monthArray = [firstMonth]

        while (monthArray.length < 12) {
            const prevMonth = monthArray[monthArray.length - 1]
            monthArray.push(this.getNextMonth(prevMonth))
        }

        return monthArray
    }

    public mergeDateAndTime = (date: Date, time: Date) => {
        return this.setMilliseconds(
            this.setSeconds(
                this.setMinutes(
                    this.setHours(
                        date,
                        this.getHours(time)
                    ),
                    this.getMinutes(time)
                ),
                this.getSeconds(time),
            ),
            this.getMilliseconds(time)
        )
    }

    public mergeDateAndTimeHMParts = (date: Date, time: Date) => {
        return this.setMinutes(
            this.setHours(
                date,
                this.getHours(time)
            ),
            this.getMinutes(time)
        )
    }

    public mergeDateAndTimeHMSParts = (date: Date, time: Date) => {
        return this.setSeconds(
            this.setMinutes(
                this.setHours(
                    date,
                    this.getHours(time)
                ),
                this.getMinutes(time)
            ),
            this.getSeconds(time),
        )
    }

    public mergeDateAndSMsTimeParts = (date: Date, time: Date) => {
        return this.setMilliseconds(
            this.setSeconds(
                date,
                this.getSeconds(time),
            ),
            this.getMilliseconds(time)
        )
    }

    public mergeDateAndMsTimeParts = (date: Date, time: Date) => {
        return this.setMilliseconds(
            date,
            this.getMilliseconds(time)
        )
    }

    public getWeekdays = () => {
        const now = new Date()
        return eachDayOfInterval({
            start: startOfWeek(now, { locale: this.locale }),
            end: endOfWeek(now, { locale: this.locale }),
        }).map((day) => format(day, 'EEEEEE', { locale: this.locale }))
    }

    public getWeekArray = (date: Date) => {
        const start = startOfWeek(startOfMonth(date), { locale: this.locale })
        const end = endOfWeek(endOfMonth(date), { locale: this.locale })

        let count = 0
        let current = start
        const nestedWeeks: Date[][] = []
        let lastDay = null
        while (isBefore(current, end)) {
            const weekNumber = Math.floor(count / 7)
            nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || []
            const day = getDay(current)
            if (lastDay !== day) {
                lastDay = day
                nestedWeeks[weekNumber].push(current)
                count += 1
            }
            current = addDays(current, 1)
        }
        return nestedWeeks
    }

    public getDayRange = (start: Date, end: Date) => {
        const startDate = startOfDay(start)
        const endDate = endOfDay(end)
        const days: Date[] = []

        let current = startDate
        while (isBefore(current, endDate)) {
            days.push(current)
            current = addDays(current, 1)
        }

        return days
    }

    public getWeekRange = (start: Date, end: Date) => {
        const startDate = startOfWeek(start, { locale: this.locale })
        const endDate = endOfWeek(end, { locale: this.locale })
        const weeks: Date[] = []

        let current = startDate
        while (isBefore(current, endDate)) {
            weeks.push(current)
            current = addWeeks(current, 1)
        }

        return weeks
    }

    public getMonthRange = (start: Date, end: Date) => {
        const startDate = startOfMonth(start)
        const endDate = endOfMonth(end)
        const months: Date[] = []

        let current = startDate
        while (isBefore(current, endDate)) {
            months.push(current)
            current = addMonths(current, 1)
        }

        return months
    }

    public getYearRange = (start: Date, end: Date) => {
        const startDate = startOfYear(start)
        const endDate = endOfYear(end)
        const years: Date[] = []

        let current = startDate
        while (isBefore(current, endDate)) {
            years.push(current)
            current = addYears(current, 1)
        }

        return years
    }
}

export type DateValidationError =
    | 'invalidDate'
    | 'minDate'
    | 'maxDate'
    | 'disableFuture'
    | 'disablePast'
    | 'shouldDisableDate'
    | 'minTime'
    | 'maxTime'
    | 'shouldDisableTime'
    | null

type DateValidationProps = Pick<DateTimePickerProps,
    | 'minDate'
    | 'maxDate'
    | 'disableFuture'
    | 'disablePast'
    | 'shouldDisableDate'
    | 'minTime'
    | 'maxTime'
    | 'shouldDisableTime'
    | 'disableIgnoringDatePartForTimeValidation'
>

export const validateDate = (
    utils: DateUtils,
    value: Date,
    {
        minDate,
        maxDate,
        disableFuture,
        disablePast,
        shouldDisableDate,
        minTime,
        maxTime,
        shouldDisableTime,
        disableIgnoringDatePartForTimeValidation
    }: DateValidationProps
): DateValidationError => {
    const now = utils.date()!
    const date = utils.date(value)

    if (date === null) {
        return null
    }

    const isAfterComparingFn = createIsAfterIgnoreDatePart(
        Boolean(disableIgnoringDatePartForTimeValidation),
        utils,
    )

    switch (true) {
        case !utils.isValid(value):
            return 'invalidDate'

        case Boolean(minDate && utils.isBeforeDay(date, minDate)):
            return 'minDate'

        case Boolean(maxDate && utils.isAfterDay(date, maxDate)):
            return 'maxDate'

        case Boolean(disableFuture && utils.isAfterDay(date, now)):
            return 'disableFuture'

        case Boolean(disablePast && utils.isBeforeDay(date, now)):
            return 'disablePast'

        case Boolean(shouldDisableDate && shouldDisableDate(date)):
            return 'shouldDisableDate'

        case Boolean(minTime && isAfterComparingFn(minTime, date)):
            return 'minTime'

        case Boolean(maxTime && isAfterComparingFn(date, maxTime)):
            return 'maxTime'

        case Boolean(shouldDisableTime && shouldDisableTime(date)):
            return 'shouldDisableTime'

        default:
            return null
    }
}

export const getSecondsInDay = (date: Date, utils: DateUtils) => {
    return utils.getHours(date) * 3600 + utils.getMinutes(date) * 60 + utils.getSeconds(date)
}

export const createIsAfterIgnoreDatePart = (disableIgnoringDatePartForTimeValidation: boolean, utils: DateUtils) =>
  (dateLeft: Date, dateRight: Date) => {
    if (disableIgnoringDatePartForTimeValidation) {
        return utils.isAfter(dateLeft, dateRight)
    }

    return getSecondsInDay(dateLeft, utils) > getSecondsInDay(dateRight, utils)
}

interface FindClosestDateParams {
    date: Date
    disableFuture?: boolean
    disablePast?: boolean
    maxDate: Date
    minDate: Date
    shouldDisableDate: (date: Date) => boolean
    utils: DateUtils
}

export const findClosestEnabledDate = ({
    date,
    disableFuture,
    disablePast,
    maxDate,
    minDate,
    shouldDisableDate,
    utils,
}: FindClosestDateParams) => {
    const today = utils.startOfDay(utils.date()!)

    if (disablePast && utils.isBefore(minDate!, today)) {
        minDate = today
    }

    if (disableFuture && utils.isAfter(maxDate, today)) {
        maxDate = today
    }

    let forward: Date | null = date
    let backward: Date | null = date

    if (utils.isBefore(date, minDate)) {
        forward = utils.date(minDate)
        backward = null
    }

    if (utils.isAfter(date, maxDate)) {
        if (backward) {
            backward = utils.date(maxDate)
        }

        forward = null
    }

    while (forward || backward) {
        if (forward && utils.isAfter(forward, maxDate)) {
            forward = null
        }
        if (backward && utils.isBefore(backward, minDate)) {
            backward = null
        }

        if (forward) {
            if (!shouldDisableDate(forward)) {
                return forward
            }
            forward = utils.addDays(forward, 1)
        }

        if (backward) {
            if (!shouldDisableDate(backward)) {
                return backward
            }
            backward = utils.addDays(backward, -1)
        }
    }

    return today
}
