import React from 'react'
import { Meta, Story } from '@storybook/react'
import Tooltip, { TooltipProps } from './Tooltip'
import { Box } from '../Box'
import { Button } from '../Button'

export default {
    title: 'Tooltip',
    component: Tooltip,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

export const ButtonExample: Story<TooltipProps> = (args) => (
    <Box display="flex">
        <Tooltip {...args}>
            <Button>Кнопка</Button>
        </Tooltip>
    </Box>
)

ButtonExample.args = {
    title: 'Пояснение к кнопке'
}

export const ButtonWrapExample: Story<TooltipProps> = (args) => (
    <Box display="flex">
        <Tooltip {...args}>
            <Box component={'span'}>
                <Button>Кнопка</Button>
            </Box>
        </Tooltip>
    </Box>
)

ButtonWrapExample.args = {
    title: 'Пояснение к кнопке'
}
