import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ButtonBase from './ButtonBase'

export default {
    title: 'ButtonBase',
    component: ButtonBase,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const Template: Story<ComponentProps<typeof ButtonBase>> = (args) => (
    <ButtonBase {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {
    children: 'BaseButton'
}
