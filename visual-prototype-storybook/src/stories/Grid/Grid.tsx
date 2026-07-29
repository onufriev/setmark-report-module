import React, { FC } from 'react'
import { Grid as MuiGrid, GridProps as MuiGridProps } from '@material-ui/core'

export type GridProps = MuiGridProps

const Grid: FC<GridProps> = (props) => {
    return <MuiGrid {...props} />
}

export default Grid
