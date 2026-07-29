import React, { FC } from 'react'
import {
    DialogContentText as MuiDialogContentText,
    DialogContentTextProps as MuiDialogContentTextProps
} from '@material-ui/core'

export type DialogContentTextProps = MuiDialogContentTextProps

const DialogContentText: FC<DialogContentTextProps> = (props): JSX.Element => (
    <MuiDialogContentText data-testid="DialogContentText" {...props} />
)

export default DialogContentText
