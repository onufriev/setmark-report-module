import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import CardMedia from './CardMedia'

export default {
    title: 'CardMedia',
    component: CardMedia,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof CardMedia>> = (args) => (
    <CardMedia {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
