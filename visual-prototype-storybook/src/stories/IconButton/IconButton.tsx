import React, { forwardRef } from 'react'
import styled from 'styled-components'
import {
    IconButton as MuiIconButton,
    IconButtonProps as MuiIconButtonProps,
} from '@material-ui/core'
import { MakeStyled } from '../../typings/utils'
import { IconButtonClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type IconButtonProps = MuiIconButtonProps & {
    noPadding?: boolean
}

const StyledIconButton = styled(MuiIconButton)<MakeStyled<{ noPadding?: boolean }>>`
    &.${IconButtonClasses.root} {
        padding: 6px;

        &.${IconButtonClasses.sizeSmall} {
            padding: 3px;
        }

        ${props => props.$noPadding && `padding: 0;`}
    }
`

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    function (props, forwardedRef) {
        const { noPadding, classes, ...restProps } = props
        return <StyledIconButton ref={forwardedRef} $noPadding={noPadding} classes={mergeClasses(IconButtonClasses, classes)} {...restProps} />
    }
) as React.FC<IconButtonProps>

export default IconButton


