import React, { FC } from 'react'
import styled from 'styled-components'
import { Switch as MuiSwitch, SwitchProps as MuiSwitchProps } from '@material-ui/core'
import { FormControlLabel } from '../FormControlLabel'
import { SwitchClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'

export type SwitchProps = {
    label?: string
    /** Использовать чистый Switch из Material-UI */
    native?: boolean
} & MuiSwitchProps

const Switch: FC<SwitchProps> = (props): JSX.Element => {
    const { label, native, disabled, classes, ...restProps } = props

    return !native ? (
        <FormControlLabel
            label={label}
            disabled={disabled}
            control={<StyledSwitch data-testid="Switch" classes={mergeClasses(SwitchClasses, classes)} {...restProps} />}
        />
    ) : (
        <StyledSwitch data-testid="Switch" disabled={disabled} classes={mergeClasses(SwitchClasses, classes)} {...restProps} />
    )
}

Switch.defaultProps = {
    color: 'primary',
}

export default Switch

const StyledSwitch = styled(MuiSwitch)<SwitchProps>`
    &.${SwitchClasses.root}:not(.${SwitchClasses.sizeSmall}) {
        height: 36px;
        padding: 11px 12px;

        .${SwitchClasses.switchBase} {
            padding: 8px;
        }
    }
`
