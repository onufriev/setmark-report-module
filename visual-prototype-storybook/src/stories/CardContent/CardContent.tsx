import React, { FC } from 'react'
import {
    CardContent as MuiCardContent,
    CardContentProps as MuiCardContentProps,
} from '@material-ui/core'
import styled from 'styled-components'

export type CardContentProps = MuiCardContentProps

const CardContent: FC<CardContentProps> = (props): JSX.Element => (
    <StyledCardContent data-testid="CardContent" {...props} />
)

export default CardContent

const StyledCardContent = styled(MuiCardContent)`
    padding: ${props => props.theme.spacing(1.5)}px;
`
