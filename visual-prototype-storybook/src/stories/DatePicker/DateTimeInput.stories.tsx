import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import DateTimeInput, { DateTimeInputProps } from './DateTimeInput/DateTimeInput'
import { ContentBox } from '../ContentBox'
import { Stack } from '../Stack'

export default {
    title: 'DatePicker/DateTimeInput',
    component: DateTimeInput,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const UncontrolledTemplate: Story<DateTimeInputProps> = (args) => (
    <ContentBox>
        <DateTimeInput
            style={{ width: '25ch' }}
            {...args}
        />
    </ContentBox>
)

export const UncontrolledStory = UncontrolledTemplate.bind({})
UncontrolledStory.storyName = 'Uncontrolled'
UncontrolledStory.args = {}

const actionHandler = action('onChange')

const ControlledTemplate: Story<DateTimeInputProps> = (args) => {
    const [value, setValue] = useState<Date | null>()

    return (
        <ContentBox>
            <DateTimeInput
                style={{ width: '25ch' }}
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
ControlledStory.args = {}

export const StatesExample = () => {
    const [value, setValue] = useState<Date | null>()

    return (
        <ContentBox>
            <Stack direction="column" spacing={2} width="300px">
                <DateTimeInput
                    date={value}
                    onChange={setValue}
                />
                <DateTimeInput
                    date={value}
                    onChange={setValue}
                    disabled
                    helperText="disabled"
                />
                <DateTimeInput
                    date={value}
                    onChange={setValue}
                    readOnly
                    helperText="readOnly"
                />
                <DateTimeInput
                    date={value}
                    onChange={setValue}
                    error
                    helperText="With error"
                    // либо
                    // errorText="With error"
                />
            </Stack>
        </ContentBox>
    )
}
