import React, { ComponentProps } from 'react'
import {
    MenuIcon,
    NotificationsIcon,
    AnnouncementIcon,
    AccountCircleIcon,
    SvgIconProps,
    ErrorIcon,
    WarningIcon,
    CheckCircleIcon,
    InfoIcon,
} from './Icon'
import { Meta, Story } from '@storybook/react'

export default {
    title: 'Icon',
    component: MenuIcon,
} as Meta

export const ExampleMenuIcon: Story<ComponentProps<typeof MenuIcon>> = (args) => (
    <MenuIcon {...args} />
)

export const Examples: Story<SvgIconProps> = (args) => {
    return (
        <>
            <div>
                <MenuIcon {...args} />
                <NotificationsIcon {...args} />
                <AnnouncementIcon {...args} />
                <AccountCircleIcon {...args} />
                <ErrorIcon {...args} />
                <WarningIcon {...args} />
                <CheckCircleIcon {...args}/>
                <InfoIcon {...args}/>
            </div>
        </>
    )
}
