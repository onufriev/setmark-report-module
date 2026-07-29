import React from 'react'
import classNames from 'classnames'
import styled from 'styled-components'
import { IconButton, IconButtonProps } from '../../../IconButton'
import { ListItemIcon } from '../../../ListItemIcon'
import { MenuItem, MenuItemProps } from '../../../MenuItem'

export type TableCellActionsItemProps = {
    label: string
    icon?: React.ReactElement
} & (
    | ({ showInMenu?: false; icon: React.ReactElement, visibleOnHover?: boolean } & IconButtonProps)
    | ({ showInMenu: true } & MenuItemProps)
)

const TableCellActionsItem = (props: TableCellActionsItemProps) => {
    // @ts-ignore
    const { label, icon, showInMenu, onClick, visibleOnHover, ...restProps } = props

    const handleClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent> & React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        if (onClick) {
            evt.stopPropagation()
            onClick(evt)
        }
    }

    if (!showInMenu) {
        return (
            <StyledIconButton
                className={classNames(
                    'table-cell-action-item',
                    visibleOnHover && 'table-cell-action-item--visible-on-hover'
                )}
                size="small"
                aria-label={label}
                {...(restProps as any)}
                onClick={handleClick}
            >
                { React.cloneElement(icon!, { fontSize: 'small' }) }
            </StyledIconButton>
        )
    }

    return (
        <MenuItem
            {...(restProps as any)}
            onClick={onClick}
        >
            { icon && <ListItemIcon>{icon}</ListItemIcon> }
            { label }
        </MenuItem>
    )
}

const StyledIconButton = styled(IconButton)<IconButtonProps>`
    &.table-cell-action-item--visible-on-hover {
        visibility: hidden;
    }
`

export default TableCellActionsItem
