import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import NumberInput, { NumberInputProps } from './NumberInput'
import { ContentBox } from '../ContentBox'
import { Box } from '../Box'
import { Stack } from '../Stack'

export default {
    title: 'Form/NumberInput',
    component: NumberInput,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const UncontrolledTemplate: Story<NumberInputProps> = (args) => (
    <ContentBox>
        <Box width="200px">
            <NumberInput
                {...args}
                onError={onErrorHandler}
                onKeyDown={undefined}
                onKeyUp={undefined}
                onChange={undefined}
                onFocus={undefined}
                onBlur={undefined}
            />
        </Box>
    </ContentBox>
)

export const UncontrolledStory: Story<NumberInputProps> = UncontrolledTemplate.bind({})
UncontrolledStory.storyName = 'Default Uncontrolled'
UncontrolledStory.args = {
    defaultValue: -2,
    clearable: true,
}

const onValueChangeHandler = action('onValueChange')
const onErrorHandler = action('onError')

const ControlledTemplate: Story<NumberInputProps> = (args) => {
    const [value, setValue] = useState<number | null>(-20)

    return (
        <ContentBox>
            <Box width="200px">
                <NumberInput
                    {...args}
                    value={value}
                    onValueChange={value => {
                        setValue(value)
                        onValueChangeHandler(value)
                    }}
                    onError={onErrorHandler}
                    onKeyDown={undefined}
                    onKeyUp={undefined}
                    onChange={undefined}
                    onFocus={undefined}
                    onBlur={undefined}
                />
            </Box>
        </ContentBox>
    )
}

export const ControlledStory: Story<NumberInputProps> = ControlledTemplate.bind({})
ControlledStory.storyName = 'Default Controlled'
ControlledStory.args = {}

const IntegerTemplate: Story<NumberInputProps> = (args) => (
    <ContentBox>
        <Box width="200px">
            <NumberInput
                {...args}
                onKeyDown={undefined}
                onKeyUp={undefined}
                onChange={undefined}
                onFocus={undefined}
                onBlur={undefined}
            />
        </Box>
    </ContentBox>
)

export const IntegerStory: Story<NumberInputProps> = IntegerTemplate.bind({})
IntegerStory.storyName = 'Integer'
IntegerStory.args = {
    type: 'int',
}

export const DecimalStory: Story<NumberInputProps> = UncontrolledTemplate.bind({})
DecimalStory.storyName = 'Decimal'
DecimalStory.args = {
    type: 'decimal',
}

export const RoundingStory: Story<NumberInputProps> = UncontrolledTemplate.bind({})
RoundingStory.storyName = 'Rounding'
RoundingStory.args = {
    type: 'decimal',
    rounding: 5,
    helperText: `rounding: ${5}`,
}

export const MinMaxStory: Story<NumberInputProps> = UncontrolledTemplate.bind({})
MinMaxStory.storyName = 'MinMax'
MinMaxStory.args = {
    type: 'decimal',
    min: -100.90,
    max: 100.90,
    helperText: `min: ${-100.90}, max: ${100.90}`,
}

export const NullableStory: Story<NumberInputProps> = UncontrolledTemplate.bind({})
NullableStory.storyName = 'Nullable'
NullableStory.args = {
    type: 'decimal',
    nullable: true,
}

export const FormattingStory: Story<NumberInputProps> = UncontrolledTemplate.bind({})
FormattingStory.storyName = 'Formatting'
FormattingStory.args = {
    type: 'decimal',
    formatting: true,
}

export const CurrencyStory: Story<NumberInputProps> = UncontrolledTemplate.bind({})
CurrencyStory.storyName = 'Currency'
CurrencyStory.args = {
    type: 'currency',
    currency: 'RUB',
    formatting: true,
    helperText: 'рубли',
}

export const UnitStory: Story<NumberInputProps> = UncontrolledTemplate.bind({})
UnitStory.storyName = 'Unit'
UnitStory.args = {
    type: 'unit',
    unit: 'megabyte',
    formatting: true,
    helperText: 'мегабайты',
}

export const StatesExample = () => {
    const [value, setValue] = useState<number | null>(0)

    return (
        <ContentBox>
            <Stack direction="column" spacing={2} width="300px">
                <NumberInput
                    value={value}
                    onValueChange={setValue}
                />
                <NumberInput
                    value={value}
                    onValueChange={setValue}
                    disabled
                    helperText="disabled"
                />
                <NumberInput
                    value={value}
                    onValueChange={setValue}
                    readOnly
                    helperText="readOnly"
                />
                <NumberInput
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
