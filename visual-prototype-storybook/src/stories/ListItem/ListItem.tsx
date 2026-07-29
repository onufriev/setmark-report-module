import React, { FC } from 'react'
import { ListItem as MuiListItem, ListItemProps as MuiListItemProps } from '@material-ui/core'

export type ListItemProps = MuiListItemProps

const ListItem: FC<ListItemProps> = (props): JSX.Element => (
    // @ts-ignore
    <MuiListItem data-testid="ListItem" {...props} />
)

export default ListItem
