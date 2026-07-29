import React, { forwardRef } from 'react'
import classNames from 'classnames'
import styled from 'styled-components'

export type TableBodyProps = React.HTMLAttributes<HTMLDivElement> & {
    height: number | string
    width?: number
}

export const TableBody = forwardRef<HTMLDivElement, TableBodyProps>(
    function (props, forwardedRef) {
        const { height, width, children, className, ...restProps } = props

        return (
            <StyledTableBody
                ref={forwardedRef}
                className={classNames(
                    'table-body',
                    className
                )}
                style={{
                    height,
                    // width: `${width}px`,
                }}
                {...restProps}
            >{ children }</StyledTableBody>
        )
    }
)

const StyledTableBody = styled.div`
    width: 100%;
    position: relative;
    overflow-y: auto;
`
