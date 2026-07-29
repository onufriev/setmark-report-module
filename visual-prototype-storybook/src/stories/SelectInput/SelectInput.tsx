import React, { useEffect, useRef, useState } from 'react'
import {
    makeStyles,
    Select as MuiSelect,
    SelectProps as MuiSelectProps,
} from '@material-ui/core'
import styled from 'styled-components'
import { getKey, optionToLabel, optionToValue } from './utils'
import { ArrowDropDown } from '../icons'
import { Checkbox } from '../Checkbox'
import { Input } from '../Input'
import { Typography } from '../Typography'
import { CsiTheme } from '../../typings/Theme'
import { FormControl } from '../FormControl'
import { InputLabel } from '../InputLabel'
import { FormHelperText } from '../FormHelperText'
import { CircularProgress } from '../CircularProgress'
import { useForkRef } from '../../utils/useForkRef'
import { Paper } from '../Paper'
import { MenuItem } from '../MenuItem'
import useMounted from '../../utils/useMounted'
import useControlled from '../../utils/useControlled'
import { IconButtonClasses, MenuItemClasses, PaperClasses } from '../../core/classes'
import { useLocale } from '../LocaleProvider'

export type SelectOptionValue = string | number

export type DefaultSelectOption<V extends SelectOptionValue = string> = {
    label: string
    value: V
    disabled?: boolean
}

export type SelectInputProps<T = DefaultSelectOption> = {
    value?: SelectOptionValue | SelectOptionValue[]
    /**
     * label для инпута
     */
    label?: string
    /**
     * Вызывается при изменении выделения
     * @param {T} selectedOptions
     */
    onSelect?: (selectedOption: T) => void
    /**
     * Вызывается при изменении выделения, если multiple === true
     * @param {T[]} selectedOptions
     */
    onMultipleSelect?: (selectedOptions: T[]) => void
    /**
     * Поле в option, несущее value выбранной option
     * Не будет работать, если T - примитивный тип
     * Имеет более низкий приоритет, чем valueFunction
     * Должно быть keyOf T
     */
    valueField?: keyof T
    /**
     * Функция, которая вычисляет value выбранной option
     * Имеет более высокий приоритет, чем valueField
     * @param {T} option
     */
    valueFunction?: (option: T) => SelectOptionValue
    /**
     * Поле в option, которое задает отображаемое значение option
     * Не будет работать, если T - примитивный тип
     * Имеет более низкий приоритет, чем labelFunction
     * Должно быть keyOf T
     */
    labelField?: keyof T
    /**
     * Функция, которая вычисляет отображаемое значение option
     * Имеет более высокий приоритет, чем labelField
     * @param {T} option
     */
    labelFunction?: (option: T) => string
    /**
     * Кастомный рендер опций
     */
    optionRenderer?: (option: T, index?: number) => React.ReactNode
    /**
     * Добавляет divider для опций
     */
    divider?: boolean
    /**
     * Поле в option, несущее key (React Key) выбранной option
     */
    keyField?: keyof T
    /**
     * Функция, которая вычисляет key (React Key) выбранной option
     * Имеет более высокий приоритет, чем keyField
     * @param {T} option
     */
    keyFunction?: (option: T) => SelectOptionValue
    /**
     * Функция асинхронного получения options
     * Если указана, то это включает асинхронный режим получения options
     * В асинхронном режиме options будут получены 1 раз при первом рендере компонента, а props.options будут проигнорированы
     */
    fetchFunction?: () => Promise<T[]>
    /**
     * Информации об элементах в dropdown
     */
    options?: T[]
    /**
     * Текст в popup'е с опциями, если список опций пуст
     * @default Нет вариантов
     */
    noOptionText?: string
    /**
     * Текст подсказки
     */
    helperText?: string
    /**
     * Текст ошибки
     * Имеет более высокий приоритет, чем helperText
     */
    errorText?: string
    /**
     * Кастомный рендер выбранных значений
     */
    valueRenderer?: (value: string | string[]) => React.ReactNode
    /** Ref для корневого div'а */
    rootRef?: React.Ref<HTMLDivElement>
} & Omit<
    MuiSelectProps,
    | 'value'
    | 'variant'
    | 'autoWidth'
    | 'children'
    | 'input'
    | 'label'
    | 'labelWidth'
    | 'native'
    | 'disableUnderline'
    | 'IconComponent'
    | 'onSelect'
    | 'ref'
