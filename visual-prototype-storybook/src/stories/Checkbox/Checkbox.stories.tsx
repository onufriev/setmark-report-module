import React, { ComponentProps } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Checkbox from './Checkbox'
import { FormControl } from '../FormControl'
import { FormGroup } from '../FormGroup'
import { FormLabel } from '../FormLabel'
import { FormHelperText } from '../FormHelperText'
import { Paper } from '../Paper'
import { Box } from '../Box'
import { Grid } from '../Grid'

export default {
    title: 'Form/Checkbox',
    component: Checkbox,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=3312%3A7304',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Checkbox>> = (args) => (
    <Paper>
        <Box p={1.5}>
            <Checkbox {...args} onClick={action('click')} />
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
                    <Checkbox />
                    <Checkbox checked />
                    <Checkbox indeterminate />
                    <Checkbox disabled />
                    <Checkbox required />
                    <br />
                    <Checkbox label="Label 1" />
                    <Checkbox label="Label 2" checked />
                    <Checkbox label="Label 3" indeterminate />
                    <Checkbox label="Label 4" disabled />
                    <Checkbox label="Label 5" required />
                </Grid>
                <Grid item xs={4}>
                    <FormControl>
                        <FormLabel>Form label</FormLabel>
                        <FormGroup>
                            <Checkbox label={label} />
                            <Checkbox label={label} disabled />
                            <Checkbox label={label} />
                        </FormGroup>
                        <FormHelperText>Form helper text</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl error required>
                        <FormLabel>Form label</FormLabel>
                        <FormGroup>
                            <Checkbox label={label} />
                            <Checkbox label={label} />
                            <Checkbox disabled />
                        </FormGroup>
                        <FormHelperText>Form helper text</FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    </Paper>
)
