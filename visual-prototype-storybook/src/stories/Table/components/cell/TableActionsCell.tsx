import React from 'react'
import styled from 'styled-components'
import { TableCellActionsRendererParams, TableColumnCommonWithActionsProps, TableData } from '../../types'
import { MoreVert } from '../../../icons'
import { IconButton } from '../../../IconButton'
import { Menu } from '../../../Menu'

export type TableActionsCellProps<T extends TableData> = TableCellActionsRendererParams<T>

export function TableActionsCell<T extends TableData>(props: TableActionsCellProps<T>): JSX.Element {
    const {
        column,
        row,
    } = props

    const { getActions } = column as TableColumnCommonWithActionsProps<T>

    if (typeof getActions !== 'function') throw new Error('CSI UI: Missing the `getActions` property in the `column`')

    const [open, setOpen] = React.useState(false)
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    const options = getActions({
        column,
        row,
    })

    const showMenu = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent> & React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        evt.stopPropagation()
        setOpen(true)
    }

    const hideMenu = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent> & React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        evt.stopPropagation()
        setOpen(false)
    }

    const iconButtons = options.filter(option => !option.props.showInMenu)
    const menuButtons = options.filter(option => option.props.showInMenu)

    return (
        <TableCellActions>
            { iconButtons.map((button, index) =>
                React.cloneElement(button, { key: index }),
            ) }

            { menuButtons.length > 0 && (
                <IconButton
                    ref={buttonRef}
                    size="small"
                    onClick={showMenu}
                >
                    <MoreVert fontSize="small" />
                </IconButton>
            ) }

            { menuButtons.length > 0 && (
                <Menu
                    onClose={hideMenu}
                    onClick={hideMenu}
                    open={open}
                    anchorEl={buttonRef.current}
                >
                    { menuButtons.map((button, index) => React.cloneElement(button, { key: index })) }
                </Menu>
            ) }
        </TableCellActions>
    )
}

const TableCellActions = styled.div`
    display: flex;
    margin-left: auto;
`

export const renderTableActionsCell = <T extends TableData>(props: TableActionsCellProps<T>) => <TableActionsCell {...props} />
