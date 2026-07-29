import React, { FC, forwardRef } from 'react'
import { Paper as MuiPaper, PaperProps as MuiPaperProps } from '@material-ui/core'
import styled from 'styled-components'
import { PaperClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type PaperProps = MuiPaperProps

const Paper = forwardRef<unknown, PaperProps>(
    function (props, forwardedRef) {
        const { classes, ...restProps } = props
        return <StyledPaper ref={forwardedRef} classes={mergeClasses(PaperClasses, classes)} {...restProps} />
    }
) as React.FC<PaperProps>

export default Paper

const StyledPaper = styled(MuiPaper)<MuiPaperProps>`
    &.${PaperClasses.rounded} {
        border-radius: 6px;
    }
`
