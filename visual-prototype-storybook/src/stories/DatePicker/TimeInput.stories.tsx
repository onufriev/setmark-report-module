import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { ContentBox } from '../ContentBox'
import TimeInput, { TimeInputProps } from './TimeInput/TimeInput'
import { action } from '@storybook/addon-actions'

export default {
    title: 'DatePicker/TimeInput',
    component: TimeInput,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const UncontrolledTemplate: Story<TimeInputProps> = (args) => (
    <ContentBox>
        <TimeInput
            style={{ width: '10ch' }}
            {...args}
        />
    </ContentBox>
)

export const UncontrolledStory = UncontrolledTemplate.bind({})
UncontrolledStory.storyName = 'Uncontrolled'
UncontrolledStory.args = {
    label: 'Время'
}

const actionHandler = action('onChange')

const ControlledTemplate: Story<TimeInputProps> = (args) => {
    const [value, setValue] = useState<Date | null>(new Date(2000, 0, 1))

    return (
        <ContentBox>
            <TimeInput
                style={{ width: '10ch' }}
                {...args}
                time={value}
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
ControlledStory.args = {}
