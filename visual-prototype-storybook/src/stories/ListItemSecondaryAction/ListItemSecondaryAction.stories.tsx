import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ListItemSecondaryAction from './ListItemSecondaryAction'

export default {
    title: 'ListItemSecondaryAction',
    component: ListItemSecondaryAction,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof ListItemSecondaryAction>> = (args) => (
    <ListItemSecondaryAction {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
