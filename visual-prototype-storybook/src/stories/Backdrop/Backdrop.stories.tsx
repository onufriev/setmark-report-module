import React from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Backdrop, { BackdropProps } from './Backdrop'
import { CircularProgress } from '../CircularProgress'

export default {
    title: 'Backdrop',
    component: Backdrop,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const Template: Story<BackdropProps> = (args) => (
    <Backdrop {...args} onClick={action('click')}>
        <CircularProgress color="inherit" />
    </Backdrop>
)

export const Example: Story<BackdropProps> = Template.bind({})
Example.args = {
    open: true,
}
