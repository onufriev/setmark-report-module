import React, { useEffect, useRef, useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Table from './Table'
import TableCellActionsItem from './components/cell/TableCellActionsItem'
import { ContentBox } from '../ContentBox'
import {
    Add,
    Delete, InfoOutlined,
} from '../icons'
import faker from 'faker'
import { TableApiRef, TableColumnProps, TableProps, TableSortModel } from './types'
import { Typography } from '../Typography'
import { IconButton } from '../IconButton'
import { Fab } from '../Fab'
import TablePagination from './components/pagination/TablePagination'
import { getSortFunction } from './utils'
import { tableStringOrNumberComparator } from './constants'
import { TablePaginationCheckbox } from './components/header/TableHeaderCheckboxCell'

export default {
    title: 'Table/Table',
    component: Table,
    parameters: { actions: { argTypesRegex: null } }
} as Meta

const getRows = (rowsCount: number = 100) => [...new Array(rowsCount)].map((_, i) => ({
    id: i,
    guid: faker.datatype.uuid(),
    // srt: faker.datatype.string(200),
    name: faker.name.findName(),
    city: faker.address.city(),
    accountName: faker.finance.accountName(),
    bitcoinAddress: faker.finance.bitcoinAddress(),
    amount: faker.datatype.number(100000),
    date: faker.datatype.datetime()
}))

const defaultData = getRows(101)

type DataType = ReturnType<typeof getRows>[0]

const columns: TableColumnProps<DataType>[] = [
    {
        field: 'accountName',
        headerName: 'Аккаунт',
        headerDescription: 'Ячейка без типа и рендерера',
        sortable: true,
        hideable: true,
        // width: 100,
    },
    {
        field: 'name',
        headerName: 'Имя Фамилия',
        headerDescription: 'Кастомный рендерер',
        sortable: true,
        editable: true,
        width: 200,
        renderCell: ({ row }) => (
            <div>
                <Typography display="block">{ row.name }</Typography>
                <Typography display="block" variant="caption" color="textSecondary">{ row.guid }</Typography>
            </div>
        ),
        errorFunction: ({ value }) => String(value).length < 5,
        onEditEnd: action('onEditEnd')
    },
    // {
    //     field: 'srt',
    //     headerName: 'Длинная строка',
    //     renderCell: ({ row }) => (
    //         <div style={{
    //             whiteSpace: 'normal',
    //             wordBreak: 'break-all'
    //         }}>{ row.srt }</div>
    //     ),
    //     width: 200,
    // },
    {
        field: 'city',
        headerName: 'Город',
        sortable: true,
        hideable: true,
        // width: 100,
        renderGroupCell: ({ rows }) => <Typography>Всего городов: {rows.length}</Typography>
    },
    {
        field: 'bitcoinAddress',
        type: 'string',
        headerName: 'Адрес кошелька',
        headerDescription: 'Тип ячейки string',
        hideable: true,
        width: 225,
        valueGetter: ({ value }) => value.split('').reverse().join(''),
    },
    {
        field: 'date',
        type: 'datetime',
        headerName: 'Дата',
        headerDescription: 'Тип ячейки datetime',
        editable: true,
        hideable: true,
        width: 175,
        onEditEnd: action('onEditEnd'),
    },
    {
        field: 'amount',
        type: 'number',
        headerName: 'Количество',
        headerDescription: 'Тип ячейки number',
        editable: true,
        align: 'right',
        width: 100,
        onEditEnd: action('onEditEnd'),
        valueGroupGetter: ({ rows }) => rows.reduce((acc, cur) => acc + cur.amount, 0),
    },
    // {
    //     field: 'actions2',
    //     visibleOnHover: true,
    //     width: 56,
    //     renderCell: () => (
    //         <IconButton color="primary"><Edit /></IconButton>
    //     )
    // },
    {
        field: 'actions',
        type: 'actions',
        renderHeader: () => <IconButton size="small"><InfoOutlined fontSize="small" /></IconButton>,
        headerDescription: 'Кастомный рендер ячейки заголовка',
        align: 'right',
        disableActions: true,
        getActions: ({ row }) => [
            <TableCellActionsItem onClick={action(`onClick - Удалить ${row?.id}`)} label="Удалить" icon={<Delete />} visibleOnHover />,
            <TableCellActionsItem onClick={action(`onClick - Редактировать ${row?.id}`)} label="Редактировать" showInMenu />,
            <TableCellActionsItem onClick={action(`onClick - Удалить ${row?.id}`)} label="Удалить" showInMenu />,
        ]
    },
]

const Template: Story<TableProps<DataType>> = (args) => (
    <ContentBox height="calc(100vh - 2rem)">
        <Table<DataType>
            {...args}
            id="BeautifulTable"
            style={{ boxShadow: '0 0 0 1px #D0D3D6' }}
            onBodyScroll={undefined}
            columns={columns}
        />
    </ContentBox>
)

export const Base: Story<TableProps<DataType>> = Template.bind({})
Base.args = {
    rows: defaultData,
    getRowId: row => row.id,
    columns,
}

export const Empty: Story<TableProps<DataType>> = Template.bind({})
Empty.args = {
    rows: [],
    getRowId: row => row.id,
    columns,
    EmptyProps: {
        message: 'Записей пока нет'
    }
}

export const WithSelection: Story<TableProps<DataType>> = Template.bind({})
WithSelection.args = {
    rows: defaultData,
    getRowId: row => row.id,
    columns,
    selectable: true,
}

export const WithPagination: Story<TableProps<DataType>> = Template.bind({})
WithPagination.args = {
    rows: defaultData,
    getRowId: row => row.id,
    columns,
    pagination: true,
}

export const WithGroupingByField: Story<TableProps<DataType>> = Template.bind({})
WithGroupingByField.args = {
    rows: getRows(10),
    getRowId: row => row.id,
    columns,
    groupingField: 'accountName',
}

export const VirtualizedMode: Story<TableProps<DataType>> = Template.bind({})
VirtualizedMode.args = {
    rows: getRows(20000),
    getRowId: row => row.id,
    columns,
    virtualized: true
}

export const WithEmptyRows: Story<TableProps<DataType>> = Template.bind({})
WithEmptyRows.args = {
    rows: defaultData,
    getRowId: row => row.id,
    columns,
    renderEmptyRows: true,
    emptyRowsCount: 5,
}

const CustomRowTemplate: Story<TableProps<DataType>> = (args) => {
    const [currentCustomer, setCurrentCustomer] = useState<number>(-1)
    return (
    <ContentBox height="calc(100vh - 2rem)">
        <Table<DataType>
            {...args}
            id="BeautifulTable"
            style={{ boxShadow: '0 0 0 1px #D0D3D6' }}
            onBodyScroll={undefined}
            onRowClick={e => {
                setCurrentCustomer(e.row.id)
            }}
            getRowStyles={row => {
                if (currentCustomer === row.row.id) {
                    return {
                        backgroundColor: '#EAF0F3'
                    }
                }
                return { backgroundColor: '#6FC8FF' }
            }}
        />
    </ContentBox>
)}

export const WithCustomRow: Story<TableProps<DataType>> = CustomRowTemplate.bind({})
WithCustomRow.args = {
    rows: defaultData,
    getRowId: row => row.id,
    columns,
}

const InfiniteScrollTemplate: Story<Pick<TableProps<DataType>, 'virtualized'>> = (args) => {
    const [lastPage, setLastPage] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setTimeout(() => setLastPage(prev => ++prev), 1000)
    }, [])

    const apiRef = useRef<TableApiRef<DataType>>({})

    const currentRowsCount = lastPage * 5
    const rows = defaultData.slice(0, currentRowsCount)

    return (
        <ContentBox height="calc(100vh - 2rem)" position="relative">
            <Table<DataType>
                {...args}
                apiRef={apiRef}
                style={{ boxShadow: '0 0 0 1px #D0D3D6' }}
                rows={rows}
                getRowId={row => row.id}
                columns={[
                    {
                        field: 'city',
                        headerName: 'Город',
                    },
                    {
                        field: 'accountName',
                        headerName: 'Аккаунт',
                    },
                    {
                        field: 'actions',
                        type: 'actions',
                        getActions: ({ row }) => [
                            <TableCellActionsItem onClick={undefined} label="Удалить" icon={<Delete />} visibleOnHover />,
                        ]
                    },
                ]}
                hasMore={currentRowsCount < defaultData.length}
                onLoadRows={() => {
                    setLoading(true)
                    setTimeout(() => {
                        setLoading(false)
                        setLastPage(prev => ++prev)
                    }, 500)
                }}
                loading={loading}
                LoaderProps={{
                    overlap: true
                }}
                onBodyScroll={undefined}
                renderEmptyRows
            />

            <Fab><Add /></Fab>
        </ContentBox>
    )
}

