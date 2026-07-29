import React from 'react'
import styled, { css } from 'styled-components'
import { MakeStyled } from '../../typings/utils'
import { IconButton } from '../IconButton'
import { Checkbox } from '../Checkbox'
import { Box, BoxProps } from '../Box'
import { Typography } from '../Typography'
import { IconButtonClasses, CheckboxClasses, RadioClasses } from '../../core/classes'
import { Radio } from '../Radio'

export const TreeViewContainer = styled.div`
    flex: 1 1 0%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

export const TreeViewBodyContainer = styled.div`
    flex-grow: 1;
    height: 0;
`

export const TreeViewBody = styled.div`
    height: 100%;
    overflow-y: auto;
`

export const TreeViewRowIcon = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    // 3 * 8 = 24 - размер кнопки или чекбокса
    // + 1 * 8 = 8 - правый отступ
    min-width: ${props => props.theme.spacing(4)}px;
`

export const TreeViewExpandButton = styled(IconButton)`
    &.${IconButtonClasses.root} {
        padding: 0;
        margin-right: ${props => props.theme.spacing(1)}px;
    }
`

export const TreeViewCheckbox = styled(Checkbox)`
    &.${CheckboxClasses.root} {
        padding: 0;
        margin-right: ${props => props.theme.spacing(1)}px;
    }
`

export const TreeViewRadio = styled(Radio)`
    &.${RadioClasses.root} {
        padding: 0;
        margin-right: ${props => props.theme.spacing(1)}px;
    }
`

export const TreeViewRowContent = styled.div`
    flex-grow: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

export const TreeViewRowMeta = styled.div`
    display: flex;
    flex-shrink: 0;
`

type TreeViewRowStyledProps = MakeStyled<{
    depth?: number,
    pickable?: boolean
    selectable?: boolean
    radio?: boolean
    isLeaf?: boolean
}>

export const TreeViewRow = styled.div<TreeViewRowStyledProps>`
    flex-shrink: 0;
    padding-left: ${props =>
        // левый отступ
        props.theme.spacing(1.5) +
        // смещение по глубине
        (props.$depth || 0) * props.theme.spacing(4) +
        // дополнительный сдвиг для листового узла в режиме с выборкой
        (props.$selectable && props.$isLeaf && !props.$radio ? props.theme.spacing(4) : 0)
    }px;
    // правый отступ
    padding-right: ${props => props.theme.spacing(1.5)}px;
    display: flex;
    align-items: center;

    transition: ${({ theme }) => theme.transitions.create('background-color', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.short,
    })};

    ${props => props.$pickable && css`
        cursor: pointer;

        &:hover {
            background-color: ${props => props.theme.palette.action.hover};
        }
    `}

    &.tree-view-node--is-picked {
        background-color: ${props => props.theme.palette.action.selected};
    }

    ${props => props.$selectable && css`
        ${TreeViewExpandButton} {
            margin-right: ${props => props.theme.spacing(1)}px;
        }
    `}

    .tree-view--children-zero-depth & {
        padding-left: ${props => props.theme.spacing(1.5)}px;

        ${TreeViewRowIcon} {
            min-width: unset;
        }
    }
`

export interface TreeViewListItemContentProps {
    primaryText?: string | number
    secondaryText?: string | number
    thirdText?: string | number
}

export const TreeViewListItemContent: React.FC<TreeViewListItemContentProps & BoxProps> = (props) => {
    const { primaryText, secondaryText, thirdText, ...restProps } = props

    return (
        <Box display="flex" alignItems="center" {...restProps}>
            <Box display="flex" flexDirection="column" flexGrow={1} overflow="hidden">
                <TypographyOverflow variant="caption" color="textSecondary">{ secondaryText }</TypographyOverflow>
                <TypographyOverflow>{ primaryText }</TypographyOverflow>
            </Box>
            { thirdText ? (
                <Box display="flex" marginLeft={.5}>
                    <Typography variant="subtitle1">{ thirdText }</Typography>
                </Box>
            ) : null }
        </Box>
    )
}

const TypographyOverflow = styled(Typography)`
    overflow: hidden;
    text-overflow: ellipsis;
`
