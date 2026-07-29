import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import SvgIcon from './SvgIcon'

export default {
    title: 'SvgIcon',
    component: SvgIcon,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const Template: Story<ComponentProps<typeof SvgIcon>> = (args) => (
    <SvgIcon {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}

