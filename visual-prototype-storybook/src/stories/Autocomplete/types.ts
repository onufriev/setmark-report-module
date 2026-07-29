import React from 'react'

export type AutocompleteValue<T, Multiple, DisableClearable> = Multiple extends
  | undefined
  | false
  ? DisableClearable extends true
    ? NonNullable<T>
    : T | null
  : Array<T>

export type AutocompleteProps<
    T = string,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    Value = AutocompleteValue<T, Multiple, DisableClearable>
> = {
    defaultValue?: Value
    value?: Value
    onChange?: (option: Value) => void

    defaultInputValue?: string
    inputValue?: string
    onInputChange?: (value: string) => void

    options?: readonly T[]
    /** Ограничение на количество отображаемых опций */
    optionsLimit?: number
    /**
     * Функция сопоставления опции со значением.
     * @default (option, value) => option === value
     **/
    isOptionEqualToValue?: (option: T, value: T) => boolean

    /**
     * Функция получения label опции.
     * @default option => option.label ?? option
     */
    getOptionLabel?: (option: T) => string
    /** Функция определения что опция выключена */
    getOptionDisabled?: (option: T) => boolean

    /**
     * Фунция загрузки опций
     * @param params.options неотфильтрованные опции, возвращённые предыдущим вызовом fetchOptions
     * @param params.valueChange флаг изменения введенного значения
     */
    fetchOptions?: (inputValue: string, params: { options: readonly T[], valueChange: boolean }) => Promise<T[]>
    /** Загружать опции на ввод */
    fetchOptionsOnInput?: boolean
    /**
     * Задержка вызова функции загрузки опций в мс
     * @default 200
     */
    fetchOptionsDebounceDelay?: number
    /** Длина значения ввода, при котором начнётся загрузка опций, если fetchOptionsOnInput = true */
    fetchOptionsOnInputLength?: number
    /**
     * Вызывать функцию загрузки после монтирования компонента.
     * По-умолчанию вызывается на первый фокус по компоненту, если нет выбранного значения.
     */
    fetchOptionsOnMount?: boolean
    /**
     * Индикатор необходимости вызывать функцию загрузки следующей пачки опций
     * Если false, то fetchOptions на скроллинг списка опций не вызывается
     * @unstable
     */
    fetchOptionsHasMore?: boolean
    /**
     * Порог срабатывания функции дозагрузки в режиме Infinite Scroll
     * @default 200
     **/
    fetchOptionsScrollThreshold?: number

    /**
     * Функция фильтрации опций.
     * По-умолчанию сопоставляет ввод с label опции.
     * Фильтрация отключается, если заданы fetchOptions и fetchOptionsOnInput, но возможность задать свою функцию сохраняется.
     */
    filterOptions?: AutocompleteFilterOptions<T>
    /** Фильтровать выбранные опции */
    filterSelectedOptions?: boolean

    /** Текст вместо лоадера */
    loadingText?: string
    /** Текст, если нет опций */
    noOptionText?: string
    /** Текст, если фильтрация опций не дала результатов */
    notFoundText?: string

    /** WIP */
    groupBy?: (option: T) => string
    /** WIP */
    renderGroup?: (params: AutocompleteRenderGroupParams) => React.ReactNode

    /**
     * Флаг режима множественного выбора.
     * @experimental
     */
    multiple?: Multiple

    /** WIP */
    renderValue?: (value: Value) => React.ReactNode
    /** Рендер-функция для контейнера режима множественного выбора */
    renderTags?: (value: Value, getTagProps: AutocompleteGetTagProps) => React.ReactNode
    /** Рендер-функция для опции */
    renderOption?: AutocompleteOptionRenderer<T>
    /** Рендер-функция для содержимого части опции */
    renderOptionInner?: (option: T) => React.ReactNode

    /** Выделять значение ввода при фокусе на поле */
    selectOnFocus?: boolean
    /**
     * Очищать значение ввода при блюре
     * Если 'true', текст ввода очищается при размытии, если значение не выбрано.
     * Установите значение 'true', если вы хотите помочь пользователю ввести новое значение.
     * Установите значение 'false', если вы хотите, чтобы пользователь возобновил поиск.
     **/
    clearOnBlur?: boolean
    /**
     * Убрать фокус с поля после выбора значения
     * - 'false' ввод не размывается.
     * - 'true' ввод всегда размыт.
     **/
    blurOnSelect?: boolean

    /**
     * Пользовательский ввод не привязан к предоставленным параметрам (options)
     */
    freeSolo?: boolean

    onFocus?: () => void
    onBlur?: () => void

    /** Автоматически выбирать опцию из списка, если есть только одно совпадение */
    autoSelectOneMatch?: boolean

    /** Отключить очищаемость поля */
    disableClearable?: DisableClearable
    /** Отключить закрытие опций после выбора значения */
    disableCloseOnSelect?: boolean
    /** Отключить переброс фокуса опции с последней на первую и с первой на последнюю */
    disableListWrap?: boolean

    /** Отключить отображение иконки поиска */
    disableSearchIndicator?: boolean
    /** Включить идикатор списка опций, вместо дефолтной иконки поиска */
    enablePopupIndicator?: boolean

    label?: string

    fullWidth?: boolean
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    error?: boolean
    helperText?: string
    errorText?: string
    placeholder?: string

    endAdornment?: React.ReactNode
}

export interface AutocompleteRenderGroupParams {
    key: string
    group: string
    children?: React.ReactNode
}

export type AutocompleteCreateFilterOptionsConfig<T> = {
    trim?: boolean
    ignoreCase?: boolean
    limit?: number
    matchFrom?: 'start' | 'any'
    stringify?: (option: T) => string
}

export type AutocompleteFilterOptions<T> = (options: readonly T[], params: { inputValue: string, getOptionLabel: (option: T) => string }) => T[]
export type AutocompleteOptionRenderer<T> = (
    props: React.HTMLAttributes<HTMLButtonElement>,
    option: T,
    state: { inputValue: string, selected: boolean, disabled: boolean }
) => React.ReactNode

export type AutocompleteGetTagProps = (index: number ) => {
    key: number,
    'data-tag-index': number,
    tabIndex: -1,
    onDelete: (() => void) | undefined
}
