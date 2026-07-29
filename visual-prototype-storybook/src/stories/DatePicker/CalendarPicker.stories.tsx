import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ContentBox } from '../ContentBox'
import CalendarPicker, { CalendarPickerProps } from './CalendarPicker/CalendarPicker'
import { isWeekend } from 'date-fns'

export default {
    title: 'DatePicker/CalendarPicker',
    component: CalendarPicker,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const UncontrolledTemplate: Story<CalendarPickerProps> = (args) => (
    <ContentBox>
        <CalendarPicker
            {...args}
        />
    </ContentBox>
)

export const UncontrolledStory = UncontrolledTemplate.bind({})
UncontrolledStory.storyName = 'Uncontrolled'
UncontrolledStory.args = {
    autoFocus: true,
    shouldDisableDate: isWeekend,
}

const actionHandler = action('onChange')

const ControlledTemplate: Story<CalendarPickerProps> = (args) => {
    const [value, setValue] = useState(new Date())

    return (
        <ContentBox>
            <CalendarPicker
                {...args}
                date={value}
                onChange={data => {
                    setValue(data)
                    actionHandler(data)
                }}
            />
        </ContentBox>
    )
}

export const ControlledStory = ControlledTemplate.bind({})
ControlledStory.storyName = 'Controlled'
ControlledStory.args = {
    autoFocus: true,
    shouldDisableDate: isWeekend,
}
