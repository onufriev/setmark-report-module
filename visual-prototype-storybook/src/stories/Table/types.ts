import React from 'react'
import { UseAutosizerSize } from '../../utils/useResizeObserver'
import { EmptyProps } from '../Empty'
import { FetchLoaderProps } from '../Loader'
import { TableCellActionsItemProps } from './components/cell/TableCellActionsItem'
import { TablePaginationState } from './components/pagination/TablePagination'

export type TableData = {
    [key: string]: any
}

export type TableCellValue = string | number | boolean | Date | null | undefined | object

export type TableApiRef<T extends TableData> = Partial<TableRootState<T>>

export type TableProps<
    T extends TableData,
    RowId extends string | number = any
> = {
    apiRef?: React.MutableRefObject<TableApiRef<T>>

    columns: TableColumnProps<T>[]
    rows: T[]
    getRowId: (row: T) => TableRowId<RowId>
    /**
     * Высота строки заголовка
     * @default 36
     */
    headerHeight?: number
    /**
     * Предустановленные высоты для строк таблицы
     * @values 'small' - 36px, 'medium' - 40px, 'large' - 48px
     * @default 'medium'
     */
    size?: TableSizeTypes
    /** Включает посветку строк при наведении */
    highlightRowOnHover?: boolean
    disableHeader?: boolean
    /**
     * Минимальная ширина колонок с незаданной шириной
     * @default 50
     */
    columnMinWidth?: number

    columnVisibilityModel?: TableColumnVisibilityModel
    onColumnVisibilityModelChange?: (newColumnVisibilityModel: TableColumnVisibilityModel) => void

    pagination?: boolean
    /**
     * Текущая страница
     * @default 0
     */
    defaultPage?: number
    page?: number
    onPageChange?: (newPage: number) => void
    /**
     * Размер страницы
     * @default либо указанный, либо первый элемент pageSizeOptions
     */
    defaultPageSize?: number
    pageSize?: number
    onPageSizeChange?: (newPageSize: number) => void
    /**
     * Массив размеров страниц
     * @default [10, 25, 50]
     */
    pageSizeOptions?: number[]
    onPaginationStateChange?: (newState: TablePaginationState) => void

    selectable?: boolean
    selectionModel?: TableSelectionModel<RowId>
    onSelectionModelChange?: (newSelectionModel: TableSelectionModel<RowId>) => void
    isRowSelectable?: (params: TableRowParams<T>) => boolean
    /**
     * Выключает пагинационное меню управления выборкой.
     * Включено по-умолчанию в режиме работы с пагинацией.
     **/
    disableSelectionAdditionalControls?: boolean

    /** Функция для определения возможности редактировать ячейки в строке */
    isCellEditable?: (params: TableRowParams<T>) => boolean

    defaultSortModel?: TableSortModel
    sortModel?: TableSortModel
    onSortModelChange?: (newSortModel: TableSortModel) => void
    /**
     * Порядок переключения направления сортировки
     * @default ['asc', 'desc', null]
     */
    sortSequence?: TableSortSequence

    /** Включает виртуализацию строк в таблице */
    virtualized?: boolean
    /** Высота строки. Имеет более высокий приоритет, чем преустановленные размеры таблицы в size */
    rowHeight?: number
    /** Функция расчёта высоты строки. Позволяет задать каждой строке разный размер */
    getRowHeight?: (params: TableRowParams<T>) => number
    /** Функция для стилизации строки таблицы */
    getRowStyles?: (params: TableRowParams<T>) => React.CSSProperties | void
    /** Коллбэк на скроллинг тела таблицы */
    onBodyScroll?: ({ scrollTop }: { scrollTop: number }) => void

    /** Высота будет установлена в 100%. Иначе будет считать через resizeObserver */
    fullHeight?: boolean

    /** Функция дозагрузки следующей пачки элементов */
    onLoadRows?: () => void
    /**
     * Индикатор необходимости вызывать функцию загрузки следующей пачки элементов.
     * Если false, то onLoadRows не вызывается, таблица работает в обычном режиме.
     */
    hasMore?: boolean
    /**
     * Порог срабатывания функции дозагрузки в режиме Infinite Scroll
     * @default 200
     **/
    scrollThreshold?: number

    onRowClick?: (params: TableRowParams<T>) => void
    onRowDoubleClick?: (params: TableRowParams<T>) => void

    /** Идентификатор стобца, по которому нужно произвести группировку данных */
    groupingField?: string
    /** Определяет высоту группировочной строки. По-умолчанию значение определяется либо rowHeight, либо size таблицы. */
    getRowGroupHeight?: (params: TableGroupParams<T>) => number
    /** Отключает скрытие группировочного значения в строке */
    disableGroupingValueHidingInRow?: boolean
    /**
     * Минимальное кол-во элементов, совпадающих по `groupingField`, для объединения в группы
     * @default 2
     */
    minElementsInGroup?: number

    /* TODO Рендер-функция для "панели детализации" */
    renderRowDetails?: (params: TableRowParams<T>) => JSX.Element
    /* TODO Фунция получения высоты "панели детализации". По-умолчанию высота равна 500px */
    getRowDetailsHeight?: (params: TableRowParams<T>) => number

    /** Состояние загрузки */
    loading?: boolean
    /** Параметры лоадера */
    LoaderProps?: FetchLoaderProps
    /** Параметры для заглушки. Тут же и передаётся message. */
    EmptyProps?: EmptyProps
    /** Включает рендер пустых строк. Полезно, если поверх таблицы отображается FAB. */
    renderEmptyRows?: boolean
    /**
     * Количество отрисовываемых пустых строк.
     * @default 2
     */
    emptyRowsCount?: number

    /** Заменяемые компоненты */
    components?: TableComponents
    /** Параметры передаваемые в элементы */
    componentsProps?: TableComponentsProps
}

