import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ListItemAvatar from './ListItemAvatar'

export default {
    title: 'ListItemAvatar',
    component: ListItemAvatar,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof ListItemAvatar>> = (args) => (
    <ListItemAvatar {...args} />
)

export const Example = Template.bind({})
Example.args = {}
