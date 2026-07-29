import React, { FC } from 'react'
import {
    SvgIcon as MuiSvgIcon,
    SvgIconProps as MuiSvgIconProps
} from '@material-ui/core'

export type SvgIconProps = MuiSvgIconProps

const SvgIcon: FC<SvgIconProps> = (props): JSX.Element => (
    <MuiSvgIcon data-testid="SvgIcon" {...props} />
)

export default SvgIcon
