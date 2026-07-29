import React from 'react'
import classNames from 'classnames'
import isNil from 'lodash/isNil'
import styled from 'styled-components'
import { MakeStyled } from '../../../typings/utils'
import { useTableRootProps, useTableRootState } from '../hooks'
import { TableData, TableProps, TableRootState } from '../types'
import { TableCell } from './cell/TableCell'

export type TableRowProps<T extends TableData> = React.HTMLAttributes<HTMLDivElement> & {
    row: T,
    rowIndex: number
    inGroup?: boolean
}

export function TableRow<T extends TableData>(props: TableRowProps<T>): JSX.Element {
    const {
        row,
        rowIndex,
        inGroup,
        children,
        ...restProps
    } = props

    const rootProps = useTableRootProps() as TableProps<T>
    const rootState = useTableRootState() as TableRootState<T>

    const {
        getRowId,
        highlightRowOnHover,
        isCellEditable,
        onRowClick,
        onRowDoubleClick,
    } = rootProps

    const {
        visibleColumns,
        columnsSizeState,
    } = rootState

    const rowId = getRowId(row)
    const rowIsEditable = isCellEditable ? isCellEditable({ row }) : true

    const handleClick = () => {
        onRowClick?.({ row })
    }

    const handleDoubleClick = () => {
        onRowDoubleClick?.({ row })
    }

    const isClickable: boolean = !isNil(onRowClick) || !isNil(onRowDoubleClick)

    return (
        <StyledTableRow
            role="row"
            className={classNames(
                'table-row',
                highlightRowOnHover && 'table-row--highlight-row-on-hover',
            )}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            $isClickable={isClickable}
            {...restProps}
        >
            { visibleColumns.map((column, columnIndex) => {
                const columnSize = columnsSizeState[column.field]
                return (
                    <TableCell
                        key={`table-cell-${rowId}-${column.field}`}
                        row={row}
                        rowIndex={rowIndex}
                        column={column}
                        columnIndex={columnIndex}
                        columnSize={columnSize}
                        isEditable={rowIsEditable && column.editable && column.type !== 'actions'}
                        inGroup={inGroup}
                    />
                )
            }) }
        </StyledTableRow>
    )
}

export const StyledTableRow = styled.div<MakeStyled<{ height?: number, isClickable?: boolean }>>`
    display: flex;
    border-bottom: 1px solid ${props => props.theme.palette.divider};

    ${props => !isNil(props.$height) && `
        height: ${props.$height + 1}px;
    `}

    ${props => props.$isClickable && `
        cursor: pointer;
    `}

    &.table-row--highlight-row-on-hover:hover {
        background-color: ${props => props.theme.palette.overlay.hover};
    }

    &:hover {
        .table-cell--visible-on-hover,
        .table-cell-action-item--visible-on-hover {
            visibility: visible;
        }
    }

    .table--overflow-container &:last-child {
        border-bottom: none;
    }
`

export const TableEmptyRow = styled.div.attrs(props => ({
    role: 'empty-row'
}))``
