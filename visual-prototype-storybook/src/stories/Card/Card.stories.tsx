import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Card from './Card'

export default {
    title: 'Card',
    component: Card,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Card>> = (args) => (
    <Card {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
