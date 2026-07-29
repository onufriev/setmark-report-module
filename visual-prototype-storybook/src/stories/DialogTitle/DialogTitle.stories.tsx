import React from 'react'
import { Meta, Story } from '@storybook/react'
import DialogTitle from './DialogTitle'
import { ContentBox } from '../ContentBox'
import { Error } from '../icons'

export default {
    title: 'DialogTitle',
    component: DialogTitle,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

export const Example: Story = () => {
    return (
        <ContentBox width={620}>
            <DialogTitle>
                Тестовый заголовок
            </DialogTitle>
            <DialogTitle
                onClose={()=>{}}
            >
                Тестовый заголовок с крестиком
            </DialogTitle>
            <DialogTitle
                icon={<Error fontSize='large' color='secondary'/>}
            >
                Тестовый заголовок с иконкой
            </DialogTitle>
            <DialogTitle
                icon={<Error fontSize='large' color='secondary'/>}
                onClose={()=>{}}
            >
                Большой тестовый заголовок с иконкой и крестиком
                Большой тестовый заголовок с иконкой и крестиком
            </DialogTitle>
            <DialogTitle
                variant='success'
                showIcon
                onClose={()=>{}}
            >
                Тестовый заголовок успешно
            </DialogTitle>
            <DialogTitle
                variant='error'
                showIcon
            >
                Тестовый заголовок ошибка
            </DialogTitle>
            <DialogTitle
                variant='info'
                showIcon
            >
                Тестовый заголовок информация
            </DialogTitle>
        </ContentBox>
    )
}
