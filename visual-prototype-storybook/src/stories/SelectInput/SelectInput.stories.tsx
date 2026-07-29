import React, { useState } from 'react'
import SelectInput, { DefaultSelectOption, SelectInputProps } from './SelectInput'
import { Meta, Story } from '@storybook/react'
import { Chip } from '../Chip'
import { Typography } from '../Typography'
import { Box } from '../Box'
import { Grid } from '../Grid'
import { ContentBox } from '../ContentBox'
import { Dialog } from '../Dialog'

export default {
    title: 'Form/SelectInput',
    component: SelectInput,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=3575%3A6634',
        },
    },
} as Meta

const Template: Story<SelectInputProps> = (args) => (
    <ContentBox>
        <SelectInput {...args} style={{ width: '300px' }} />
    </ContentBox>
)

const TemplateWithSimpleData: Story<SelectInputProps<string>> = (args) => (
    <ContentBox>
        <SelectInput<string> {...args} style={{ width: '300px' }} />
    </ContentBox>
)

export const Basic = Template.bind({})
Basic.args = {
    label: 'Select input',
    options: [
        { label: 'None', value: '' },
        { label: 'First item', value: '1' },
        { label: 'Second item', value: '2', disabled: true },
        { label: 'Third item', value: '3' },
    ],
}

export const Multiple = Template.bind({})
Multiple.args = {
    label: 'Select input',
    options: [
        { label: 'First item', value: '1' },
        { label: 'Extremely long second item which should wrap to a new line', value: '2' },
        { label: 'Just third item', value: '3', disabled: true },
        { label: 'Fourth item', value: '4' },
    ],
    multiple: true,
}

export const FetchedOption = Template.bind({})
FetchedOption.args = {
    label: 'Select input',
    fetchFunction: async () => {
        await new Promise((res) => setTimeout(res, 2000))

        return [
            { label: 'None', value: '' },
            { label: 'First item', value: '1' },
            { label: 'Second item', value: '2' },
            { label: 'Third item', value: '3' },
        ]
    },
}

export const EmptyOptions = TemplateWithSimpleData.bind({})
EmptyOptions.args = {
    label: 'Select input',
    options: [],
}

export const SimpleOptions = TemplateWithSimpleData.bind({})
SimpleOptions.args = {
    label: 'Select input',
    options: [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
    ],
}

export const CustomValueRender = TemplateWithSimpleData.bind({})
CustomValueRender.args = {
    label: 'Select input',
    multiple: true,
    options: [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
    ],
    valueRenderer: (values) => (
        <Box display="flex" flexWrap="wrap" marginLeft="-2px">
            {(values as string[]).map((value) => (
                <Box m="2px" key={value}>
                    <Chip label={value} size="small" />
                </Box>
            ))}
        </Box>
    ),
}

export const CustomOptionRender = TemplateWithSimpleData.bind({})
CustomOptionRender.args = {
    label: 'Select input',
    multiple: true,
    options: [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
    ],
    optionRenderer: (option: string) => (
        <Box>
            <Typography variant="subtitle1">
                {option
                    .split(' ')
                    .map((v) => v[0])
                    .join('')}
            </Typography>
            <Typography color="textSecondary">{option}</Typography>
        </Box>
    ),
}

export const StatesExample = (): JSX.Element => {
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
            <Box width={300}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <SelectInput options={options} value={value} onSelect={onSelect} />
                    </Grid>
                    <Grid item>
                        <SelectInput
                            label="Select input"
                            options={options}
                            value={value}
                            onSelect={onSelect}
                        />
                    </Grid>
                    <Grid item>
                        <SelectInput
                            required
                            label="Select input"
                            options={options}
                            value={value}
                            onSelect={onSelect}
                            helperText="Пояснительная надпись под полем"
                        />
                    </Grid>
                    <Grid item>
                        <SelectInput
                            label="Select input"
                            options={options}
                            value={value}
                            onSelect={onSelect}
                            disabled
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
            </Box>
        </ContentBox>
    )
}

export const ModalExample = () => (
    <Dialog open>
        <StatesExample />
    </Dialog>
)
