import React, { FC } from 'react'
import {
    ListSubheader as MuiListSubheader,
    ListSubheaderProps as MuiListSubheaderProps
} from '@material-ui/core'

export type ListSubheaderProps = MuiListSubheaderProps

const ListSubheader: FC<ListSubheaderProps> = (props): JSX.Element => (
    <MuiListSubheader data-testid="ListSubheader" {...props} />
)

export default ListSubheader
