import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Chip from './Chip'
import { Grid } from '../Grid'
import { Box } from '../Box'
import { Typography } from '../Typography'

export default {
    title: 'Chip',
    component: Chip,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=3395%3A6763',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Chip>> = (args) => (
    <Chip {...args} onClick={action('click')} />
)

export const Default = Template.bind({})
Default.args = {
    label: 'Статус Online',
}

export const Example = () => {
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs="auto">
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <Typography variant="subtitle1" noWrap>
                                Дефолтный
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Chip label="Default" />
                        </Grid>
                        <Grid item>
                            <Chip label="Default disabled" disabled />
                        </Grid>
                        <Grid item>
                            <Chip label="Primary" color="primary" />
                        </Grid>
                        <Grid item>
                            <Chip label="Primary disabled" color="primary" disabled />
                        </Grid>
                        <Grid item>
                            <Chip label="Secondary" color="secondary" />
                        </Grid>
                        <Grid item>
                            <Chip label="Secondary disabled" color="secondary" disabled />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs="auto">
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <Typography variant="subtitle1" noWrap>
                                Кликабельный
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Chip clickable label="Default" />
                        </Grid>
                        <Grid item>
                            <Chip clickable label="Default disabled" disabled />
                        </Grid>
                        <Grid item>
                            <Chip clickable label="Primary" color="primary" />
                        </Grid>
                        <Grid item>
                            <Chip clickable label="Primary disabled" color="primary" disabled />
                        </Grid>
                        <Grid item>
                            <Chip clickable label="Secondary" color="secondary" />
                        </Grid>
                        <Grid item>
                            <Chip clickable label="Secondary disabled" color="secondary" disabled />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs="auto">
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <Typography variant="subtitle1" noWrap>
                                Удаляемый
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Chip label="Default" onDelete={() => null} />
                        </Grid>
                        <Grid item>
                            <Chip label="Default disabled" disabled onDelete={() => null} />
                        </Grid>
                        <Grid item>
                            <Chip label="Primary" color="primary" onDelete={() => null} />
                        </Grid>
                        <Grid item>
                            <Chip
                                label="Primary disabled"
                                color="primary"
                                disabled
                                onDelete={() => null}
                            />
                        </Grid>
                        <Grid item>
                            <Chip label="Secondary" color="secondary" onDelete={() => null} />
                        </Grid>
                        <Grid item>
                            <Chip
                                label="Secondary disabled"
                                color="secondary"
                                disabled
                                onDelete={() => null}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs="auto">
                    <Grid container direction="column" spacing={2}>
                        <Grid item>
                            <Typography variant="subtitle1" noWrap>
                                Кликабельный и удаляемый
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Chip clickable label="Default" onDelete={() => null} />
                        </Grid>
                        <Grid item>
                            <Chip
                                clickable
                                label="Default disabled"
                                disabled
                                onDelete={() => null}
                            />
                        </Grid>
                        <Grid item>
                            <Chip clickable label="Primary" color="primary" onDelete={() => null} />
                        </Grid>
                        <Grid item>
                            <Chip
                                clickable
                                label="Primary disabled"
                                color="primary"
                                disabled
                                onDelete={() => null}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                clickable
                                label="Secondary"
                                color="secondary"
                                onDelete={() => null}
                            />
                        </Grid>
                        <Grid item>
                            <Chip
                                clickable
                                label="Secondary disabled"
                                color="secondary"
                                disabled
                                onDelete={() => null}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}
