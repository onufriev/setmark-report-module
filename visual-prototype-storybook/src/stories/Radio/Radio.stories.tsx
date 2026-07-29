import React, { ComponentProps, useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Radio from './Radio'
import { FormControl } from '../FormControl'
import { FormLabel } from '../FormLabel'
import { FormHelperText } from '../FormHelperText'
import { Paper } from '../Paper'
import { Box } from '../Box'
import { Grid } from '../Grid'
import { RadioGroup } from '../RadioGroup'

export default {
    title: 'Form/Radio',
    component: Radio,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=3312%3A7816',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Radio>> = (args) => (
    <Paper>
        <Box p={1.5}>
            <Radio {...args} onClick={action('click')} />
        </Box>
    </Paper>
)

export const Default = Template.bind({})
Default.args = {}

const contentLabel = 'Text areas are taller than text fields and wrap overflow text onto a new line.'

export const Withcontent = Template.bind({})
Withcontent.args = {
    label: contentLabel,
    id: 'test'
}

export const FullExample = () => {
    const [selection, setSelection] = useState<string>('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setSelection(value)
    }

    return (
        <Paper>
            <Box p={1.5}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Radio />
                        <Radio checked />
                        <Radio disabled />
                        <Radio required />
                        <br />
                        <Radio label="content 1" />
                        <Radio label="content 2" checked />
                        <Radio label="content 4" disabled />
                        <Radio label="content 5" required />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl>
                            <FormLabel>Form content</FormLabel>
                            <RadioGroup>
                                <Radio value="1" label={contentLabel} />
                                <Radio value="2" label={contentLabel} disabled />
                                <Radio value="3" label={contentLabel} />
                            </RadioGroup>
                            <FormHelperText>Form helper text</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl error required>
                            <FormLabel>Form content</FormLabel>
                            <RadioGroup>
                                <Radio value="1" label={contentLabel} />
                                <Radio value="2" label={contentLabel} />
                                <Radio value="3" disabled />
                            </RadioGroup>
                            <FormHelperText>Form helper text</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box pt={2} width={360}>
                    <RadioGroup>
                        <Radio
                            id="button1"
                            name="fillType-buttons"
                            value={"1"}
                            onChange={(event) => {
                                handleChange(event)}
                            }
                            label={
                                <Grid container>
                                    <Grid container item spacing={2} xs={12}>
                                        <Grid item xs={3}>
                                            Сергей
                                        </Grid>
                                        <Grid item xs={4}>
                                            12.05.2015
                                        </Grid>
                                        <Grid item xs={4}>
                                            мужской
                                        </Grid>
                                    </Grid>
                                </Grid>
                            }
                            checked={selection === "1"}
                            variant="outlined"
                        />
                        <Radio
                            id="button2"
                            name="fillType-buttons"
                            value={"2"}
                            onChange={(event) => {
                                handleChange(event)}
                            }
                            label={
                                <Grid container>
                                    <Grid container item spacing={2} xs={12}>
                                        <Grid item xs={3}>
                                            Сергей
                                        </Grid>
                                        <Grid item xs={4}>
                                            12.05.2015
                                        </Grid>
                                        <Grid item xs={4}>
                                            мужской
                                        </Grid>
                                    </Grid>
                                    <Grid container item spacing={2} xs={12}>
                                        <Grid item xs={3}>
                                            Марина
                                        </Grid>
                                        <Grid item xs={4}>
                                            14.04.2021
                                        </Grid>
                                        <Grid item xs={4}>
                                            женский
                                        </Grid>
                                    </Grid>
                                    <Grid container item spacing={2} xs={12}>
                                        <Grid item xs={3}>
                                            Евгений
                                        </Grid>
                                        <Grid item xs={4}>
                                            14.04.2022
                                        </Grid>
                                        <Grid item xs={4}>
                                            мужской
                                        </Grid>
                                    </Grid>
                                    <Grid container item spacing={2} xs={12}>
                                        <Grid item xs={3}>
                                            Маша
                                        </Grid>
                                        <Grid item xs={4}>
                                            22.09.2021
                                        </Grid>
                                        <Grid item xs={4}>
                                            женский
                                        </Grid>
                                    </Grid>
                                </Grid>
                            }
                            checked={selection === "2"}
                            variant="outlined"
                        />
                        <Radio
                            id="button1"
                            name="fillType-buttons"
                            value={"3"}
                            onChange={(event) => {
                                handleChange(event)}
                            }
                            label={"ПетроПетровичевечевеПетричвечПетровачПетровичкев"}
                            checked={selection === "3"}
                            variant="outlined"
                        />
                    </RadioGroup>
                </Box>
            </Box>
        </Paper>
)}
