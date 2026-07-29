import React, { useEffect, useRef, useState, useMemo, useImperativeHandle } from 'react'
import {
    TableProps,
    TableAutoSizerSize,
    TableSortModel,
    TableSortDirection,
    TableRowId,
    TableData,
    TableColumnVisibilityModel,
    TableRootState,
    TableColumnProps,
    TableCellValue,
    TableGroup,
    TableRenderableRow,
    TableGroupsExpandedModelMap
} from './types'
import { getCellValue, getColumnByField, getColumnsWidth, getEmptyRowsData, getFixedPageIfOutOfRange, getRowsOnPage, getSortComparator } from './utils'
import { DefaultTableProps, TABLE_ROW_HEIGHTS, TABLE_SELECTABLE_MODE_COL_DEF } from './constants'
import { TableContextProvider } from './contexts'
import { TableHeaderCell } from './components/header/TableHeaderCell'
import { TableEmptyRow, TableRow } from './components/TableRow'
import { TableBodyContainer } from './components/TableBodyContainer'
import { TableHeader } from './components/TableHeader'
import { TableContainer } from './components/TableContainer'
import { TableBody } from './components/TableBody'
import { SelectionVariant, TableHeaderCheckboxCell } from './components/header/TableHeaderCheckboxCell'
import debounce from 'lodash/debounce'
import isNil from 'lodash/isNil'
import { TableFooter } from './components/TableFooter'
import classNames from 'classnames'
import TablePagination from './components/pagination/TablePagination'
import { VariableSizeList } from 'react-window'
import { TableSettingsSwitchItem } from './components/TableSettings'
import { useLocale } from '../LocaleProvider'
import { TableGroupRow } from './components/TableGroupRow'
import { Popover } from '../Popover'
import { Switch } from '../Switch'
import { Box } from '../Box'
import { Button } from '../Button'
import { Spacer } from '../Spacer'
import useResizeObserver from '../../utils/useResizeObserver'
import { Empty } from '../Empty'
import { FetchLoader } from '../Loader'
import useControlled from '../../utils/useControlled'

