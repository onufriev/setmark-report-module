import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { MakeStyled } from '../../typings/utils'
import { Box, BoxProps } from '../Box'

export type StackProps = BoxProps & {
    spacing?: number
    direction?: StackDirection
    divider?: ReactNode
}

type StyledStackProps = BoxProps & MakeStyled<{
    spacing: number
    direction: StackDirection
}>

const StyledStack = styled(Box)<StyledStackProps>`
    display: flex;
    flex-direction: ${(props) => props.$direction};

    & > :not(style) + :not(style) {
        margin: 0;
        ${(props) =>
            `margin-${getSideFromDirection(props.$direction)}: ${props.theme.spacing(
                props.$spacing,
            )}px`};
    }
`

const Stack: React.FC<StackProps> = (props) => {
    const { spacing = 0, direction = 'row', divider, children, ...restProps } = props

    return (
        <StyledStack {...restProps} $spacing={spacing} $direction={direction}>
            { divider ? joinChildren(children, divider) : children }
        </StyledStack>
    )
}

export default Stack

export type StackDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'

function getSideFromDirection(direction: StackDirection) {
    return {
        row: 'left',
        'row-reverse': 'right',
        column: 'top',
        'column-reverse': 'bottom',
    }[direction]
}
/**
 * Return an array with the separator React element interspersed between
 * each React node of the input children.
 *
 * > joinChildren([1,2,3], 0)
 * [1,0,2,0,3]
 *
 * From {@link https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Stack/Stack.js}
 */
function joinChildren (children: ReactNode | ReactNode[], separator: ReactNode) {
    const childrenArray = React.Children.toArray(children).filter(Boolean)

    return childrenArray.reduce<ReactNode[]>((output, child, index) => {
        output.push(child)

        if (index < childrenArray.length - 1) {
            output.push(React.cloneElement(separator as any, { key: `separator-${index}` }))
        }

        return output
    }, [])
}
