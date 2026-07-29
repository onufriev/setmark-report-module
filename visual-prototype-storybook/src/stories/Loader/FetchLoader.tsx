import React from 'react'
import styled from 'styled-components'
import { Box, BoxProps } from '../Box'
import { LinearProgress, LinearProgressProps } from '../LinearProgress'

export type FetchLoaderProps = {
    overlap?: boolean
    ProgressProps?: LinearProgressProps
} & BoxProps

const FetchLoader = (props: FetchLoaderProps) => {
    const { overlap, ProgressProps, ...restProps } = props

    const containerParams: BoxProps = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 'drawer',
    }

    if (overlap) {
        containerParams.bottom = 0
    }

    return (
        <Box {...containerParams} {...restProps}>
            <StyledLinearProgress {...ProgressProps} />
            { overlap ? (
                <Box height={1} width={1} />
            ) : null }
        </Box>
    )
}

export default FetchLoader

const StyledLinearProgress = styled(LinearProgress)`
    width: 100%;
`