export const WithInfiniteScroll: Story<Pick<TableProps<DataType>, 'virtualized'>> = InfiniteScrollTemplate.bind({})

WithInfiniteScroll.args = {
    virtualized: false
}

export const ExternalPagination = () => {
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [sortModel, setSortModel] = useState<TableSortModel>({
        field: 'city',
        sort: 'desc'
    })

    const initialRows = defaultData.slice()

    const sortFunction = getSortFunction<DataType>(tableStringOrNumberComparator, sortModel)

    if (sortFunction) {
        initialRows.sort(sortFunction)
    }

    const rows = initialRows.slice(page * pageSize, (page + 1) * pageSize)

    return (
        <ContentBox flexContainerVertical height="calc(100vh - 2rem)">
            <Table<DataType, DataType["id"]>
                rows={rows}
                getRowId={row => row.id}
                columns={[
                    {
                        field: 'city',
                        headerName: 'Город',
                        sortable: true,
                        description: ({ row }) => row.city + ' - прекрасный город!'
                    },
                    {
                        field: 'accountName',
                        headerName: 'Аккаунт',
                        sortable: true,
                        styles: {
                            backgroundColor: 'darkkhaki',
                            color: 'white'
                        }
                    },
                ]}
                sortModel={sortModel}
                onSortModelChange={setSortModel}
                selectable
                components={{
                    HeaderCheckbox: () => {
                        return (
                            <TablePaginationCheckbox
                                checked={false}
                                options={[{ value: 'something', label: 'Сделать что-то странное' }]}
                                onClick={() => { return false }}
                            />
                        )
                    }
                }}
            />

            <TablePagination
                count={defaultData.length}
                page={page}
                pageSize={pageSize}
                pageSizeOptions={[10, 25, 50, 100, 500]}
                onStateChange={newState => {
                    setPage(newState.page)
                    setPageSize(newState.pageSize)
                }}
            />
        </ContentBox>
    )
}
