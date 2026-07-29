import { CalendarPickerProps } from './CalendarPicker/CalendarPicker'
import { DateTimeInputProps } from './DateTimeInput/DateTimeInput'
import { DateIOFormats } from './types'

export const SECOND = 1000
export const MINUTE = 3600
export const HOUR = 216000
export const DAY = 5184000

export const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7]

export enum Weeks {
    monday = 1,
    tuesday = 2,
    wednesday = 3,
    thursday = 4,
    friday = 5,
    saturday = 6,
    sunday = 7,
}

export const DAYS_IN_WEEK = 7

export const YEARS_IN_ROW = 3
export const MONTHS_IN_ROW = 3

export const MIN_DATE = new Date(1990, 0, 1)
export const MAX_DATE = new Date(2099, 11, 31)

export const formats: DateIOFormats = {
    dayOfMonth: 'd',
    fullDate: 'PP',
    fullDateWithWeekday: 'PPPP',
    fullDateTime: 'PP p',
    fullDateTime12h: 'PP hh:mm aaa',
    fullDateTime24h: 'PP HH:mm',
    fullTime: 'p',
    fullTime12h: 'hh:mm aaa',
    fullTime24h: 'HH:mm',
    hours12h: 'hh',
    hours24h: 'HH',
    keyboardDate: 'P',
    keyboardDateTime: 'P p',
    keyboardDateTime12h: 'P hh:mm aaa',
    keyboardDateTime24h: 'P HH:mm',
    minutes: 'mm',
    month: 'LLLL',
    monthAndDate: 'MMMM d',
    monthAndYear: 'LLLL yyyy',
    monthShort: 'MMM',
    weekday: 'EEEE',
    weekdayShort: 'EEE',
    normalDate: 'd MMMM',
    normalDateWithWeekday: 'EEE, MMM d',
    seconds: 'ss',
    shortDate: 'MMM d',
    year: 'yyyy',
}

export const DateTimeInputDefaults: Required<Pick<DateTimeInputProps, 'variant'>> = {
    variant: 'datetime',
}

export const CalendarPickerDefaults: Required<Pick<CalendarPickerProps, 'minDate' | 'maxDate'>> = {
    minDate: MIN_DATE,
    maxDate: MAX_DATE,
}
