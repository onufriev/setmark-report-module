import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import CircularProgress from './CircularProgress'

export default {
    title: 'CircularProgress',
    component: CircularProgress,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const Template: Story<ComponentProps<typeof CircularProgress>> = (args) => (
    <CircularProgress {...args} />
)

export const Example = Template.bind({})
Example.args = {}
