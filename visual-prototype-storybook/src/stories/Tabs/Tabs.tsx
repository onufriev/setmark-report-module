import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import TabProxy, { TabProxyProps } from '../TabProxy/Tab'
import TabsProxy, { TabsProxyProps } from '../TabsProxy/Tabs'
import TabPanel from '../TabPanel/TabPanel'
import { findEnabledTab, tabIsEnabled } from './utils'
import { MakeStyled } from '../../typings/utils'
import { Button } from '../Button'
import { Box, IconButton, Icons, Typography } from '../..'
import { ButtonClasses, IconButtonClasses, TabClasses, TypographyClasses } from '../../core/classes'

export type TabProps = {
    id?: string
    label: string
    /**
     * Используйте примитивы, т.к. используется строгое сравнение.
     * Если используете объекты или массивы, передавайте ссылку, а не копию
     */
    value?: any
    hidden?: boolean
} & Pick<TabProxyProps, 'wrapped' | 'disabled'>

export type TabsProps = {
    id?: string
    tabs: TabProps[]
    value?: number
    addNewTabLabel?: string
    editable?: boolean
    onTabChange?: (value: any, index: number, tab: TabProps) => void
    onTabAdd?: () => void
    onTabRemove?: (removingValue: number) => void
} & Pick<TabsProxyProps, 'variant' | 'orientation' | 'centered' | 'indicatorColor' | 'textColor'>

const Tabs: React.FC<TabsProps> = (props) => {
    const {
        id,
        tabs,
        value: valueProps,
        addNewTabLabel,
        editable,
        onTabChange,
        onTabAdd,
        onTabRemove,
        variant = 'standard',
        orientation = 'horizontal',
        indicatorColor,
        textColor = 'secondary',
        centered,
        children,
    } = props

    const [currentIndex, setCurrentIndex] = useState<number>(() => {
        let valueIndex = valueProps ? tabs.findIndex(tab => tab.value === valueProps) : 0
        if (valueIndex === -1) valueIndex = 0
        return tabIsEnabled(tabs[valueIndex]) ? valueIndex : findEnabledTab(tabs, valueIndex)
    })

    useEffect(() => {
        const currentItem = tabs[currentIndex]
        const currentItemValue = currentItem?.value

        if (currentItem) onTabChange?.(currentItemValue, currentIndex, currentItem)
    }, [currentIndex])

    useEffect(() => {
        let valueIndex = valueProps ? tabs.findIndex(tab => tab.value === valueProps) : 0
        if (valueIndex === -1) valueIndex = 0
        setCurrentIndex(tabIsEnabled(tabs[valueIndex]) ? valueIndex : findEnabledTab(tabs, valueIndex))
    }, [valueProps, tabs])

    const handleChange = (event: React.ChangeEvent<{}>, newIndex: number) => {
        setCurrentIndex(newIndex)
    }

    const handleRemove = (event: React.ChangeEvent<{}>, value: number) => {
        event.stopPropagation()
        onTabRemove?.(value)
    }

    const childrenItems = React.Children.toArray(children)

    if (tabs.length !== childrenItems.length) {
        console.error('CSI UI: the number of elements in the parameter "tabs" does not match the number of children!')
        return null
    }

    const isLastEnabledTab = tabs.filter(tab => !tab.hidden && !tab.disabled).length === 1
    const showRemoveButton = Boolean(!isLastEnabledTab && editable)

    return (
        <StyledTabsContainer
            id={id}
            $orientation={orientation}
        >
            <TabNavigateContainer $orientation={orientation}>
                <TabsProxy
                    id={id && `${id}Tabs`}
                    value={currentIndex}
                    indicatorColor={indicatorColor}
                    textColor={textColor}
                    variant={variant}
                    orientation={orientation}
                    centered={centered}
                    // @ts-ignore
                    onChange={handleChange}
                    role="tabs"
                    $showRemoveButton={showRemoveButton}
                >
                    {
                        tabs.map((item, i) => (
                            <StyledTabProxy
                                id={item.id || id && `${id}Tab${i}`}
                                label={item.label}
                                disabled={item.disabled}
                                key={i}
                                role="tab"
                                wrapped={item.wrapped}
                                hidden={item.hidden}
                                textColor={textColor}
                                orientation={orientation}
                                icon={showRemoveButton && !item.disabled ? (
                                    <IconButton
                                        id={item.id || id && `${id}Tab${i}RemoveButton`}
                                        onClick={e => handleRemove(e, item.value)}
                                        noPadding
                                    >
                                        <Icons.Clear fontSize="small"/>
                                    </IconButton>
                                ) : undefined}
                            />
                        ))
                    }
                </TabsProxy>
                {editable &&
                    <AddTabButton
                        $orientation={orientation}
                        onClick={onTabAdd}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                        >
                            <Icons.Add />
                            {addNewTabLabel && (
                                <Box pl={1}>
                                    <Typography>
                                        { addNewTabLabel }
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </AddTabButton>
                }
            </TabNavigateContainer>
            {
                tabs.map((item, i) => (
                    <TabPanel
                        id={item.id && `${item.id}TabPanel${i}` || id && `${id}TabPanel${i}`}
                        value={currentIndex}
                        index={i}
                        key={i}
                        orientation={orientation}
                    >
                        { childrenItems[i] }
                    </TabPanel>
                ))
            }
        </StyledTabsContainer>
    )
}

Tabs.defaultProps = {
    textColor: 'primary',
    indicatorColor: 'primary',
}

export default Tabs

const StyledTabsContainer = styled.div<MakeStyled<Pick<TabsProps, 'orientation'>>>`
    height: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: ${props => props.$orientation === 'vertical' ? 'row' : 'column'};
    border-radius: inherit;
`

const TabNavigateContainer = styled.div<MakeStyled<Pick<TabsProps, 'orientation'>>>`
    flex-direction: ${props => props.$orientation === 'vertical' ? 'column' : 'row'};
    display: flex;
    ${props => props.$orientation === 'vertical' && `
        border-right: 1px solid ${props.theme.palette.divider};
    `}
    ${props => props.$orientation === 'horizontal' && `
        border-bottom: 1px solid ${props.theme.palette.divider};
    `}
    background-color: ${props => props.theme.palette.overlay.type3};
    overflow: hidden;
    min-width: 160px;
`

const AddTabButton = styled(Button)<MakeStyled<Pick<TabsProps, 'orientation'>>>`
    &.${ButtonClasses.root} {
        min-width: max-content;

        .${TypographyClasses.root} {
            font-weight: ${(props) => props.theme.typography.fontWeightMedium};
        }

        ${props => props.$orientation === 'vertical' && `
            text-transform: none;
        `}
    }
`

const StyledTabProxy = styled(TabProxy)<MakeStyled<Pick<TabsProps, 'orientation'>>>`
    &.${ButtonClasses.root} {
        min-width: max-content;
    }

    &.${TabClasses.root} {
        .${TabClasses.wrapper} > *:first-child {
            margin-bottom: 0;
        }
    }

    .${IconButtonClasses.root} {
        margin-left: 16px;
    }
`
