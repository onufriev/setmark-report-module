import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import CardHeader from './CardHeader'

export default {
    title: 'CardHeader',
    component: CardHeader,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof CardHeader>> = (args) => (
    <CardHeader {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
