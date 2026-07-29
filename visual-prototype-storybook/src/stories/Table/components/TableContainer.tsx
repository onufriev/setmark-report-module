import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { MakeStyled } from '../../../typings/utils'

export type TableContainerProps = React.HTMLAttributes<HTMLDivElement>

export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
    function (props, forwardedRef) {
        const { children, ...restProps } = props

        return (
            <StyledTableContainer
                ref={forwardedRef}
                {...restProps}
            >
                { children }
            </StyledTableContainer>
        )
    }
)

const StyledTableContainer = styled.div<MakeStyled<{}>>`
    flex: 1 1 0%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .table-header,
    .table-body-container,
    .table-footer {
        visibility: hidden;
    }

    &.table--columns-computed {
        .table-header,
        .table-body-container,
        .table-footer {
            visibility: visible;
        }
    }
`
