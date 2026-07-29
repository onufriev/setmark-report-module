import React, { forwardRef } from 'react'
import DateTimePicker, { DateTimePickerProps } from '../DateTimePicker/DateTimePicker'

export type DatePickerProps = Omit<DateTimePickerProps, 'withTime' | 'withSeconds'>

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
    function (props, forwardedRef) {
        return (
            <DateTimePicker
                ref={forwardedRef}
                {...props}
                data-testid="DatePicker"
            />
        )
    }
)

export default DatePicker
