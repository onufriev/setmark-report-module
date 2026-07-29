import React, { FC } from 'react'
import { CardMedia as MuiCardMedia, CardMediaProps as MuiCardMediaProps } from '@material-ui/core'

export type CardMediaProps = MuiCardMediaProps

const CardMedia: FC<CardMediaProps> = (props): JSX.Element => (
    <MuiCardMedia data-testid="CardMedia" {...props} />
)

export default CardMedia
