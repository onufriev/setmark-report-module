import React, { ComponentProps } from 'react'
import MenuList from './MenuList'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { MenuItem } from '../MenuItem'
import { Paper } from '../Paper'

export default {
    title: 'MenuList',
    component: MenuList,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof MenuList>> = (args) => (
    <Paper>
        <MenuList {...args} onClick={action('click')} disablePadding={true}>
            <MenuItem>1</MenuItem>
            <MenuItem>2</MenuItem>
            <MenuItem>3</MenuItem>
        </MenuList>
    </Paper>
)

export const Example = Template.bind({})
Example.args = {}
