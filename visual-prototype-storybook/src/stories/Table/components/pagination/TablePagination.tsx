import React, { FC } from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import { DefaultTablePaginationProps } from '../../constants'
import isNil from 'lodash/isNil'
import {
    FirstPage,
    ChevronLeft,
    ChevronRight,
    LastPage,
} from '../../../icons'
import { SelectInput } from '../../../SelectInput'
import { Spacer } from '../../../Spacer'
import { Typography } from '../../../Typography'
import { IconButton } from '../../../IconButton'
import { useLocale } from '../../../LocaleProvider'
import useControlled from '../../../../utils/useControlled'
import { getFixedPageIfOutOfRange } from '../../utils'

export type TablePaginationProps = {
    count: number
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
    onStateChange?: (newState: TablePaginationState) => void

    disabled?: boolean
    disablePageSelect?: boolean
    disablePageSizeSelect?: boolean
}

export type TablePaginationState = {
    page: number
    pageSize: number
}

const TablePagination: FC<React.HTMLAttributes<HTMLDivElement> & TablePaginationProps> = (props) => {
    const {
        id,

        count,
        page: pageProp,
        defaultPage = DefaultTablePaginationProps.page,
        onPageChange,
        pageSize: pageSizeProp,
        defaultPageSize = props.defaultPageSize || props.pageSize || props.pageSizeOptions?.[0] || DefaultTablePaginationProps.pageSizeOptions[0],
        onPageSizeChange,
        pageSizeOptions = DefaultTablePaginationProps.pageSizeOptions,
        onStateChange,

        disabled,
        disablePageSelect,
        disablePageSizeSelect,

        ...restProps
    } = props

    const { t } = useLocale()

    const [page, setPage] = useControlled({
        controlled: pageProp,
        default: defaultPage,
    })

    const [pageSize, setPageSize] = useControlled({
        controlled: pageSizeProp,
        default: defaultPageSize,
    })

    if (isNil(count)) throw new Error('CSI UI: Missing the `count` property')

    const pagesCount = Math.ceil(count / pageSize)
    const from = pageSize * page + 1
    const to = pageSize * (page + 1) > count ? count : pageSize * (page + 1)

    const goToFirst = () => {
        const newPage = 0
        setPage(newPage)
        onPageChange?.(newPage)
        onStateChange?.({ page: newPage, pageSize })
    }
    const goBackward = () => {
        const newPage = page > 0 ? page - 1 : 0
        setPage(newPage)
        onPageChange?.(newPage)
        onStateChange?.({ page: newPage, pageSize })
    }
    const goForward = () => {
        const newPage = page < pagesCount - 1 ? page + 1 : pagesCount - 1
        setPage(newPage)
        onPageChange?.(newPage)
        onStateChange?.({ page: newPage, pageSize })
    }
    const goToLast = () => {
        const newPage = pagesCount - 1
        setPage(newPage)
        onPageChange?.(newPage)
        onStateChange?.({ page: newPage, pageSize })
    }

    const pageOptions = [...new Array(pagesCount)].map((_, i) => i)

    return (
        <StyledTablePagination
            id={id}
            className={classNames(
                'table-pagination',
            )}
            {...restProps}
        >
            <Spacer />
            { !disablePageSelect ? (
                <>
                    <Typography id={id && `${id}PageText`} className="table-pagination__caption">{ t('table.page') }:</Typography>
                    <div className="table-pagination__select-input">
                        <SelectInput
                            id={id && `${id}PageSelect`}
                            value={page}
                            labelFunction={opt => String(opt + 1)}
                            options={pageOptions}
                            onSelect={opt => {
                                setPage(opt)
                                onPageChange?.(opt)
                                onStateChange?.({ page: opt, pageSize })
                            }}
                            disabled={disabled}
                        />
                    </div>
                </>
            ) : null }
            { !disablePageSizeSelect ? (
                <>
                    <Typography id={id && `${id}RowsOnPageText`} className="table-pagination__caption">{ t('table.rowsOnPage') }:</Typography>
                    <div className="table-pagination__select-input">
                        <SelectInput
                            id={id && `${id}PageSizeSelect`}
                            value={pageSize}
                            options={pageSizeOptions}
                            onSelect={opt => {
                                setPageSize(opt)
                                onPageSizeChange?.(opt)

                                const newPage = getFixedPageIfOutOfRange(page, opt, count)
                                if (page !== newPage) {
                                    setPage(newPage)
                                    onPageChange?.(newPage)
                                }

                                onStateChange?.({ page: newPage, pageSize: opt })
                            }}
                            disabled={disabled}
                        />
                    </div>
                </>
            ) : null }
            <Typography id={id && `${id}RangeText`} className="table-pagination__caption">{from}-{to} { t('table.outOf') } {count}</Typography>
            <div className="table-pagination__page-controls">
                <IconButton
                    id={id && `${id}GoToFirstButton`}
                    onClick={goToFirst}
                    disabled={disabled || (page === 0)}
                >
                    <FirstPage fontSize="inherit" />
                </IconButton>
                <IconButton
                    id={id && `${id}GoBackwardButton`}
                    onClick={goBackward}
                    disabled={disabled || (page === 0)}
                >
                    <ChevronLeft fontSize="inherit" />
                </IconButton>
                <IconButton
                    id={id && `${id}GoForwardButton`}
                    onClick={goForward}
                    disabled={disabled || (page === pagesCount - 1)}
                >
                    <ChevronRight fontSize="inherit" />
                </IconButton>
                <IconButton
                    id={id && `${id}GoToLastButton`}
                    onClick={goToLast}
                    disabled={disabled || (page === pagesCount - 1)}
                >
                    <LastPage fontSize="inherit" />
                </IconButton>
            </div>
        </StyledTablePagination>
    )
}

const StyledTablePagination = styled.div`
    display: flex;
    align-items: center;
    min-height: 48px;
    padding: 0 12px;

    .table-pagination__select-input {
        margin-left: ${props => props.theme.spacing(1)}px;
        margin-right: ${props => props.theme.spacing(2)}px;
    }

    .table-pagination__page-controls {
        margin-left: ${props => props.theme.spacing(1)}px;
        display: flex;
    }
`
export default TablePagination
