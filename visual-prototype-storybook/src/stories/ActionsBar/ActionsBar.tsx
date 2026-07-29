import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'
import { ToolbarClasses } from '../../core/classes'
import { Toolbar } from '../Toolbar'
import { ToolbarProps } from '../Toolbar/Toolbar'

export type ActionsBarProps = {
    left?: ReactNode | ReactNode[]
    center?: ReactNode | ReactNode[]
    right?: ReactNode | ReactNode[]
} & ToolbarProps

const StyledToolbar = styled(Toolbar)<ToolbarProps>`
    &.${ToolbarClasses.root} {
        background-color: ${(props) => props.theme.palette.overlay.type3};
        border-bottom-right-radius: inherit;
        border-bottom-left-radius: inherit;
    }
`

const StyledPartsContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > :not(:first-child) {
        margin-left: ${props => props.theme.spacing(2)}px;
    }
`

const StyledItemsContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;

    > :not(:first-child) {
        margin-left: ${props => props.theme.spacing(1)}px;
    }
`

const StyledItem = styled.div`
    flex-grow: 0;
    flex-basis: auto;
`

const ActionsBar: FC<ActionsBarProps> = (props): JSX.Element => {
    const { left, center, right, children, ...restProps } = props

    const custom = left || center || right

    return (
        <StyledToolbar data-testid="ActionsBar" variant="dense" {...restProps}>
            {custom ? (
                <StyledPartsContainer>
                    <StyledItem>
                        {left && (
                            Array.isArray(left) ? (
                                <StyledItemsContainer>
                                    { left.map((node, index) => <StyledItem key={`left-${index}`}>{ node }</StyledItem>) }
                                </StyledItemsContainer>
                            ) : left
                        )}
                    </StyledItem>
                    <StyledItem>
                        {center && (
                            Array.isArray(center) ? (
                                <StyledItemsContainer>
                                    { center.map((node, index) => <StyledItem key={`center-${index}`}>{ node }</StyledItem>) }
                                </StyledItemsContainer>
                            ) : center
                        )}
                    </StyledItem>
                    <StyledItem>
                        {right && (
                            Array.isArray(right) ? (
                                <StyledItemsContainer>
                                    { right.map((node, index) => <StyledItem key={`right-${index}`}>{ node }</StyledItem>) }
                                </StyledItemsContainer>
                            ) : right
                        )}
                    </StyledItem>
                </StyledPartsContainer>
            ) : children}
        </StyledToolbar>
    )
}

export default ActionsBar
