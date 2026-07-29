import React, { ComponentProps, useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Dialog from './Dialog'
import { ContentBox } from '../ContentBox'
import { Button } from '../Button'
import { DialogTitle } from '../DialogTitle'
import { DialogContent } from '../DialogContent'
import { SelectInput, DefaultSelectOption } from '../SelectInput'
import { Grid } from '../Grid'

export default {
    title: 'Dialog',
    component: Dialog,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=4102%3A6688'
        }
    }
} as Meta

const handleOnClose = action('onClose')

export const FullExample: Story<ComponentProps<typeof Dialog>> = (args) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = (...args: any[]) => {
        handleOnClose(...args)
        setOpen(false)
    };

    const [value, setValue] = useState('')

    const options: DefaultSelectOption[] = [
        { label: 'None', value: '' },
        { label: 'First item', value: '1' },
        { label: 'Second item', value: '2' },
        { label: 'Third item', value: '3' },
        { label: 'Tykpe itep', value: '4' },
    ]

    const onSelect = (o: DefaultSelectOption) => setValue(o.value)

    return (
        <ContentBox>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                Открыть диалог
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">
                    Use Google's location service?
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} direction={'column'}>
                        <Grid item>
                            <SelectInput
                                label="Select input"
                                options={options}
                                value={value}
                                onSelect={onSelect}
                                errorText="Данный элемент недоступен"
                            />
                        </Grid>
                        <Grid item>
                            <SelectInput
                                label="Select input"
                                options={options}
                                value={value}
                                onSelect={onSelect}
                                errorText="Данный элемент недоступен"
                            />
                        </Grid>
                        <Grid item>
                            <SelectInput
                                label="Select input"
                                options={options}
                                value={value}
                                onSelect={onSelect}
                                errorText="Данный элемент недоступен"
                            />
                        </Grid>
                        <Grid item>
                            <SelectInput
                                label="Select input"
                                options={options}
                                value={value}
                                onSelect={onSelect}
                                errorText="Данный элемент недоступен"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                {/* <ActionsBar
                    left={[
                        <Button color="primary" onClick={handleClose}>Отмена</Button>
                    ]}
                    center={[
                        <Button color="primary" onClick={handleClose}>Отмена</Button>
                    ]}
                    right={[
                        <Button color="primary" onClick={handleClose}>Отмена</Button>
                    ]}
                /> */}
            </Dialog>
        </ContentBox>
    )
}
