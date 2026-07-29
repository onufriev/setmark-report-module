import isEqual from 'lodash/isEqual'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ENTER_KEY } from '../../utils/key-names'
import useControlled from '../../utils/useControlled'
import { Close, List, ReportProblemOutlined } from '../icons'
import { ActionsBar } from '../ActionsBar'
import { Autocomplete } from '../Autocomplete'
import { Button } from '../Button'
import { Dialog } from '../Dialog'
import { DialogContent } from '../DialogContent'
import { DialogTitle } from '../DialogTitle'
import { IconButton } from '../IconButton'
import { InputAdornment } from '../InputAdornment'
import { Stack } from '../Stack'
import { TextInput } from '../TextInput'
import { Tooltip } from '../Tooltip'
import { Typography } from '../Typography'
import { Box } from '../Box'
import ListInputProgress, { ListInputProgressProps } from './ListInputProgress'
import {
    ListInputCustomRootParams,
    ListInputDialogMode,
    ListInputProgressParams,
    ListInputProps,
    ListInputValidationResult
} from './types'
import { useListInputText } from './hooks'

const ListInput = function<AutocompleteValue = string>(props: ListInputProps<AutocompleteValue>) {
    const {
        defaultValue = [],
        value: valueProps,
        onChange,
        entryRegExp,
        delimiter = ',',
        entryTrimDisabled,
        validator,
        showAutocomplete,
        AutocompleteProps,
        getListTextInputProps = () => {},
        clearAfterApply,
        applyFromRootOnBlur,
        getEntryFromOption = value => value,
        postProcessingDisabled,
        rootRef,
        children,
        getEntryTypeText = () => '',
        textOverrides = {},
        ...TextInputProps
    } = props

    const {
        id,
        readOnly,
        disabled,
        onKeyUp: onRootKeyUp,
        onBlur: onRootBlur,
        clearable,
        ...restTextInputProps
    } = TextInputProps

    const validationAbortControllerRef = useRef<AbortController | null>(null)
    const validationAbortSignalRef = useRef<AbortSignal | null>(null)

    const getValidationAbort = (): { controller: AbortController, signal: AbortSignal } => {
        if (validationAbortControllerRef.current === null || validationAbortSignalRef.current === null) {
            const controller = new AbortController()

            validationAbortControllerRef.current = controller
            validationAbortSignalRef.current = controller.signal
        }

        return {
            controller: validationAbortControllerRef.current,
            signal: validationAbortSignalRef.current,
        }
    }

    const resetValidationAbort = () => {
        validationAbortControllerRef.current = null
        validationAbortSignalRef.current = null
    }

    const [value, setValue] = useControlled({
        controlled: valueProps,
        default: defaultValue
    })

    const multipleMode = value.length > 1

    const [dialogMode, setDialogMode] = useState<ListInputDialogMode>(null)
    const [validationResult, setValidationResult] = useState<ListInputValidationResult>({ correct: [], incorrect: [] })
    const [validatorError, setValidatorError] = useState(false)
    const [rootTextInputValue, setRootTextInputValue] = useState('')
    const [listTextInputValue, setListTextInputValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [progressProps, setProgressProps] = useState<ListInputProgressProps>({
        variant: 'indeterminate',
        value: 0
    })
    const [touched, setTouched] = useState(false)

    const prevDialogModeRef = useRef<ListInputDialogMode>()

    useEffect(() => {
        if (valueProps && valueProps.length < 2 && dialogMode === null) {
            resetInputsValueByEntries(valueProps)
        }
    }, [valueProps])

    const progress: ListInputProgressParams = {
        setVariant: variant => {
            setProgressProps(state => ({ ...state, variant }))
        },
        setValue: value => {
            setProgressProps(state => ({ ...state, value }))
        },
    }

    const changeDialogMode = (newDialogMode: ListInputDialogMode) => {
        prevDialogModeRef.current = dialogMode
        setDialogMode(newDialogMode)
    }

    const handleOpen = () => {
        setTouched(false)
        resetInputsValueByEntries(value)
        changeDialogMode('list')
    }

    const handleClose = (currentValue?: string[]) => {
        if (clearAfterApply) {
            setValue([])
            resetInputsValueByEntries([])
        } else {
            resetInputsValueByEntries(currentValue || value)
        }

        changeDialogMode(null)
    }

    const handleClear = () => {
        setListTextInputValue('')
        setTouched(true)
    }

    const handleAutocompleteChange = (value: AutocompleteValue | null) => {
        if (!value) return

        const addedValue = getEntryFromOption(value)

        setListTextInputValue(prevValue => prevValue + (prevValue.endsWith('\n') || prevValue === '' ? '' : '\n') + addedValue)
        setTouched(true)
    }

    const handleListTextInputChange = (value: string) => {
        setListTextInputValue(value)
        setTouched(true)
    }

    const handleRootTextInputChange = (value: string) => {
        setRootTextInputValue(value)
    }

    const handleRootTextInputKeyUp = async (evt: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!multipleMode && evt.key === ENTER_KEY) {
            await processValue(rootTextInputValue)
        }

        onRootKeyUp?.(evt)
    }

    const handleRootTextInputBlur = async (evt: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!multipleMode && applyFromRootOnBlur) {
            await processValue(rootTextInputValue)
        }

        onRootBlur?.(evt)
    }

    const handleListButtonClick = () => {
        if (readOnly) return

        handleOpen()
    }

    const handleListDialogCancel = () => {
        handleClose()
    }

    const handleListDialogApply = async () => {
        processValue(listTextInputValue)
    }

    const handleValidationDialogBack = async () => {
        changeDialogMode(prevDialogModeRef.current!)
    }

    const handleValidationDialogAbort = () => {
        const { controller } = getValidationAbort()
        controller.abort()

        resetValidationAbort()
        changeDialogMode(prevDialogModeRef.current!)
    }

    const handleValidationDialogClose = () => {
        handleClose()
    }

    const handleValidationDialogShowNotAdded = () => {
        setTouched(false)
        setListTextInputValueByEntries(validationResult.incorrect)
        changeDialogMode('postProcessing')
    }

    const handlePostProcessingDialogCancel = () => {
        handleClose()
    }

    const handlePostProcessingDialogAdd = () => {
        postProcessValue(listTextInputValue)
    }

    /** Первичная обработка и применение введенного значения */
    const processValue = async (inputValue: string) => {
        const { uniqEntries: entries } = getEntriesByInputValue(inputValue)

        if (isEqual(value, entries)) {
            handleClose()
            return
        }

        if (!validator || !entries.length) {
            applyEntries(entries)
            handleClose(entries)
            return
        }

        resetValidationState()
        changeDialogMode('validation')

        const { signal } = getValidationAbort()
        try {
            const result = await validator(entries, progress, signal)
            if (signal.aborted) throw new Error('Validation aborted')
            setValidationResult(result)
            applyEntries(result.correct)
        } catch (err) {
            console.error(err)
            // если ошибка валидатора
            if (!signal.aborted) {
                setValidatorError(true)
            }
        } finally {
            setLoading(false)
        }
    }

    /** Постобработка не добавленных значений */
    const postProcessValue = async (inputValue: string) => {
        const { uniqEntries: entries } = getEntriesByInputValue(inputValue)

        if (!entries.length) {
            handleClose()
            return
        }

        const entriesWithoutDublicates = entries.filter(entry => !value.includes(entry))

        resetValidationState()
        changeDialogMode('validation')

        const { signal } = getValidationAbort()
        try {
            const result = await validator!(entriesWithoutDublicates, progress, signal)
            if (signal.aborted) throw new Error('Validation aborted')
            setValidationResult(result)
            if (result.correct.length > 0) addEntries(result.correct)
        } catch (err) {
            console.error(err)
            // если ошибка валидатора
            if (!signal.aborted) {
                setValidatorError(true)
            }
        } finally {
            setLoading(false)
        }
    }

    const getEntriesByInputValue = (inputValue: string): {
        entries: string[]
        uniqEntries: string[]
        duplicates: string[]
    } => {
        const postProcess = (entry: string) => {
            if (!entryTrimDisabled) entry = entry.trim()
            return entry
        }

        const entries = inputValue
            .replace(/\n|\r|\r\n/g, delimiter)
            .split(delimiter)
            .map(postProcess)
            .filter((entry: string) => {
                if (!entry) return false
                if (entryRegExp) {
                    // сбрасываем индекс, если был использован флаг g
                    entryRegExp.lastIndex = 0
                    return entryRegExp.test(entry)
                }
                return true
            })

        const uniqEntries: Set<string> = new Set()
        const duplicates: string[] = []

        entries.forEach((entry) => {
            if (uniqEntries.has(entry)) {
                duplicates.push(entry)
            } else {
                uniqEntries.add(entry)
            }
        })

        return {
            entries,
            uniqEntries: [...uniqEntries.values()],
            duplicates: duplicates,
        }
    }

    const applyEntries = (entries: string[]) => {
        onChange?.(entries)
        setValue(entries)
        resetInputsValueByEntries(entries)
    }

    const addEntries = (entries: string[]) => {
        const newEntries = [...value, ...entries]

        onChange?.(newEntries)
        setValue(newEntries)
        resetInputsValueByEntries(newEntries)
    }

    const resetInputsValueByEntries = (entries: string[]) => {
        setListTextInputValueByEntries(entries)
        setRootTextInputValue(entries.length > 1 ? '' : (entries[0] || ''))
    }

    const setListTextInputValueByEntries = (entries: string[]) => {
        setListTextInputValue(entries.join('\n'))
    }

    const resetValidationResult = () => {
        setValidationResult({
            correct: [],
            incorrect: [],
        })
    }

    const resetValidationState = () => {
        resetValidationResult()
        setValidatorError(false)
        setProgressProps({ variant: 'indeterminate', value: 0 })
        setLoading(true)
    }

    const {
        entries: listInputEntries,
        duplicates: listInputDuplicates
    } = useMemo(
        () => getEntriesByInputValue(listTextInputValue),
        [listTextInputValue]
    )

    const rootTextInputClearProps = clearable ? {
        clearable: true,
        clearVisibled: value.length > 0 && !disabled && !readOnly,
        onClear: () => applyEntries([])
    } : {}

    const customRootParams: ListInputCustomRootParams = {
        id,
        readOnly,
        disabled,
        open: handleOpen,
    }

    const {
        list: listText,
        validation: validationText,
        postProcessing: postProcessingText,
        selected: selectedText
    } = useListInputText({
        value,
        validationResult,
        listInputEntries,
        listInputDuplicates,
        getEntryTypeText,
        textOverrides,
    })

    const displayedRootTextInputValue = multipleMode ? selectedText : rootTextInputValue

    return (
        <>
            <Dialog
                id={id && `${id}Dialog`}
                open={!!dialogMode}
                maxWidth="sm"
                fullWidth
            >
                { dialogMode === 'list' ? (
                    <>
                        { listText.title ? (
                            <DialogTitle id={id && `${id}ListDialogTitle`}>
                                { listText.title }
                            </DialogTitle>
                        ) : null }
                        <DialogContent>
                            <Stack spacing={1} direction="column">
                                { showAutocomplete ? (
                                    <Autocomplete<AutocompleteValue>
                                        id={id && `${id}ListDialogAutocomplete`}
                                        {...AutocompleteProps}
                                        value={null}
                                        onChange={handleAutocompleteChange}
                                        blurOnSelect
                                    />
                                ) : null }
                                <TextInput
                                    id={id && `${id}ListDialogTextInput`}
                                    value={listTextInputValue}
                                    onValueChange={handleListTextInputChange}
                                    minRows={10}
                                    maxRows={10}
                                    {...getListTextInputProps('list')}
                                    multiline
                                />
                                <Stack spacing={1} alignItems="center" justifyContent="space-between">
                                    <Tooltip title={listText.clearButtonTooltipTitle}>
                                        <IconButton
                                            id={id && `${id}ListDialogClearButton`}
                                            size="small"
                                            onClick={handleClear}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Tooltip>
                                    <Typography variant="caption" color="textSecondary">
                                        { listText.textInputHelperText }
                                    </Typography>
                                </Stack>
                            </Stack>
                        </DialogContent>
                        <ActionsBar
                            left={[
                                <Typography id={id && `${id}ListDialogNowOnListText`}>
                                    { listText.nowOnListText }
                                </Typography>,
                                listInputDuplicates.length > 0 ? (
                                    <Typography id={id && `${id}ListDialogDuplicatesText`}>
                                        { listText.duplicatesText }
                                    </Typography>
                                ) : null,
                            ].filter(Boolean)}
                            right={[
                                <Button
                                    id={id && `${id}ListDialogCancelButton`}
                                    color="primary"
                                    onClick={handleListDialogCancel}
                                >
                                    { listText.cancelButtonText }
                                </Button>,
                                <Button
                                    id={id && `${id}ListDialogApplyButton`}
                                    color="primary"
                                    onClick={handleListDialogApply}
                                    variant="contained"
                                    disabled={!touched}
                                >
                                    { listText.applyButtonText }
                                </Button>
                            ]}
                        />
                    </>
                ) : dialogMode === 'validation' ? (
                    <>
                        { !loading && validationText.title ? (
                            <DialogTitle id={id && `${id}ValidationDialogTitle`}>
                                { validationText.title }
                            </DialogTitle>
                        ) : null }
                        <DialogContent>
                            { validatorError ? (
                                <Stack spacing={1} direction="column" alignItems="center" color="error.main">
                                    <Box display="flex" fontSize="56px">
                                        <ReportProblemOutlined color="inherit" fontSize="inherit" />
                                    </Box>
                                    <Typography color="inherit">
                                        { validationText.errorText }
                                    </Typography>
                                </Stack>
                            ) : loading ? (
                                <Stack spacing={1} direction="column" alignItems="center">
                                    <ListInputProgress id={id && `${id}ValidationDialogProgress`} {...progressProps} />
                                    <Typography gutterBottom>
                                        { validationText.progressText }
                                    </Typography>
                                </Stack>
                            ) : (
                                <Stack spacing={1} direction="column">
                                    <Typography id={id && `${id}ValidationDialogAddedText`}>
                                        { validationText.addedText }
                                    </Typography>
                                    <Typography id={id && `${id}ValidationDialogNotAddedText`}>
                                        { validationText.notAddedText }
                                    </Typography>
                                    <Box maxHeight="50vh" overflow="auto">
                                        <Typography
                                            id={id && `${id}ValidationDialogIncorrectEntriesText`}
                                            color="textSecondary"
                                            style={{ whiteSpace: 'pre-line' }}
                                        >
                                            { validationResult.incorrect.join('\n') }
                                        </Typography>
                                    </Box>
                                </Stack>
                            ) }
                        </DialogContent>
                        <ActionsBar
                            left={!postProcessingDisabled && validationResult.incorrect.length > 0 ? (
                                <Button
                                    id={id && `${id}ValidationDialogShowNotAddedButton`}
                                    color="primary"
                                    onClick={handleValidationDialogShowNotAdded}
                                >
                                    { validationText.showNotAddedButtonText }
                                </Button>
                            ) : null }
                            right={[
                                validatorError ? (
                                    <Button
                                        id={id && `${id}ValidationDialogBackButton`}
                                        color="primary"
                                        onClick={handleValidationDialogBack}
                                    >
                                        { validationText.backButtonText }
                                    </Button>
                                ) : null,
                                loading ? (
                                    <Button
                                        id={id && `${id}ValidationDialogAbortButton`}
                                        onClick={handleValidationDialogAbort}
                                    >
                                        { validationText.abortButtonText }
                                    </Button>
                                ) : (
                                    <Button
                                        id={id && `${id}ValidationDialogCloseButton`}
                                        color="primary"
                                        onClick={handleValidationDialogClose}
                                    >
                                        { validationText.closeButtonText }
                                    </Button>
                                )
                            ].filter(Boolean)}
                        />
                    </>
                ) : dialogMode === 'postProcessing' ? (
                    <>
                        { postProcessingText.title ? (
                            <DialogTitle id={id && `${id}PostProcessingTitle`}>
                                <Box component="span" mr={1}>{ postProcessingText.title }</Box>
                                <Typography variant="body1" display="inline">{ postProcessingText.alreadyAddedTitle }</Typography>
                            </DialogTitle>
                        ) : null }
                        <DialogContent>
                            <TextInput
                                id={id && `${id}PostProcessingDialogTextInput`}
                                value={listTextInputValue}
                                onValueChange={handleListTextInputChange}
                                minRows={10}
                                maxRows={10}
                                {...getListTextInputProps('postProcessing')}
                                multiline
                                errorText={!touched ? postProcessingText.notValidText : undefined}
                            />
                        </DialogContent>
                        <ActionsBar
                            left={touched ? [
                                <Typography id={id && `${id}PostProcessingDialogNowOnListText`}>
                                    { postProcessingText.nowOnListText }
                                </Typography>,
                                listInputDuplicates.length > 0 ? (
                                    <Typography id={id && `${id}PostProcessingDialogDuplicatesText`}>
                                        { postProcessingText.duplicatesText }
                                    </Typography>
                                ) : null,
                            ].filter(Boolean) : null}
                            right={[
                                <Button
                                    id={id && `${id}PostProcessingDialogCancelButton`}
                                    color="primary"
                                    onClick={handlePostProcessingDialogCancel}
                                >
                                    { postProcessingText.cancelButtonText }
                                </Button>,
                                <Button
                                    id={id && `${id}PostProcessingDialogAddButton`}
                                    color="primary"
                                    onClick={handlePostProcessingDialogAdd}
                                    variant="contained"
                                    disabled={!touched}
                                >
                                    { postProcessingText.addButtonText }
                                </Button>
                            ]}
                        />
                    </>
                ) : null }
            </Dialog>

            { !!children && typeof children === 'function' ? children(customRootParams) : (
                <TextInput
                    id={id}
                    value={displayedRootTextInputValue}
                    onValueChange={handleRootTextInputChange}
                    readOnly={multipleMode || readOnly}
                    disabled={disabled}
                    onKeyUp={handleRootTextInputKeyUp}
                    onBlur={handleRootTextInputBlur}
                    {...restTextInputProps}
                    ref={rootRef}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                id={id && `${id}OpenButton`}
                                edge="end"
                                disabled={disabled}
                                onClick={handleListButtonClick}
                            >
                                <List />
                            </IconButton>
                        </InputAdornment>
                    }
                    {...rootTextInputClearProps}
                />
            ) }
        </>
    )
}

export default ListInput
