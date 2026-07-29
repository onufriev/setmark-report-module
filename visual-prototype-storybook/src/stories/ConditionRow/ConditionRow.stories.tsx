import React from 'react'
import { Meta, Story } from '@storybook/react'
import { ContentBox } from '../ContentBox'
import ConditionRow from './ConditionRow'
import { ConditionWrapper } from '../ConditionWrapper'

export default {
    title: 'ConditionRow',
    component: ConditionRow,
    parameters: {
        design: {
            type: 'figma',
        },
    },
} as Meta

export const FullExample: Story = () => {
    return (
        <ContentBox>
            <ConditionWrapper
                label={'Триггер с текстом'}
                onOpen={() => console.log('true')}
            >
                <ConditionRow
                    title={'Триггер с текстом'}
                    subtitle={'Триггер с текстом'}
                />
            </ConditionWrapper>
        </ContentBox>
    )
}