>

const useStyles = makeStyles((theme: CsiTheme) => ({
    selectInput: {
        '&:focus': {
            backgroundColor: 'unset',
        },
    },
}))

function SelectInput<T = DefaultSelectOption<string>>(props: SelectInputProps<T>) {

    const mounted = useMounted()

    const { t } = useLocale()

    const {
        id = 'SelectInput',
        label,
        labelId: labelIdProps,
        onSelect,
        onMultipleSelect,
        valueField = 'value',
        valueFunction,
        labelField = 'label',
        labelFunction,
        defaultValue = props.multiple ? [] : '',
        value: valueProps,
        valueRenderer,
        multiple,
        fetchFunction: fetchFunctionProps,
        options: optionsProps = [],
        optionRenderer,
        noOptionText = t('select.noOption'),
        keyField,
        keyFunction,
        errorText: errorTextProps,
        helperText: helperTextProps,
        onChange,
        required,
        disabled,
        fullWidth = true,
        divider = false,
        MenuProps,
        rootRef,
        ...restProps
    } = props

    const classes = useStyles()

    const inputRef = useRef<HTMLDivElement>(null)
    const handleRef = useForkRef(inputRef, rootRef)

    const [value, setValue] = useControlled<unknown>({
        controlled: valueProps,
        default: defaultValue
    })

    const [options, setOptions] = useState<T[]>(optionsProps)
    const [loading, setLoading] = useState<boolean>(false)

    const fetchFunction = async () => {
        if (!fetchFunctionProps) return

        setLoading(true)
        try {
            const opts = await fetchFunctionProps()
            if (mounted()) setOptions(opts || [])
        } catch (err) {
            if (mounted()) setOptions([])
        } finally {
            if (mounted()) setLoading(false)
        }
    }

    useEffect(() => {
        if (fetchFunctionProps) {
            fetchFunction()
        }
    }, [fetchFunctionProps])

    useEffect(() => {
        if (!fetchFunctionProps) {
            setOptions(optionsProps || [])
        }
    }, [optionsProps])

    const oToValue = (option: T) => {
        return optionToValue(option, valueField as keyof T, valueFunction)
    }

    const oToLabel = (option: T) => {
        return optionToLabel(option, labelField as keyof T, labelFunction)
    }

    const oToKey = (option: T) => {
        return getKey(option, (keyField as keyof T) || (valueField as keyof T), keyFunction)
    }

    const valueToLabel = (value: string): string => {
        const option = options?.find((o) => oToValue(o) === value)
        return (option != null && oToLabel(option)) || ''
    }

    const handleChange: MuiSelectProps['onChange'] = (event, child) => {
        event.persist()

        setValue(event.target.value)

        onChange?.(event, child)

        if (multiple) {
            if (!onMultipleSelect) return

            const multipleValue = event.target.value as SelectOptionValue[]

            const selectedOptions = options?.filter((option) =>
                multipleValue.includes(oToValue(option)),
            )

            onMultipleSelect(selectedOptions)
        } else {
            if (!onSelect) return

            const selectedOption = options?.find(
                (option) => oToValue(option) === event.target.value,
            )

            if (selectedOption != null) {
                onSelect(selectedOption as T)
            }
        }
    }

    const optionItems = options?.length > 0 ? options.map((option: T, index: number) => {
        const optionId = `${id}Option-${oToValue(option)}`.replace('.', '-')

        let optionContent: React.ReactNode

        if (optionRenderer) {
            optionContent = optionRenderer(option, index)
        } else if (multiple) {
            const multipleValue = value as SelectOptionValue[]

            optionContent = (
                <>
                    <StyledCheckbox
                        checked={multipleValue.indexOf(oToValue(option)) > -1}
                        tabIndex={-1}
                        native
                        disableRipple
                    />
                    <Typography variant="body1">{oToLabel(option)}</Typography>
                </>
            )
        } else {
            optionContent = <Typography variant="body1">{oToLabel(option)}</Typography>
        }

        const disabled =
            (option as unknown as DefaultSelectOption<SelectOptionValue>)?.disabled || false

        return (
            <StyledMenuItem
                key={oToKey(option)}
                id={optionId}
                value={oToValue(option)}
                divider={divider}
                disabled={disabled}
            >
                { optionContent }
            </StyledMenuItem>
        )
    }) : (
        <StyledMenuItem
            id={`${id}EmptyOption`}
            disabled
        >
            { noOptionText }
        </StyledMenuItem>
    )

    const renderValue = (valueSelect: unknown) => {
        if (valueRenderer) {
            const value = valueSelect as string | string[]
            return valueRenderer(value)
        }

        if (multiple) {
            return (valueSelect as string[]).map((v) => valueToLabel(v)).join(', ')
        } else {
            return valueToLabel(valueSelect as string)
        }
    }

    const labelId = label ? `${id}Label` : labelIdProps

    const helperText = errorTextProps || helperTextProps
    const helperTextId = helperText ? `${id}HelperText` : undefined

    return (
        <FormControl
            fullWidth={fullWidth}
            variant="filled"
            error={Boolean(errorTextProps)}
            required={required}
            disabled={loading || disabled}
        >
            { label && <InputLabel id={labelId}>{ label }</InputLabel> }

            <MuiSelect
                {...restProps}
                id={id}
                labelId={labelId}
                data-testid="SelectInput"
                value={value}
                onChange={handleChange}
                classes={{
                    select: classes.selectInput,
                }}
                input={<Input />}
                MenuProps={{
                    id: id && `${id}Menu`,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                    transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                    },
                    ...MenuProps,
                    elevation: 2,
                    PaperProps: {
                        ...MenuProps?.PaperProps,
                        component: StyledPaper,
                        style: inputRef.current ? {
                            ...MenuProps?.PaperProps?.style,
                            maxWidth: `${inputRef.current.clientWidth}px`
                        } : MenuProps?.PaperProps?.style,
                    },
                    MenuListProps: {
                        ...MenuProps?.MenuListProps,
                        disablePadding: true
                    },
                    getContentAnchorEl: null,
                }}
                multiple={multiple}
                renderValue={renderValue}
                disableUnderline
                IconComponent={
                    loading
                        ? (props) => <CircularProgress size={24} {...props} />
                        : ArrowDropDown
                }
                ref={handleRef}
            >
                { optionItems }
            </MuiSelect>

            { helperText && <FormHelperText id={helperTextId}>{ helperText }</FormHelperText> }
        </FormControl>
    )
}

// @ts-ignore
SelectInput.muiName = MuiSelect.muiName

export default SelectInput

const StyledPaper = styled(Paper)`
    &.${PaperClasses.root} {
        /* background-color: ${props => props.theme.palette.overlay.type2}; */
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        margin-top: -2px;
    }
`

const StyledCheckbox = styled(Checkbox)`
    &.${IconButtonClasses.root} {
        padding: 0;
        margin-right: ${props => props.theme.spacing(1.5)}px;
    }
`

const StyledMenuItem = styled(MenuItem)`
    &.${MenuItemClasses.root} {
        padding: ${props => props.theme.spacing(1)}px ${props => props.theme.spacing(1.5)}px;
        white-space: normal;
    }
`
