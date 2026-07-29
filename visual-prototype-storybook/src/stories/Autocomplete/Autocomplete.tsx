import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { isEmpty, debounce } from 'lodash'
import styled from 'styled-components'
import classNames from 'classnames'
import { Popper } from '@material-ui/core'

import { FormControl } from '../FormControl'
import { FormHelperText } from '../FormHelperText'
import { IconButton } from '../IconButton'
import { Input } from '../Input'
import { InputLabel } from '../InputLabel'
import { Paper } from '../Paper'
import { Chip } from '../Chip'
import ButtonBase from '../ButtonBase'
import { CircularProgress } from '../CircularProgress'
import { Close, ArrowDropDown, ArrowDropUp, Search } from '../icons'

import { AutocompleteGetTagProps, AutocompleteOptionRenderer, AutocompleteProps } from './types'
import { useLocale } from '../LocaleProvider'
import { ARROW_DOWN_KEY, ARROW_UP_KEY, END_KEY, ENTER_KEY, ESC_KEY, HOME_KEY } from '../../utils/key-names'
import { createFilterOptions } from './utils'
import useMounted from '../../utils/useMounted'
import useEventCallback from '../../utils/useEventCallback'
import useControlled from '../../utils/useControlled'

import { zIndex } from '../../themes/base-theme'
import { ButtonBaseClasses, ChipClasses, InputClasses, InputLabelClasses, PaperClasses } from '../../core/classes'

