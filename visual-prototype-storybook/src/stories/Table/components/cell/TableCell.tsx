import classNames from 'classnames'
import React, { CSSProperties, useState } from 'react'
import styled from 'styled-components'
import { InputBaseClasses } from '../../../../core/classes'
import { MakeStyled } from '../../../../typings/utils'
import { Tooltip } from '../../../Tooltip'
import {
    DefaultTableColumnProps,
    CELL_PAD_LEFT,
    CELL_PAD_RIGHT,
    ROW_PAD_LEFT,
    ROW_PAD_RIGHT,
    TABLE_CELL_SELECT_CHECKBOX_TYPE
} from '../../constants'
import { useTableRootProps } from '../../hooks'
import { TableCellParams, TableCellRenderer, TableColSizeData, TableData, TableProps } from '../../types'
import { getCellRenderer, getCellValue, getColWidthStyle, getEditCellRenderer } from '../../utils'

export type TableCellProps<T extends TableData> = TableCellParams<T> & {
    rowIndex: number
    columnIndex: number
    columnSize?: TableColSizeData
    isEditable?: boolean
    inGroup?: boolean
}

export function TableCell<T extends TableData>(props: TableCellProps<T>): JSX.Element {
    const {
        column,
        columnIndex,
        row,
        rowIndex,
        columnSize,
        isEditable,
        inGroup,
    } = props

    const {
        field,
        description,
        align = DefaultTableColumnProps.align,
        styles: customStyles = {},
        type,
        visibleOnHover = DefaultTableColumnProps.visibleOnHover,
        renderCell,
        renderEditCell,
        onEditEnd,
        errorFunction,
    } = column

    const rootProps = useTableRootProps() as TableProps<T>

    const {
        groupingField,
        disableGroupingValueHidingInRow,
        components,
        componentsProps,
    } = rootProps

    const [isEditing, setIsEditing] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const cellValue = getCellValue(column, row)

    const renderParams = {
        column,
        row,
    }

    const renderParamsWithValue = {
        ...renderParams,
        value: cellValue
    }

    const editRenderer = renderEditCell || getEditCellRenderer(type)

    let content

    if (groupingField === field && inGroup && !disableGroupingValueHidingInRow) {
        content = null
    } else if (isEditing) {
        content = editRenderer({
            ...renderParams,
            defaultValue: cellValue,
            errorFunction: errorFunction && ((value) => errorFunction({ value, row })),
            onEditEnd: (value) => {
                setIsEditing(false)
                onEditEnd?.({ value, row })
            },
        })
    } else if (renderCell) {
        content = renderCell(renderParamsWithValue)
    } else {
        const renderer = getCellRenderer(type) as TableCellRenderer<T>

        if (renderer) {
            content = renderer(renderParamsWithValue)
        } else {
            content = cellValue?.toString()
        }
    }

    if (description) {
        const { CellDescriptionTooltip } = components!
        const { cellDescriptionTooltip = {} } = componentsProps!

        content = CellDescriptionTooltip ? (
            <CellDescriptionTooltip title={description(renderParams)} {...cellDescriptionTooltip}>
                <StyledTextTooltip>{ content }</StyledTextTooltip>
            </CellDescriptionTooltip> 
        ) : (
            <Tooltip title={description(renderParams)}>
                <StyledTextTooltip>{ content }</StyledTextTooltip>
            </Tooltip>
        )
    }

    const styles = getColWidthStyle(columnSize)

    const handleDoubleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
        if (isEditable) {
            setIsEditing(true)
        }
    }

    const handleKeyUp = (evt: React.KeyboardEvent<HTMLDivElement>) => {
        if (isEditable && isFocused) {
            if (evt.key === 'Enter') {
                setIsEditing(true)
            }
        }
    }

    const handleFocus = () => {
        setIsFocused(true)
    }
    const handleBlur = () => {
        setIsFocused(false)
    }

    return (
        <StyledTableCell
            role="cell"
            className={classNames(
                'table-cell',
                `table-cell--${type}`,
                align === 'left' && 'table-cell--align-left',
                align === 'center' && 'table-cell--align-center',
                align === 'right' && 'table-cell--align-right',
                visibleOnHover && 'table-cell--visible-on-hover',
                isEditable && 'table-cell--editable',
                isEditing && 'table-cell--editing',
            )}
            style={{
                ...customStyles,
                ...styles,
            }}
            tabIndex={isEditable ? 0 : -1}
            onDoubleClick={handleDoubleClick}
            onKeyUp={handleKeyUp}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            { content }
        </StyledTableCell>
    )
}

const StyledTextTooltip = styled.span`
    overflow: hidden;
`

const StyledTableCell = styled.div<MakeStyled<{ width?: number }>>`
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
