import React from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import AppLoader, { AppLoaderProps } from './AppLoader'
import ContentLoader, { ContentLoaderProps } from './ContentLoader'
import FetchLoader, { FetchLoaderProps } from './FetchLoader'
import { ContentBox } from '../ContentBox'
import { Button } from '../Button'

export default {
    title: 'Loaders',
    parameters: {
        design: {
            type: 'figma',
            url: ''
        }
    }
} as Meta

const AppLoaderTemplate: Story<AppLoaderProps> = (args) => (
    <AppLoader {...args} />
)

export const AppLoaderExample: Story<AppLoaderProps> = AppLoaderTemplate.bind({})
AppLoaderExample.args = {
    open: true,
    title: 'Идёт загрузка...',
}

const ContentLoaderTemplate: Story<ContentLoaderProps> = (args) => (
    <ContentLoader {...args} />
)

export const ContentLoaderExample: Story<ContentLoaderProps> = ContentLoaderTemplate.bind({})
ContentLoaderExample.args = {
    title: 'Идёт загрузка...',
}

const FetchLoaderTemplate: Story<FetchLoaderProps> = (args) => (
    <FetchLoader {...args} />
)

export const FetchLoaderExample: Story<FetchLoaderProps> = FetchLoaderTemplate.bind({})
FetchLoaderExample.args = {}

export const FetchLoaderOverlap = () => (
    <ContentBox position="relative" height={1} width={1} flexContainer flexCenter>
        <FetchLoader overlap />

        <Button color="primary">{ 'Попробуй нажми на меня :)' }</Button>
    </ContentBox>
)
