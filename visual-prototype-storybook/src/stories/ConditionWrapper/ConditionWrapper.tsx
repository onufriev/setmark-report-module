import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import { Box, BoxProps } from '../Box'
import { Grid } from '../Grid'
import { Typography } from '../Typography'
import { IconButton } from '../IconButton'
import { Button } from '../Button'
import { Settings } from '../icons'
import { ConditionWrapperContextProvider } from './contexts'
import { MakeStyled } from '../../typings/utils'

export type ConditionWrapperProps = {
    label?: string,
    disabled?: boolean,
    error?: boolean,
    buttonText?: string,
    onOpen: React.ReactEventHandler<{}>
}

export type BoxConditionWrapperProps = BoxProps & {
    error?: boolean
}

const ConditionWrapper: FC<ConditionWrapperProps & React.HTMLAttributes<HTMLDivElement>> = (props): JSX.Element => {
    const {
        id,
        label,
        disabled,
        error,
        buttonText,
        onOpen,
        ...restProps
    } = props

    const rootProps: ConditionWrapperProps = {
        label,
        disabled,
        error,
        buttonText,
        onOpen
    }

    return (
        <ConditionWrapperContextProvider props={rootProps}>
            <Box id={id} {...restProps}>
                {label && (
                    <Box pb={1}>
                        <Typography id={id && `${id}Label`} variant="subtitle1">
                            {label}
                        </Typography>
                    </Box>
                )}
                <Grid container spacing={1}>
                    <Grid item xs={11}>
                        <StyledConditionWrapperBox
                            id={id && `${id}InnerContainer`}
                            p={1.5}
                            mb={3}
                            bgcolor="overlay.type3"
                            borderRadius="borderRadius"
                            minHeight="74px"
                            $error={error}
                        >
                            {props.children}
                        </StyledConditionWrapperBox>
                    </Grid>
                    <Grid item xs={1}>
                        { buttonText ? (
                            <Button
                                color="primary"
                                id={id && `${id}Button`}
                                onClick={onOpen}
                                disabled={disabled}
                            >
                                { buttonText }
                            </Button>
                        ) : (
                            <IconButton
                                id={id && `${id}Button`}
                                onClick={onOpen}
                                disabled={disabled}
                                noPadding
                            >
                                <Settings />
                            </IconButton>
                        ) }
                    </Grid>
                </Grid>
            </Box>
        </ConditionWrapperContextProvider>
    )
}

export default ConditionWrapper

const StyledConditionWrapperBox = styled(Box)<MakeStyled<BoxConditionWrapperProps>>`
    ${props => {
        if (props.$error) {
            return css`
                border: 1px solid ${props => props.theme.palette.error.main}
            `
        }
    }}
`
