import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import TooltipBase from './TooltipBase'
import { Button } from '../Button'
import { Box } from '../Box'

export default {
    title: 'TooltipBase',
    component: TooltipBase,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof TooltipBase>> = (args) => (
    <Box>
        <TooltipBase {...args}>
            <Button>Кнопка</Button>
        </TooltipBase>
    </Box>
)

export const Example = Template.bind({})
Example.args = {
    title: 'Пояснение к кнопке'
}
