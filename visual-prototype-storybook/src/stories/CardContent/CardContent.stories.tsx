import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import CardContent from './CardContent'

export default {
    title: 'CardContent',
    component: CardContent,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof CardContent>> = (args) => (
    <CardContent {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
