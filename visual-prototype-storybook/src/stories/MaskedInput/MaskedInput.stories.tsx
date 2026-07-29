import React, { useRef, useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import MaskedInput from './MaskedInput'
import { Box } from '../Box'
import { ContentBox } from '../ContentBox'
import { Stack } from '../Stack'
import { MaskedInputProps } from './types'

/**
 * Статья про email regex https://www.regular-expressions.info/email.html
 */
const EMAIL_REGEXP = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/

export default {
    title: 'Form/MaskedInput',
    component: MaskedInput,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<MaskedInputProps> = (args) => (
    <ContentBox>
        <Box width={200}>
            <MaskedInput
                {...args}
                onFocus={undefined}
                onBlur={undefined}
                onKeyDown={undefined}
                onKeyUp={undefined}
            />
        </Box>
    </ContentBox>
)

export const Basic = Template.bind({})
Basic.args = {
    options: {
        mask: '00-`00-`00',
        lazy: false,
    }
}

const actionHandler = action('onValueChange')

const ControlledTemplate: Story<MaskedInputProps> = (args) => {
    const [value, setValue] = useState<string>()

    const optionsRef = useRef({
        mask: '+{7} (000) 000-00-00',
        lazy: false,
    })

    const handleValueChange = value => {
        setValue(value)
        actionHandler(value)
    }

    return (
        <ContentBox>
            <Box width={200}>
                <MaskedInput
                    {...args}
                    options={optionsRef.current}
                    value={value}
                    onValueChange={handleValueChange}
                    onFocus={undefined}
                    onBlur={undefined}
                    onKeyDown={undefined}
                    onKeyUp={undefined}
                />
            </Box>
        </ContentBox>
    )
}

export const MaskedValue = ControlledTemplate.bind({})
MaskedValue.args = {
    unmask: false
}

export const UnmaskedValue = ControlledTemplate.bind({})
UnmaskedValue.args = {
    unmask: true
}

export const TypedValue = ControlledTemplate.bind({})
TypedValue.args = {
    unmask: 'typed'
}

export const PhoneNumber = Template.bind({})
PhoneNumber.args = {
    label: 'Номер телефона',
    options: {
        mask: '+{7} (000) 000-00-00',
        lazy: false,
    },
    unmask: true,
}

export const Email = Template.bind({})
Email.args = {
    label: 'Email',
    options: {
        mask: 'name{@}`domain{.}`domain',
        blocks: {
            name: {
                mask: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+$/,
            },
            domain: {
                mask: /^[a-zA-Z0-9]*$/,
            },
        },
    },
    helperText: 'Использования регулярного выражения для email плохая идея, т.к. фактически узнать, валидный ли адрес введен получиться лишь после попытки на него что либо отправить'
}

export const StatesExample = () => {
    const [value, setValue] = useState<string>('')

    const optionsRef = useRef({
        mask: '+{7} (000) 000-00-00',
        lazy: false,
    })

    const handleValueChange = value => {
        setValue(value)
        actionHandler(value)
    }

    return (
        <ContentBox>
            <Stack direction="column" spacing={2} width="300px">
                <MaskedInput
                    options={optionsRef.current}
                    value={value}
                    onValueChange={handleValueChange}
                />
                <MaskedInput
                    options={optionsRef.current}
                    value={value}
                    onValueChange={handleValueChange}
                    disabled
                    helperText="disabled"
                />
                <MaskedInput
                    options={optionsRef.current}
                    value={value}
                    onValueChange={handleValueChange}
                    readOnly
                    helperText="readOnly"
                />
                <MaskedInput
                    options={optionsRef.current}
                    value={value}
                    onValueChange={handleValueChange}
                    error
                    helperText="With error"
                    // либо
                    // errorText="With error"
                />
            </Stack>
        </ContentBox>
    )
}
