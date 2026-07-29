import React, { FC } from 'react'
import {
    CardActions as MuiCardActions,
    CardActionsProps as MuiCardActionsProps,
} from '@material-ui/core'
import styled from 'styled-components'

export type CardActionsProps = MuiCardActionsProps

const CardActions: FC<CardActionsProps> = (props): JSX.Element => (
    <StyledCardActions data-testid="CardActions" {...props} />
)

export default CardActions

const StyledCardActions = styled(MuiCardActions)`
    padding-top: 0;
`
