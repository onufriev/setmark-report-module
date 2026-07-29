import React, { FC } from 'react'
import {
    ListItemIcon as MuiListItemIcon,
    ListItemIconProps as MuiListItemIconProps,
} from '@material-ui/core'

export type ListItemIconProps = MuiListItemIconProps

const ListItemIcon: FC<ListItemIconProps> = (props): JSX.Element => (
    <MuiListItemIcon data-testid="ListItemIcon" {...props} />
)

export default ListItemIcon