function Autocomplete<
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
>(props: Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> & AutocompleteProps<T, Multiple, DisableClearable>) {
    const { t } = useLocale()
    const mounted = useMounted()

    const {
        defaultValue = props.multiple ? [] : null,
        value: valueProps,
        onChange,

        defaultInputValue = '',
        inputValue: inputValueProps,
        onInputChange,

        options: optionsProps,
        optionsLimit,
        isOptionEqualToValue = (option, value) => option === value,

        loadingText,
        noOptionText = t('autocomplete.noOption'),
        notFoundText = t('autocomplete.notFound'),

        getOptionLabel: getOptionLabelProps = (option: any) => option.label ?? option,
        getOptionDisabled,

        fetchOptions: fetchOptionsProps,
        fetchOptionsOnMount,
        fetchOptionsOnInput,
        fetchOptionsDebounceDelay = 200,
        fetchOptionsHasMore,
        fetchOptionsScrollThreshold = 200,
        fetchOptionsOnInputLength = 0,

        filterOptions = props.fetchOptions && props.fetchOptionsOnInput
            ? (options) => props.optionsLimit && props.optionsLimit > 0 ? options.slice(0, props.optionsLimit) : options
            : createFilterOptions<T>({ limit: props.optionsLimit }),
        filterSelectedOptions,

        groupBy,
        renderGroup,

        multiple = false,

        renderValue,
        renderTags,
        renderOption: renderOptionProps,
        renderOptionInner,

        selectOnFocus,
        clearOnBlur,
        blurOnSelect,

        onFocus,
        onBlur,

        freeSolo = false,
        autoSelectOneMatch,

        disableClearable,
        disableCloseOnSelect,
        disableListWrap,

        disableSearchIndicator,
        enablePopupIndicator,

        label,

        fullWidth,
        required,
        disabled,
        readOnly,
        helperText,
        error,
        errorText,
        placeholder,

        id,
        style,

        endAdornment
    } = props

    const getOptionLabel = (option: T) => {
        const optionLabel = getOptionLabelProps(option)
        if (typeof optionLabel !== 'string') return String(optionLabel)
        return optionLabel
    }

    const getTagProps: AutocompleteGetTagProps = (index) => ({
        key: index,
        'data-tag-index': index,
        tabIndex: -1,
        onDelete: !readOnly ? () => handleTagDelete(index) : undefined,
    })

    const uuidRef = useRef(uuid())
    const anchorRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const listboxRef = useRef<HTMLDivElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)
    const highlightedIndexRef = useRef(-1)
    const ignoreFocusRef = useRef(false)
    const firstFocusRef = useRef(true)
    const autoScrollRef = useRef(false)
    const scrollTopRef = useRef(0)

    const [value, setValue] = useControlled<any>({
        controlled: valueProps,
        default: defaultValue
    })
    const [inputValue, setInputValue] = useControlled<string>({
        controlled: inputValueProps,
        default: defaultInputValue
    })

    const [options, setOptions] = useState<readonly T[]>(fetchOptionsProps ? [] : (optionsProps || []))
    const [open, setOpen] = useState(false)
    const [focused, setFocused] = useState(false)
    const [loading, setLoading] = useState(false)
    const [inputPristine, setInputPristine] = React.useState(true)

    const fetchOptions = useCallback(async (value: string, params: { valueChange?: boolean } = {}) => {
        const { valueChange = false } = params
        if (!fetchOptionsProps) return
        setLoading(true)
        try {
            const opts = await fetchOptionsProps(value, { options, valueChange })
            if (mounted()) setOptions(opts || [])
        } catch (err) {
            console.error(err)
            if (mounted()) setOptions([])
        } finally {
            if (mounted()) setLoading(false)
        }
    }, [mounted, fetchOptionsProps, options])

    const fetchOptionsDebounced = useCallback(debounce(fetchOptions, fetchOptionsDebounceDelay), [fetchOptionsDebounceDelay, fetchOptions])

    /* onMount и пользовательское изменение функции загрузки */
    useEffect(() => {
        if (
            fetchOptionsProps &&
            fetchOptionsOnMount &&
            (!fetchOptionsOnInput || fetchOptionsOnInputLength === 0)
        ) {
            fetchOptions(inputValue)
        }
    }, [fetchOptionsProps])

    /* Пользовательское изменение опций */
    useEffect(() => {
        if (!fetchOptionsProps && optionsProps) {
            setOptions(optionsProps)
        }
    }, [optionsProps])

    const inputValueIsSelectedValue = !multiple && value != null && inputValue === getOptionLabel(value)

    const dirty = freeSolo && inputValue.length > 0 || (multiple ? value.length > 0 : value !== null)

    const popupOpen = open && !readOnly

    const filteredOptions = popupOpen ? filterOptions(
        filterSelectedOptions ? options.filter(option => {
            if ((multiple ? value : [value]).some((v: any) => v !== null && isOptionEqualToValue(option, v))) {
                return false
            }

            return true
        }) : options,
        {
            inputValue: inputValueIsSelectedValue && inputPristine ? '' : inputValue,
            getOptionLabel
        }
    ) : []

    const maxIndex = filteredOptions.length - 1

    /* Автовыбор одного найденного значения */
    useEffect(() => {
        if (
            !multiple &&
            filteredOptions.length === 1 &&
            autoSelectOneMatch &&
            (value == null || !isOptionEqualToValue(filteredOptions[0], value))
        ) {
            selectNewValue(null, filteredOptions[0])
        }
    }, [filteredOptions.length])

    const handleOpen = () => {
        if (open) return

        setOpen(true)
        setInputPristine(true)
    }

    const handleClose = () => {
        if (!open) return

        setOpen(false)
    }

    const handleClick = () => {
        inputRef.current!.focus()

        if (
            selectOnFocus &&
            firstFocusRef.current &&
            inputRef.current!.selectionEnd! - inputRef.current!.selectionEnd! === 0
        ) {
            inputRef.current!.select()
        }

        firstFocusRef.current = false
    }

    const handleMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
        if ((evt.target as HTMLDivElement).dataset.uuid !== uuidRef.current) {
            evt.preventDefault()
        }
    }

    const handleClear = (evt: React.MouseEvent<HTMLButtonElement>) => {
        ignoreFocusRef.current = true

        setInputValue('')
        onInputChange?.('')

        handleValue(multiple ? [] : null)
    }

    const handlePopupIndicator = () => {
        if (open) {
            handleClose()
        } else {
            handleOpen()
        }
    }

    const handleFocus = () => {
        setFocused(true)

        if (!ignoreFocusRef.current) {
            handleOpen()
        }

        if (
            firstFocusRef.current &&
            fetchOptionsProps &&
            !fetchOptionsOnMount &&
            (!fetchOptionsOnInput || fetchOptionsOnInputLength === 0)
        ) {
            fetchOptions(inputValue)
        }

        if (onFocus) {
            onFocus()
        }
    }

    const handleBlur = () => {
        setFocused(false)

        firstFocusRef.current = true
        ignoreFocusRef.current = false

        if (clearOnBlur) {
            resetInputValue(value)
        }

        handleClose()

        if (onBlur) {
            onBlur()
        }
    }

    const handleInputMouseDown = () => {
        if (inputValue === '' || !open) {
            handlePopupIndicator()
        }
    }

    const handleValue = (newValue: any, option?: T) => {
        if (multiple) {
            if (value.length === newValue.length && value.every((val: any, i: number) => val === newValue[i])) {
                return
            }
        } else if (value === newValue) {
            return
        }

        setValue(newValue)

        onChange?.(newValue)
    }

    const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = evt.target.value

        if (inputValue !== newValue) {
            setInputValue(newValue)
            setInputPristine(false)

            onInputChange?.(newValue)

            if (
                fetchOptionsProps &&
                fetchOptionsOnInput &&
                newValue.length >= fetchOptionsOnInputLength
            ) {
                fetchOptionsDebounced(newValue, { valueChange: true })
            }
        }

        if (newValue === '') {
            if (!disableClearable && !multiple) {
                handleValue(null)
            }
        } else {
            handleOpen()
        }
    }

    const handleKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
        switch (evt.key) {
            case ARROW_DOWN_KEY: {
                if (popupOpen) {
                    evt.preventDefault()
                    changeHighlightedIndex({ diff: 1, direction: 'next', reason: 'keyboard' })
                }
                break
            }
            case ARROW_UP_KEY: {
                if (popupOpen) {
                    evt.preventDefault()
                    changeHighlightedIndex({ diff: -1, direction: 'prev', reason: 'keyboard' })
                }
                break
            }
            case HOME_KEY: {
                evt.preventDefault()

                changeHighlightedIndex({ diff: 'start', direction: 'prev', reason: 'keyboard' })

                break
            }
            case END_KEY: {
                evt.preventDefault()

                changeHighlightedIndex({ diff: 'end', direction: 'next', reason: 'keyboard' })

                break
            }
            case ESC_KEY: {
                if (popupOpen) {
                    evt.preventDefault()
                    evt.stopPropagation()
                    handleClose()
                }
                break
            }
            case ENTER_KEY: {
                if (highlightedIndexRef.current !== -1 && popupOpen) {
                    evt.preventDefault()

                    const option = filteredOptions[highlightedIndexRef.current]
                    const disabled = getOptionDisabled ? getOptionDisabled(option) : false

                    if (disabled) {
                        return
                    }

                    selectNewValue(evt, option)
                } else if (freeSolo && inputValue !== '' && inputValueIsSelectedValue === false) {
                    if (multiple) {
                      // Allow people to add new values before they submit the form.
                      evt.preventDefault()
                    }
                    selectNewValue(evt, inputValue)
                }
                break
            }
            default:
        }
    }

    const handleOptionClick = (evt: React.MouseEvent<HTMLButtonElement>, option: T) => {
        evt.stopPropagation()

        selectNewValue(evt, option)
    }

    const handleOptionMouseOver = (evt: React.MouseEvent<HTMLButtonElement>) => {
        const newIndex = Number(evt.currentTarget.getAttribute('data-option-index'))

        setHighlightedIndex({ index: newIndex, reason: 'mouse' })
    }

    const handleListboxRef = useEventCallback((node: HTMLDivElement) => {
        // @ts-ignore
        listboxRef.current = node

        if (!node) {
            return
        }

        syncHighlightedIndex()
    })

    const handleTagDelete = (index: number) => {
        const newValue = value.slice()
        newValue.splice(index, 1)
        handleValue(newValue, value[index])
    }

    /* Управление значениями */

    /** Выбрать новое значение */
    const selectNewValue = (evt: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement> | null, option: any) => {
        let newValue = option

        if (multiple) {
            newValue = Array.isArray(value) ? value.slice() : []

            const optionIndex = newValue.findIndex((o: any) => isOptionEqualToValue(o, option))

            if (optionIndex === -1) {
                newValue.push(option)
            } else {
                newValue.splice(optionIndex, 1)
            }
        }

        resetInputValue(newValue)

        handleValue(newValue, option)

        if (!disableCloseOnSelect && !evt?.ctrlKey && !evt?.metaKey) {
            handleClose()
        }

        if (blurOnSelect) {
            inputRef.current!.blur()
        }
    }

    /** Перезаписать в поле ввода значение из option */
    const resetInputValue = useCallback((newValue: any) => {
        // // опция, переданная в параметре, выбрана
        // const isOptionSelected = multiple ? value.length < newValue.length : newValue != null

        // // хотим сохранить ввод в поле на блюре
        // if (!isOptionSelected && !clearOnBlur) {
        //     return
        // }

        let newInputValue

        if (multiple) {
            newInputValue = ''
        } else if (newValue == null) {
            newInputValue = ''
        } else {
            newInputValue = getOptionLabel(newValue)
        }

        if (inputValue === newInputValue) {
            return
        }

        setInputValue(newInputValue)

        onInputChange?.(newInputValue)
    }, [
        getOptionLabel, inputValue, multiple, onInputChange, setInputValue, clearOnBlur, value
    ])

    const prevValueRef = React.useRef()

    useEffect(() => {
        const valueChange = value !== prevValueRef.current
        prevValueRef.current = value

        if (focused && !valueChange) {
            return
        }

        // Only reset the input's value when freeSolo if the component's value changes.
        if (freeSolo && !valueChange) {
            return
        }

        resetInputValue(value)
    }, [value, resetInputValue, focused, prevValueRef, freeSolo])

    /* Подсветка (highlighting) опций */

    /** Получаем валидный следующий индекс (пропускаем disabled) */
    function validOptionIndex(index: number, direction: 'prev' | 'next'): number {
        if (!listboxRef.current || index === -1) {
            return -1
        }

        let nextIndex = index

        while (true) {
            if (
                (direction === 'next' && nextIndex === filteredOptions.length) ||
                (direction === 'prev' && nextIndex === -1)
            ) {
                return -1
            }

            const option: HTMLButtonElement | null = listboxRef.current.querySelector(`[data-option-index="${nextIndex}"]`)

            if (!option || option.disabled || option.getAttribute('aria-disabled') == 'true') {
                nextIndex += direction === 'next' ? 1 : -1
            } else {
                return nextIndex
            }
        }
    }

    /** Высчитывает новый индекс по определенной логике и обновляет подсветку на DOM узлах */
    const changeHighlightedIndex = useEventCallback(({
        diff, direction = 'next', reason = 'auto'
    }: { diff: number | 'reset' | 'start' | 'end', direction?: 'prev' | 'next', reason?: 'auto' | 'keyboard' | 'mouse' | 'reset' }) => {

        if (!popupOpen) {
            return
        }

        const getNextIndex = () => {
            if (diff === 'reset') {
                return -1
            }

            if (diff === 'start') {
                return 0
            }

            if (diff === 'end') {
                return maxIndex
            }

            const newIndex = highlightedIndexRef.current + diff

            if (newIndex < 0) {
                if (disableListWrap) {
                    return 0
                }

                return maxIndex
            }

            if (newIndex > maxIndex) {
                if (disableListWrap) {
                    return maxIndex
                }

                return 0
            }

            return newIndex
        }

        const newIndex = validOptionIndex(getNextIndex(), direction)

        setHighlightedIndex({ index: newIndex, reason })
    })

    /** Подсветить элемент и проскроллить до него */
    const setHighlightedIndex = useEventCallback(({
        index, reason = 'auto'
    }: { index: number, reason?: 'auto' | 'keyboard' | 'mouse' | 'reset' }) => {

        highlightedIndexRef.current = index

        if (!listboxRef.current) return

        const prev = listboxRef.current.querySelector('[role="option"][area-focused="true"]')
        if (prev) {
            prev.setAttribute('area-focused', 'false')
        }

        const listboxNode = listboxRef.current

        if (index === -1) {
            autoScrollRef.current = true
            listboxNode.scrollTop = 0
            autoScrollRef.current = false
            return
        }

        const option: HTMLButtonElement | null = listboxNode.querySelector(`[data-option-index="${index}"]`)

        if (!option) {
            return
        }

        option.setAttribute('area-focused', 'true')

        if (listboxNode.scrollHeight > listboxNode.clientHeight && reason !== 'mouse') {
            autoScrollRef.current = true

            const element = option

            const scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop
            const elementBottom = element.offsetTop + element.offsetHeight

            if (elementBottom > scrollBottom) {
                listboxNode.scrollTop = elementBottom - listboxNode.clientHeight
            } else if (element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0) < listboxNode.scrollTop) {
                listboxNode.scrollTop = element.offsetTop - element.offsetHeight * (groupBy ? 1.3 : 0)
            }

            autoScrollRef.current = false
        }
    })

    /** Синхронизирует DOM с состоянием подсветки */
    const syncHighlightedIndex = useCallback(() => {
        if (!popupOpen) {
            return
        }

        const valueItem = multiple ? value[0] : value

        if (filterOptions.length === 0 || valueItem == null) {
            changeHighlightedIndex({ diff: 'reset' })
            return
        }


        if (!listboxRef.current) {
            return
        }

        if (valueItem != null) {
            const currentOption = filteredOptions[highlightedIndexRef.current]

            if (
                multiple &&
                currentOption &&
                filteredOptions.findIndex(o => isOptionEqualToValue(o, currentOption)) !== -1
            ) {
                return
            }

            const valueIndex = filteredOptions.findIndex(o => isOptionEqualToValue(o, valueItem))

            if (valueIndex === -1) {
                changeHighlightedIndex({ diff: 'reset' })
            } else {
                setHighlightedIndex({ index: valueIndex })
            }
            return
        }

        if (highlightedIndexRef.current >= maxIndex) {
            setHighlightedIndex({ index: maxIndex })
            return
        }

        setHighlightedIndex({ index: highlightedIndexRef.current })
    }, [
        // Only sync the highlighted index when the option switch between empty and not
        filteredOptions.length,
        // Don't sync the highlighted index with the value when multiple
        // eslint-disable-next-line react-hooks/exhaustive-deps
        multiple ? false : value,
        filterSelectedOptions,
        changeHighlightedIndex,
        setHighlightedIndex,
        popupOpen,
        inputValue,
        multiple,
    ])

    useEffect(() => {
        if (!needRestoreScroll) syncHighlightedIndex()
    }, [syncHighlightedIndex])

    /* Дозагрузка опций при скролле (infinite scroll) */

    const [needRestoreScroll, setNeedRestoreScroll] = useState(false)

    useLayoutEffect(() => {
        if (popupOpen && needRestoreScroll) restoreScroll()
    }, [options.length])

    const restoreScroll = () => {
        if (listboxRef.current && scrollTopRef.current > 0) {
            listboxRef.current.scrollTop = scrollTopRef.current
        }
        setNeedRestoreScroll(false)
        // дополнительная проверка на заполненность контейнера
        checkNeedToLoadOptions(true)
    }

    const checkNeedToLoadOptions = (force: boolean = false) => {
        if (!listboxRef.current || autoScrollRef.current) {
            return
        }

        if (!fetchOptionsProps || !fetchOptionsHasMore) {
            return
        }

        const listboxNode = listboxRef.current

        scrollTopRef.current = listboxNode.scrollTop

        if (needRestoreScroll && !force) return

        const atBottom = listboxNode.scrollHeight - listboxNode.clientHeight - scrollTopRef.current < fetchOptionsScrollThreshold

        if (atBottom) {
            setNeedRestoreScroll(true)
            fetchOptions(inputValue)
        }
    }

    const handleListboxScroll = useEventCallback(() => {
        if (filterOptions.length > 0) checkNeedToLoadOptions()
    })

    let startAdornmentContent = multiple && value.length > 0 ? value.map((option: any, index: number) => {
        return (
            <AutocompleteTag
                key={index}
                data-tag-index={index}
                tabIndex={-1}
                label={getOptionLabel(option)}
                onDelete={!readOnly ? () => handleTagDelete(index) : undefined}
                size="small"
            />
        )
    }) : null

    if (multiple && renderTags && !isEmpty(value)) {
        startAdornmentContent = (
            <AutocompleteValueContainer>
                { renderTags(value, getTagProps) }
            </AutocompleteValueContainer>
        )
    }

    const showClearButton = !disableClearable && dirty && !readOnly && !disabled
    const showSearchIndicator = !disableSearchIndicator && !enablePopupIndicator
    const showPopupIndicator = enablePopupIndicator

    const endAdornmentContent = (
        <AutocompleteEndAdornment>
            { showClearButton ? (
                <IconButton
                    id={id && `${id}ClearButton`}
                    size="small"
                    tabIndex={-1}
                    onClick={handleClear}
                    disabled={loading}
                >
                    <Close />
                </IconButton>
            ) : null }

            { endAdornment || (
                <>
                    { showSearchIndicator ? (
                        <AutocompleteSearchIcon>
                            <Search color={disabled ? 'disabled' : 'action'} />
                        </AutocompleteSearchIcon>
                    ) : null }

                    { showPopupIndicator ? (
                        <IconButton
                            id={id && `${id}ExpandButton`}
                            edge="end"
                            size="small"
                            tabIndex={-1}
                            onClick={handlePopupIndicator}
                        >
                            { popupOpen ? <ArrowDropUp /> : <ArrowDropDown /> }
                        </IconButton>
                    ) : null }
                </>
            )}

        </AutocompleteEndAdornment>
    )

    const handleAnchorRef = useEventCallback((node: HTMLDivElement) => {
        // @ts-ignore
        anchorRef.current = node
    })

    const defaultRenderOption: AutocompleteOptionRenderer<T> = (props, option, state) => (
        <AutocompleteOption {...props}>
            { renderOptionInner?.(option) ?? getOptionLabel(option) }
        </AutocompleteOption>
    )

    const renderOption = renderOptionProps || defaultRenderOption

    if (disabled && focused) {
        handleBlur()
    }

    return (
        <AutocompleteRoot
            id={id}
            className={classNames(
                multiple && 'autocomplete--multiple',
                !showClearButton && 'autocomplete--disableClearable',
                disableSearchIndicator && !enablePopupIndicator && 'autocomplete--disableIndicator',
            )}
            fullWidth={fullWidth}
            variant="filled"
            error={error || !!errorText}
            required={required}
            disabled={disabled}
            style={style}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
        >
            { label && <InputLabel id={id && `${id}Label`} htmlFor={id && `${id}Input`}>{ label }</InputLabel> }

            <AutocompleteInput
                id={id && `${id}Input`}
                ref={handleAnchorRef}
                inputRef={inputRef}
                value={inputValue}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onChange={handleInputChange}
                startAdornment={startAdornmentContent}
                endAdornment={endAdornmentContent}
                placeholder={placeholder}
                autoComplete="off"
                autoCapitalize="none"
                role="combobox"
                spellCheck={false}
                inputProps={{
                    "data-uuid": uuidRef.current,
                    onMouseDown: handleInputMouseDown,
                }}
            />

            { errorText || helperText && <FormHelperText id={id && `${id}HelperText`}>{ errorText || helperText }</FormHelperText> }

            <Popper
                ref={popupRef}
                role="presentation"
                open={popupOpen}
                anchorEl={anchorRef.current}
                placement="bottom"
                style={{
                    zIndex: zIndex.tooltip,
                    width: anchorRef.current?.clientWidth,
                }}
            >
                <AutocompletePaper>
                    <AutocompleteListbox
                        id={id && `${id}Listbox`}
                        ref={handleListboxRef}
                        role="listbox"
                        onMouseDown={evt => evt.preventDefault()}
                        onScroll={handleListboxScroll}
                    >
                        { loading && !needRestoreScroll && !filteredOptions.length ? (
                            <AutocompleteLoading
                                id={id && `${id}LoadingOptions`}
                            >
                                { loadingText || <CircularProgress size={20} variant="indeterminate" /> }
                            </AutocompleteLoading>
                        ) : null }
                        { !loading && !filteredOptions.length ? (
                            <AutocompleteNoOption
                                id={id && `${id}NoOption`}
                                role="presentation"
                            >
                                { options.length > 0 ? notFoundText : noOptionText }
                            </AutocompleteNoOption>
                        ) : null }
                        { filteredOptions.length > 0 ? filteredOptions.map((option, index) => {

                            let label = getOptionLabel(option)

                            const selected = (multiple ? value : [value]).some((v: any) => v != null && isOptionEqualToValue(option, v))
                            const disabled = getOptionDisabled ? getOptionDisabled(option) : false

                            const optionProps = {
                                id: id && `${id}Option${index}`,
                                key: `${label}-${index}`,
                                role: 'option',
                                tabIndex: -1,
                                onMouseOver: handleOptionMouseOver,
                                onClick: (evt: React.MouseEvent<HTMLButtonElement>) => handleOptionClick(evt, option),
                                'data-option-index': index,
                                'aria-selected': selected,
                                'aria-disabled': disabled,
                            }

                            return renderOption(optionProps, option, { inputValue, selected, disabled })
                        }) : null }
                        { loading && needRestoreScroll ? (
                            <AutocompleteLoading
                                id={id && `${id}InfiniteLoading`}
                            >
                                <CircularProgress size={20} variant="indeterminate" />
                            </AutocompleteLoading>
                        ) : null }
                    </AutocompleteListbox>
                </AutocompletePaper>
            </Popper>
        </AutocompleteRoot>
    )
}

