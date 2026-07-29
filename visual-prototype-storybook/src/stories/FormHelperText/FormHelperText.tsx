import React, { FC } from 'react'
import styled from 'styled-components'
import {
    FormHelperText as MuiFormHelperText,
    FormHelperTextProps as MuiFormHelperTextProps,
} from '@material-ui/core'
import { FormHelperTextClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type FormHelperTextProps = Omit<MuiFormHelperTextProps, 'variant' | 'margin'>

const FormHelperText: FC<FormHelperTextProps> = (props): JSX.Element => {
    const { classes, ...restProps } = props
    return <StyledFormHelperText data-testid="FormHelperText" classes={mergeClasses(FormHelperTextClasses, classes)} {...restProps} />
}

export default FormHelperText

const StyledFormHelperText = styled(MuiFormHelperText)<MuiFormHelperTextProps>`
    &.${FormHelperTextClasses.root} {
        margin-top: 4px;
        font-size: ${(props) => props.theme.typography.caption.fontSize}px;
        line-height: ${(props) => props.theme.typography.caption.lineHeight};
    }

    &.${FormHelperTextClasses.contained} {
        margin-left: 12px;
        margin-right: 12px;
    }
`
