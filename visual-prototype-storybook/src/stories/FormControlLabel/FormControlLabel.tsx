import React, { FC } from 'react'
import styled from 'styled-components'
import {
    FormControlLabel as MuiFormControlLabel,
    FormControlLabelProps as MuiFormControlLabelProps,
} from '@material-ui/core'
import { FormControlLabelClasses, SwitchClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type FormControlLabelProps = MuiFormControlLabelProps

const FormControlLabel: FC<FormControlLabelProps> = (props): JSX.Element => {
    const { classes, ...restProps } = props
    return <StyledFormControlLabel data-testid="FormControlLabel" classes={mergeClasses(FormControlLabelClasses, classes)} {...restProps} />
}

// @ts-ignore
FormControlLabel.muiName = MuiFormControlLabel.muiName

export default FormControlLabel

const StyledFormControlLabel = styled(MuiFormControlLabel)<MuiFormControlLabelProps>`
    &.${FormControlLabelClasses.root} {
        align-items: flex-start;

        margin-left: 0; // -11px
        margin-right: 0; // 16px

        .${FormControlLabelClasses.label} {
            margin-top: 8px;
        }

        .${SwitchClasses.sizeSmall} + .${FormControlLabelClasses.label} {
            margin-top: 2px;
        }
    }
`
