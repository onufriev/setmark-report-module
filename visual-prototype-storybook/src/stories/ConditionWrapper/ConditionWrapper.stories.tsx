import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { ContentBox } from '../ContentBox'
import { Grid } from '../Grid'
import ConditionWrapper from './ConditionWrapper'
import { Dialog } from '../Dialog'
import { Button } from '../Button'
import { DialogTitle } from '../DialogTitle'
import { DialogContent } from '../DialogContent'
import { ActionsBar } from '../ActionsBar'
import { Typography } from '@material-ui/core'
import { Box } from '../Box'
import ConditionRow from '../ConditionRow/ConditionRow'

export default {
    title: 'ConditionWrapper',
    component: ConditionWrapper,
    parameters: {
        design: {
            type: 'figma',
        },
    },
} as Meta

export const FullExample: Story = () => {
    const [open, setOpen] = useState(false)

    const localeEmulator = {
        command: 'Действие',
        fixValue: 'Фиксированная величина',
        count: 'Счет',
        term: 'Срок сгорания бонусов'
    }

    const conditionsTriggers = [
        {
            header: 'По заполнению полей анкеты',
            condition: 'E-mail и согласие на отправку'
        },
    ]

    const conditionsErrorTriggers = [
        {
            header: 'По зафиксированному уровню ПЛ',
            condition: 'Выбранный уровень программы лояльности был удален. \n Выберите уровень, чтобы возобновить акцию'
        },
    ]

    const conditionsEvents = [
        {
            command: 'По заполнению полей анкеты',
            fixValue: 'E-mail и согласие на отправку',
            count: 'Основной',
            term: 'Несгораемые'
        }
    ]

    return (
        <ContentBox>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <ConditionWrapper
                        label={'Триггер'}
                        onOpen={() => setOpen(true)}
                    >
                        {conditionsTriggers.map(({header, condition}) => (
                            <ConditionRow
                                key={`${condition}_${header}`}
                                title={header}
                                subtitle={condition}
                            />
                        ))}
                    </ConditionWrapper>
                </Grid>
                <Grid item xs={6}>
                    <ConditionWrapper
                        label={'Действия'}
                        onOpen={() => setOpen(true)}
                        disabled
                    >
                        {conditionsEvents.map(el => (
                            Object.entries(el).map(el => (
                                <Box pb={1} key={`${el[0]}_${el[1]}`}>
                                    <Grid container spacing={2} alignItems='center'>
                                        <Grid item xs={4}>
                                            <Typography variant='caption' color='textSecondary'>
                                                { localeEmulator[el[0]] }
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography>{ el[1] }</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))
                        ))}
                    </ConditionWrapper>
                </Grid>
            </Grid>
            <Grid item container>
                <Grid item xs={6}>
                    <ConditionWrapper
                        label={'Триггер с ошибкой'}
                        onOpen={() => setOpen(true)}
                        buttonText="Редактировать"
                        error
                    >
                        {conditionsErrorTriggers.map(({ condition, header }) => (
                            <ConditionRow
                                key={`${condition}_${header}`}
                                title={header}
                                subtitle={condition}
                            />
                        ))}
                    </ConditionWrapper>
                </Grid>
            </Grid>
            <Dialog open={open}>
                <DialogTitle onClose={() => setOpen(false)}>
                    Триггер
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} direction={'column'}>
                        <Grid item>
                        </Grid>
                    </Grid>
                </DialogContent>
                <ActionsBar
                    left={[
                        <Button color="primary" onClick={() => setOpen(false)}>Отмена</Button>
                    ]}
                />
            </Dialog>
        </ContentBox>
    )
}
