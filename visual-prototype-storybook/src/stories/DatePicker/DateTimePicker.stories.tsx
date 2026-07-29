import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import DateTimePicker, { DateTimePickerProps } from './DateTimePicker/DateTimePicker'
import { isWeekend } from 'date-fns'
import { ContentBox } from '../ContentBox'
import { Box } from '../Box'
import { Dialog } from '../Dialog'
import { Stack } from '../Stack'
import { DateValidationError } from './utils'
import { DateTimeInputError } from './DateTimeInput/DateTimeInput'
import { Button } from '../Button'

export default {
    title: 'DatePicker/DateTimePicker',
    component: DateTimePicker,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const UncontrolledTemplate: Story<DateTimePickerProps> = (args) => (
    <ContentBox>
        <Box width="300px">
            <DateTimePicker
                {...args}
            />
        </Box>
    </ContentBox>
)

export const UncontrolledStory = UncontrolledTemplate.bind({})
UncontrolledStory.storyName = 'Uncontrolled'
UncontrolledStory.args = {
    withTime: true,
    withSeconds: true,
    shouldDisableDate: isWeekend,
    disableFuture: true,
}

const actionHandler = action('onChange')
const errorHandler = action('onError')

const ControlledTemplate: Story<DateTimePickerProps> = (args) => {
    const [value, setValue] = useState<Date | null>(null)

    return (
        <ContentBox>
            <Box width="300px">
                <DateTimePicker
                    {...args}
                    value={value}
                    onChange={data => {
                        setValue(data)
                        actionHandler(data)
                    }}
                    nullable
                    initialTimeStrategy="end"
                />
            </Box>
        </ContentBox>
    )
}

export const ControlledStory = ControlledTemplate.bind({})
ControlledStory.storyName = 'Controlled'
ControlledStory.args = {
    withTime: true,
    withSeconds: true,
    shouldDisableDate: isWeekend,
    disableFuture: true,
}

const UncontrolledErrorTemplate: Story<DateTimePickerProps> = (args) => {
    return (
    <ContentBox>
        <Box width="200px">
            <DateTimePicker
                {...args}
                onError={error => errorHandler(error)}
            />
        </Box>
    </ContentBox>
    )
}

export const UncontrolledErrorStory = UncontrolledErrorTemplate.bind({})
UncontrolledErrorStory.storyName = 'UncontrolledError'
UncontrolledErrorStory.args = {
    withTime: true,
    withSeconds: true,
    disablePast: true,
}

const ControlledErrorTemplate: Story<DateTimePickerProps> = (args) => {
    const [error, setError] = useState<DateValidationError | DateTimeInputError | true>(null)

    return (
        <ContentBox>
            <Stack direction="row">
                <Box width="200px" mr={5}>
                    <DateTimePicker
                        {...args}
                        error={error}
                        onError={error => {
                            setError(error)
                            errorHandler(error)
                        }}
                        errorText={error ? `${error}` : ''}
                    />
                </Box>
                <Box maxHeight="38px">
                    <Button
                        onClick={() => setError(null)}
                        variant="outlined"
                    >
                        {'Сброс ошибки'}
                    </Button>
                </Box>
            </Stack>
        </ContentBox>
    )
}

export const ControlledErrorStory = ControlledErrorTemplate.bind({})
ControlledErrorStory.storyName = 'ControlledError'
ControlledErrorStory.args = {
    withTime: true,
    withSeconds: true,
    disablePast: true,
}

export const TimeWithDateStory = ControlledTemplate.bind({})
TimeWithDateStory.storyName = 'TimeWithDate'
TimeWithDateStory.args = {
    withTime: true,
    disableAutoTimeFilling: true,
    shouldDisableDate: isWeekend,
    nullable: true,
    timePartModifyVariant: 'start',
    shouldDisableTime: (time: Date) => time.getHours() > 12,
    clearable: true,
}

export const ModalExample = () => (
    <Dialog open>
        <UncontrolledTemplate />
    </Dialog>
)

export const StatesExample = () => {
    const [value, setValue] = useState<Date | null>()

    return (
        <ContentBox>
            <Stack direction="column" spacing={2} width="300px">
                <DateTimePicker
                    value={value}
                    onChange={setValue}
                />
                <DateTimePicker
                    value={value}
                    onChange={setValue}
                    disabled
                    helperText="disabled"
                />
                <DateTimePicker
                    value={value}
                    onChange={setValue}
                    readOnly
                    helperText="readOnly"
                />
                <DateTimePicker
                    value={value}
                    onChange={setValue}
                    error
                    helperText="With error"
                    // либо
                    // errorText="With error"
                />
            </Stack>
        </ContentBox>
    )
}
