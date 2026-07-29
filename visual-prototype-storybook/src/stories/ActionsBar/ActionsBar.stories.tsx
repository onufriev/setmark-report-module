import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import ActionsBar from './ActionsBar'
import { ContentBox } from '../ContentBox'
import { Button } from '../Button'
import { Typography } from '../Typography'
import { IconButton } from '../IconButton'
import { Grid } from '../Grid'
import { Autorenew } from '../icons'

export default {
    title: 'ActionsBar',
    component: ActionsBar,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof ActionsBar>> = (args) => (
    <ActionsBar {...args} onClick={action('click')} />
)

export const Example = Template.bind({})
Example.args = {}

export const PassingElementsViaProps: Story = () => (
    <ContentBox>
        <ActionsBar
            left={[
                <Button color="primary">Удалить</Button>,
                <Button color="primary">Сделать копию</Button>
            ]}
            center={[
                <Typography>Критериям соответствуют: 15 678 покупателей</Typography>,
                <IconButton color="primary" size="small"><Autorenew /></IconButton>
            ]}
            right={[
                <Button color="primary">Отмена</Button>,
                <Button color="primary" variant="contained">Пересчитать и сохранить</Button>
            ]}
        />
    </ContentBox>
)

export const PassingElementsViaChildren: Story = () => (
    <ContentBox>
        <ActionsBar>
            <Grid
                container
                spacing={2}
                alignItems="center"
                wrap="nowrap"
                justifyContent="space-between"
            >
                <Grid item xs="auto">
                    <Grid container spacing={1} alignItems="center" wrap="nowrap">
                        <Grid item xs="auto">
                            <Button color="primary">Удалить</Button>
                        </Grid>
                        <Grid item xs="auto">
                            <Button color="primary">Сделать копию</Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs="auto">
                    <Grid container spacing={1} alignItems="center" wrap="nowrap">
                        <Grid item xs="auto">
                            <Typography>
                                Критериям соответствуют: 15 678 покупателей
                            </Typography>
                        </Grid>
                        <Grid item xs="auto">
                            <IconButton color="primary" size="small">
                                <Autorenew />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs="auto">
                    <Grid container spacing={1} alignItems="center" wrap="nowrap">
                        <Grid item xs="auto">
                            <Button color="primary">Отмена</Button>
                        </Grid>
                        <Grid item xs="auto">
                            <Button color="primary" variant="contained">
                                Пересчитать и сохранить
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ActionsBar>
    </ContentBox>
)
