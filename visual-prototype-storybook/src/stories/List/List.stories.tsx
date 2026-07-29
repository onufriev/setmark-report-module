import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import List from './List'

export default {
    title: 'List',
    component: List,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof List>> = (args) => (
    <List {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