export default Autocomplete

const AutocompleteRoot = styled(FormControl)``

const AutocompleteTag = styled(Chip)`
    &.${ChipClasses.root} {
        margin: 2px;
        max-width: calc(100% - 4px);
    }
`

const AutocompleteSearchIcon = styled.div`
    display: inline-flex;
    padding: 3px 0 3px 3px;
`

const AutocompleteEndAdornment = styled.div`
    position: absolute;
    top: 3px;
    right: 8px;
    display: flex;
    align-items: center;
`

const AutocompleteValueContainer = styled.div`
    max-width: calc(100% - 34px);
`

const AutocompleteInput = styled(Input)`
    &.${InputClasses.root} {
        flex-wrap: wrap;
        padding-right: ${12 + 30 * 2 + 8}px;
    }

    .autocomplete--disableClearable &.${InputClasses.root},
    .autocomplete--disableIndicator &.${InputClasses.root} {
        padding-right: ${12 + 30 + 8}px;
    }

    .autocomplete--disableClearable.autocomplete--disableIndicator &.${InputClasses.root} {
        padding-right: ${12}px;
    }

    .autocomplete--multiple &.${InputClasses.root} {
        padding-top: 6px;
        padding-right: ${10 + 30 * 2 + 8}px;
        padding-bottom: 6px;
        padding-left: 10px;
    }

    .autocomplete--multiple .${InputLabelClasses.root} + &.${InputClasses.root} {
        align-items: flex-end;
        padding-top: 12px;
        padding-bottom: 0;
    }

    .autocomplete--disableClearable.autocomplete--multiple &.${InputClasses.root},
    .autocomplete--disableIndicator.autocomplete--multiple &.${InputClasses.root} {
        padding-right: ${10 + 30 + 8}px;
    }

    .autocomplete--disableClearable.autocomplete--disableIndicator.autocomplete--multiple &.${InputClasses.root} {
        padding-right: ${10}px;
    }

    & .${InputClasses.input} {
        flex-grow: 1;
        width: 0;
        min-width: 30px;

        &:placeholder-shown {
            text-overflow: ellipsis;
        }
    }

    .autocomplete--multiple & .${InputClasses.input} {
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 0;
        margin: 2px;
    }
`

