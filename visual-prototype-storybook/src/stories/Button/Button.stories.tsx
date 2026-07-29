import React, { ComponentProps } from 'react'
import Button from './Button'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ContentBox } from '../ContentBox'
import { Grid } from '../Grid'
import { Add } from '../icons'

export default {
    title: 'Button',
    component: Button,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=1488%3A66',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Button>> = (args) => (
    <Button {...args} onClick={action('click')}>
        Button
    </Button>
)

export const Playground = Template.bind({})
Playground.args = {

}

export const FullExaple: Story = () => {
    return (
        <ContentBox>
            <Grid container spacing={4} wrap="nowrap">
                <Grid item xs="auto">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Button>Button</Button>
                        </Grid>
                        <Grid item>
                            <Button disabled>
                                Button
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs="auto">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Button startIcon={<Add />}>
                                Button
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button startIcon={<Add />} disabled>
                                Button
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs="auto">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Button variant="contained">
                                Button
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button disabled variant="contained">
                                Button
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs="auto">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Button startIcon={<Add />} variant="contained">
                                Button
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                startIcon={<Add />}
                                disabled
                                variant="contained"
                            >
                                Button
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container spacing={4} wrap="nowrap">
                <Grid item xs="auto">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Button color="secondary">Button</Button>
                        </Grid>
                        <Grid item>
                            <Button color="secondary" disabled>
                                Button
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs="auto">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Button color="secondary" startIcon={<Add />}>
                                Button
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button color="secondary" startIcon={<Add />} disabled>
                                Button
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs="auto">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Button color="secondary" variant="contained">
                                Button
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button color="secondary" disabled variant="contained">
                                Button
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs="auto">
                    <Grid container spacing={2} direction="column">
                        <Grid item>
                            <Button color="secondary" startIcon={<Add />} variant="contained">
                                Button
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                color="secondary"
                                startIcon={<Add />}
                                disabled
                                variant="contained"
                            >
                                Button
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ContentBox>
    )
}
