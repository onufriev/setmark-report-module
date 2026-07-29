import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import LinearProgress from './LinearProgress'

export default {
    title: 'LinearProgress',
    component: LinearProgress,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const Template: Story<ComponentProps<typeof LinearProgress>> = (args) => (
    <LinearProgress {...args} />
)

export const Example = Template.bind({})
Example.args = {}
