import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Switch from './Switch'
import { FormControl } from '../FormControl'
import { FormGroup } from '../FormGroup'
import { FormLabel } from '../FormLabel'
import { FormHelperText } from '../FormHelperText'
import { Paper } from '../Paper'
import { Box } from '../Box'
import { Grid } from '../Grid'

export default {
    title: 'Form/Switch',
    component: Switch,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Switch>> = (args) => (
    <Paper>
        <Box p={1.5}>
            <Switch {...args} onClick={action('click')} />
        </Box>
    </Paper>
)

export const Default = Template.bind({})
Default.args = {}

const label = 'Text areas are taller than text fields and wrap overflow text onto a new line.'

export const WithLabel = Template.bind({})
WithLabel.args = {
    label: label,
}

export const FullExample = () => (
    <Paper>
        <Box p={1.5}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Switch />
                    <Switch checked />
                    <Switch disabled />
                    <Switch required />
                    <br />
                    <Switch label="Label 1" />
                    <Switch label="Label 2" checked />
                    <Switch label="Label 4" disabled />
                    <Switch label="Label 5" required />
                </Grid>
                <Grid item xs={4}>
                    <FormControl>
                        <FormLabel>Form label</FormLabel>
                        <FormGroup>
                            <Switch label={label} />
                            <Switch label={label} disabled />
                            <Switch label={label} />
                        </FormGroup>
                        <FormHelperText>Form helper text</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl error required>
                        <FormLabel>Form label</FormLabel>
                        <FormGroup>
                            <Switch label={label} />
                            <Switch label={label} />
                            <Switch disabled />
                        </FormGroup>
                        <FormHelperText>Form helper text</FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    </Paper>
)
