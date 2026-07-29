import classNames from 'classnames'
import React from 'react'
import styled from 'styled-components'
import { MakeStyled } from '../../../typings/utils'
import { useTableRootProps } from '../hooks'
import { TableData, TableProps } from '../types'

export type TableHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
    scrollPad?: number
}

export function TableHeader<T extends TableData>(props: TableHeaderProps) {
    const { scrollPad, className, children, ...restProps } = props

    const rootProps = useTableRootProps() as TableProps<T>

    const {
        headerHeight,
    } = rootProps

    return (
        <StyledTableHeader
            role="header"
            $height={headerHeight!}
            $scrollPad={scrollPad}
            className={classNames(
                'table-header',
                className
            )}
            {...restProps}
        >
            { children }
        </StyledTableHeader>
    )
}

const StyledTableHeader = styled.div<MakeStyled<{ height: number, scrollPad?: number }>>`
    display: flex;
    height: ${props => props.$height + 1}px;
    background-color: ${props => props.theme.palette.overlay.type3};
    border-bottom: 1px solid ${props => props.theme.palette.divider};
    padding-right: ${props => (props.$scrollPad || 0)}px;
    flex-shrink: 0;
`
