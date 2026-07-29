import React, { FC } from 'react'

import { Toolbar as MuiToolbar, ToolbarProps as MuiToolbarProps } from '@material-ui/core'
import styled from 'styled-components'
import { ToolbarClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type ToolbarProps = MuiToolbarProps

const Toolbar: FC<ToolbarProps> = (props): JSX.Element => {
    const { classes, ...restProps } = props
    return <StyledToolbar data-testid={'Toolbar'} classes={mergeClasses(ToolbarClasses, classes)} {...restProps} />
}

export default Toolbar

const StyledToolbar = styled(MuiToolbar)<ToolbarProps>`
    &.${ToolbarClasses.gutters} {
        padding-left: 12px;
        padding-right: 12px;
    }
`
