import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Menu from './Menu'

export default {
    title: 'Menu',
    component: Menu,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const Template: Story<ComponentProps<typeof Menu>> = (args) => (
    <Menu {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}

