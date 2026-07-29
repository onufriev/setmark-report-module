import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Collapse from './Collapse'

export default {
    title: 'Collapse',
    component: Collapse,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Collapse>> = (args) => (
    <Collapse {...args} />
)

export const Example = Template.bind({})
Example.args = {}
