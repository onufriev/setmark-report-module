import React, { FC } from 'react'
import {
    RadioGroup as MuiRadioGroup,
    RadioGroupProps as MuiRadioGroupProps,
} from '@material-ui/core'

export type RadioGroupProps = MuiRadioGroupProps

const RadioGroup: FC<RadioGroupProps> = (props): JSX.Element => (
    <MuiRadioGroup data-testid="RadioGroup" {...props} />
)

export default RadioGroup
