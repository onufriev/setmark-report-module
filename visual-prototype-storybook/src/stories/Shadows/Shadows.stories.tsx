import React from 'react'
import { Meta, Story } from '@storybook/react'
import Shadows from './Shadows'

export default {
    title: 'Shadows',
    component: Shadows,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=3115%3A6500',
        },
    },
} as Meta

export const Example: Story<void> = () => <Shadows />
