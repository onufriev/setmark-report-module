import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import Stack, { StackProps } from './Stack'
import { ContentBox } from '../ContentBox'
import { Divider } from '../Divider'

export default {
    title: 'Stack',
    component: Stack,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<StackProps> = (args) => (
    <Stack {...args}>
        <ContentBox>Item 1</ContentBox>
        <ContentBox>Item 2</ContentBox>
        <ContentBox>Item 3</ContentBox>
        <ContentBox>Item 4</ContentBox>
        <ContentBox>Item 5</ContentBox>
    </Stack>
)

export const Default = Template.bind({})
Default.args = {
    spacing: 1,
}

export const WithDivider = Template.bind({})
WithDivider.args = {
    spacing: 2,
    divider: <Divider orientation='vertical' flexItem />
}
