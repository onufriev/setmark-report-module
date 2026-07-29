import React, { FC, forwardRef } from 'react'
import {
    Tab as MuiTab,
    TabProps as MuiTabProps
} from '@material-ui/core'
import styled, { css } from 'styled-components'
import { TabClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'
import { MakeStyled } from '../../typings/utils'
import { TabsProxyProps } from '../TabsProxy/Tabs'

export type TabProxyProps = MuiTabProps & Pick<TabsProxyProps, 'orientation'>

const StyledTab = styled(MuiTab)<MakeStyled<{ orientation?: TabProxyProps['orientation'] }>>`
    &[hidden] {
        display: none;
    }
}}`

const Tab: FC<TabProxyProps> = (props): JSX.Element => {
    const { orientation, classes, icon, ...restProps } = props
    return (
        <StyledTab
            data-testid="Tab"
            $orientation={orientation}
            icon={icon}
            classes={mergeClasses(TabClasses, classes)}
            {...restProps}
        />
    )
}

export default Tab
