import React, { useEffect, useRef, useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ContentBox } from '../ContentBox'
import TablePagination, { TablePaginationProps } from './components/pagination/TablePagination'

export default {
    title: 'Table/Pagination',
    component: TablePagination,
} as Meta

const handleStateChange = action('onStateChange')

const UncontrolledTemplate: Story<TablePaginationProps> = (args) => {
    return (
        <ContentBox>
            <TablePagination
                id="Test"
                {...args}
            />
        </ContentBox>
    )
}

export const Uncontrolled: Story<TablePaginationProps> = UncontrolledTemplate.bind({})
Uncontrolled.args = {
    count: 1234,
    defaultPage: 2,
    defaultPageSize: 25
}

export const FewItems: Story<TablePaginationProps> = UncontrolledTemplate.bind({})
FewItems.args = {
    count: 5,
    defaultPageSize: 25
}

export const Disabled: Story<TablePaginationProps> = UncontrolledTemplate.bind({})
Disabled.args = {
    count: 25,
    defaultPageSize: 10,
    disabled: true
}

export const Controlled: Story<Omit<TablePaginationProps, 'count' | 'page' | 'pageSize'>> = (args) => {
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    return (
        <ContentBox>
            <TablePagination
                id="Test"
                count={1234}
                page={page}
                pageSize={pageSize}
                {...args}
                onStateChange={newState => {
                    setPage(newState.page)
                    setPageSize(newState.pageSize)
                    handleStateChange(newState)
                }}
            />
        </ContentBox>
    )
}
