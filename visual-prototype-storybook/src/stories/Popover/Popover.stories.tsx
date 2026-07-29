import React, { ComponentProps } from 'react'
import Popover from './Popover'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'

export default {
    title: 'Popover',
    component: Popover,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Popover>> = (args) => (
    <Popover {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}
