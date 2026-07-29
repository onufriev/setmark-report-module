import React from 'react'
import { Box, BoxProps } from '../Box'
import { CircularProgress, CircularProgressProps } from '../CircularProgress'
import { Stack } from '../Stack'
import { Typography } from '../Typography'

export type ContentLoaderProps = {
    title?: string
    ProgressProps?: CircularProgressProps
} & BoxProps

const ContentLoader = (props: ContentLoaderProps) => {
    const { title, ProgressProps, ...restProps } = props

    return (
        <Box height={1} width={1} flexGrow={1} display="flex" alignItems="center" justifyContent="center" {...restProps}>
            <Stack
                spacing={2}
                direction="column"
                alignItems="center"
            >
                <Box display="flex"><CircularProgress color="secondary" {...ProgressProps} /></Box>
                { title && <Typography color="inherit">{ title }</Typography> }
            </Stack>
        </Box>
    )
}

export default ContentLoader
