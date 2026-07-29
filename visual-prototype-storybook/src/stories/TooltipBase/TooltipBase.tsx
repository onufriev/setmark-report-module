import React from 'react'
import {
    Tooltip as MuiTooltip,
    TooltipProps as MuiTooltipProps,
} from '@material-ui/core'

export type TooltipBaseProps = MuiTooltipProps

const TooltipBase = (props: TooltipBaseProps): JSX.Element => {
    return <MuiTooltip {...props} />
}

export default TooltipBase
