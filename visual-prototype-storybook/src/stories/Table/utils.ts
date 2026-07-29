import isNil from 'lodash/isNil'
import { renderTableActionsCell } from './components/cell/TableActionsCell'
import { renderTableDatetimeCell, renderTableEditDatetimeCell } from './components/cell/TableDatetimeCell'
import { renderTableEditStringCell, renderTableStringCell } from './components/cell/TableStringCell'
import {
    ACTIONS_ITEM_SIZE,
    CELL_PAD_LEFT,
    CELL_PAD_RIGHT,
    MIN_COLUMN_WIDTH,
    tableDateComparator,
    TableFixedWidthColumnTypes,
    tableNumberComparator,
    tableStringOrNumberComparator
} from './constants'
import {
    TableProps,
    TableColumnProps,
    TableCellType,
    TableColumnCommonWithActionsProps,
    TableData,
    TableSortDirection,
    TableSortModel,
    TableComparatorFn,
    ExtendedTableCellRenderer,
    TableRenderableRow,
    TableColSizeData,
    TableCellValue,
} from './types'
import { renderTableEditNumberCell, renderTableNumberCell } from './components/cell/TableNumberCell'
import { renderTableCheckboxCell } from './components/cell/TableCheckboxCell'
import { CSSProperties } from 'react'

export interface ColumnsState {
    [field: string]: TableColSizeData
}

export interface ColumnsStateCalcFnResult {
    computed: boolean
    state: ColumnsState
}

export function getColumnsWidth<T extends TableData>(tableProps: TableProps<T>, colDefs: TableColumnProps<T>[], bodyWidth?: number): ColumnsStateCalcFnResult {
    /**
     * типы ширины колонок:
     * 1. фиксированная ширины, утилитарная колока - colsWithFixedWidth
     * 2. пользовательская ширина                  - colsWithWidth
     * 3. без ширины                               - colsWithoutWidth
     */

    let initialFreeSpace = bodyWidth || 0

    const { rows, columnMinWidth } = tableProps

    const colsState: ColumnsStateCalcFnResult = {
        computed: false,
        state: {}
    }

    if (!initialFreeSpace) {
        return colsState
    }

    const colsTotalCount = colDefs.length

    const colsWithFixedWidth = colDefs.filter(col => col.type && TableFixedWidthColumnTypes.includes(col.type))
    const colsWithFixedWidthCount = colsWithFixedWidth.length

    if (colsWithFixedWidthCount > 0) {
        colsWithFixedWidth.forEach(col => {
            colsState.state[col.field] = {
                flex: false,
                width: col.type === 'actions'
                    ? getCellActionsWidth(col as TableColumnCommonWithActionsProps<T>, rows[0])
                    : col.width!,
            }
        })
    }

    colsState.computed = true

    const colsWithFixedWidthSum = Object.keys(colsState.state).reduce((acc, cur) => acc + colsState.state[cur].width, 0)

    const colsWithWidth = colDefs.filter(col =>
        !isNil(col.width) && colsWithFixedWidth.findIndex(colWithFixedWidth => colWithFixedWidth.field === col.field) === -1)
    const colsWithWidthCount = colsWithWidth.length
    const colsWithWidthSum = colsWithWidth.reduce((acc, col) => acc + (col.width as number), 0)

    const colsWithAnyWidth = [...colsWithFixedWidth, ...colsWithWidth]
    const colsWithAnyWidthCount = colsWithAnyWidth.length
    const colsWithAnyWidthMinSum = colsWithAnyWidthCount * columnMinWidth!

    const colsWithoutWidth = colDefs.filter(col => colsWithAnyWidth.findIndex(colWithAnyWidth => colWithAnyWidth.field === col.field) === -1)
    const colsWithoutWidthCount = colsWithoutWidth.length
    const colsWithoutWidthMinSum = colsWithoutWidthCount * columnMinWidth!

    // пользовательские размеры с фиксированными размерами вписываются, остальные >= минимального, спокойно распределяем
    if (initialFreeSpace - colsWithFixedWidthSum - colsWithWidthSum - colsWithoutWidthMinSum >= 0) {
        const freeSpaceOnColumnWithoutWidth = (initialFreeSpace - colsWithFixedWidthSum - colsWithWidthSum) / colsWithoutWidthCount

        colsWithWidth.forEach(col => colsState.state[col.field] = { width: Math.floor(col.width!), flex: false })
        colsWithoutWidth.forEach(col => colsState.state[col.field] = { width: Math.floor(freeSpaceOnColumnWithoutWidth), flex: true })

        return colsState
    }

    // уменьшать свободные колонки уже не можем, будем уменьшать пользовательские до минимального
    if (initialFreeSpace - colsWithFixedWidthSum - colsWithAnyWidthMinSum >= 0) {
        console.debug('CSI UI: total columns width exceeds table width')

        const reductionFactor = (initialFreeSpace - colsWithFixedWidthSum - colsWithoutWidthMinSum) / (colsWithWidthSum)

        colsWithWidth.forEach(col => colsState.state[col.field] = { width: Math.floor(col.width! * reductionFactor), flex: false })
        colsWithoutWidth.forEach(col => colsState.state[col.field] = { width: columnMinWidth!, flex: true })

        return colsState
    }

    // в остальных случаях пространства за вычетом колонок с фиксированной шириной не остаётся, поэтому полагаемся на механизмы flexbox
    console.debug('CSI UI: too little space for the table! Perhaps it is used in inappropriate conditions')

    return colsState
}

