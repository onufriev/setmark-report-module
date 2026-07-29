import React, { FC } from 'react'
import styled from 'styled-components'
import { Radio as MuiRadio, RadioProps as MuiRadioProps } from '@material-ui/core'
import { FormControlLabel } from '../FormControlLabel'
import { FormControlLabelClasses, RadioClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'
import { MakeStyled } from '../../typings/utils'

export type RadioProps = {
    label?: React.ReactNode
    variant?: 'default' | 'outlined'
    /** Использовать чистый Radio из Material-UI */
    native?: boolean
} & MuiRadioProps

const Radio: FC<RadioProps> = (props): JSX.Element => {
    const { label, id, native, variant, disabled, checked, classes, ...restProps } = props

    return !native ? (
        <RadioFormControlLabel
            label={label}
            $variant={variant}
            disabled={disabled}
            $checked={checked}
            id={id && `${id}RadioControl`}
            control={<StyledRadio id={id} data-testid="Radio" checked={checked} classes={mergeClasses(RadioClasses, classes)} {...restProps} />}
        />
    ) : (
        <StyledRadio id={id} data-testid="Radio" disabled={disabled} checked={checked} classes={mergeClasses(RadioClasses, classes)} {...restProps} />
    )
}

Radio.defaultProps = {
    color: 'primary',
}

export default Radio

const StyledRadio = styled(MuiRadio)<RadioProps>`
    &.${RadioClasses.root} {
        padding: 6px;
    }
`

const RadioFormControlLabel = styled(FormControlLabel)<MakeStyled<RadioProps>>`
    &.${FormControlLabelClasses.root} {
        width: 100%;
        ${props => props.$variant === 'outlined' && `
            align-items: center;
            border: 1px solid;
            border-color: ${props.theme.palette.divider};
            border-radius: 5px;
            padding: ${props.theme.spacing(0.5)}px;
            padding-right: ${props.theme.spacing(1)}px;
            margin-bottom: ${props.theme.spacing(1)}px;
        `}

        ${props => props.$variant === 'outlined' && props.$checked && `
            border: 1px solid;
            border-color: ${props.theme.palette.overlay.hover};
            background: ${props.theme.palette.overlay.hover};
        `}

        .${FormControlLabelClasses.label} {
            ${props => props.$variant === 'outlined' && `
                padding-left: ${props.theme.spacing(1)}px;
                margin-top: 0px;
            `}
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
`
