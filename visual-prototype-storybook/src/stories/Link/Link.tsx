import React, { FC } from 'react'
import styled from 'styled-components'
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@material-ui/core'
import { LinkClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type LinkProps = MuiLinkProps

const Link: FC<LinkProps> = (props): JSX.Element => {
    const { classes, ...restProps } = props

    return <StyledLink classes={mergeClasses(LinkClasses, classes)} {...restProps} />
}

const StyledLink = styled(MuiLink)<LinkProps>`
    &.${LinkClasses.root} {
        cursor: pointer;
    }
`

export default Link
