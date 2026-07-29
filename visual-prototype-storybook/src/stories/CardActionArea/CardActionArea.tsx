import React, { FC } from 'react'
import {
    CardActionArea as MuiCardActionArea,
    CardActionAreaProps as MuiCardActionAreaProps,
} from '@material-ui/core'

export type CardActionAreaProps = MuiCardActionAreaProps

const CardActionArea: FC<CardActionAreaProps> = (props): JSX.Element => (
    <MuiCardActionArea data-testid="CardActionArea" {...props} />
)

export default CardActionArea
