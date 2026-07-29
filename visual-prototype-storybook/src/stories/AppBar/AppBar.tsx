import React from 'react'

import { AppBar as MuiAppBar, AppBarProps as MuiAppBarProps } from '@material-ui/core'

export type AppBarProps = Omit<MuiAppBarProps, 'elevation'>

const AppBar = (props: AppBarProps): JSX.Element => {
    return <MuiAppBar elevation={3} {...props} />
}

export default AppBar
