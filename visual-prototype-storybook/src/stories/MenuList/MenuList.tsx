import React, { forwardRef } from 'react'
import { MenuList as MuiMenuList, MenuListProps as MuiMenuListProps } from '@material-ui/core'

export type MenuListProps = MuiMenuListProps

const MenuList = forwardRef<HTMLUListElement, MenuListProps>(
    function (props, forwardedRef) {
        return (
            <MuiMenuList ref={forwardedRef} data-testid="MenuList" disablePadding {...props} />
        )
    }
)

export default MenuList
