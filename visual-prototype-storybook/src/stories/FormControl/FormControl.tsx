import React, { FC } from 'react'
import {
    FormControl as MuiFormControl,
    FormControlProps as MuiFormControlProps,
} from '@material-ui/core'
import { FormControlClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type FormControlProps = MuiFormControlProps

const FormControl: FC<FormControlProps> = (props): JSX.Element => {
    const { classes, ...restProps } = props
    return <MuiFormControl data-testid="FormControl" classes={mergeClasses(FormControlClasses, classes)} {...restProps} />
}

// @ts-ignore
FormControl.muiName = MuiFormControl.muiName

export default FormControl
