import React, { forwardRef } from 'react'
import styled from 'styled-components'

const Container = styled.div<Pick<BaseLineClampProps, 'breakAll'>>(
    (props) => ({
        display: 'flex',
        'align-items': 'center',
        'white-space': 'normal',
        'word-break': props.breakAll ? 'break-all' : 'break-word',
        'text-overflow': 'ellipsis',
    })
)
const Paragraph = styled.div<Pick<BaseLineClampProps, 'lines'>>(
    (props) => ({
        display: '-webkit-box',
        '-webkit-line-clamp': String(props.lines),
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
    })
)

interface BaseLineClampProps {
    lines?: number
    breakAll?: boolean
}

export type LineClampProps = BaseLineClampProps & React.HTMLAttributes<HTMLDivElement>

export const LineClamp = forwardRef<HTMLDivElement, LineClampProps>(
    (props, ref) => {
        const { lines = 2, breakAll = false, children, ...restProps } = props

        return (
            <Container breakAll={breakAll} ref={ref} {...restProps}>
                <Paragraph lines={lines}>{ children }</Paragraph>
            </Container>
        )
    }
)

export default LineClamp
