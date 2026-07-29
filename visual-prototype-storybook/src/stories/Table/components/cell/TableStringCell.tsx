import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import useOnClickOutside from '../../../../utils/useOnClickOutside'
import { InputBase, InputBaseProps } from '../../../InputBase'
import { TableCellUserTypedRendererParams, TableData, TableEditCellRendererParams } from '../../types'

/* view */

export type TableStringCellProps<T extends TableData> = TableCellUserTypedRendererParams<T>

export function TableStringCell<T extends TableData>(props: TableStringCellProps<T>): JSX.Element {
    const {
        value: valueProps,
    } = props

    const value = String(valueProps)

    return (
        <StyledTableStringCell>{ value }</StyledTableStringCell>
    )
}

const StyledTableStringCell = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
`

export const renderTableStringCell = <T extends TableData>(props: TableStringCellProps<T>) => <TableStringCell {...props} />

/* edit */

export type TableEditStringCellProps<T extends TableData> = InputBaseProps & TableEditCellRendererParams<T>

export function TableEditStringCell<T extends TableData>(props: TableEditStringCellProps<T>) {
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
        onEditEnd(error || withoutUpdate ? defaultValue : value)
    }

    return (
        <InputBase
            className="table-edit-cell"
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
            error={error}
        />
    )
}

export const renderTableEditStringCell = <T extends TableData>(props: TableEditStringCellProps<T>) => <TableEditStringCell {...props} />
