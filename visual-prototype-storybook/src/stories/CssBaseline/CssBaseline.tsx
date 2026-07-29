import React, { FC } from 'react'
import {
    CssBaseline as MuiCssBaseline,
    CssBaselineProps as MuiCssBaselineProps,
} from '@material-ui/core'

export type CssBaselineProps = MuiCssBaselineProps

const CssBaseline: FC<CssBaselineProps> = (props): JSX.Element => <MuiCssBaseline {...props} />

export default CssBaseline
