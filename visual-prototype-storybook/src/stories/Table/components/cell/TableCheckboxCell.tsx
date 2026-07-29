import React from 'react'
import styled from 'styled-components'
import { CheckboxClasses } from '../../../../core/classes'
import { Checkbox, CheckboxProps } from '../../../Checkbox'
import { TABLE_ROW_HEIGHTS } from '../../constants'
import { useTableRootProps, useTableRootState } from '../../hooks'
import { TableData, TableCellParams, TableProps, TableRootState, TableGroupRowCellParams } from '../../types'

export type TableCheckboxCellProps<T extends TableData> = TableCellParams<T> | TableGroupRowCellParams<T>

export function TableCheckboxCell<T extends TableData>(props: TableCheckboxCellProps<T>) {
    const { row } = props as TableCellParams<T>
    const { group } = props as TableGroupRowCellParams<T>

    const rootProps = useTableRootProps() as TableProps<T>
    const rootState = useTableRootState() as TableRootState<T>

    const {
        getRowId,
        isRowSelectable,
    } = rootProps

    const {
        selection
    } = rootState

    const {
        selectionModelMap,
        changeGroupSelection,
        changeRowSelection,
    } = selection

    let selected = false
    let disabled = false
    let indeterminate = false

    if (row) {
        selected = selectionModelMap ? selectionModelMap.has(getRowId(row)) : false
        disabled = isRowSelectable ? !isRowSelectable({ row }) : false
    }

    if (group) {
        selected = group.rows.some(row => selectionModelMap.has(getRowId(row)))
        indeterminate = selected && !group.rows.every(row => selectionModelMap.has(getRowId(row)))
    }

    const handleChange = () => {
        if (row) {
            changeRowSelection?.(row)
        }

        if (group) {
            changeGroupSelection?.(group)
        }
    }

    return (
        <StyledCheckbox
            native
            checked={selected}
            indeterminate={indeterminate}
            disabled={disabled}
            onClick={(evt: React.MouseEvent) => evt.stopPropagation()}
            onChange={handleChange}
        />
    )
}

export const renderTableCheckboxCell = <T extends TableData>(props: TableCheckboxCellProps<T>) => <TableCheckboxCell {...props} />

const StyledCheckbox = styled(Checkbox)<CheckboxProps>`
    &.${CheckboxClasses.root} {
        padding: ${(TABLE_ROW_HEIGHTS.medium - 24) / 2}px;

        .table--size-small & {
            padding: ${(TABLE_ROW_HEIGHTS.small - 24) / 2}px;
        }
    }
`
