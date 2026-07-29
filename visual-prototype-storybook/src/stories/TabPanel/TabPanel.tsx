import React, { FC } from 'react'
import styled from 'styled-components'
import { MakeStyled } from '../../typings/utils'

import { TabsProxyProps } from '../TabsProxy/Tabs'

export type TabPanelProps = {
    orientation?: TabsProxyProps['orientation']
    value: number
    index: number
}

const TabPanel: FC<TabPanelProps & React.HTMLAttributes<HTMLDivElement>> = (props): JSX.Element => {
    const { value, index, orientation, children, ...restProps } = props

    return (
        <StyledTabPanel
            data-testid="TabPanel"
            role="tabpanel"
            hidden={value !== index}
            $orientation={orientation}
            {...restProps}
        >
            { value === index && children }
        </StyledTabPanel>
    )
}

const StyledTabPanel = styled.div<MakeStyled<Pick<TabPanelProps, 'orientation'>>>`
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    &[hidden] {
        display: none;
    }

    ${props => props.$orientation === 'vertical' ? `
        border-top-right-radius: inherit;
        border-bottom-right-radius: inherit;
    ` : `
        border-bottom-right-radius: inherit;
        border-bottom-left-radius: inherit;
    `}
`

export default TabPanel
