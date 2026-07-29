import React, { forwardRef } from 'react'
import { Fab as MuiFab, FabProps as MuiFabProps } from '@material-ui/core'
import styled from 'styled-components'
import { MakeStyled } from '../../typings/utils'
import { FabClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

type OwnFabProps = {
    position?: 'static' | 'absolute' | 'fixed'
    placement?: 'top-left'| 'top-right' | 'bottom-right' | 'bottom-left'
    offset?: [number | string, number | string]
}

export type FabProps = OwnFabProps & MuiFabProps

/**
 * По-умолчанию FAB имеет абсолютное позиционирование в правом нижнем углу.
 * Чтобы сбросить позиционные настройки, необходимо использовать position="static".
 */
const Fab = forwardRef<HTMLButtonElement, FabProps>(
    function (props, forwardedRef) {
        const {
            position = 'absolute',
            placement = 'bottom-right',
            offset = [24, 24],
            classes,
            ...restProps
        } = props

        return (
            <StyledFab
                ref={forwardedRef}
                data-testid="Fab"
                classes={mergeClasses(FabClasses, classes)}
                $position={position}
                $placement={placement}
                $offset={offset}
                {...restProps}
            />
        )
    }
) as React.FC<FabProps>

Fab.defaultProps = {
    color: 'primary',
}

export default Fab

const StyledFab = styled(MuiFab)<MakeStyled<Required<OwnFabProps>>>`
    &.${FabClasses.root} {
        position: ${({ $position }) => $position !== 'static' ? $position : ''};

        ${({ $position, $placement, $offset }) => $position !== 'static' ? ({
            top: $placement.search('top') > -1
                ? typeof $offset[0] === 'number' ? `${$offset[0]}px` : $offset[0]
                : undefined,
            left: $placement.search('left') > -1
                ? typeof $offset[1] === 'number' ? `${$offset[1]}px` : $offset[1]
                : undefined,
            right: $placement.search('right') > -1
                ? typeof $offset[1] === 'number' ? `${$offset[1]}px` : $offset[1]
                : undefined,
            bottom: $placement.search('bottom') > -1
                ? typeof $offset[0] === 'number' ? `${$offset[0]}px` : $offset[0]
                : undefined,
        }) : ''}

        box-shadow: ${props => props.theme.shadows[2]};
    }
`
