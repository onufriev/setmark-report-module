import React, { forwardRef } from 'react'
import {
    Menu as MuiMenu,
    MenuProps as MuiMenuProps
} from '@material-ui/core'

export type MenuProps = MuiMenuProps

const Menu = forwardRef<HTMLDivElement, MenuProps>(
    function (props, forwardedRef) {
        return (
            <MuiMenu ref={forwardedRef} data-testid="Menu" elevation={2} {...props} />
        )
    }
)

export default Menu
