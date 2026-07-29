import React, { FC } from 'react'
import { List as MuiList, ListProps as MuiListProps } from '@material-ui/core'

export type ListProps = MuiListProps

const List: FC<ListProps> = (props): JSX.Element => <MuiList data-testid="List" {...props} />

export default List
