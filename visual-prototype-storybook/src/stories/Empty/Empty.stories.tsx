import React from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Empty, { EmptyProps } from './Empty'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { Warning } from '../icons'
import { Box } from '../Box'

export default {
    title: 'Empty',
    component: Empty,
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const EmptyTemplate: Story<EmptyProps> = (args) => (
    <Empty {...args} />
)

export const Default: Story<EmptyProps> = EmptyTemplate.bind({})
Default.args = {}

export const WithMessage: Story<EmptyProps> = EmptyTemplate.bind({})
WithMessage.args = {
    message: 'Подобные элементы в системе не найдены',
}

export const FullExample: Story<EmptyProps> = EmptyTemplate.bind({})
FullExample.args = {
    imgSlot: <Box display="flex" fontSize="80px"><Warning fontSize="inherit" color="action" /></Box>,
    message: <Typography variant="h6">Подобные элементы в системе не найдены</Typography>,
    children: <Button color="primary">Попробовать снова</Button>
}
