import React, { forwardRef } from 'react'
import {
    ButtonBase as MuiButtonBase,
    ButtonBaseProps as MuiButtonBaseProps
} from '@material-ui/core'
import { ButtonBaseClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type ButtonBaseProps = MuiButtonBaseProps

const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>(
    function (props, forwardedRef) {
        const { classes, ...restProps } = props
        return (
            <MuiButtonBase ref={forwardedRef} data-testid="ButtonBase" classes={mergeClasses(ButtonBaseClasses, classes)} {...restProps} />
        )
    }
)

export default ButtonBase
