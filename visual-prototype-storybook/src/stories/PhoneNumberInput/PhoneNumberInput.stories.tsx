import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import PhoneNumberInput, { PhoneNumberInputProps } from './PhoneNumberInput'
import { ContentBox } from '../ContentBox'
import { Box } from '../Box'
import { Stack } from '../Stack'

export default {
    title: 'Form/PhoneNumberInput',
    component: PhoneNumberInput,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const UncontrolledTemplate: Story<PhoneNumberInputProps> = (args) => (
    <ContentBox>
        <Box width="300px">
            <PhoneNumberInput
                {...args}
                onKeyDown={undefined}
                onKeyUp={undefined}
                onFocus={undefined}
                onBlur={undefined}
            />
        </Box>
    </ContentBox>
)

export const UncontrolledStory: Story<PhoneNumberInputProps> = UncontrolledTemplate.bind({})
UncontrolledStory.storyName = 'Default Uncontrolled'
UncontrolledStory.args = {
    label: 'Номер телефона'
}

const actionHandler = action('onValueChange')

const ControlledTemplate: Story<PhoneNumberInputProps> = (args) => {
    const [value, setValue] = useState<string>('')

    return (
        <ContentBox>
            <Box width="300px">
                <PhoneNumberInput
                    {...args}
                    value={value}
                    onValueChange={value => {
                        setValue(value)
                        actionHandler(value)
                    }}
                    onKeyDown={undefined}
                    onKeyUp={undefined}
                    onFocus={undefined}
                    onBlur={undefined}
                />
            </Box>
        </ContentBox>
    )
}

export const ControlledStory: Story<PhoneNumberInputProps> = ControlledTemplate.bind({})
ControlledStory.storyName = 'Default Controlled'
ControlledStory.args = {
    label: 'Номер телефона'
}

export const MultyCountry: Story<PhoneNumberInputProps> = ControlledTemplate.bind({})
MultyCountry.storyName = 'Many Country Available'
MultyCountry.args = {
    label: 'Номер телефона',
    countries: ['RU', 'GR']
}

export const StatesExample = () => {
    const [value, setValue] = useState<string>('')

    return (
        <ContentBox>
            <Stack direction="column" spacing={2} width="300px">
                <PhoneNumberInput
                    value={value}
                    onValueChange={setValue}
                />
                <PhoneNumberInput
                    value={value}
                    onValueChange={setValue}
                    disabled
                    helperText="disabled"
                />
                <PhoneNumberInput
                    value={value}
                    onValueChange={setValue}
                    readOnly
                    helperText="readOnly"
                />
                <PhoneNumberInput
                    value={value}
                    onValueChange={setValue}
                    error
                    helperText="With error"
                    // либо
                    // errorText="With error"
                />
            </Stack>
        </ContentBox>
    )
}
