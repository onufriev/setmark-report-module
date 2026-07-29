import React, { forwardRef } from 'react'
import DateTimeInput, { DateTimeInputProps } from '../DateTimeInput/DateTimeInput'

export type TimeInputProps = {
    time?: Date | null
    onChange?: (time: Date | null) => void
    withSeconds?: boolean
} & Omit<DateTimeInputProps, 'date' | 'onChange' | 'minDate' | 'maxDate' | 'variant'>

const TimeInput = forwardRef<HTMLDivElement, TimeInputProps>(
    function (props, forwardedRef) {
        const {
            time,
            onChange,
            withSeconds,
            nullable,

            ...restProps
        } = props

        return (
            <DateTimeInput
                ref={forwardedRef}
                date={time}
                onChange={onChange}
                nullable={nullable}
                variant={withSeconds ? 'timeWithSeconds' : 'time'}
                {...restProps}
                data-testid="TimeInput"
            />
        )
    }
)

export default TimeInput
