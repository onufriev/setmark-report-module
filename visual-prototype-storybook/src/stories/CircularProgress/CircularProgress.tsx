import React, { FC } from 'react'
import {
    CircularProgress as MuiCircularProgress,
    CircularProgressProps as MuiCircularProgressProps
} from '@material-ui/core'

export type CircularProgressProps = MuiCircularProgressProps

const CircularProgress: FC<CircularProgressProps> = (props): JSX.Element => (
    <MuiCircularProgress data-testid="CircularProgress" {...props} />
)

export default CircularProgress
