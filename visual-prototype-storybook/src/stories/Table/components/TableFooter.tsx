import classNames from 'classnames'
import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { MakeStyled } from '../../../typings/utils'

export type TableFooterProps = React.HTMLAttributes<HTMLDivElement>

export const TableFooter = forwardRef<HTMLDivElement, TableFooterProps>(
    function (props, forwardedRef) {
        const { className, children, ...restProps } = props

        return (
            <StyledTableFooter
                ref={forwardedRef}
                className={classNames(
                    'table-footer',
                    className
                )}
                {...restProps}
            >{ children }</StyledTableFooter>
        )
    }
)

const StyledTableFooter = styled.div<MakeStyled<{}>>`
    border-top: 1px solid ${props => props.theme.palette.divider};
`
