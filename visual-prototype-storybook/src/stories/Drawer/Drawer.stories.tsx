import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Drawer from './Drawer'

export default {
    title: 'Drawer',
    component: Drawer,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Drawer>> = (args) => (
    <Drawer {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
