import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { ContentBox } from '../ContentBox'
import DateTimeRangePicker, { DateTimeRangePickerProps, DateRange } from './DateTimeRangePicker/DateTimeRangePicker'
import { isWeekend } from 'date-fns'
import { action } from '@storybook/addon-actions'

export default {
    title: 'DatePicker/DateTimeRangePicker',
    component: DateTimeRangePicker,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const UncontrolledTemplate: Story<DateTimeRangePickerProps> = (args) => (
    <ContentBox>
        <DateTimeRangePicker
            style={{ width: '500px' }}
            {...args}
        />
    </ContentBox>
)

export const UncontrolledStory = UncontrolledTemplate.bind({})
UncontrolledStory.storyName = 'Uncontrolled'
UncontrolledStory.args = {}

const actionHandler = action('onChange')

const ControlledTemplate: Story<DateTimeRangePickerProps> = (args) => {
    const [value, setValue] = useState<DateRange>([new Date(2000, 0, 10, 12), null])

    return (
        <ContentBox>
            <DateTimeRangePicker
                style={{ width: '500px' }}
                {...args}
                value={value}
                onChange={value => {
                    setValue(value)
                    actionHandler(value)
                }}
            />
        </ContentBox>
    )
}

export const ControlledStory = ControlledTemplate.bind({})
ControlledStory.storyName = 'Controlled'
ControlledStory.args = {
    withTime: true,
    clearable: true,
}
