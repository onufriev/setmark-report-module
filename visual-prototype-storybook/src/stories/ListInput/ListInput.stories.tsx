import React, { useEffect, useRef, useState } from 'react'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { getFakeOptions, mockShopRequests, ShopVO, delay } from '../__mock__'
import { normalise } from '../../utils/components-util'
import ListInput from './ListInput'
import { ListInputProgressParams, ListInputProps } from './types'
import { ContentBox } from '../ContentBox'
import { Stack } from '../Stack'
import { Box } from '../Box'
import { Typography } from '../Typography'
import { Table } from '../Table'
import { Divider } from '../Divider'
import { Button } from '../Button'
import { TextInput } from '../TextInput'
import { IconButton } from '../IconButton'
import { List } from '@material-ui/icons'

export default {
    title: 'Form/ListInput',
    component: ListInput,
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
    },
} as Meta

const actionHandler = action('onChange')

const Template: Story<ListInputProps> = (args) => {
    const [value, setValue] = useState<string[]>([])

    return (
        <ContentBox>
            <Box width={300}>
                <ListInput
                    {...args}
                    value={value}
                    onChange={value => {
                        setValue(value)
                        actionHandler(value)
                    }}
                    onKeyDown={undefined}
                    onKeyUp={undefined}
                    onFocus={undefined}
                    onBlur={undefined}
                />
            </Box>
        </ContentBox>
    )
}

export const Simple: Story<ListInputProps> = Template.bind({})
Simple.args = {}

export const Clearable: Story<ListInputProps> = Template.bind({})
Clearable.args = {
    clearable: true
}

export const WithEntryRegExp: Story<ListInputProps> = Template.bind({})
WithEntryRegExp.args = {
    entryRegExp: /^\d+$/,
    helperText: 'Разрешен ввод только цифр, значения с иными символами отфильтруются'
}

export const WithValidation: Story<ListInputProps> = Template.bind({})
WithValidation.args = {
    validator: async entries => {
        await delay(2000)
        return {
            correct: entries.filter(entry => !isNaN(Number(entry))),
            incorrect: entries.filter(entry => isNaN(Number(entry))),
        }
    }
}

export const WithSteppedValidation: Story<ListInputProps> = Template.bind({})
WithSteppedValidation.args = {
    validator: async (entries, progress, signal) => {
        progress.setVariant('determinate')

        for (let i = 0; i <= 8; i++) {
            progress.setValue(normalise(i, 0, 8))
            await delay(300)
        }

        return {
            correct: entries.filter(entry => !isNaN(Number(entry))),
            incorrect: entries.filter(entry => isNaN(Number(entry))),
        }
    }
}

export const WithAutocomplete: Story<ListInputProps> = Template.bind({})
WithAutocomplete.args = {
    showAutocomplete: true,
    AutocompleteProps: {
        options: getFakeOptions()
    },
}

export const CustomRootExample = () => {
    const [value, setValue] = useState<string[]>([])

    return (
        <ContentBox>
            <Stack spacing={1} direction="column" alignItems="flex-start">
                <ListInput
                    value={value}
                    onChange={entries => {
                        actionHandler(entries)
                        setValue(entries)
                    }}
                    clearAfterApply
                >
                    { ({ open }) => (
                        <IconButton color="primary" onClick={open}>
                            <List />
                        </IconButton>
                    ) }
                </ListInput>

                <Typography variant="caption" color="textSecondary">Значения в ListInput:</Typography>
                <Typography>{ JSON.stringify(value, null, '\t') }</Typography>
            </Stack>
        </ContentBox>
    )
}

