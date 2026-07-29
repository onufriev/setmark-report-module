import React, { useRef, useState } from 'react'
import isDate from 'lodash/isDate'
import isNumber from 'lodash/isNumber'
import styled from 'styled-components'
import useOnClickOutside from '../../../../utils/useOnClickOutside'
import { useTableRootState } from '../../hooks'
import { TableCellUserTypedRendererParams, TableData, TableEditCellRendererParams, TableRootState } from '../../types'
import { InputBase, InputBaseProps } from '../../../InputBase'

/* view */

export type TableDatetimeCellProps<T extends TableData> = TableCellUserTypedRendererParams<T>

export function TableDatetimeCell<T extends TableData>(props: TableDatetimeCellProps<T>): JSX.Element {
    const {
        column,
        value: valueProps,
    } = props

    const {
        dateFormatter,
        dateTimeFormatter,
    } = useTableRootState() as TableRootState<T>

    const value = valueProps as unknown as number | Date | null

    const isValid = isNumber(value) || isDate(value) || value === null

    return (
        <StyledTableDatetimeCell>
            { value && isValid ? (column?.type === 'datetime' ? dateTimeFormatter : dateFormatter).format(value) : null }
        </StyledTableDatetimeCell>
    )
}

const StyledTableDatetimeCell = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
`

export const renderTableDatetimeCell = <T extends TableData>(props: TableDatetimeCellProps<T>) => <TableDatetimeCell {...props} />

/* edit */

export type TableEditDatetimeCellProps<T extends TableData> = InputBaseProps & TableEditCellRendererParams<T>

export function TableEditDatetimeCell<T extends TableData>(props: TableEditDatetimeCellProps<T>) {
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

    const type = column.type === 'datetime' ? 'datetime-local' : 'date'

    const inputRef = useRef(null)

    useOnClickOutside(inputRef, () => finish())

    // TODO инициализация и управление значением

    // @ts-ignore
    const [value, setValue] = useState((defaultValue || valueProps as Date).toISOString())

    const error = errorFunction?.(value) ?? false

    const finish = (withoutUpdate?: boolean) => {
        onEditEnd(error || withoutUpdate ? defaultValue : value)
    }

    return (
        <InputBase
            className="table-edit-cell"
            type={type}
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

export const renderTableEditDatetimeCell = <T extends TableData>(props: TableEditDatetimeCellProps<T>) => <TableEditDatetimeCell {...props} />
