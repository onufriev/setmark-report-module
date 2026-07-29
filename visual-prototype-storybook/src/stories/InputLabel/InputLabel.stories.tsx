import React, { ComponentProps } from 'react'
import InputLabel from './InputLabel'
import { Meta, Story } from '@storybook/react'

export default {
    title: 'Form/InputLabel',
    component: InputLabel,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof InputLabel>> = (args) => (
    <InputLabel {...args}>label</InputLabel>
)

export const Example = Template.bind({})
Example.args = {}
