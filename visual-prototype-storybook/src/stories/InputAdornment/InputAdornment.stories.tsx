import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import InputAdornment from './InputAdornment'

export default {
    title: 'InputAdornment',
    component: InputAdornment,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof InputAdornment>> = (args) => (
    <InputAdornment {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
