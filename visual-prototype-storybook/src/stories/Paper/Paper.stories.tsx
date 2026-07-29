import React, { ComponentProps } from 'react'
import Paper from './Paper'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Box } from '../Box'

export default {
    title: 'Paper',
    component: Paper,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Paper>> = (args) => {
    return (
        <Paper {...args} onClick={action('click')} data-testid={'Paper'}>
            <Box width={200} height={200} />
        </Paper>
    )
}

export const Example = Template.bind({})
Example.args = {}
