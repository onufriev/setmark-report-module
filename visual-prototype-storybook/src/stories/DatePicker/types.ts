export type CommonPickerProps = {
    date?: Date | null
    onChange?: (date: Date) => void
    focusedDay?: Date
    disableFuture?: boolean
    disablePast?: boolean
    minDate?: Date
    maxDate?: Date
    shouldDisableDate?: (date: Date) => boolean
}

export type CommonSubPickerProps = {
    date: Date | null
    onChange?: (date: Date) => void
    focusedDate: Date
    onFocusedDateChange: (date: Date) => void
    isDateDisabled: (date: Date) => boolean
}

export type InitialTimeStrategyType = 'now' | 'start' | 'end'

export type CalendarPickerViewType = 'day' /* | 'week' */ | 'month' | 'year'

export type DayPickerProps = CommonSubPickerProps & {
    currentMonth: Date
}

export type MonthPickerProps = CommonSubPickerProps & {
    currentMonth: Date
    onMonthSelect?: (date: Date) => void
    disableFuture?: boolean
    disablePast?: boolean
    minDate: Date
    maxDate: Date
}

export type YearPickerProps = CommonSubPickerProps & {
    currentYear: Date
    onYearSelect?: (date: Date) => void
    disableFuture?: boolean
    disablePast?: boolean
    minDate: Date
    maxDate: Date
}

export type DateTimeInputVariant = 'datetime' | 'date' | 'time' | 'datetimeWithSeconds' | 'timeWithSeconds'

export type Unit =
    | "years"
    | "quarters"
    | "months"
    | "weeks"
    | "days"
    | "hours"
    | "minutes"
    | "seconds"
    | "milliseconds"

export interface DateIOFormats {
    /** Localized full date @example "Jan 1, 2019" */
    fullDate: string
    /** Partially localized full date with weekday, useful for text-to-speech accessibility @example "Tuesday, January 1, 2019" */
    fullDateWithWeekday: string
    /** Date format string with month and day of month @example "1 January" */
    normalDate: string
    /** Date format string with weekday, month and day of month @example "Wed, Jan 1" */
    normalDateWithWeekday: string
    /** Shorter day format @example "Jan 1" */
    shortDate: string
    /** Year format string @example "2019" */
    year: string
    /** Month format string @example "January" */
    month: string
    /** Short month format string @example "Jan" */
    monthShort: string
    /** Short month format string @example "January 2018" */
    monthAndYear: string
    /** Month with date format string @example "January 1" */
    monthAndDate: string
    /** Weekday format string @example "Wednesday" */
    weekday: string
    /** Short weekday format string @example "Wed" */
    weekdayShort: string
    /** Day format string @example "1" */
    dayOfMonth: string
    /** Hours format string @example "11" */
    hours12h: string
    /** Hours format string @example "23" */
    hours24h: string
    /** Minutes format string @example "44" */
    minutes: string
    /** Seconds format string @example "00" */
    seconds: string
    /** Full time localized format string @example "11:44 PM" for US, "23:44" for Europe */
    fullTime: string
    /** Not localized full time format string @example "11:44 PM" */
    fullTime12h: string
    /** Not localized full time format string @example "23:44" */
    fullTime24h: string
    /** Date & time format string with localized time @example "Jan 1, 2018 11:44 PM" */
    fullDateTime: string
    /** Not localized date & Time format 12h @example "Jan 1, 2018 11:44 PM" */
    fullDateTime12h: string
    /** Not localized date & Time format 24h @example "Jan 1, 2018 23:44" */
    fullDateTime24h: string
    /** Localized keyboard input friendly date format @example "02/13/2020 */
    keyboardDate: string
    /** Localized keyboard input friendly date/time format @example "02/13/2020 23:44" */
    keyboardDateTime: string
    /** Partially localized keyboard input friendly date/time 12h format @example "02/13/2020 11:44 PM" */
    keyboardDateTime12h: string
    /** Partially localized keyboard input friendly date/time 24h format @example "02/13/2020 23:44" */
    keyboardDateTime24h: string
}
