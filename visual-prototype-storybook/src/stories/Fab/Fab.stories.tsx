import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import Fab from './Fab'
import { ContentBox } from '../ContentBox'
import { Grid } from '../Grid'
import { Add } from '../icons'

export default {
    title: 'Fab',
    component: Fab,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Fab>> = (args) => (
    <ContentBox position="relative" height={1} width={1}>
        <Fab {...args}>
            <Add />
        </Fab>
    </ContentBox>
)

export const Playground = Template.bind({})
Playground.args = {}

export const FullExaple: Story = () => {
    return (
        <ContentBox>
            <Grid container spacing={4} wrap="nowrap">
                <Grid item xs="auto">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Fab position="static" color="primary" size="large">
                                <Add />
                            </Fab>
                        </Grid>
                        <Grid item>
                            <Fab position="static" color="primary" size="medium">
                                <Add />
                            </Fab>
                        </Grid>
                        <Grid item>
                            <Fab position="static" color="primary" size="small">
                                <Add />
                            </Fab>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs="auto">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Fab position="static" color="primary">
                                <Add />
                            </Fab>
                        </Grid>
                        <Grid item>
                            <Fab position="static" color="primary" disabled>
                                <Add />
                            </Fab>
                        </Grid>
                        <Grid item>
                            <Fab position="static" color="primary" variant="extended">
                                <Add /> Button
                            </Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ContentBox>
    )
}
