import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import DialogConfirm from './DialogConfirm'
import { ContentBox } from '../ContentBox'
import { Button } from '../Button'

export default {
    title: 'DialogConfirm',
    component: DialogConfirm,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=4009%3A6775',
        },
    },
} as Meta

export const FullExample: Story<ComponentProps<typeof DialogConfirm>> = (args) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ContentBox>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Открыть диалог
            </Button>
            <DialogConfirm
                {...args}
                open={open}
                buttons={[
                   {
                       label: "Отмена",
                       onClick: handleClose
                   },
                   {
                       label: "Принять",
                       onClick: handleClose
                   }
               ]}
            />
        </ContentBox>
    )
}

FullExample.args = {
    title: 'Заголовок диалогового окна',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
}
