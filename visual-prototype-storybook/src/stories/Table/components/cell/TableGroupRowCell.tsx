import React, { CSSProperties, useState } from 'react'
import classNames from 'classnames'
import styled from 'styled-components'
import { MakeStyled } from '../../../../typings/utils'
import {
    DefaultTableColumnProps,
    CELL_PAD_LEFT,
    CELL_PAD_RIGHT,
    ROW_PAD_LEFT,
    ROW_PAD_RIGHT,
    TABLE_CELL_SELECT_CHECKBOX_TYPE,
    TableUserColumnTypes
} from '../../constants'
import { useTableRootProps, useTableRootState } from '../../hooks'
import { TableGroupRowCellParams, TableData, TableProps, TableRootState, TableCellUserTypedRenderer, TableColSizeData } from '../../types'
import { ExpandMore, ChevronRight } from '../../../icons'
import { IconButton, IconButtonProps } from '../../../IconButton'
import { renderTableCheckboxCell } from './TableCheckboxCell'
import { getCellRenderer, getColWidthStyle } from '../../utils'
import { IconButtonClasses, InputBaseClasses } from '../../../../core/classes'

export type TableGroupRowCellProps<T extends TableData> = TableGroupRowCellParams<T> & {
    groupIndex: number
    columnIndex: number
    columnSize?: TableColSizeData
}

export function TableGroupRowCell<T extends TableData>(props: TableGroupRowCellProps<T>): JSX.Element {
    const {
        column,
        columnIndex,
        group,
        groupIndex,
        columnSize,
    } = props

    const {
        field,
        align = DefaultTableColumnProps.align,
        type,
        visibleOnHover = DefaultTableColumnProps.visibleOnHover,
        valueGroupGetter,
        renderGroupCell,
    } = column

    const rootProps = useTableRootProps() as TableProps<T>
    const rootState = useTableRootState() as TableRootState<T>

    const {
        groupingField,
    } = rootProps

    const {
        groupsExpandedModelMap,
        setGroupExpandedValue,
    } = rootState.grouping

    const [isFocused, setIsFocused] = useState(false)

    const renderParams = {
        column,
        group,
    }

    const renderParamsWithRows = {
        ...renderParams,
        rows: group.rows
    }

    const handleExpandClick = (evt: React.MouseEvent) => {
        evt.stopPropagation()

        setGroupExpandedValue(group.value, !groupsExpandedModelMap?.get(group.value))
    }

    let content = null

    if (field === groupingField) {
        content = (
            <>
                <StyledIconButton
                    size="small"
                    onClick={handleExpandClick}
                >
                    { groupsExpandedModelMap?.get(group.value)
                        ? <ExpandMore fontSize="small" />
                        : <ChevronRight fontSize="small" />
                    }
                </StyledIconButton>
                <span>{ group.value }</span>
            </>
        )
    } else if (type === 'select-checkbox') {
        content = renderTableCheckboxCell(renderParams)
    } else if (renderGroupCell) {
        const params = valueGroupGetter
            ? { ...renderParamsWithRows, value: valueGroupGetter(renderParamsWithRows) }
            : renderParamsWithRows

        content = renderGroupCell(params)
    } else if (type && TableUserColumnTypes.includes(type) && valueGroupGetter) {
        const renderer = getCellRenderer(type) as TableCellUserTypedRenderer<T>

        if (renderer) {
            content = renderer({
                column,
                value: valueGroupGetter(renderParamsWithRows)
            })
        }
    }

    const styles = getColWidthStyle(columnSize)

    const handleFocus = () => {
        setIsFocused(true)
    }
    const handleBlur = () => {
        setIsFocused(false)
    }

    return (
        <StyledTableGroupRowCell
            role="cell"
            className={classNames(
                'table-cell',
                `table-cell--${type}`,
                align === 'left' && 'table-cell--align-left',
                align === 'center' && 'table-cell--align-center',
                align === 'right' && 'table-cell--align-right',
                visibleOnHover && 'table-cell--visible-on-hover',
            )}
            style={styles}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            { content }
        </StyledTableGroupRowCell>
    )
}

const StyledTableGroupRowCell = styled.div<MakeStyled<{ width?: number }>>`
    display: flex;
    align-items: center;
    padding-left: ${CELL_PAD_LEFT}px;
    padding-right: ${CELL_PAD_RIGHT}px;
    color: ${props => props.theme.palette.text.primary};
    flex: 1 1 0%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:first-child {
        padding-left: ${ROW_PAD_LEFT + CELL_PAD_LEFT}px;
    }
    &:last-child {
        padding-right: ${ROW_PAD_RIGHT + CELL_PAD_RIGHT}px;
    }

    &.table-cell--visible-on-hover {
        visibility: hidden;
    }

    &.table-cell--align-left {
        justify-content: flex-start;
    }

    &.table-cell--align-center {
        justify-content: center;
    }

    &.table-cell--align-right {
        justify-content: flex-end;
    }

    &.table-cell--${TABLE_CELL_SELECT_CHECKBOX_TYPE} {
        padding: 0;
    }

    &.table-cell--editable {
        &:focus,
        &:focus-visible {
            outline: 1px solid ${props => props.theme.palette.primary.main};
            outline-offset: -1px;
        }
    }

    &.table-cell--editing {
        padding: 1px;
        box-shadow: ${props => props.theme.shadows[3]};
    }

    .table-edit-cell {
        height: 100%;
        padding-left: ${CELL_PAD_LEFT}px;
        padding-right: ${CELL_PAD_RIGHT}px;

        &.${InputBaseClasses.error} {
            background-color: ${props => props.theme.palette.error.main};
            color: ${props => props.theme.palette.error.contrastText};
        }
    }
`

const StyledIconButton = styled(IconButton)<IconButtonProps>`
    &.${IconButtonClasses.root} {
        margin-right: ${props => props.theme.spacing(1)}px;
    }
    & + span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
`
