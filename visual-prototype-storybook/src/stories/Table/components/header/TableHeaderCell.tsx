import React, { CSSProperties } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { TableColumnProps, TableProps, TableData, TableRootState, TableColSizeData } from '../../types'
import {
    ArrowDownward,
    ArrowUpward,
    MoreVert,
} from '../../../icons'
import { MakeStyled } from '../../../../typings/utils'
import { CELL_PAD_LEFT, CELL_PAD_RIGHT, DefaultTableColumnProps, ROW_PAD_LEFT, ROW_PAD_RIGHT } from '../../constants'
import { useTableRootProps, useTableRootState } from '../../hooks'
import { Menu } from '../../../Menu'
import { MenuItem } from '../../../MenuItem'
import { IconButton } from '../../../IconButton'
import { useLocale } from '../../../LocaleProvider'
import { Tooltip } from '../../../Tooltip'
import { getColWidthStyle } from '../../utils'

export type TableHeaderCellProps<T extends TableData>= {
    columnIndex?: number
    column: TableColumnProps<T>
    columnSize?: TableColSizeData
}

export function TableHeaderCell<T extends TableData>(props: TableHeaderCellProps<T>): JSX.Element {
    const {
        columnIndex,
        column,
        columnSize,
    } = props
    const {
        headerName,
        headerDescription,
        renderHeader,
        align = DefaultTableColumnProps.align,
        hideable,
        headerMultiline,
        headerStyles: customHeaderStyles = {},
        disableActions,
    } = column

    const { t } = useLocale()

    const rootProps = useTableRootProps() as TableProps<T>
    const rootState = useTableRootState() as TableRootState<T>

    const {
        sortSequence,
        groupingField,
    } = rootProps

    const isSortable = column.sortable && column.type !== 'actions'

    const sortApi = rootState.sorting
    const visibilityApi = rootState.columnVisibility

    const isSorted = sortApi.sortModel.field === column.field && sortApi.sortModel.sort != null

    const onSortButtonClick = () => {
        const index = sortSequence!.indexOf(sortApi.sortModel.sort)
        const nextIndex = (sortApi.sortModel.field === column.field && index !== sortSequence!.length - 1) ? index + 1 : 0

        sortApi.setSortModelValue(column.field, sortSequence![nextIndex])
    }

    const SortIcon = sortApi.sortModel.sort === 'desc' ? ArrowDownward : ArrowUpward

    const hasHideable = visibilityApi.hasHideable

    const [open, setOpen] = React.useState(false)
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    const showMenu = () => setOpen(true)
    const hideMenu = () => setOpen(false)

    let headerLabel = null

    if (renderHeader) {
        headerLabel = renderHeader()
    } else if (headerName) {
        headerLabel = (
            <div className="header-cell__name">{ headerName }</div>
        )
    }

    if (headerDescription) {
        headerLabel = (
            <Tooltip title={headerDescription}>
                <span>{ headerLabel }</span>
            </Tooltip>
        )
    }

    const hasControls = hasHideable || isSortable

    const styles = getColWidthStyle(columnSize)

    return (
        <StyledTableHeaderCell
            role="header-cell"
            className={classNames(
                'table-header-cell',
                align === 'left' && 'table-header-cell--align-left',
                align === 'center' && !hasControls && 'table-header-cell--align-center',
                align === 'right' && 'table-header-cell--align-right',
                headerMultiline && 'table-header-cell--multiline',
                isSortable && 'table-header-cell--sortable',
                isSorted && 'table-header-cell--sorted',
            )}
            style={{
                ...customHeaderStyles,
                ...styles
            }}
        >
            { headerLabel }
            { isSortable && (
                <div className="header-cell__icons-container">
                    <IconButton
                        onClick={onSortButtonClick}
                        size="small"
                    >
                        <SortIcon fontSize="inherit" style={{ opacity: !isSorted ? .5 : '' }} />
                    </IconButton>
                </div>
            )}
            { !disableActions && (hasHideable || isSortable) && (
                <div className="header-cell__more-icon">
                    <IconButton
                        ref={buttonRef}
                        onClick={showMenu}
                        size="small"
                    >
                        <MoreVert fontSize="inherit" />
                    </IconButton>
                    <Menu
                        anchorEl={buttonRef.current}
                        open={open}
                        onClick={hideMenu}
                        onClose={hideMenu}
                    >
                        { isSortable && (
                            <MenuItem
                                onClick={() => sortApi.setSortModelValue(column.field, 'asc')}
                                disabled={sortApi.sortModel.field === column.field && sortApi.sortModel.sort === 'asc'}
                            >
                                { t('table.sortByAsc') }
                            </MenuItem>
                        ) }
                        { isSortable && (
                            <MenuItem
                                onClick={() => sortApi.setSortModelValue(column.field, 'desc')}
                                disabled={sortApi.sortModel.field === column.field && sortApi.sortModel.sort === 'desc'}
                            >
                                { t('table.sortByDesc') }
                            </MenuItem>
                        ) }
                        { hideable && column.field !== groupingField && (
                            <MenuItem
                                onClick={() => visibilityApi.setColumnVisibilityModelValue(column.field, false)}
                            >
                                { t('table.hideColumn') }
                            </MenuItem>
                        ) }
                        { hasHideable && (
                            <MenuItem
                                onClick={() => visibilityApi.showSettings()}
                            >
                                { t('table.showColumns') }
                            </MenuItem>
                        ) }
                    </Menu>
                </div>
            ) }
        </StyledTableHeaderCell>
    )
}

type StyledTableHeaderCellProps = MakeStyled<{
    width?: number
}>

const StyledTableHeaderCell = styled.div<StyledTableHeaderCellProps>`
    display: flex;
    align-items: center;
    padding-left: ${CELL_PAD_LEFT}px;
    padding-right: ${CELL_PAD_RIGHT}px;
    overflow: hidden;
    flex: 1 1 0%;

    &:first-child {
        padding-left: ${ROW_PAD_LEFT + CELL_PAD_LEFT}px;
    }
    &:last-child {
        padding-right: ${ROW_PAD_RIGHT + CELL_PAD_RIGHT}px;
    }

    &.table-header-cell--align-left {
        /* justify-content: flex-start; */

        .header-cell__more-icon {
            margin-left: auto;
            margin-right: -10px;
        }
    }

    &.table-header-cell--align-center {
        justify-content: center;

        .header-cell__name {
            text-align: center;
        }
    }

    &.table-header-cell--align-right {
        flex-direction: row-reverse;
        /* justify-content: flex-end; */

        .header-cell__name {
            text-align: end;
        }

        .header-cell__more-icon {
            margin-left: -10px;
            margin-right: auto;
        }
    }

    .header-cell__name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: ${props => props.theme.typography.caption.fontSize}px;
        line-height: ${(props) => props.theme.typography.caption.lineHeight};
        color: ${props => props.theme.palette.text.secondary};
    }

    &.table-header-cell--multiline {
        .header-cell__name {
            white-space: normal;
        }
    }

    &.table-header-cell--sorted,
    &:hover {
        .header-cell__icons-container {
            visibility: visible;
            width: auto;
        }
    }

    &:hover {
        .header-cell__more-icon {
            visibility: visible;
            width: auto;
        }
    }

    .header-cell__more-icon,
    .header-cell__icons-container {
        display: flex;
        visibility: hidden;
        width: 0;
    }
`
