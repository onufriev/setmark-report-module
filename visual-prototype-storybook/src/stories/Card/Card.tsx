import React, { FC } from 'react'
import { Card as MuiCard, CardProps as MuiCardProps } from '@material-ui/core'

export type CardProps = MuiCardProps

const Card: FC<CardProps> = (props): JSX.Element => <MuiCard data-testid="Card" {...props} />

export default Card
