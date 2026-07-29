import React, { FC } from 'react'
import styled from 'styled-components'
import {
    InputAdornment as MuiInputAdornment,
    InputAdornmentProps as MuiInputAdornmentProps,
} from '@material-ui/core'
import { InputAdornmentClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type InputAdornmentProps = MuiInputAdornmentProps

const InputAdornment: FC<InputAdornmentProps> = (props): JSX.Element => {
    const { classes, ...restProps } = props
    return <StyledInputAdornment data-testid="InputAdornment" classes={mergeClasses(InputAdornmentClasses, classes)} {...restProps} />
}

export default InputAdornment

const StyledInputAdornment = styled(MuiInputAdornment)<MuiInputAdornmentProps>`
    &.${InputAdornmentClasses.filled}.${InputAdornmentClasses.positionStart}:not(.${InputAdornmentClasses.hiddenLabel}) {
        margin-top: 12px;
    }
`