function getCellActionsWidth<T extends TableData>(column: TableColumnCommonWithActionsProps<T>, row: T) {
    const options = column.getActions({ row, column })

    const iconButtons = options.filter(option => !option?.props.showInMenu)
    const menuButtons = options.filter(option => option?.props.showInMenu)

    return CELL_PAD_LEFT + CELL_PAD_RIGHT + (iconButtons.length + (menuButtons.length > 0 ? 1 : 0)) * ACTIONS_ITEM_SIZE
}

function numberMap (value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

export function getRowsOnPage<T>(page: number, pageSize: number, rows: T[]): T[] {
    if (isNil(page) || isNil(pageSize)) return rows

    const totalItems = rows.length

    let start = page * pageSize
    let end = start + pageSize

    if (end > totalItems) {
        end = totalItems
    }

    let result = rows.slice(start, end)

    return result
}

export function getTotalPageCount (pageSize: number, total: number) {
    return Math.ceil(total / pageSize)
}

export function getFixedPageIfOutOfRange (page: number, pageSize: number, total: number): number {
    if (total < 1) return 0

    if (page < 0) return 0

    const endPage = Math.floor((total - 1) / pageSize)

    if (page > endPage) return endPage

    return page
}

export function getColumnByField<T extends TableData>(columns: TableColumnProps<T>[], field: string): TableColumnProps<T> {
    return columns.find(column => column.field === field)!
}

export function getCellValue<T extends TableData>(column: TableColumnProps<T>, row: T) {
    if (column.type === 'actions') return null

    return column.type && column.valueGetter?.({
        column,
        row,
        value: row[column.field]
    }) || row[column.field]
}

export function sortIsEnabled (sortModel: TableSortModel) {
    return sortModel.field !== null && sortModel.sort !== null
}

export function getSortComparator<T extends TableData>(colDefs: TableColumnProps<T>[], sortModel: TableSortModel): TableComparatorFn | null {
    if (!sortIsEnabled(sortModel)) {
        return null
    }

    const column = getColumnByField(colDefs, sortModel.field!)

    const comparatorFn = column.sortComparator || getComparator(column.type)

    if (!comparatorFn) {
        return null
    }

    return isDesc(sortModel.sort)
        ? (...args) => -1 * comparatorFn(...args)
        : comparatorFn
}

/**
 * Утилитарная функция для получения универсальной функции сортировки на основе текущей модели сортировки
 *
 * @param comparatorFn функция-компаратор
 * @param sortModel модель сортировки
 * @returns
 */
export function getSortFunction<T extends TableData>(comparatorFn: TableComparatorFn, sortModel: TableSortModel) {
    if (!sortModel.field || !sortModel.sort) {
        return null
    }

    const comparator = isDesc(sortModel.sort)
        ? (...args: [TableCellValue, TableCellValue]) => -1 * comparatorFn(...args)
        : comparatorFn

    return (value1: T, value2: T) => comparator(value1[sortModel.field as keyof T], value2[sortModel.field as keyof T])
}

export function getComparator (columnType?: TableCellType) {
    switch (columnType) {
        case 'number':
            return tableNumberComparator
        case 'string':
            return tableStringOrNumberComparator
        case 'datetime':
            return tableDateComparator
        case 'actions':
        case 'select-checkbox':
            return null
        default:
            return tableStringOrNumberComparator
    }
}

export const isDesc = (direction: TableSortDirection) => direction === 'desc'

export function getCellRenderer<T extends TableData>(columnType?: TableCellType): ExtendedTableCellRenderer<T> | null {
    switch (columnType) {
        case 'number':
            return renderTableNumberCell
        case 'string':
            return renderTableStringCell
        case 'date':
        case 'datetime':
            return renderTableDatetimeCell
        case 'actions':
            return renderTableActionsCell
        case 'select-checkbox':
            return renderTableCheckboxCell
        default:
            return null
    }
}

export function getEditCellRenderer (columnType?: TableCellType) {
    switch (columnType) {
        case 'number':
            return renderTableEditNumberCell
        case 'date':
        case 'datetime':
            return renderTableEditDatetimeCell
        case 'actions':
        case 'select-checkbox':
            return () => null
        case 'string':
        default:
            return renderTableEditStringCell
    }
}

export function getEmptyRowsData (count: number): TableRenderableRow<{}>[] {
    return [...new Array(count)].map(() => ({ isEmpty: true }))
}

export function getColWidthStyle (sizeData?: TableColSizeData): CSSProperties {
    const styles: CSSProperties = {}

    if (sizeData) {
        if (sizeData.flex) {
            styles.flex = `0 1 ${sizeData.width}px`
        } else {
            styles.width = `${sizeData.width}px`
            styles.minWidth = `${sizeData.width}px`
            styles.maxWidth = `${sizeData.width}px`
        }
    }

    return styles
}
