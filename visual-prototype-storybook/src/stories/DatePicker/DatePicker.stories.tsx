import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { ContentBox } from '../ContentBox'
import DatePicker, { DatePickerProps } from './DatePicker/DatePicker'
import { isWeekend } from 'date-fns'
import { Box } from '../Box'
import { action } from '@storybook/addon-actions'

export default {
    title: 'DatePicker/DatePicker',
    component: DatePicker,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const UncontrolledTemplate: Story<DatePickerProps> = (args) => (
    <ContentBox>
        <Box width="200px">
            <DatePicker
                {...args}
            />
        </Box>
    </ContentBox>
)

export const UncontrolledStory = UncontrolledTemplate.bind({})
UncontrolledStory.storyName = 'Uncontrolled'
UncontrolledStory.args = {}

const actionHandler = action('onChange')

const ControlledTemplate: Story<DatePickerProps> = (args) => {
    const [value, setValue] = useState<Date | null>(new Date())

    return (
        <ContentBox>
            <Box width="200px">
                <DatePicker
                    {...args}
                    value={value}
                    onChange={data => {
                        setValue(data)
                        actionHandler(data)
                    }}
                />
            </Box>
        </ContentBox>
    )
}

export const ControlledStory = ControlledTemplate.bind({})
ControlledStory.storyName = 'Controlled'
ControlledStory.args = {}
