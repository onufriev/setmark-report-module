import React from 'react'
import styled from 'styled-components'
import { Backdrop, BackdropProps } from '../Backdrop'
import { Box } from '../Box'
import { CircularProgress, CircularProgressProps } from '../CircularProgress'
import { Stack } from '../Stack'
import { Typography } from '../Typography'

export type AppLoaderProps = BackdropProps & {
    title?: string
    ProgressProps?: CircularProgressProps
}

const AppLoader: React.FC<AppLoaderProps> = (props) => {
    const { open, title, ProgressProps, ...restProps } = props
    return (
        <StyledBackdrop open={open} {...restProps}>
            <Stack
                spacing={2}
                direction="column"
                alignItems="center"
            >
                <Box display="flex"><CircularProgress color="inherit" {...ProgressProps} /></Box>
                { title && <Typography color="inherit">{ title }</Typography> }
            </Stack>
        </StyledBackdrop>
    )
}

export default AppLoader

const StyledBackdrop = styled(Backdrop)`
    color: ${props => props.theme.palette.common.white};
    z-index: ${props => props.theme.zIndex.max};
`
