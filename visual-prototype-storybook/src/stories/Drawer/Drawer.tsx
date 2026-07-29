import React, { FC } from 'react'
import { Drawer as MuiDrawer, DrawerProps as MuiDrawerProps } from '@material-ui/core'

export type DrawerProps = MuiDrawerProps

const Drawer: FC<DrawerProps> = (props): JSX.Element => (
    <MuiDrawer data-testid="Drawer" elevation={2} {...props} />
)

export default Drawer
