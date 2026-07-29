import React, { FC } from 'react'
import { FormGroup as MuiFormGroup, FormGroupProps as MuiFormGroupProps } from '@material-ui/core'

export type FormGroupProps = MuiFormGroupProps

const FormGroup: FC<FormGroupProps> = (props): JSX.Element => (
    <MuiFormGroup data-testid="FormGroup" {...props} />
)

export default FormGroup
