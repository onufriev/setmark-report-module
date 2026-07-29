import React, { FC, forwardRef } from 'react'
import {
    Button as MuiButton,
    ButtonProps as MuiButtonProps
} from '@material-ui/core'
import styled from 'styled-components'
import { ButtonClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type ButtonProps = MuiButtonProps

const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(
    function (props, forwardedRef) {
        const { classes, ...restProps } = props
        return (
            <StyledButton
                ref={forwardedRef}
                disableElevation
                classes={mergeClasses(ButtonClasses, classes)}
                {...restProps}
            />
        )
    }
)

Button.defaultProps = {
    color: 'primary',
}

export default Button

const StyledButton = styled(MuiButton)<MuiButtonProps>`
    &.${ButtonClasses.root} {
        padding: 8px 8px;

        &.${ButtonClasses.contained} {
            padding: 8px 16px;
        }
    }
`
