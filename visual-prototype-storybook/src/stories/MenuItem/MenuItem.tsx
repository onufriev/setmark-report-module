import React, { forwardRef } from 'react'
import { MenuItem as MuiMenuItem, MenuItemProps as MuiMenuItemProps } from '@material-ui/core'
import { MenuItemClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type MenuItemProps = MuiMenuItemProps

const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(
    function (props, forwardedRef) {
        const { classes, ...restProps } = props
        return (
            // @ts-ignore
            <MuiMenuItem ref={forwardedRef} data-testid="MenuItem" classes={mergeClasses(MenuItemClasses, classes)} {...restProps} />
        )
    }
)

export default MenuItem
