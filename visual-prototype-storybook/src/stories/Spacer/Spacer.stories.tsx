import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Spacer from './Spacer'

export default {
    title: 'Spacer',
    component: Spacer,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Spacer>> = (args) => (
    <Spacer {...args} />
)

export const Example = Template.bind({})
Example.args = {}
