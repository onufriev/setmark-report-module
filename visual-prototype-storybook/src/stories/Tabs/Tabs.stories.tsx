import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Tabs, { TabsProps } from './Tabs'
import { ContentBox } from '../ContentBox'
import { DialogConfirm } from '../DialogConfirm'
import { cloneDeep } from 'lodash'

export default {
    title: 'Tabs/Tabs',
    component: Tabs,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=3391%3A6715',
        },
        actions: { argTypesRegex: null }
    },
} as Meta

const TABS_COUNT = 10

const uncontrolledTabsProp = [...new Array(TABS_COUNT)].map((_, i) => ({
    label: 'Очень большое и длинное название таба' + i,
    disabled: i % 3 === 0,
    hidden: i === 4 || i === 9,
}))

const UncontrolledTemplate: Story<TabsProps> = (args) => (
    <ContentBox p={0}>
        <Tabs
            id="BeautifulTabs"
            {...args}
        >
            {
                [...new Array(TABS_COUNT)].map((_, i) => (
                    <ContentBox component="div" key={i}>
                        {i} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur repellendus
                        vitae voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Pariatur repellendus vitae voluptate? Lorem ipsum dolor sit amet, consectetur
                        adipisicing elit. Pariatur repellendus vitae voluptate? Lorem ipsum dolor sit
                        amet, consectetur adipisicing elit. Pariatur repellendus vitae voluptate? Lorem
                        ipsum dolor sit amet, consectetur adipisicing elit. Pariatur repellendus vitae
                        voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur
                        repellendus vitae voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Pariatur repellendus vitae voluptate? Lorem ipsum dolor sit amet,
                        consectetur adipisicing elit. Pariatur repellendus vitae voluptate? Lorem ipsum
                        dolor sit amet, consectetur adipisicing elit. Pariatur repellendus vitae
                        voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur
                        repellendus vitae voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Pariatur repellendus vitae voluptate? Lorem ipsum dolor sit amet,
                        consectetur adipisicing elit. Pariatur repellendus vitae voluptate?
                    </ContentBox>
                ))
            }
        </Tabs>
    </ContentBox>
)

export const UncontrolledHorizontal: Story<TabsProps> = UncontrolledTemplate.bind({})
UncontrolledHorizontal.args = {
    tabs: uncontrolledTabsProp,
}

export const UncontrolledVertical: Story<TabsProps> = UncontrolledTemplate.bind({})
UncontrolledVertical.args = {
    tabs: uncontrolledTabsProp,
    orientation: 'vertical',
}

const controlledTabsProp = [...new Array(TABS_COUNT)].map((_, i) => ({
    label: 'Page ' + i,
    value: i,
    disabled: i % 3 === 0,
    hidden: i === 4 || i === 9,
}))

const actionHandler = action('onTabChange')

const ControlledTemplate: Story<TabsProps> = (args) => {
    const [value, setValue] = React.useState<number>(0)

    return (
        <ContentBox p={0} height={400}>
            <Tabs
                id="BeautifulTabs"
                {...args}
                value={value}
                onTabChange={(value, index, tab) => {
                    setValue(value)
                    actionHandler(value, index, tab)
                }}
            >
                {
                    [...new Array(TABS_COUNT)].map((_, i) => (
                        <ContentBox component="div" key={i} flexChildStretched flexContainerVertical flexScrollContainer>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur repellendus
                            vitae voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Pariatur repellendus vitae voluptate? Lorem ipsum dolor sit amet, consectetur
                            adipisicing elit. Pariatur repellendus vitae voluptate? Lorem ipsum dolor sit
                            amet, consectetur adipisicing elit. Pariatur repellendus vitae voluptate? Lorem
                            ipsum dolor sit amet, consectetur adipisicing elit. Pariatur repellendus vitae
                            voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur
                            repellendus vitae voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit. Pariatur repellendus vitae voluptate? Lorem ipsum dolor sit amet,
                            consectetur adipisicing elit. Pariatur repellendus vitae voluptate? Lorem ipsum
                            dolor sit amet, consectetur adipisicing elit. Pariatur repellendus vitae
                            voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur
                            repellendus vitae voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit. Pariatur repellendus vitae voluptate? Lorem ipsum dolor sit amet,
                            consectetur adipisicing elit. Pariatur repellendus vitae voluptate?
                            <br /><br />
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
                            voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
                            sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt
                            ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
                            quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
                            ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate
                            velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
                            voluptas nulla pariatur?
                        </ContentBox>
                    ))
                }
            </Tabs>
        </ContentBox>
    )
}