const Table = function <T extends TableData, RowId extends string | number = any>(props: React.HTMLAttributes<HTMLDivElement> & TableProps<T, RowId>) {
    const {
        // важно вытащить все TableProps, чтобы restProps содержал только атрибуты корневого элемента
        apiRef,

        columns,
        rows,
        getRowId,

        headerHeight = DefaultTableProps.headerHeight,
        size: sizeProps = DefaultTableProps.size,
        highlightRowOnHover = DefaultTableProps.highlightRowOnHover,
        disableHeader,
        columnMinWidth = DefaultTableProps.columnMinWidth,

        columnVisibilityModel: columnVisibilityModelProp,
        onColumnVisibilityModelChange,

        pagination = DefaultTableProps.pagination,
        page: pageProp,
        defaultPage = DefaultTableProps.page,
        onPageChange,
        pageSize: pageSizeProp,
        defaultPageSize = props.defaultPageSize || props.pageSize || props.pageSizeOptions?.[0] || DefaultTableProps.pageSizeOptions[0],
        onPageSizeChange,
        pageSizeOptions = DefaultTableProps.pageSizeOptions,
        onPaginationStateChange,

        selectable = DefaultTableProps.selectable,
        selectionModel: selectionModelProp,
        onSelectionModelChange,
        isRowSelectable,
        disableSelectionAdditionalControls = DefaultTableProps.disableSelectionAdditionalControls,

        isCellEditable,

        sortModel: sortModelProp,
        defaultSortModel = DefaultTableProps.sortModel,
        onSortModelChange,
        sortSequence = DefaultTableProps.sortSequence,

        virtualized = DefaultTableProps.virtualized,
        rowHeight = TABLE_ROW_HEIGHTS[sizeProps],
        getRowHeight,

        onBodyScroll,

        onLoadRows,
        hasMore,
        scrollThreshold = DefaultTableProps.scrollThreshold,

        onRowClick,
        onRowDoubleClick,

        groupingField,
        getRowGroupHeight,
        disableGroupingValueHidingInRow,
        minElementsInGroup = 2,

        renderRowDetails,
        getRowDetailsHeight,

        loading,
        LoaderProps,
        EmptyProps,
        renderEmptyRows = DefaultTableProps.renderEmptyRows,
        emptyRowsCount = DefaultTableProps.emptyRowsCount,

        getRowStyles,
        fullHeight,

        components = {},
        componentsProps = {},

        id,
        ...restProps
    } = props

    const rootProps: TableProps<T> = {
        columns, rows, getRowId,
        headerHeight, size: sizeProps, highlightRowOnHover, disableHeader, columnMinWidth,
        columnVisibilityModel: columnVisibilityModelProp, onColumnVisibilityModelChange,
        pagination, page: pageProp, defaultPage, onPageChange, pageSize: pageSizeProp, defaultPageSize, onPageSizeChange, pageSizeOptions, onPaginationStateChange,
        selectable, selectionModel: selectionModelProp, onSelectionModelChange, isRowSelectable, disableSelectionAdditionalControls,
        isCellEditable,
        sortModel: sortModelProp, defaultSortModel, onSortModelChange, sortSequence,
        virtualized, rowHeight, getRowHeight, getRowStyles, fullHeight,
        onBodyScroll,
        onLoadRows, hasMore, scrollThreshold,
        onRowClick, onRowDoubleClick,
        groupingField, getRowGroupHeight, disableGroupingValueHidingInRow,
        renderRowDetails, getRowDetailsHeight,
        loading, LoaderProps, EmptyProps, renderEmptyRows, emptyRowsCount,
        components, componentsProps,
    }

    if (!columns || !rows || !getRowId) {
        return null
    }

    const isEmpty = rows.length === 0

    /* Локализованные сообщения */
    const { locale, t } = useLocale()

    /* --- Инициализация --- */

    const prepareColumns = (columns: TableColumnProps<T>[]) => {
        const colDefs = [...columns]
        if (selectable) {
            colDefs.unshift({
                ...TABLE_SELECTABLE_MODE_COL_DEF
            })
        }
        return colDefs
    }

    const bodyContainerRef = useRef<HTMLDivElement>(null)
    const bodyRef = useRef<HTMLDivElement | null>(null)
    const virtualizedRef = useRef<any>(null)

    const [colDefs, setColDefs] = useState<Array<TableColumnProps<T>>>(prepareColumns(columns))

    useEffect(() => {
        setColDefs(prepareColumns(columns))
    }, [columns, selectable])

    /* Инструменты локализации */
    const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale])
    const dateFormatter = useMemo(() => new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }), [locale])
    const dateTimeFormatter = useMemo(() => new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    }), [locale])

    /* Инициализация размеров */
    const [bodySize, setBodySize] = useState({ height: 0, width: 0 })
    const [bodyContainerSize, setBodyContainerSize] = useState<TableAutoSizerSize>({ height: 0, width: 0 })
    const [scrollOffset, setScrollOffset] = useState<number>(0)

    const calcTableDimentions = () => {
        if (bodyRef.current) {
            const newSize = {
                height: bodyRef.current.clientHeight,
                width: bodyRef.current.clientWidth,
            }

            setBodySize(newSize)

            const newScrollOffset = bodyRef.current.offsetWidth - bodyRef.current.clientWidth

            setScrollOffset(newScrollOffset)
        }
    }

    const onResizeRef = useRef(debounce((size: TableAutoSizerSize) => {
        setBodyContainerSize(size)
        calcTableDimentions()
        checkNeedToLoadRows()
    }, 300))

    useResizeObserver({ ref: bodyContainerRef, onResize: onResizeRef.current })

    /* Колонки */
    const [columnVisibilityModel, setColumnVisibilityModel] = useState<TableColumnVisibilityModel>(() => {
        return colDefs.reduce<TableColumnVisibilityModel>((acc, cur) => {
            if (cur.hideable && cur.field !== groupingField) {
                acc[cur.field] = columnVisibilityModelProp?.[cur.field] ?? true
            }
            return acc
        }, {})
    })

    useEffect(() => {
        const newColumnVisibilityModel = colDefs.reduce<TableColumnVisibilityModel>((acc, cur) => {
            if (cur.hideable && cur.field !== groupingField) {
                acc[cur.field] = columnVisibilityModelProp?.[cur.field] ?? (columnVisibilityModel[cur.field] || true)
            }
            return acc
        }, {})

        setColumnVisibilityModel(newColumnVisibilityModel)
    }, [colDefs])

    useEffect(() => {
        if (columnVisibilityModelProp) {
            setColumnVisibilityModel(Object.keys(columnVisibilityModel).reduce((acc, field) => {
                acc[field] = columnVisibilityModelProp[field] ?? columnVisibilityModel[field]
                return acc
            }, {} as TableColumnVisibilityModel))
        }
    }, [columnVisibilityModelProp])

    const visibleColumns = useMemo(() => {
        return colDefs.filter(column => columnVisibilityModel[column.field] ?? true)
    }, [colDefs, columnVisibilityModel])

    const [openColumnVisibilitySettings, setOpenColumnVisibilitySettings] = useState(false)

    /* Выбор */
    const [selectionModelMap, setSelectionModelMap] = useState<Map<TableRowId<RowId>, T>>(new Map())

    // useEffect(() => {
    //     onSelectionModelChange?.(Array.from(selectionModelMap.keys()))
    // }, [selectionModelMap])

    useEffect(() => {
        if (selectionModelProp) {
            const addedIds = selectionModelProp.filter(outTableRowId => !selectionModelMap.has(outTableRowId))
            const removedIds = [...selectionModelMap.keys()].filter(inTableRowId => !selectionModelProp.includes(inTableRowId))

            if (addedIds.length || removedIds.length) {
                addedIds.forEach(addedId => {
                    const row = rows.find(row => getRowId(row) === addedId)
                    if (row) selectionModelMap.set(getRowId(row), row)
                    else console.warn('CSI UI: selectionModel has invalid row id!')
                })

                removedIds.forEach(removedId => {
                    selectionModelMap.delete(removedId)
                })

                updateSelectionModelMap(true)
            }
        }
    }, [selectionModelProp])

    const updateSelectionModelMap = (noEmit: boolean = false) => {
        setSelectionModelMap(new Map(selectionModelMap))
        if (!noEmit) onSelectionModelChange?.(Array.from(selectionModelMap.keys()))
    }

    /* Сортировка */
    const [sortModel, setSortModel] = useControlled<TableSortModel>({
        controlled: sortModelProp,
        default: defaultSortModel,
    })

    /* Пагинация */
    const [page, setPage] = useControlled<number>({
        controlled: pageProp,
        default: defaultPage,
    })

    const [pageSize, setPageSize] = useControlled<number>({
        controlled: pageSizeProp,
        default: defaultPageSize,
    })

    /* --- Логика --- */

    const selectedAll = selectionModelMap.size === rows.length
    const selectedEmpty = selectionModelMap.size === 0
    const selectedPartial = !selectedAll && !selectedEmpty

    /* Выбор */
    const onHeaderCheckboxSelect = (selected?: SelectionVariant) => {
        if (selected) {
            if (selected === 'all') {
                rows.forEach(row => {
                    selectionModelMap.set(getRowId(row), row)
                })
            }
            if (selected === 'perPage') {
                computedRows.filter(rowData => !rowData.isGroup).forEach(rowData => {
                    selectionModelMap.set(getRowId(rowData.row!), rowData.row!)
                })
            }
            if (selected === 'none') {
                selectionModelMap.clear()
            }
        } else {
            if (selectedAll) {
                selectionModelMap.clear()
            } else {
                rows.forEach(row => {
                    selectionModelMap.set(getRowId(row), row)
                })
            }
        }

        updateSelectionModelMap()
    }

    const changeRowSelection = (row: T) => {
        const rowId = getRowId(row)

        if (selectionModelMap.has(rowId)) {
            selectionModelMap.delete(rowId)
        } else {
            selectionModelMap.set(rowId, row)

        }

        updateSelectionModelMap()
    }

    const changeGroupSelection = (group: TableGroup<T>) => {
        if (group.rows.every(row => selectionModelMap.has(getRowId(row)))) {
            group.rows.forEach(row => {
                selectionModelMap.delete(getRowId(row))
            })
        } else {
            group.rows.forEach(row => {
                selectionModelMap.set(getRowId(row), row)
            })
        }

        updateSelectionModelMap()
    }

    /* --- Обработка строк --- */

    /* Сортировка строк */
    const sortedRows = useMemo(() => {
        const sortingComparator = getSortComparator(colDefs, sortModel)

        if (!sortingComparator) {
            return rows
        }

        const tempRows = rows.slice()

        const column = getColumnByField(colDefs, sortModel.field!)

        tempRows.sort((row1, row2) => sortingComparator(getCellValue(column, row1), getCellValue(column, row2)))

        return tempRows
    }, [colDefs, sortModel, rows])

    const gropingEnabled = groupingField && columns.some(column => column.field === groupingField)

    /* Группировка */
    const groupsMap = useMemo(() => {
        if (gropingEnabled) {
            return rows.reduce<Map<TableCellValue, T[]>>((acc, cur) => {
                const rowValue = cur[groupingField]
                if (!acc.has(rowValue)) {
                    acc.set(rowValue, [])
                }
                acc.set(rowValue, acc.get(rowValue)!.concat([cur]))
                return acc
            }, new Map())
        }

        return null
    }, [groupingField, rows])

    const [groupsExpandedModelMap, setGroupsExpandedModelMap] = useState<TableGroupsExpandedModelMap | null>(() => {
        if (!groupsMap) {
            return null
        }

        return Array.from(groupsMap.keys()).reduce<TableGroupsExpandedModelMap>((acc, cur) => {
            acc.set(cur, false)
            return acc
        }, new Map())
    })

    useEffect(() => {
        if (!groupsMap) {
            setGroupsExpandedModelMap(null)
            return
        }

        setGroupsExpandedModelMap(Array.from(groupsMap.keys()).reduce<TableGroupsExpandedModelMap>((acc, cur) => {
            acc.set(cur, false)
            return acc
        }, new Map()))
    }, [groupsMap])

    const setGroupExpandedValue = (key: TableCellValue, value: boolean) => {
        if (!groupsExpandedModelMap) {
            return
        }

        const newGroupsExpandedModel = new Map(groupsExpandedModelMap)

        newGroupsExpandedModel.set(key, value)

        setGroupsExpandedModelMap(newGroupsExpandedModel)
    }

    /* Сортировка групп */
    const sortedGroups = useMemo<TableGroup<T>[]>(() => {
        if (!groupsMap) {
            return []
        }

        const groupColumn = getColumnByField(colDefs, groupingField!)

        const groupsArray: TableGroup<T>[] = Array.from(groupsMap.entries()).map(([key, value]) => {
            return {
                value: key,
                column: groupColumn,
                field: groupColumn.field,
                rows: value.slice(),
                expanded: true,
            }
        })

        const sortingComparator = getSortComparator(colDefs, sortModel)

        if (sortingComparator) {
            const sortColumn = getColumnByField(colDefs, sortModel.field!)

            if (groupingField === sortModel.field) {
                groupsArray.sort((group1, group2) => sortingComparator(group1.value, group2.value))
            } else {
                groupsArray.forEach(group => {
                    group.rows.sort((row1, row2) => sortingComparator(getCellValue(sortColumn, row1), getCellValue(sortColumn, row2)))
                })
            }
        }

        return groupsArray
    }, [groupsMap, colDefs, sortModel])

    const renderableRows: TableRenderableRow<T>[] = useMemo(() => {
        const renderable = gropingEnabled
            ? sortedGroups.reduce((acc, curGroup) => {
                if (curGroup.rows.length < minElementsInGroup) {
                    return [
                        ...acc,
                        ...curGroup.rows.map(row => ({ row })),
                    ]
                }

                return [
                    ...acc,
                    { isGroup: true, group: curGroup },
                    ...( groupsExpandedModelMap?.get(curGroup.value) ? curGroup.rows.map(row => ({ inGroup: true, row })) : [] ),
                ]
            }, [] as any)
            : sortedRows.map(row => ({ row }))

        if (!pagination && renderEmptyRows) {
            renderable.push(...getEmptyRowsData(emptyRowsCount))
        }

        return renderable
    }, [
        gropingEnabled,
        sortedGroups,
        groupsExpandedModelMap,
        pagination,
        renderEmptyRows,
        emptyRowsCount,
    ])

    useEffect(() => {
        if (pagination) {
            const newPage = getFixedPageIfOutOfRange(page, pageSize, renderableRows.length)
            if (page !== newPage) {
                setPage(newPage)
                onPageChange?.(newPage)
                onPaginationStateChange?.({
                    page: newPage,
                    pageSize
                })
            }
        }
    }, [renderableRows.length])

    /* Пересчёт размеров */
    useEffect(() => {
        calcTableDimentions()
    }, [page, pageSize, selectable, virtualized, renderableRows.length])

    let computedRows = renderableRows

    /* Пагинация строк */
    if (pagination) {
        computedRows = getRowsOnPage(page, pageSize, computedRows)
    }

    const setColumnVisibilityModelValue = (field: string, value: boolean) => {
        const newColumnVisibilityModel = {
            ...columnVisibilityModel,
            [field]: value
        }
        setColumnVisibilityModel(newColumnVisibilityModel)
        onColumnVisibilityModelChange?.(newColumnVisibilityModel)
    }

    const showAllColumns = () => {
        const newColumnVisibilityModel = Object.keys(columnVisibilityModel).reduce<TableColumnVisibilityModel>((acc, field) => {
            acc[field] = true
            return acc
        }, {})
        setColumnVisibilityModel(newColumnVisibilityModel)
        onColumnVisibilityModelChange?.(newColumnVisibilityModel)
    }

    const hideAllColumns = () => {
        const newColumnVisibilityModel = Object.keys(columnVisibilityModel).reduce<TableColumnVisibilityModel>((acc, field) => {
            acc[field] = false
            return acc
        }, {})
        setColumnVisibilityModel(newColumnVisibilityModel)
        onColumnVisibilityModelChange?.(newColumnVisibilityModel)
    }

    const setSortModelValue = (field: string, value: TableSortDirection) => {
        const newSortModel = {
            field,
            sort: value
        }
        setSortModel(newSortModel)
        onSortModelChange?.(newSortModel)
    }

    const {
        computed: columnsSizeComputed,
        state: columnsSizeState
    } = useMemo(() => {
        return getColumnsWidth<T>(rootProps, visibleColumns, bodySize.width)
    }, [
        rows.length,
        visibleColumns,
        bodySize.width
    ])

    /* infinite scroll */
    const scrollTopRef = useRef<number>(0)
    const needRestoreScrollRef = useRef<boolean>(false)

    useEffect(() => {
        if (needRestoreScrollRef.current) restoreScroll()
    }, [rows.length])

    const restoreScroll = () => {
        if (scrollTopRef.current > 0 && bodyRef.current) {
            if (virtualized) {
                virtualizedRef.current.scrollTo(scrollTopRef.current)
            } else {
                bodyRef.current.scrollTop = scrollTopRef.current
            }
        }
        needRestoreScrollRef.current = false
        // дополнительная проверка на заполненность контейнера
        checkNeedToLoadRows(true)
    }

    const checkNeedToLoadRows = (force?: boolean) => {
        if (!bodyRef.current) return

        const newScrollTop = bodyRef.current.scrollTop

        if (onBodyScroll) {
            // выполняем коллбэк в следующем тике, чтобы отработать обработчик до конца
            setTimeout(() => onBodyScroll({ scrollTop: newScrollTop }), 0)
        }

        if (!onLoadRows || !hasMore) return

        scrollTopRef.current = newScrollTop

        if (needRestoreScrollRef.current && !force) return

        const clientHeight = bodyRef.current.clientHeight
        const scrollHeight = bodyRef.current.scrollHeight

        const atBottom = scrollHeight - newScrollTop - clientHeight < scrollThreshold

        if (atBottom && hasMore) {
            needRestoreScrollRef.current = true
            onLoadRows()
        }
    }

    const rootState: TableRootState<T> = {
        columnVisibility: {
            hasHideable: colDefs.some(colDef => colDef.hideable && colDef.field !== groupingField),
            columnVisibilityModel,
            setColumnVisibilityModelValue,
            showSettings: () => {
                setOpenColumnVisibilitySettings(true)
            }
        },
        sorting: {
            sortModel,
            setSortModelValue,
        },
        visibleColumns,
        numberFormatter,
        dateFormatter,
        dateTimeFormatter,
        selection: {
            selectionModelMap,
            changeRowSelection,
            changeGroupSelection,
        },
        columnsSizeState,
        renderableRows,
        grouping: {
            groupsExpandedModelMap,
            setGroupExpandedValue,
        },
    }

    useImperativeHandle(apiRef, () => Object.freeze(rootState), [apiRef])

    return (
        <TableContextProvider props={rootProps} state={rootState}>
            <TableContainer
                id={id}
                className={classNames(
                    'table',
                    sizeProps === 'small' && 'table--size-small',
                    sizeProps === 'medium' && 'table--size-medium',
                    sizeProps === 'large' && 'table--size-large',
                    columnsSizeComputed && 'table--columns-computed',
                    scrollOffset > 0 && 'table--overflow-container',
                )}
                {...restProps}
            >
                <>
                    { !disableHeader && (
                        <TableHeader
                            id={id && `${id}Header`}
                            scrollPad={scrollOffset}
                        >
                            { visibleColumns.map((column, columnIndex) => {
                                const columnSize = columnsSizeState[column.field]

                                if (column.type === 'select-checkbox') {
                                    return (
                                        <TableHeaderCheckboxCell
                                            key={`table-header-cell-${column.field}`}
                                            id={id && `${id}HeaderSelection`}
                                            columnSize={columnSize}
                                            selected={!selectedEmpty}
                                            indeterminate={selectedPartial}
                                            onSelect={onHeaderCheckboxSelect}
                                        />
                                    )
                                }

                                return (
                                    <TableHeaderCell
                                        key={`table-header-cell-${column.field}`}
                                        columnIndex={columnIndex}
                                        column={column}
                                        columnSize={columnSize}
                                    />
                                )
                            }) }
                        </TableHeader>
                    ) }
                    <Popover
                        anchorEl={bodyContainerRef.current}
                        open={openColumnVisibilitySettings}
                        onClose={() => {
                            setOpenColumnVisibilitySettings(false)
                        }}
                        elevation={2}
                    >
                        <Box pt={1} px={1}>
                            { Object.keys(columnVisibilityModel).map(field => {
                                const column = getColumnByField(colDefs, field)
                                return (
                                    <TableSettingsSwitchItem key={field}>
                                        <Switch
                                            size="small"
                                            label={column.headerName}
                                            checked={columnVisibilityModel[field]}
                                            onChange={() => setColumnVisibilityModelValue(field, !columnVisibilityModel[field])}
                                        />
                                    </TableSettingsSwitchItem>
                                )

                            }) }
                        </Box>
                        <Box display="flex" p={0.5}>
                            <Button
                                color="primary"
                                size="small"
                                onClick={() => hideAllColumns()}
                            >{ t('table.hideAll') }</Button>
                            <Spacer />
                            <Button
                                color="primary"
                                size="small"
                                onClick={() => showAllColumns()}
                            >{ t('table.showAll') }</Button>
                        </Box>
                    </Popover>
                    {isEmpty ? (
                        <div
                            style={{ height: '100%' }}
                            ref={bodyRef}
                        >
                            <Empty id={id && `${id}Empty`} {...EmptyProps} />
                        </div>
                    )
                        :
                    (
                        <>
                            <TableBodyContainer
                                id={id && `${id}BodyContainer`}
                                ref={bodyContainerRef}
                            >
                                { loading ? (
                                    <FetchLoader id={id && `${id}Loader`} {...LoaderProps} />
                                ) : null }
                                {/* <AutoSizer>{({ height, width }) => */}
                                { virtualized ? (
                                    <VariableSizeList
                                        height={fullHeight ? '100%' : (bodyContainerSize.height || 0)}
                                        width="100%"
                                        itemCount={computedRows.length}
                                        itemSize={index => {
                                            const rowData = computedRows[index]

                                            if (rowData.isGroup) {
                                                return getRowGroupHeight ? getRowGroupHeight({ group: rowData.group! }) + 1 : rowHeight + 1
                                            }

                                            return getRowHeight ? getRowHeight({ row: rowData.row! }) + 1 : rowHeight + 1
                                        }}
                                        itemData={computedRows.slice()}
                                        itemKey={(index, rows) => rows[index].isGroup
                                            ? `table-group-row-${index}`
                                            : rows[index].isEmpty
                                                ? `table-empty-row-${index}`
                                                : `table-row-${getRowId(rows[index].row!)}`
                                        }
                                        outerRef={bodyRef}
                                        onScroll={() => checkNeedToLoadRows()}
                                        ref={virtualizedRef}
                                        style={{ overflow: bodyContainerSize.height ? 'auto' : 'visible' }}
                                    >{({ index, style, data }) => {
                                        const rowData = data[index]

                                        const rowStyle = {
                                            ...getRowStyles?.({ row: rowData.row! }),
                                            ...style,
                                        }

                                        if (rowData.isGroup) {
                                            return (
                                                <TableGroupRow
                                                    group={rowData.group!}
                                                    groupIndex={index}
                                                    key={`table-group-row-${index}`}
                                                    style={rowStyle}
                                                />
                                            )
                                        }

                                        if (rowData.isEmpty) {
                                            return (
                                                <TableEmptyRow
                                                    key={`table-empty-row-${index}`}
                                                    style={rowStyle}
                                                />
                                            )
                                        }

                                        const rowId = getRowId(rowData.row!)

                                        return (
                                            <TableRow
                                                row={rowData.row!}
                                                rowIndex={index}
                                                key={`table-row-${rowId}`}
                                                style={rowStyle}
                                                inGroup={rowData.inGroup}
                                            />
                                        )
                                    }}</VariableSizeList>
                                ) : (
                                    <TableBody
                                        id={id && `${id}Body`}
                                        height={fullHeight ? '100%' : (bodyContainerSize.height || 0)}
                                        // width={size.width || 0}
                                        ref={bodyRef}
                                        onScroll={() => checkNeedToLoadRows()}
                                    >
                                        { computedRows.map((rowData, rowIndex) => {
                                            const style = {
                                                ...getRowStyles?.({ row: rowData.row! }),
                                                minHeight: `${rowHeight + 1}px`,
                                            }

                                            if (rowData.isGroup) {
                                                if (getRowGroupHeight) {
                                                    style.minHeight = `${getRowGroupHeight({ group: rowData.group! }) + 1}px`
                                                }

                                                return (
                                                    <TableGroupRow
                                                        group={rowData.group!}
                                                        groupIndex={rowIndex}
                                                        key={`table-group-row-${rowIndex}`}
                                                        style={style}
                                                    />
                                                )
                                            }

                                            if (getRowHeight) {
                                                style.minHeight = `${getRowHeight({ row: rowData.row! }) + 1}px`
                                            }

                                            if (rowData.isEmpty) {
                                                return (
                                                    <TableEmptyRow
                                                        key={`table-empty-row-${rowIndex}`}
                                                        style={style}
                                                    />
                                                )
                                            }

                                            return (
                                                <TableRow
                                                    row={rowData.row!}
                                                    rowIndex={rowIndex}
                                                    key={`table-row-${getRowId(rowData.row!)}`}
                                                    style={style}
                                                    inGroup={rowData.inGroup}
                                                />
                                            )
                                        }) }
                                    </TableBody>
                                ) }
                                {/* </AutoSizer> */}
                            </TableBodyContainer>
                            { pagination && (
                                <TableFooter
                                    id={id && `${id}Footer`}
                                >
                                    <TablePagination
                                        id={id && `${id}Pagination`}
                                        count={renderableRows.length}
                                        page={page}
                                        pageSize={pageSize}
                                        pageSizeOptions={pageSizeOptions}
                                        onStateChange={newState => {
                                            if (page !== newState.page) {
                                                setPage(newState.page)
                                                onPageChange?.(newState.page)
                                            }

                                            if (pageSize !== newState.pageSize) {
                                                setPageSize(newState.pageSize)
                                                onPageSizeChange?.(newState.pageSize)
                                            }

                                            onPaginationStateChange?.({ ...newState })
                                        }}
                                    />
                                </TableFooter>
                            )}
                        </>
                    )}
                </>
            </TableContainer>
        </TableContextProvider>
    )
}

export default Table
