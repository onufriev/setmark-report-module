import React, { ComponentProps } from 'react'
import Toolbar from './Toolbar'
import { Meta, Story } from '@storybook/react'
import { AppBar } from '../AppBar'

export default {
    title: 'Toolbar',
    component: Toolbar,
} as Meta

const Template: Story<ComponentProps<typeof Toolbar>> = (args) => (
    <AppBar position={'static'}>
        <Toolbar {...args}>Toolbar</Toolbar>
    </AppBar>
)

export const Example = Template.bind({})
Example.args = {
    variant: 'dense',
}
