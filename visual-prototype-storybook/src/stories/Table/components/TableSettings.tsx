import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { MakeStyled } from '../../../typings/utils'

export type TableSettingsProps = React.HTMLAttributes<HTMLDivElement>

export const TableSettings = forwardRef<HTMLDivElement, TableSettingsProps>(
    function (props, forwardedRef) {
        const { children, ...restProps } = props

        return (
            <StyledTableSettings
                ref={forwardedRef}
                {...restProps}
            >
                { children }
            </StyledTableSettings>
        )
    }
)

const StyledTableSettings = styled.div<MakeStyled<{}>>`
    flex: 1 1 0%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

export type TableSettingsSwitchItemProps = React.HTMLAttributes<HTMLDivElement>

export const TableSettingsSwitchItem = forwardRef<HTMLDivElement, TableSettingsSwitchItemProps>(
    function (props, forwardedRef) {
        const { children, ...restProps } = props

        return (
            <StyledTableSettingsSwitchItem
                ref={forwardedRef}
                className="table-settings__switch-item"
                {...restProps}
            >
                { children }
            </StyledTableSettingsSwitchItem>
        )
    }
)

const StyledTableSettingsSwitchItem = styled.div<MakeStyled<{}>>`
    padding: 0;
`
