import React, { forwardRef } from 'react'
import { InputBase as MuiInputBase, InputBaseProps as MuiInputBaseProps } from '@material-ui/core'
import { InputBaseClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type InputBaseProps = MuiInputBaseProps

const InputBase = forwardRef<HTMLDivElement, InputBaseProps>(
    function (props, forwardedRef) {
        const { classes, ...restProps } = props
        return <MuiInputBase ref={forwardedRef} data-testid="InputBase" classes={mergeClasses(InputBaseClasses, classes)} {...restProps} />
    }
)

// @ts-ignore
InputBase.muiName = MuiInputBase.muiName

export default InputBase
