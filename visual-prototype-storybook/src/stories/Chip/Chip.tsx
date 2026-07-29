import React, { FC } from 'react'
import { Chip as MuiChip, ChipProps as MuiChipProps } from '@material-ui/core'
import styled from 'styled-components'
import { ChipClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type ChipProps = MuiChipProps

const Chip: FC<ChipProps> = (props): JSX.Element => {
    const { classes, ...restProps } = props
    return <StyledChip data-testid="Chip" classes={mergeClasses(ChipClasses, classes)} {...restProps} />
}

export default Chip

const StyledChip = styled(MuiChip)<MuiChipProps>`
    &.${ChipClasses.root} {
        height: 28px;
        border-radius: 14px;
        font-size: ${(props) => props.theme.typography.caption.fontSize}px;
        line-height: ${(props) => props.theme.typography.caption.lineHeight};

        &.${ChipClasses.clickable} {
            &:not(.${ChipClasses.colorPrimary}):not(.${ChipClasses.colorSecondary}) {
                background-color: ${(props) => props.theme.palette.overlay.type1};

                &:hover {
                    background-color: ${(props) => props.theme.palette.overlay.hover};
                }
            }

            &:active {
                box-shadow: none;
            }
        }
    }

    &.${ChipClasses.sizeSmall} {
        height: 20px;
        border-radius: 10px;
    }

    & .${ChipClasses.label} {
        padding-left: 9px;
        padding-right: 9px;
    }
`
