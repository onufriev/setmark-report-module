import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import FormControl from './FormControl'

export default {
    title: 'FormControl',
    component: FormControl,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof FormControl>> = (args) => (
    <FormControl {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