export type TableColumnProps<T extends TableData> = TableColumnCommonProps<T> | TableColumnCommonWithActionsProps<T>

export type TableColumnCommonProps<T extends TableData> = {
    /** Идентификатор столбца */
    field: string
    /** Описание ячейки, отображаемое в Tooltip */
    description?: (params: TableCellParams<T>) => string
    /** Заголовок столбца */
    headerName?: string
    /** Включает многострочный вывод заголовка */
    headerMultiline?: boolean
    /**
     * Рендер-функция отрисовки заголовка.
     * Используется вместо headerName, но не исключает необходимость его задавать,
     * поскольку headerName используется так же для переключателей видимости колонки.
     **/
    renderHeader?: () => React.ReactNode
    /** Описание заголовка, отображаемое в Tooltip */
    headerDescription?: string
    /** Стили корневого элемента заголовка ячейки */
    headerStyles?: React.CSSProperties
    /** Отключает отображение действий с колонкой */
    disableActions?: boolean
    /**
     * Выравнивание столбца
     * @default 'left'
     **/
    align?: TableCellAlignTypes
    /** Отображать при наведении строку */
    visibleOnHover?: boolean
    /**
     * Ширина столбца в px.
     * Таблица старается удержать пользовательскую ширину, жертвуя шириной свободных колонок до 20px.
     * Далее уже пропорционально уменьшает колонки с заданной шириной.
     */
    width?: number
    /** Стили корневого элемента ячейки */
    styles?: React.CSSProperties
    /**
     * Тип ячейки. Влияет на форматирование, редактирование и логику сортировки данных в столбце.
     * Пользователю доступны 'string' | 'number' | 'date' | 'datetime' | 'actions'.
     * @default 'string'
     **/
    type?: TableCellType
    /**
     * Функция для получения отрисовываемого значения. Иначе значением является T[field].
     * Должна возвращать значение того же типа, что и тип ячейки.
     */
    valueGetter?: (params: TableCellParams<T> & { value: any }) => TableCellValue
    /** Рендер-функция содержимого ячейки. Имеет наивысший приоритет. */
    renderCell?: TableCellRenderer<T>

    /**
     * Функция для получения значения, которое будет выведено в ячейке группировочной строки.
     * Должна возвращать значение того же типа, что и тип ячейки.
     */
    valueGroupGetter?: (params: TableGroupRowCellParams<T> & { rows: T[] }) => TableCellValue
    /** Рендер-функция содержимого ячейки в группе. Имеет наивысший приоритет. */
    renderGroupCell?: TableGroupCellRenderer<T>

    /**
     * Проп управляющий возможностью скрывать колонки.
     * Игнорируется, если по этой колонке производится группировка (column.field === groupingField)
     */
    hideable?: boolean

    /** Включает сортировку в столбце */
    sortable?: boolean
    /** Функция сравнения для сортировки */
    sortComparator?: TableComparatorFn

    /** Включает возможность редактировать ячейку */
    editable?: boolean
    /** Рендер-функция для кастомного редактора */
    renderEditCell?: TableEditCellRenderer<T>
    /** Функция валидации для ячейки в режиме редактирования */
    errorFunction?: (params: TableRowParams<T> & { value: TableCellValue }) => boolean
    /**
     * Коллбэк функция срабатывающая по завершению редактирования.
     * Возвращает начальное значение ячейки, если функция валидации возвращает true
     **/
    onEditEnd?: (params: TableRowParams<T> & { value: TableCellValue }) => void
}

export type TableColumnCommonWithActionsProps<T extends TableData> = TableColumnCommonProps<T> & {
    type: 'actions',
    /** Функция получения элементов управления строкой */
    getActions: (params: TableCellParams<T>) => React.ReactElement<TableCellActionsItemProps>[]
}

export type TableRowParams<T extends TableData> = {
    row: T
}

