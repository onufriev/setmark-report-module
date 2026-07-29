import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ListItem from './ListItem'

export default {
    title: 'ListItem',
    component: ListItem,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof ListItem>> = (args) => (
    <ListItem {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
