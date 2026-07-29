import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import {
    FilledInput as MuiFilledInput,
    FilledInputProps as MuiFilledInputProps,
} from '@material-ui/core'
import { InputClasses, InputLabelClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type InputProps = Omit<MuiFilledInputProps, 'disableUnderline' | 'margin'>

const Input = forwardRef<HTMLDivElement, InputProps>(
    function (props, forwardedRef) {
        const { classes, ...restProps } = props
        return (
            <StyledInput
                ref={forwardedRef}
                data-testid="Input"
                disableUnderline
                classes={mergeClasses(InputClasses, classes)}
                {...restProps}
            />
        )
    }
)

// @ts-ignore
Input.muiName = MuiFilledInput.muiName

export default Input

const StyledInput = styled(MuiFilledInput)<MuiFilledInputProps>`
    &.${InputClasses.root} {
        background-color: ${(props) => props.theme.palette.overlay.type2};
        font-size: ${(props) => props.theme.typography.inputText.fontSize}px;
        line-height: 20px;

        ${props => props.theme.palette.type === 'dark' && css`
            caretColor: #fff;
        `}

        border-radius: ${(props) => props.theme.shape.borderRadius}px;

        &:hover {
            background-color: ${(props) => props.theme.palette.overlay.hover};
        }
        &.${InputClasses.focused} {
            background-color: ${(props) => props.theme.palette.background.paper};
            outline: 1px solid ${(props) => props.theme.palette.primary.main};
        }
        &.${InputClasses.disabled} {
            background-color: ${(props) => props.theme.palette.overlay.type3};
        }
        &.${InputClasses.error} {
            box-shadow: 0 0 0 1px ${props => props.theme.palette.error.main};
        }
    }

    & .${InputClasses.input} {
        padding-top: 8px;
        padding-bottom: 8px;

        height: auto;
    }

    & .${InputClasses.input}:-webkit-autofill {
        border-bottom-left-radius: inherit;
        border-bottom-right-radius: inherit;
    }

    ${props => props.theme.palette.type === 'dark' && css`
        & .${InputClasses.input}:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 100px #266798 inset;
            -webkit-text-fill-color: #fff;
            caretColor: #fff;
        }
    `}

    &.${InputClasses.multiline} {
        padding: 8px 12px;

        .${InputClasses.input} {
            padding: 0;
        }
    }

    .${InputLabelClasses.filled} + & .${InputClasses.input} {
        padding-top: 14px;
        padding-bottom: 2px;
    }

    .${InputLabelClasses.filled} + &.${InputClasses.multiline} {
        padding: 26px 12px 8px;

        .${InputClasses.input} {
            padding: 0;
        }
    }
`