export const ShopNumbersInputExample = () => {
    const requestRef = useRef(mockShopRequests())

    const [value, setValue] = useState<string[]>([])

    const fetchOptions = async (inputValue: string): Promise<ShopVO[]> => {
        const res = await requestRef.current.getShops(inputValue)
        return res
    }

    return (
        <ContentBox>
            <Stack spacing={2} divider={<Divider orientation='vertical' flexItem />}>
                <Box width={300} flexShrink={0}>
                    <ListInput<ShopVO>
                        fullWidth
                        value={value}
                        onChange={entries => {
                            setValue(entries)
                            actionHandler(entries)
                        }}
                        showAutocomplete
                        AutocompleteProps={{
                            label: 'Поиск магазина',
                            fetchOptions,
                            fetchOptionsOnInput: true,
                            optionsLimit: 20,
                            autoSelectOneMatch: true,
                            isOptionEqualToValue: (o, v) => o.number === v.number,
                            getOptionLabel: o => String(o.number),
                            renderOptionInner: o => (
                                <Box>
                                    <Typography display="block" variant="caption">Номер: {o.number}</Typography>
                                    <Typography display="block" variant="caption" color="textSecondary">Магазин: {o.name}</Typography>
                                    <Typography display="block" variant="caption" color="textSecondary">Город: {o.city}</Typography>
                                </Box>
                            ),
                        }}
                        getListTextInputProps={(mode) => ({
                            placeholder: mode === 'list' ? 'Номера магазинов' : ''
                        })}
                        getEntryFromOption={o => String(o.number)}
                        validator={async (entries, progress, signal) => {
                            const incorrectEntries: string[] = entries.filter(entry => isNaN(Number(entry)))
                            const correctEntries: string[] = entries.filter(entry => !incorrectEntries.includes(entry))

                            if (correctEntries.length > 0) {
                                const shopsByCorrectEntries: ShopVO[] = await requestRef.current.getShopsByNumbers(correctEntries.map(Number), { signal, randomError: true })

                                if (shopsByCorrectEntries.length !== correctEntries.length) {
                                    const correctShopNumbers = shopsByCorrectEntries.map(shop => String(shop.number))
                                    const incorrectShopNumber = correctEntries.filter(entry => !correctShopNumbers.includes(entry))

                                    incorrectShopNumber.forEach(shopNumber => {
                                        correctEntries.splice(correctEntries.indexOf(shopNumber), 1)
                                        incorrectEntries.push(shopNumber)
                                    })
                                }
                            }

                            return {
                                correct: correctEntries,
                                incorrect: incorrectEntries,
                            }
                        }}
                    />
                </Box>
                <Box>
                    <Typography>
                        Пример <code>ListInput</code> для списка магазинов.<br/>
                        Эмулируются запросы на сервер, механизм fetch abort.<br/>
                        Корректными являются числовые значения в диапазоне от 1 до 500.<br/>
                        Валидация включает сверку с имеющимися в базе магазинами.<br/>
                        Запрос получения списка магазинов выдаёт ошибку с вероятностью 40%,
                        которая не обрабатывается на уровне уровне функции валидации и попадает в компонент.<br/>
                        Компонент должен быть к такому готов.
                    </Typography>
                </Box>
            </Stack>
        </ContentBox>
    )
};

