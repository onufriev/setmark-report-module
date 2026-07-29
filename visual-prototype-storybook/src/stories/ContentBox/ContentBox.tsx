import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import { MakeStyled } from '../../typings/utils'
import { Box, BoxProps } from '../Box'
import { Paper } from '../Paper'

type OwnContentBoxProps = {
    /** Делает горизонтальный flex контейнер */
    flexContainer?: boolean
    /** Делает вертикальный flex контейнер */
    flexContainerVertical?: boolean
    /** Растягивает компонент */
    flexChildStretched?: boolean
    /** Растягивает компонент и делает содержимое прокручиваемым */
    flexScrollContainer?: boolean
    /** Выравнивает элементы по центру */
    flexCenter?: boolean
}

export type ContentBoxProps = OwnContentBoxProps & BoxProps

const StyledBox = styled(Box)<MakeStyled<OwnContentBoxProps>>`
    ${props => props.$flexContainer && css`
        display: flex;
    `}
    ${props => props.$flexContainerVertical && css`
        display: flex;
        flex-direction: column;
    `}
    ${props => props.$flexChildStretched && css`
        flex-grow: 1;
    `}
    ${props => props.$flexScrollContainer && css`
        flex-glow: 1;
        height: 0;
        overflow: auto;
    `}
    ${props => props.$flexCenter && css`
        align-items: center;
        justify-content: center;
    `}
`

const ContentBox: FC<ContentBoxProps> = (props) => {
    const {
        flexContainer,
        flexContainerVertical,
        flexChildStretched,
        flexScrollContainer,
        flexCenter,
        children,
        ...restProps
    } = props

    return (
        <StyledBox
            p={1.5}
            $flexContainer={flexContainer}
            $flexContainerVertical={flexContainerVertical}
            $flexChildStretched={flexChildStretched}
            $flexScrollContainer={flexScrollContainer}
            $flexCenter={flexCenter}
            component={Paper}
            {...restProps}
        >
            {children}
        </StyledBox>
    )
}

export default ContentBox
