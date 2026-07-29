import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import FormLabel from './FormLabel'

export default {
    title: 'FormLabel',
    component: FormLabel,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof FormLabel>> = (args) => (
    <FormLabel {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