export const ClearAfterApplyExample = () => {
    const CHUNK_LENGTH = 100

    const requestRef = useRef(mockShopRequests(500))

    const [shopNumbers, setShopNumbers] = useState<string>('')
    const [shops, setShops] = useState<ShopVO[]>([])

    const generateShopNumbers = () => {
        setShopNumbers([...new Array(625)].map((_, i) => i + 1).join(','))
    }

    const fetchOptions = async (inputValue: string): Promise<ShopVO[]> => {
        const res = await requestRef.current.getShops(inputValue)
        return res
    }

    const addShops = async (entries: string[]) => {
        if (!entries.length) return
        let newShops = await requestRef.current.getShopsByNumbers(entries.map(Number), { delay: 300 })
        newShops = newShops.filter(newShop => shops.findIndex(shop => shop.id === newShop.id) === -1)
        if (!newShops.length) return
        setShops(prevShops => [...prevShops, ...newShops])
    }

    const validator = async (entries: string[], progress: ListInputProgressParams, signal: AbortSignal) => {
        const incorrectEntries: string[] = entries.filter(entry => isNaN(Number(entry)))
        const correctEntries: string[] = entries.filter(entry => !incorrectEntries.includes(entry))

        const correctEntriesResult = correctEntries.slice()

        const validateChunk = async (correctEntriesChunk: string[]) => {
            const shopsByCorrectEntries: ShopVO[] = await requestRef.current.getShopsByNumbers(correctEntriesChunk.map(Number), { signal, delay: 300 })

            if (shopsByCorrectEntries.length !== correctEntriesChunk.length) {
                const correctShopNumbers = shopsByCorrectEntries.map(shop => String(shop.number))
                const incorrectShopNumber = correctEntriesChunk.filter(entry => !correctShopNumbers.includes(entry))

                incorrectShopNumber.forEach(shopNumber => {
                    correctEntriesResult.splice(correctEntriesResult.indexOf(shopNumber), 1)
                    incorrectEntries.push(shopNumber)
                })
            }
        }

        if (correctEntries.length > 0) {
            if (correctEntries.length > CHUNK_LENGTH) {
                progress.setVariant('determinate')
                const chunks = Math.ceil(correctEntries.length / CHUNK_LENGTH)
                for (let i = 0; i < chunks; i++) {
                    const start = i * CHUNK_LENGTH, end = (i + 1) * CHUNK_LENGTH
                    const correctEntriesChunk = correctEntries.slice(start, end)
                    progress.setValue(normalise(i, 0, chunks - 1))
                    await validateChunk(correctEntriesChunk)
                }
            } else {
                await validateChunk(correctEntries)
            }
        }

        return {
            correct: correctEntriesResult,
            incorrect: incorrectEntries,
        }
    }

    return (
        <ContentBox>
            <Stack spacing={2} direction="column">
                <Typography>
                    Пример <code>ListInput</code> для получения валидного списка номеров магазинов, по которому заполняется таблица.<br/>
                    При вводе свыше { CHUNK_LENGTH } номеров магазинов, валидация разбивается на чанки, прогресс отражается процентами.<br/>
                    Валидные номера магазинов с 1 по 500.
                </Typography>
                <Stack spacing={2} divider={<Divider orientation='vertical' flexItem />}>
                    <Box width={300} flexShrink={0}>
                        <Stack spacing={1} direction="column">
                            <ListInput<ShopVO>
                                fullWidth
                                onChange={entries => {
                                    actionHandler(entries)
                                    addShops(entries)
                                }}
                                clearAfterApply
                                showAutocomplete
                                AutocompleteProps={{
                                    label: 'Поиск магазина',
                                    fetchOptions,
                                    fetchOptionsOnInput: true,
                                    optionsLimit: 20,
                                    autoSelectOneMatch: true,
                                    isOptionEqualToValue: (o, v) => o.number === v.number,
                                    getOptionLabel: o => String(o.number),
                                    renderOptionInner: o => (
                                        <Box>
                                            <Typography display="block" variant="caption">Номер: {o.number}</Typography>
                                            <Typography display="block" variant="caption" color="textSecondary">Магазин: {o.name}</Typography>
                                            <Typography display="block" variant="caption" color="textSecondary">Город: {o.city}</Typography>
                                        </Box>
                                    ),
                                }}
                                getListTextInputProps={(mode) => ({
                                    placeholder: mode === 'list' ? 'Номера магазинов' : ''
                                })}
                                getEntryFromOption={o => String(o.number)}
                                validator={validator}
                                getEntryTypeText={count => {
                                    const lastNumber = Number(String(count)[String(count).length - 1])
                                    const one = count === 1
                                    const few = lastNumber > 1 && lastNumber < 5
                                    return one
                                        ? 'номер магазина'
                                        : few
                                            ? 'номера магазинов'
                                            : 'номеров магазинов'
                                }}
                            />
                            <Button onClick={generateShopNumbers}>Сгенерировать номера</Button>
                            <TextInput
                                label="Номер магазинов"
                                value={shopNumbers}
                                onValueChange={setShopNumbers}
                                multiline
                                minRows={10}
                                maxRows={10}
                            />
                        </Stack>
                    </Box>
                    <Box height={400} flexGrow={1}>
                        <Table<ShopVO>
                            getRowId={row => row.id}
                            rows={shops}
                            columns={[
                                {
                                    field: 'number',
                                    headerName: 'Номер',
                                },
                                {
                                    field: 'name',
                                    headerName: 'Магазин'
                                },
                                {
                                    field: 'city',
                                    headerName: 'Город'
                                },
                            ]}
                            size="small"
                            sortModel={{
                                field: 'number',
                                sort: 'asc',
                            }}
                        />
                    </Box>
                </Stack>
            </Stack>
        </ContentBox>
    )
};

export const StatesExample = () => {
    const [value, setValue] = useState<string[]>([])

    return (
        <ContentBox>
            <Stack direction="column" spacing={2} width="300px">
                <ListInput
                    value={value}
                    onChange={setValue}
                    clearable
                />
                <ListInput
                    value={value}
                    onChange={setValue}
                    clearable
                    disabled
                    helperText="disabled"
                />
                <ListInput
                    value={value}
                    onChange={setValue}
                    clearable
                    readOnly
                    helperText="readOnly"
                />
                <ListInput
                    value={value}
                    onChange={setValue}
                    clearable
                    error
                    helperText="With error"
                    // либо
                    // errorText="With error"
                />
            </Stack>
        </ContentBox>
    )
}
