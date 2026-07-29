import React, { FC } from 'react'
import { FormLabel as MuiFormLabel, FormLabelProps as MuiFormLabelProps } from '@material-ui/core'

export type FormLabelProps = MuiFormLabelProps

const FormLabel: FC<FormLabelProps> = (props): JSX.Element => (
    <MuiFormLabel data-testid="FormLabel" {...props} />
)

export default FormLabel
