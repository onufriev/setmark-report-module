import React from 'react'
import { Meta, Story } from '@storybook/react'
import DialogContent from './DialogContent'
import { ContentBox } from '../ContentBox'

export default {
    title: 'DialogContent',
    component: DialogContent,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

export const Example: Story = () => {
    return (
        <ContentBox>
            <DialogContent>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </DialogContent>
        </ContentBox>
    )
}
