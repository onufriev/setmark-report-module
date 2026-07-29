import React, { forwardRef } from 'react'
import {
    Tooltip as MuiTooltip,
    TooltipProps as MuiTooltipProps,
    makeStyles
} from '@material-ui/core'
import { CsiTheme } from '../../typings/Theme'

const useStyles = makeStyles<CsiTheme>((theme) => {
    return {
        tooltip: {
            color: theme.palette.text.primary,
            fontSize: theme.typography.caption.fontSize,
            fontStyle: theme.typography.caption.fontStyle,
            fontWeight: theme.typography.caption.fontWeight,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2]
        },
    }
})

export type TooltipProps = MuiTooltipProps

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
    function (props, forwardedRef) {
        const classes = useStyles()
        return (
            <MuiTooltip
                ref={forwardedRef}
                classes={{
                    tooltip: classes.tooltip,
                }}
                data-testid="Tooltip"
                {...props}
            />
        )
    }
) as React.FC<TooltipProps>

export default Tooltip
