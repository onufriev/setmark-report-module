import React, { FC } from 'react'
import {
    Backdrop as MuiBackdrop,
    BackdropProps as MuiBackdropProps
} from '@material-ui/core'

export type BackdropProps = MuiBackdropProps

const Backdrop: FC<BackdropProps> = (props): JSX.Element => (
    <MuiBackdrop data-testid="Backdrop" {...props} />
)

export default Backdrop
