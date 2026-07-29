import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import Divider from './Divider'
import { ContentBox } from '../ContentBox'

export default {
    title: 'Divider',
    component: Divider,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=3876%3A6657',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Divider>> = (args) => (
    <ContentBox>
        <Divider {...args} />
    </ContentBox>
)

export const Example = Template.bind({})
Example.args = {}
