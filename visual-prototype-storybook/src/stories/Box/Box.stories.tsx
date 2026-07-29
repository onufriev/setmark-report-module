import React, { ComponentProps } from 'react'
import { Box } from './Box'
import { Meta, Story } from '@storybook/react'

export default {
    title: 'Box',
    component: Box,
    parameters: {
        description: '',
    },
} as Meta

export const Template: Story<ComponentProps<typeof Box>> = (args) => (
    <Box {...args}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt, velit.</Box>
)
