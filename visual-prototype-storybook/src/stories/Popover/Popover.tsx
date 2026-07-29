import React, { FC } from 'react'
import { Popover as MuiPopover, PopoverProps as MuiPopoverProps } from '@material-ui/core'

export type PopoverProps = MuiPopoverProps

const Popover: FC<PopoverProps> = (props): JSX.Element => (
    <MuiPopover data-testid="Popover" {...props} />
)

export default Popover
