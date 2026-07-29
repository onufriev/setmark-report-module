import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import {
    InputLabel as MuiInputLabel,
    InputLabelProps as MuiInputLabelProps,
} from '@material-ui/core'
import { InputLabelClasses, FormControlClasses, InputClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type InputLabelProps = Omit<
    MuiInputLabelProps,
    'variant' | 'margin' | 'disableAnimation'
>

const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
    function (props, forwardedRef) {
        const { children, classes, ...restProps } = props
        return (
            <StyledInputLabel ref={forwardedRef} data-testid="InputLabel" classes={mergeClasses(InputLabelClasses, classes)} {...restProps}>
                { children }
            </StyledInputLabel>
        )
    }
)

// @ts-ignore
InputLabel.muiName = MuiInputLabel.muiName

export default InputLabel

const StyledInputLabel = styled(MuiInputLabel)<MuiInputLabelProps>`
    &.${InputLabelClasses.root} {
        font-size: ${(props) => props.theme.typography.inputText.fontSize}px;
        line-height: 20px;
    }

    ${props => props.theme.palette.type === 'dark' && css`
        &.${InputLabelClasses.root}.${InputLabelClasses.focused} {
            color: rgba(255, 255, 255, .7);
        }
    `}

    &.${InputLabelClasses.filled} {
        transform: translate(12px, 8px) scale(1);

        &.${InputLabelClasses.shrink} {
            transform: translate(12px, 2px) scale(0.75);
        }
    }

    .${FormControlClasses.root}:has(&).${FormControlClasses.root}:has(.${InputClasses.multiline})  &.${InputLabelClasses.filled} {
        transform: translate(12px, 12px) scale(1);

        &.${InputLabelClasses.shrink} {
            transform: translate(12px, 8px) scale(0.75);
        }
    }
`
