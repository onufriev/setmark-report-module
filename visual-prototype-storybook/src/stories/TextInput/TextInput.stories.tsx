import React, { ComponentProps, useState } from 'react'
import TextInput from './TextInput'
import { Meta, Story } from '@storybook/react'
import { Box } from '../Box'
import { Paper } from '../Paper'
import { InputAdornment } from '../InputAdornment'
import { IconButton } from '../IconButton'
import { DateRange, Edit } from '../icons'
import { ContentBox } from '../ContentBox'
import { Stack } from '../Stack'

export default {
    title: 'Form/TextInput',
    component: TextInput,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof TextInput>> = (args) => (
    <Paper>
        <Box width={300} p={1.5}>
            <TextInput {...args} />
        </Box>
    </Paper>
)

export const Example = Template.bind({})
Example.args = {
    label: 'Label',
}

export const StatesExample = (): JSX.Element => {
    const [value, setValue] = useState('')

    const onValueChange = (value: string) => setValue(value)

    return (
        <ContentBox>
            <Stack spacing={2}>
                <Stack direction="column" spacing={2}>
                    <TextInput
                        value={value}
                        onValueChange={onValueChange}
                        placeholder="Placeholder"
                    />
                    <TextInput
                        label="Text input"
                        value={value}
                        onValueChange={onValueChange}
                        placeholder="Placeholder"
                    />
                    <TextInput
                        required
                        label="Text input"
                        value={value}
                        onValueChange={onValueChange}
                        helperText="Пояснительная надпись под полем"
                    />
                    <TextInput
                        label="Text input"
                        value={value}
                        onValueChange={onValueChange}
                        disabled
                        helperText="disabled"
                    />
                    <TextInput
                        label="Text input"
                        value={value}
                        onValueChange={onValueChange}
                        readOnly
                        helperText="readOnly"
                    />
                    <TextInput
                        label="Text input"
                        value={value}
                        onValueChange={onValueChange}
                        errorText="Error text"
                    />
                </Stack>
                <Stack direction="column" spacing={2}>
                    <TextInput
                        label="Text input"
                        value={value}
                        onValueChange={onValueChange}
                        startAdornment={
                            <InputAdornment position="start">http://www.</InputAdornment>
                        }
                    />
                    <TextInput
                        label="Text input"
                        value={value}
                        onValueChange={onValueChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <DateRange color="action" />
                            </InputAdornment>
                        }
                    />
                    <TextInput
                        label="Text input"
                        value={value}
                        onValueChange={onValueChange}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton>
                                    <Edit />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </Stack>
                <Stack direction="column" spacing={2}>
                    <TextInput
                        value={value}
                        onValueChange={onValueChange}
                        multiline
                        placeholder="Placeholder"
                    />
                    <TextInput
                        label="Textarea input"
                        value={value}
                        onValueChange={onValueChange}
                        multiline
                    />
                    <TextInput
                        label="Textarea input"
                        value={value}
                        onValueChange={onValueChange}
                        multiline
                        minRows={2}
                        maxRows={4}
                        clearable
                        helperText="Минимум 2 строки, максимум 4"
                    />
                </Stack>
            </Stack>
        </ContentBox>
    )
}
