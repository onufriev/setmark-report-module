import React from 'react'
import { Meta, Story } from '@storybook/react'
import DialogActions from './DialogActions'
import { ContentBox } from '../ContentBox'
import { Button } from '../Button'

export default {
    title: 'DialogActions',
    component: DialogActions,
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
            <DialogActions>
                <Button color="secondary">
                    Принять
                </Button>
                <Button color="secondary">
                    Отмена
                </Button>
                <Button color="secondary">
                    Удалить
                </Button>
                <Button color="secondary">
                    Сохранить
                </Button>
            </DialogActions>
        </ContentBox>
    )
}
