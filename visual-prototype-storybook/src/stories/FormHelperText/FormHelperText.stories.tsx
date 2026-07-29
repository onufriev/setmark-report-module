import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import FormHelperText from './FormHelperText'

export default {
    title: 'FormHelperText',
    component: FormHelperText,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof FormHelperText>> = (args) => (
    <FormHelperText {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
