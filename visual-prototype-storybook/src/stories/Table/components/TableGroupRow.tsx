import React from 'react'
import classNames from 'classnames'
import isNil from 'lodash/isNil'
import styled from 'styled-components'
import { MakeStyled } from '../../../typings/utils'
import { useTableRootProps, useTableRootState } from '../hooks'
import { TableData, TableGroup, TableProps, TableRootState } from '../types'
import { TableGroupRowCell } from './cell/TableGroupRowCell'

export type TableGroupRowProps<T extends TableData> = React.HTMLAttributes<HTMLDivElement> & {
    group: TableGroup<T>,
    groupIndex: number
}

export function TableGroupRow<T extends TableData>(props: TableGroupRowProps<T>): JSX.Element {
    const {
        group,
        groupIndex,
        children,
        ...restProps
    } = props

    const rootProps = useTableRootProps() as TableProps<T>
    const rootState = useTableRootState() as TableRootState<T>

    const {
        highlightRowOnHover,
    } = rootProps

    const {
        visibleColumns,
        columnsSizeState,
    } = rootState

    const rowId = `${group.value}${groupIndex}`

    return (
        <StyledTableGroupRow
            role="row"
            className={classNames(
                'table-row',
                highlightRowOnHover && 'table-row--highlight-row-on-hover'
            )}
            {...restProps}
        >
            { visibleColumns.map((column, columnIndex) => {
                const columnSize = columnsSizeState[column.field]
                return (
                    <TableGroupRowCell
                        key={`table-cell-${rowId}-${column.field}`}
                        group={group}
                        groupIndex={groupIndex}
                        column={column}
                        columnIndex={columnIndex}
                        columnSize={columnSize}
                    />
                )
            }) }
        </StyledTableGroupRow>
    )
}

export const StyledTableGroupRow = styled.div<MakeStyled<{ height?: number }>>`
    display: flex;
    border-bottom: 1px solid ${props => props.theme.palette.divider};

    ${props => !isNil(props.$height) && `
        height: ${props.$height + 1}px;
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
`