export const ControlledHorizontal: Story<TabsProps> = ControlledTemplate.bind({})
ControlledHorizontal.args = {
    tabs: controlledTabsProp,
    variant: 'scrollable',
}

export const ControlledVertical: Story<TabsProps> = ControlledTemplate.bind({})
ControlledVertical.args = {
    tabs: controlledTabsProp,
    orientation: 'vertical',
    variant: 'scrollable',
}

export const AllTabsDisabled: Story<TabsProps> = UncontrolledTemplate.bind({})
AllTabsDisabled.args = {
    tabs: [...new Array(TABS_COUNT)].map((_, i) => ({
        label: 'Очень большое и длинное название таба ' + i,
        value: i * 100,
        disabled: true,
    })),
}

const editableTabsMock = [
    {
        label: 'Page 1',
        value: 0,
        disabled: true,
        hidden: false,
        content: 'Какой-то контент определенный'
    },
    {
        label: 'Page 2',
        value: 1,
        disabled: false,
        hidden: false,
        content: 'Какой-то контент определенный, самый определенный'
    },
    {
        label: 'Page 3',
        value: 2,
        disabled: false,
        hidden: false,
        content: 'А здесь неопределенный'
    },
    {
        label: 'Page 4',
        value: 3,
        disabled: false,
        hidden: false,
        content: 'Тут вообще другой, не тот что раньше'
    }
]

const EditableTemplate: Story<TabsProps> = (args) => {
    const [value, setValue] = React.useState<number>(0)
    const [tabs, setTabs] = React.useState(editableTabsMock)

    const [confirmOpen, setConfirmOpen] = useState<string>('')

    return (
        <ContentBox p={0} height={400}>
            <Tabs
                id="BeautifulTabs"
                {...args}
                value={value}
                tabs={tabs}
                onTabChange={(value, index, tab) => {
                    setValue(value)
                    actionHandler(value, index, tab)
                }}
                addNewTabLabel="Новая вкладка"
                editable
                onTabAdd={() => {
                    const newTabValue = tabs[tabs.length - 1].value + 1

                    setTabs([...tabs,
                        {
                            label: 'Новый таб',
                            value: newTabValue,
                            disabled: false,
                            hidden: false,
                            content: 'А тут новый контент.'
                        }
                    ])

                    setValue(newTabValue)
                }}
                onTabRemove={removingValue => {
                    setConfirmOpen(String(removingValue))
                }}
            >
                {
                    tabs.map((_, i) => (
                        <ContentBox component="div" key={i} flexChildStretched flexContainerVertical flexScrollContainer>
                            {_.content}
                        </ContentBox>
                    ))
                }
            </Tabs>
            <DialogConfirm
                title='Вы уверены, что хотите удалить таб?'
                open={Boolean(confirmOpen)}
                buttons={[
                    {
                        label: "Нет",
                        onClick: () => setConfirmOpen('')
                    },
                    {
                        label: "Да",
                        onClick: () => {
                            const currentTabs = cloneDeep(tabs)
                            const removingTabIndex = currentTabs.findIndex(tab => tab.value === Number(confirmOpen))
                            const newTabs = currentTabs.filter(tab => tab.value !== Number(confirmOpen))

                            // Логика управлением значения текущего таба
                            // (без нее по умолчанию будет перебрасывать на первый таб, если таб со значением не будет найден)
                            if (Number(confirmOpen) === value) {
                                const newValue = removingTabIndex === 0
                                    ? tabs[removingTabIndex + 1].value
                                    : tabs[removingTabIndex - 1].value

                                setValue(newValue)
                            }

                            setTabs(newTabs)
                            setConfirmOpen('')
                        }
                    }
               ]}
            />
        </ContentBox>
    )
}

export const EditableHorizontal: Story<TabsProps> = EditableTemplate.bind({})
EditableHorizontal.args = {
    variant: 'scrollable',
}

export const EditableVertical: Story<TabsProps> = EditableTemplate.bind({})
EditableVertical.args = {
    variant: 'scrollable',
    orientation: 'vertical',

}
