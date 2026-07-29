import classNames from 'classnames'
import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { MakeStyled } from '../../../typings/utils'
import { useTableRootProps } from '../hooks'
import { TableData, TableProps } from '../types'

export type TableBodyContainerProps = React.HTMLAttributes<HTMLDivElement>

export const TableBodyContainer = forwardRef<HTMLDivElement, TableBodyContainerProps>(
    function (props, forwardedRef) {
        const { children, className, ...restProps } = props

        const rootProps = useTableRootProps() as TableProps<TableData>

        const {
            virtualized,
        } = rootProps

        return (
            <StyledTableBodyContainer
                ref={forwardedRef}
                className={classNames(
                    'table-body-container',
                    virtualized && 'table-body-container--virtualized',
                    className
                )}
                {...restProps}
            >{ children }</StyledTableBodyContainer>
        )
    }
)

const StyledTableBodyContainer = styled.div<MakeStyled<{}>>`
    position: relative;
    flex-grow: 1;
    height: 0;
    width: 100%;
`
