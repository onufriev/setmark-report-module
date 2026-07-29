import React, { FC } from 'react'
import {
    TabScrollButton as MuiTabScrollButton,
    TabScrollButtonProps as MuiTabScrollButtonProps
} from '@material-ui/core'

export type TabScrollButtonProps = MuiTabScrollButtonProps

const TabScrollButton: FC<TabScrollButtonProps> = (props): JSX.Element => (
    <MuiTabScrollButton data-testid="TabScrollButton" {...props} />
)

export default TabScrollButton
