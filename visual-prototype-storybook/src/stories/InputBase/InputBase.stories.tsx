import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import InputBase from './InputBase'
import { Box } from '../Box'
import { Paper } from '../Paper'

export default {
    title: 'Form/InputBase',
    component: InputBase,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof InputBase>> = (args) => (
    <Paper>
        <Box width={300} p={2}>
            <InputBase {...args} onClick={action('click')} />
        </Box>
    </Paper>
)

export const Example = Template.bind({})
Example.args = {}
