import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import CardActions from './CardActions'

export default {
    title: 'CardActions',
    component: CardActions,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof CardActions>> = (args) => (
    <CardActions {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