const AutocompletePaper = styled(Paper)`
    &.${PaperClasses.root} {
        overflow: auto;
        margin-top: 1px;
        /* background-color: ${props => props.theme.palette.overlay.type2}; */
        font-size: ${(props) => props.theme.typography.body1.fontSize}px;
        line-height: ${(props) => props.theme.typography.body1.lineHeight};
        border-radius: 4px;
    }
`

const AutocompleteListbox = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 40vh;
    overflow-y: auto;
    /* padding: ${props => props.theme.spacing(1)}px 0; */
`

const AutocompleteOption = styled(ButtonBase)`
    &.${ButtonBaseClasses.root} {
        padding: ${props => props.theme.spacing(1)}px ${props => props.theme.spacing(1.5)}px;
        align-items: initial;
        justify-content: initial;
        font-size: inherit;
        line-height: inherit;
        text-align: start;

        &[area-focused="true"] {
            background-color: ${props => props.theme.palette.action.hover};
        }

        &[aria-disabled="true"] {
            color: ${props => props.theme.palette.action.disabled};
            cursor: default;
            pointer-events: none;
        }

        &[aria-selected="true"] {
            background-color: ${props => props.theme.palette.action.selected};
        }
    }
`

const AutocompleteNoOption = styled.div`
    padding: ${props => props.theme.spacing(1)}px ${props => props.theme.spacing(1.5)}px;
    color: ${props => props.theme.palette.text.secondary};
`

const AutocompleteLoading = styled.div`
    padding: ${props => props.theme.spacing(1)}px ${props => props.theme.spacing(1.5)}px;
    display: flex;
    justify-content: center;
`
