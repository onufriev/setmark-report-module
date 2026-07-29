import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ListItemText from './ListItemText'

export default {
    title: 'ListItemText',
    component: ListItemText,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof ListItemText>> = (args) => (
    <ListItemText {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