export type TableGroupParams<T extends TableData> = {
    group: TableGroup<T>
}

export type TableCellParams<T extends TableData> = {
    column: TableColumnProps<T>
    row: T
}

export type TableGroupRowCellParams<T extends TableData> = {
    column: TableColumnProps<T>
    group: TableGroup<T>
}

export type TableSortModel = {
    field: string | null
    sort: TableSortDirection
}

export type TableColumnVisibilityModel = {
    [field: string]: boolean
}

export type TableGroupsExpandedModelMap = Map<any, boolean>

export type TableSelectionModel<RowId = TableRowId> = RowId[]

export type TableComponents = {
    HeaderCheckbox?: React.JSXElementConstructor<any>
    CellDescriptionTooltip?: React.JSXElementConstructor<any>
}

export type TableComponentsProps = {
    headerCheckbox?: any
    cellDescriptionTooltip?: any
}

export type TableRowId<RowId = string | number> = RowId
export type TableCellAlignTypes = 'left' | 'center' | 'right'
/**
 * Пользовательскими являются типы:
 * 'string' | 'number' | 'date' | 'datetime' | 'actions'
 *
 * Остальные - внутрянка
 */
export type TableCellType = 'string' | 'number' | 'date' | 'datetime' | 'actions' | 'detail-toggle' | 'select-checkbox'

export type TableSizeTypes = 'small' | 'medium' | 'large'
export type TableSortDirection = 'asc' | 'desc' | null
export type TableSortSequence = TableSortDirection[]

export enum TableRowHeights {
    small = 36,
    medium = 40,
    large = 48,
}

export type TableComparatorFn = (value1: TableCellValue, value2: TableCellValue) => number

export type TableAutoSizerSize = UseAutosizerSize

export type TableCellUserTypedRendererParams<T extends TableData> = { column: TableColumnProps<T>, value: TableCellValue }
export type TableCellUserTypedRenderer<T extends TableData> = (params: TableCellUserTypedRendererParams<T>) => React.ReactNode

export type TableCellActionsRendererParams<T extends TableData> = TableCellParams<T>
export type TableCellActionsRenderer<T extends TableData> = (params: TableCellParams<T>) => React.ReactNode

export type TableCellRenderer<T extends TableData> = (params: TableCellParams<T> & { value: any }) => React.ReactNode

export type ExtendedTableCellRenderer<T extends TableData> = TableCellUserTypedRenderer<T> | TableCellActionsRenderer<T> | TableGroupCellRenderer<T>

export type TableGroupCellRendererParams<T extends TableData> = TableGroupRowCellParams<T> & { rows: T[], value?: TableCellValue }
export type TableGroupCellRenderer<T extends TableData> = (params: TableGroupCellRendererParams<T>) => React.ReactNode

export type TableEditCellRendererBaseParams = {
    defaultValue?: TableCellValue
    onEditEnd: (value: TableCellValue) => void,
    errorFunction?: (value: TableCellValue) => boolean
}

export type TableEditCellRendererParams<T extends TableData> = TableCellParams<T> & TableEditCellRendererBaseParams
export type TableEditCellRenderer<T extends TableData> = (params: TableEditCellRendererParams<T>) => React.ReactNode

export interface TableRootState<T extends TableData> {
    columnVisibility: {
        hasHideable: boolean
        columnVisibilityModel: TableColumnVisibilityModel
        setColumnVisibilityModelValue: (field: string, value: boolean) => void
        showSettings: () => void
    }
    sorting: {
        sortModel: TableSortModel
        setSortModelValue: (field: string, value: TableSortDirection) => void
    },
    visibleColumns: TableColumnProps<T>[]
    numberFormatter: Intl.NumberFormat
    dateFormatter: Intl.DateTimeFormat
    dateTimeFormatter: Intl.DateTimeFormat
    selection: {
        selectionModelMap: Map<TableRowId, T>
        changeRowSelection: (row: T) => void
        changeGroupSelection: (group: TableGroup<T>) => void
    }
    columnsSizeState: {
        [field: string]: TableColSizeData
    }
    renderableRows: TableRenderableRow<T>[]
    grouping: {
        groupsExpandedModelMap: TableGroupsExpandedModelMap | null
        setGroupExpandedValue: (key: TableCellValue, value: boolean) => void
    }
}

export type TableColSizeData = {
    width: number
    flex: boolean
}

export interface TableGroup<T extends TableData> {
    value: TableCellValue
    column: TableColumnProps<T>
    field: string
    rows: T[]
}

export type TableRenderableRow<T extends TableData> = {
    /** Группировочная строка */
    isGroup?: boolean
    /** Данные группы */
    group?: TableGroup<T>
    /** Данные строки */
    row?: T
    /**  */
    isEmpty?: boolean
} & ({
    isGroup: true
    group: TableGroup<T>
} | {
    row: T
    inGroup?: boolean
} | {
    isEmpty: true
})
