import isNumber from 'lodash/isNumber'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import useOnClickOutside from '../../../../utils/useOnClickOutside'
import { InputBase, InputBaseProps } from '../../../InputBase'
import { useTableRootState } from '../../hooks'
import { TableCellUserTypedRendererParams, TableData, TableEditCellRendererParams, TableRootState } from '../../types'

/* view */

export type TableNumberCellProps<T extends TableData> = TableCellUserTypedRendererParams<T>

export function TableNumberCell<T extends TableData>(props: TableNumberCellProps<T>): JSX.Element {
    const {
        value: valueProps,
    } = props

    const { numberFormatter } = useTableRootState() as TableRootState<T>

    const value = valueProps

    const isValid = isNumber(value)

    return (
        <StyledTableCellNumberRenderer>{ isValid ? numberFormatter.format(value) : null }</StyledTableCellNumberRenderer>
    )
}

const StyledTableCellNumberRenderer = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
`

export const renderTableNumberCell = <T extends TableData>(props: TableNumberCellProps<T>) => <TableNumberCell {...props} />

/* edit */

export type TableEditNumberCellProps<T extends TableData> = InputBaseProps & TableEditCellRendererParams<T>

export function TableEditNumberCell<T extends TableData>(props: TableEditNumberCellProps<T>) {
    const {
        row,
        column,
        defaultValue,
        onEditEnd,
        errorFunction,
        onChange,
        value: valueProps,
        ...restProps
    } = props

    const inputRef = useRef<HTMLInputElement>(null)

    useOnClickOutside(inputRef, () => finish())

    const [value, setValue] = useState(defaultValue)

    const error = errorFunction?.(value) ?? false

    const finish = (withoutUpdate?: boolean) => {
        onEditEnd(error || withoutUpdate ? defaultValue : Number(value))
    }

    return (
        <InputBase
            className="table-edit-cell"
            type="number"
            value={value}
            onChange={evt => {
                const val = evt.target.value
                setValue(val)
                onChange?.(evt)
            }}
            onKeyUp={evt => {
                if (evt.key === 'Enter') finish()
                if (['Escape', 'Tab'].includes(evt.key)) finish(true)
            }}
            autoFocus
            fullWidth
            {...restProps}
            ref={inputRef}
        />
    )
}

export const renderTableEditNumberCell = <T extends TableData>(props: TableEditNumberCellProps<T>) => <TableEditNumberCell {...props} />
