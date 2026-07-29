import React, { FC } from 'react'
import {
    DialogContent as MuiDialogContent,
    DialogContentProps as MuiDialogContentProps
} from '@material-ui/core'
import styled from 'styled-components'
import { DialogContentClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type DialogContentProps = MuiDialogContentProps

const DialogContent: FC<MuiDialogContentProps> = (props): JSX.Element => {
    const { classes, ...restProps } = props
    return <StyledDialogContent classes={mergeClasses(DialogContentClasses, classes)} {...restProps} />
}

export default DialogContent

const StyledDialogContent = styled(MuiDialogContent)<DialogContentProps>`
    &.${DialogContentClasses.root} {
        padding: ${props => props.theme.spacing(2)}px;
    }
`
