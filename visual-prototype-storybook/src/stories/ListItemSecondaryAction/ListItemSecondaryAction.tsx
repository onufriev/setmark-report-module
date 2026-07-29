import React, { FC } from 'react'
import {
    ListItemSecondaryAction as MuiListItemSecondaryAction,
    ListItemSecondaryActionProps as MuiListItemSecondaryActionProps,
} from '@material-ui/core'

export type ListItemSecondaryActionProps = MuiListItemSecondaryActionProps

const ListItemSecondaryAction: FC<ListItemSecondaryActionProps> = (props): JSX.Element => (
    <MuiListItemSecondaryAction data-testid="ListItemSecondaryAction" {...props} />
)

export default ListItemSecondaryAction
