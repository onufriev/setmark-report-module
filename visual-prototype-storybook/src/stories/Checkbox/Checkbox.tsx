import React, { FC } from 'react'
import styled from 'styled-components'
import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps } from '@material-ui/core'
import { FormControlLabel } from '../FormControlLabel'
import { CheckboxClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type CheckboxProps = {
    label?: string
    /** Использовать чистый Checkbox из Material-UI */
    native?: boolean
} & MuiCheckboxProps

const Checkbox: FC<CheckboxProps> = (props): JSX.Element => {
    const { label, native, disabled, classes, ...restProps } = props

    return !native ? (
        <FormControlLabel
            label={label}
            disabled={disabled}
            control={<StyledCheckbox data-testid="Checkbox" classes={mergeClasses(CheckboxClasses, classes)} {...restProps} />}
        />
    ) : (
        <StyledCheckbox data-testid="Checkbox" disabled={disabled} classes={mergeClasses(CheckboxClasses, classes)} {...restProps} />
    )
}

Checkbox.defaultProps = {
    color: 'primary',
}

export default Checkbox

const StyledCheckbox = styled(MuiCheckbox)<CheckboxProps>`
    &.${CheckboxClasses.root} {
        padding: 6px;
    }
`
