import {
    TableCellAlignTypes,
    TableCellType,
    TableCellValue,
    TableColumnCommonProps,
    TableComparatorFn,
    TableRowHeights,
    TableSizeTypes,
    TableSortSequence
} from './types'

import { v4 as uuid } from 'uuid'

export const ROW_PAD_LEFT = 0
export const ROW_PAD_RIGHT = 0
export const CELL_PAD_LEFT = 10
export const CELL_PAD_RIGHT = 10
export const ACTIONS_ITEM_SIZE = 26
export const SELECTABLE_COLUMN_WIDTH = 50
export const MIN_COLUMN_WIDTH = 50

export const TABLE_ROW_HEIGHTS: Record<TableSizeTypes, TableRowHeights> = {
    small: TableRowHeights.small,
    medium: TableRowHeights.medium,
    large: TableRowHeights.large,
}

export const DefaultTableProps = {
    headerHeight: 36,
    size: 'medium' as TableSizeTypes,
    highlightRowOnHover: false,
    columnMinWidth: MIN_COLUMN_WIDTH,
    page: 0,
    pageSizeOptions: [10, 25, 50],
    pagination: false,
    selectable: false,
    disableSelectionAdditionalControls: false,
    virtualized: false,
    sortModel: {
        field: null,
        sort: null
    },
    sortSequence: ['asc', 'desc', null] as TableSortSequence,
    scrollThreshold: 200,
    renderEmptyRows: false,
    emptyRowsCount: 2,
}

export const DefaultTableColumnProps = {
    visibleOnHover: false,
    align: 'left' as TableCellAlignTypes,
    editable: false,
    type: 'string' as TableCellType,
    sortable: false,
}

export const DefaultTablePaginationProps = {
    page: DefaultTableProps.page,
    pageSizeOptions: DefaultTableProps.pageSizeOptions,
}

export const TABLE_CELL_STRING_TYPE = 'string'
export const TABLE_CELL_NUMBER_TYPE = 'number'
export const TABLE_CELL_DATE_TYPE = 'date'
export const TABLE_CELL_DATETIME_TYPE = 'datetime'
export const TABLE_CELL_ACTIONS_TYPE = 'actions'
export const TABLE_CELL_DETAIL_TOGGLE_TYPE = 'detail-toggle'
export const TABLE_CELL_SELECT_CHECKBOX_TYPE = 'select-checkbox'

export const TableFixedWidthColumnTypes = [
    TABLE_CELL_ACTIONS_TYPE,
    TABLE_CELL_DETAIL_TOGGLE_TYPE,
    TABLE_CELL_SELECT_CHECKBOX_TYPE,
]

export const TableUserColumnTypes = [
    TABLE_CELL_STRING_TYPE,
    TABLE_CELL_NUMBER_TYPE,
    TABLE_CELL_DATE_TYPE,
    TABLE_CELL_DATETIME_TYPE
]

const tableNillComparator = (v1: TableCellValue, v2: TableCellValue): number | null => {
    if (v1 == null && v2 != null) {
        return -1
    }
    if (v2 == null && v1 != null) {
        return 1
    }
    if (v1 == null && v2 == null) {
        return 0
    }

    return null
}

export const tableStringOrNumberComparator: TableComparatorFn = (
    value1: TableCellValue,
    value2: TableCellValue,
) => {
    const nillResult = tableNillComparator(value1, value2)
    if (nillResult !== null) {
        return nillResult
    }

    if (typeof value1 === 'string') {
        if (value1 < value2!) return -1
        if (value1 === value2!) return 0
        return 1
    }
    return (value1 as any) - (value2 as any)
}

export const tableNumberComparator: TableComparatorFn = (
    value1: TableCellValue,
    value2: TableCellValue,
) => {
    const nillResult = tableNillComparator(value1, value2)
    if (nillResult !== null) {
        return nillResult
    }

    return Number(value1) - Number(value2)
}

export const tableDateComparator: TableComparatorFn = (
    value1: TableCellValue,
    value2: TableCellValue
) => {
    const nillResult = tableNillComparator(value1, value2)
    if (nillResult !== null) {
        return nillResult
    }

    if (value1! > value2!) {
        return 1
    }
    if (value1! < value2!) {
        return -1
    }
    return 0
}


export const TABLE_SELECTABLE_MODE_COL_DEF: TableColumnCommonProps<any> = {
    field: uuid(),
    type: 'select-checkbox',
    align: 'center',
    width: 50,
}

export const TABLE_DETAIL_PANEL_TOGGLE_COL_DEF: TableColumnCommonProps<any> = {
    field: uuid(),
    type: 'detail-toggle',
    align: 'center',
    width: 50,
}
