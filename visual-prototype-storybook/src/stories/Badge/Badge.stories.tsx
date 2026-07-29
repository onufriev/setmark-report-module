import React, { ComponentProps } from 'react'
import Badge from './Badge'
import { Meta, Story } from '@storybook/react'
import { Notifications } from '../icons'

export default {
    title: 'Badge',
    component: Badge,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=1837%3A4995',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Badge>> = (args) => (
    <Badge {...args}>
        <Notifications color={'inherit'} />
    </Badge>
)

export const Default = Template.bind({})
Default.args = {
    color: 'error',
    overlap: 'circular',
    badgeContent: 4,
}
