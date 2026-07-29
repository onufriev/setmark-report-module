import React from 'react'
import { Box, BoxProps } from '../Box'
import { CircularProgress } from '../CircularProgress'
import { Typography } from '../Typography'

export type ListInputProgressProps = {
    variant: 'determinate' | 'indeterminate'
    value: number
} & BoxProps

const ListInputProgress = (props: ListInputProgressProps) => {
    const { variant, value, ...restProps } = props
    return (
        <Box position="relative" display="inline-flex" {...restProps}>
            <CircularProgress variant={variant} value={value} size={56} />
            { variant === 'determinate' ? (
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="caption" color="textSecondary">
                        { `${Math.round(props.value)}%` }
                    </Typography>
                </Box>
            ) : null }
        </Box>
    )
}

export default ListInputProgress
