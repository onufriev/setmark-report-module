import React, { ComponentProps } from 'react'
import MenuItem from './MenuItem'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'

export default {
    title: 'MenuItem',
    component: MenuItem,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof MenuItem>> = (args) => (
    <MenuItem {...args} onClick={action('click')}>
        {'menu item'}
    </MenuItem>
)

export const Example = Template.bind({})
Example.args = {}
