import React, { FC } from 'react'
import {
    DialogActions as MuiDialogActions,
    DialogActionsProps as MuiDialogActionsProps
} from '@material-ui/core'
import styled from 'styled-components'
import { DialogActionsClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type DialogActionsProps = MuiDialogActionsProps

const DialogActions: FC<DialogActionsProps> = (props): JSX.Element => {
    const { classes, ...restProps } = props
    return <StyledDialogAction classes={mergeClasses(DialogActionsClasses, classes)} {...restProps}/>
}

export default DialogActions

const StyledDialogAction = styled(MuiDialogActions)<DialogActionsProps>`
    &.${DialogActionsClasses.root} {
        padding:
            ${props => props.theme.spacing(1)}px
            ${props => props.theme.spacing(2)}px;
    }

    &.${DialogActionsClasses.spacing} > :not(:first-child) {
        margin-left: ${props => props.theme.spacing(2)}px;
    }
`
