import React, { FC } from 'react'
import {
    CardHeader as MuiCardHeader,
    CardHeaderProps as MuiCardHeaderProps,
} from '@material-ui/core'
import styled from 'styled-components'

export type CardHeaderProps = MuiCardHeaderProps

const CardHeader: FC<CardHeaderProps> = (props): JSX.Element => (
    <StyledCardHeader data-testid="CardHeader" {...props} />
)

export default CardHeader

const StyledCardHeader = styled(MuiCardHeader)`
    padding: ${props => props.theme.spacing(1.5)}px;
`
