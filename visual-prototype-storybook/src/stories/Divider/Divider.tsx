import React, { FC } from 'react'
import styled from 'styled-components'
import { Divider as MuiDivider, DividerProps as MuiDividerProps } from '@material-ui/core'
import { DividerClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type DividerProps = {
    gap?: boolean
} & MuiDividerProps

const Divider: FC<DividerProps> = (props): JSX.Element => {
    const { classes, ...restProps } = props
    return (
        <StyledDivider data-testid="Divider" classes={mergeClasses(DividerClasses, classes)} {...restProps} />
    )
}

export default Divider

const StyledDivider = styled(MuiDivider)<DividerProps>`
    &.${DividerClasses.root} {
        ${props => props.gap && `
            margin-top: 8px;
            margin-bottom: 8px;
        `}
    }

    &.${DividerClasses.middle} {
        margin-left: 12px;
        margin-right: 12px;
    }
`
