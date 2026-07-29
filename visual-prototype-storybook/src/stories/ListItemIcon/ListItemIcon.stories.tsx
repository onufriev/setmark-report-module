import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ListItemIcon from './ListItemIcon'

export default {
    title: 'ListItemIcon',
    component: ListItemIcon,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof ListItemIcon>> = (args) => (
    <ListItemIcon {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
