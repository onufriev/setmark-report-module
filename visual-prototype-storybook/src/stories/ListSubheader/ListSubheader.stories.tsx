import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ListSubheader from './ListSubheader'

export default {
    title: 'ListSubheader',
    component: ListSubheader,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const Template: Story<ComponentProps<typeof ListSubheader>> = (args) => (
    <ListSubheader {...args}>Example</ListSubheader>
)

export const Example = Template.bind({})
Example.args = {}
