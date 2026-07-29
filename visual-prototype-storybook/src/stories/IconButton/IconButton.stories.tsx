import React, { ComponentProps } from 'react'
import IconButton from './IconButton'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ContentBox } from '../ContentBox'
import { Grid } from '../Grid'
import { Add, Menu } from '../icons'

export default {
    title: 'IconButton',
    component: IconButton,
} as Meta

export const Template: Story<ComponentProps<typeof IconButton>> = (args) => (
    <IconButton {...args} onClick={action('click')}>
        <Menu />
    </IconButton>
)

export const FullExaple: Story = () => {
    return (
        <ContentBox>
            <Grid container spacing={3} wrap="nowrap" direction="column">
                <Grid item xs="auto">
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <IconButton>
                                <Add />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton color="primary">
                                <Add />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton color="primary" size="small">
                                <Add />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton color="primary" size="small">
                                <Add fontSize="inherit" />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton noPadding>
                                <Add />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs="auto">
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <IconButton disabled>
                                <Add />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton color="primary" disabled>
                                <Add />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton color="primary" disabled size="small">
                                <Add />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton color="primary" disabled size="small">
                                <Add fontSize="inherit" />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton disabled noPadding>
                                <Add />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ContentBox>
    )
}
