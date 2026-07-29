import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import Input from './Input'
import { Box } from '../Box'
import { Paper } from '../Paper'

export default {
    title: 'Form/Input',
    component: Input,
} as Meta

const Template: Story<ComponentProps<typeof Input>> = (args) => (
    <Paper>
        <Box width={300} p={2}>
            <Input {...args} />
        </Box>
    </Paper>
)

export const Default = Template.bind({})
Default.args = {}
