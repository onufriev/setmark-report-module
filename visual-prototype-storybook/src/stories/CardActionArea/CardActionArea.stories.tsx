import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import CardActionArea from './CardActionArea'

export default {
    title: 'CardActionArea',
    component: CardActionArea,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof CardActionArea>> = (args) => (
    <CardActionArea {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
