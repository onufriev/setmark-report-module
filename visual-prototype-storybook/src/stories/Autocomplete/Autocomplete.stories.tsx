import React, { useRef, useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Autocomplete from './Autocomplete'
import { AutocompleteProps } from './types'
import { ContentBox } from '../ContentBox'
import { Typography } from '../Typography'
import { Box } from '../Box'
import { Dialog } from '../Dialog'
import { Button } from '../Button'
import { Stack } from '../Stack'
import { Menu } from '../icons'
import { IconButton } from '../IconButton'
import { Chip } from '../Chip'

import {
    getFakeOptions,
    mockFilterRequest,
    mockInfiniteRequest,
    mockShopRequests,
    ShopVO,
} from '../__mock__'


export default {
    title: 'Form/Autocomplete',
    component: Autocomplete,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const Template: Story<AutocompleteProps> = (args) => (
    <ContentBox>
        <Autocomplete
            {...args}
            style={{ width: args.multiple ? '600px' : '300px' }}
        />
    </ContentBox>
)

export const Default: Story<AutocompleteProps> = Template.bind({})

Default.args = {
    label: 'Поиск пользователя',
    options: getFakeOptions(),
}

export const DisabledOptions: Story<AutocompleteProps> = Template.bind({})

DisabledOptions.args = {
    options: getFakeOptions(),
    getOptionDisabled: o => o.includes('n'),
    placeholder: 'Введите имя пользователя',
}

export const Multiple: Story<AutocompleteProps<string, true>> = Template.bind({})

Multiple.args = {
    label: 'Поиск пользователя',
    options: getFakeOptions(),
    multiple: true,
    placeholder: 'Введите имя пользователя',
}

export const DisableClearable: Story<AutocompleteProps<string, false, true>> = Template.bind({})

DisableClearable.args = {
    options: getFakeOptions(),
    disableClearable: true,
}

const request = mockFilterRequest()

export const FetchOnFocus: Story<AutocompleteProps<string>> = Template.bind({})

FetchOnFocus.args = {
    fetchOptions: async () => {
        const res = await request()
        console.log('[FetchOnFocus] fetch result:', res)
        return res
    },
}

export const FetchOnInput: Story<AutocompleteProps<string>> = Template.bind({})

FetchOnInput.args = {
    fetchOptions: async (inputValue) => {
        const res = await request(inputValue)
        console.log('[FetchOnInput] fetch result:', res)
        return res
    },
    fetchOptionsOnInput: true,
}

const actionChangeHandler = action('onChange')
const actionInputChangeHandler = action('onInputChange')

export const FreeMode: Story<AutocompleteProps<string>> = () => {
    const optionsRef = useRef(getFakeOptions())

    const [value, setValue] = useState<string>('')

    return (
        <ContentBox>
            <Autocomplete
                onChange={value => {
                    setValue(value || '')
                    actionChangeHandler(value)
                }}
                inputValue={value}
                onInputChange={value => {
                    setValue(value)
                    actionInputChangeHandler(value)
                }}
                freeSolo
                options={optionsRef.current}
                optionsLimit={10}
                style={{ width: '300px' }}
            />
        </ContentBox>
    )
}

export const FetchOnInputWithServerFilter: Story<AutocompleteProps<string>> = () => {
    const requestRef = useRef(mockFilterRequest())

    const [value, setValue] = useState<string | null>(null)

    const fetchOptions = async (inputValue: string): Promise<string[]> => {
        const res = await requestRef.current(inputValue)
        console.log('[FetchOnInputWithServerFilter] fetch result:', res)
        return res
    }

    return (
        <ContentBox>
            <Autocomplete
                value={value}
                onChange={value => {
                    setValue(value)
                    actionChangeHandler(value)
                }}
                fetchOptions={fetchOptions}
                fetchOptionsOnInput
                fetchOptionsOnInputLength={1}
                optionsLimit={10}
                autoSelectOneMatch
                style={{ width: '300px' }}
                helperText="Продуктовый пример с серверной фильтрацией, началом загрузки от одного символа и ограничением количества выводимых результатов"
            />
        </ContentBox>
    )
}

export const FetchOnInputWithServerFilterAndInfiniteScroll: Story<AutocompleteProps<string>> = () => {
    const requestRef = useRef(mockInfiniteRequest())

    const [value, setValue] = useState<string | null>(null)
    const [page, setPage] = useState<number>(0)
    const [totalCount, setTotalCount] = useState<number>(0)

    const itemsOnPage = 20

    const fetchOptions = async (inputValue: string, { options, valueChange }): Promise<string[]> => {
        const res = await requestRef.current(
            inputValue,
            valueChange ? 0 : page + 1,
            itemsOnPage
        )

        console.log('[FetchOnInputWithServerFilterAndInfiniteScroll] fetch result:', res)

        setPage(res.page)
        setTotalCount(res.totalCount)

        return valueChange ? res.items : [...options, ...res.items]
    }

    return (
        <ContentBox>
            <Stack spacing={2} alignItems="flex-start">
                <Autocomplete
                    value={value}
                    onChange={value => {
                        setValue(value)
                        actionChangeHandler(value)
                    }}
                    fetchOptions={fetchOptions}
                    fetchOptionsOnInput
                    fetchOptionsOnInputLength={1}
                    fetchOptionsHasMore={page * itemsOnPage < totalCount}
                    style={{ width: '300px' }}
                    helperText="Продуктовый пример с серверной фильтрацией, началом загрузки от одного символа и подгрузкой результатов при скроллинге списка"
                />

                <Button color="primary" onClick={() => setValue(null)}>Очистить Autocomplete</Button>
            </Stack>
        </ContentBox>
    )
}

export const ShopAutocompleteExample: Story<AutocompleteProps<ShopVO>> = () => {
    const requestRef = useRef(mockShopRequests())

    const [value, setValue] = useState<ShopVO[]>(() => ([requestRef.current.items[100]]))

    const fetchOptions = async (inputValue: string): Promise<ShopVO[]> => {
        const res = await requestRef.current.getShops(inputValue)
        console.log('[ShopAutocompleteExample] fetch result:', res)
        return res
    }

    return (
        <ContentBox>
            <Stack spacing={2} alignItems="flex-start">
                <Autocomplete<ShopVO, true, false>
                    multiple
                    value={value}
                    onChange={value => {
                        setValue(value)
                        actionChangeHandler(value)
                    }}
                    fetchOptions={fetchOptions}
                    fetchOptionsOnInput
                    optionsLimit={20}
                    autoSelectOneMatch
                    isOptionEqualToValue={(o, v) => o.number === v.number}
                    getOptionLabel={o => String(o.number)}
                    renderOptionInner={o => (
                        <Box>
                            <Typography display="block" variant="caption">Номер: {o.number}</Typography>
                            <Typography display="block" variant="caption" color="textSecondary">Магазин: {o.name}</Typography>
                            <Typography display="block" variant="caption" color="textSecondary">Город: {o.city}</Typography>
                        </Box>
                    )}
                    disableCloseOnSelect
                    style={{ width: '300px' }}
                    helperText="Продуктовый пример поля выбора магазина"
                />

                <Button color="primary" onClick={() => setValue([])}>Очистить Autocomplete</Button>
            </Stack>
        </ContentBox>
    )
}

export const CustomValueAutocompleteExample: Story<AutocompleteProps<string>> = (args) => {
    const [value, setValue] = useState<string[]>([])

    return (
        <ContentBox>
            <Stack spacing={2} alignItems="flex-start">
                <Autocomplete<string, true, false>
                    renderTags={(value, getTagProps) => {
                        return (
                            <Box
                                display="flex"
                                overflow="hidden"
                                alignItems="center"
                            >
                                <Box
                                    display="flex"
                                    overflow="hidden"
                                    justifyContent="flex-end"
                                    gridGap={8}
                                    pr={1}
                                >
                                    {value.map((value, index) => {
                                        return (
                                            <Chip
                                                color="secondary"
                                                label={value}
                                                size="small"
                                                {...getTagProps(index)}
                                            />
                                         )
                                    })}
                                </Box>
                                <Typography variant="caption">+{value.length}</Typography>
                            </Box>
                        )
                    }}
                    endAdornment={
                        <IconButton size="small" onClick={(e)=> e.stopPropagation()}>
                            <Menu />
                        </IconButton>
                    }
                    enablePopupIndicator
                    multiple
                    value={value}
                    onChange={(value) => {
                        setValue(value)
                        actionChangeHandler(value)
                    }}
                    optionsLimit={20}
                    autoSelectOneMatch
                    options={getFakeOptions()}
                    disableCloseOnSelect
                    style={{ width: '300px' }}
                />

            </Stack>
        </ContentBox>
    )
}


export const ModalExample = () => {
    return (
        <Dialog open>
            <ShopAutocompleteExample />
        </Dialog>
    )
}

export const StatesExample = () => {
    const [value, setValue] = useState<string | null>(null)

    return (
        <ContentBox>
            <Stack direction="column" spacing={2} width="300px">
                <Autocomplete
                    value={value}
                    onChange={setValue}
                    options={getFakeOptions()}
                />
                <Autocomplete
                    value={value}
                    onChange={setValue}
                    options={getFakeOptions()}
                    disabled
                    helperText="disabled"
                />
                <Autocomplete
                    value={value}
                    onChange={setValue}
                    options={getFakeOptions()}
                    readOnly
                    helperText="readOnly"
                />
                <Autocomplete
                    value={value}
                    onChange={setValue}
                    options={getFakeOptions()}
                    error
                    helperText="With error"
                    // либо
                    // errorText="With error"
                />
            </Stack>
        </ContentBox>
    )
}
