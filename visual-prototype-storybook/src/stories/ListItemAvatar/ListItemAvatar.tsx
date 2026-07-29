import React, { FC } from 'react'
import {
    ListItemAvatar as MuiListItemAvatar,
    ListItemAvatarProps as MuiListItemAvatarProps,
} from '@material-ui/core'

export type ListItemAvatarProps = MuiListItemAvatarProps

const ListItemAvatar: FC<ListItemAvatarProps> = (props): JSX.Element => (
    <MuiListItemAvatar data-testid="ListItemAvatar" {...props} />
)

export default ListItemAvatar
