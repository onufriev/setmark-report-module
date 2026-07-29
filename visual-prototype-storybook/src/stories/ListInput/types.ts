import { AutocompleteProps } from '../Autocomplete'
import { TextInputProps } from '../TextInput'

export type ListInputAutocompleteProps<AutocompleteValue> =
    Omit<AutocompleteProps<AutocompleteValue, false, false>, 'value' | 'multiple' | 'disableClearable'>
export type ListInputListTextInputProps =
    Omit<TextInputProps, 'value' | 'defaultValue' | 'onChange' | 'onValueChange' | 'maxLength'>
export type ListInputRootTextInputProps =
    Omit<TextInputProps, 'value' | 'defaultValue' | 'onChange' | 'onValueChange' | 'maxLength' | 'endAdornment' | 'clearVisibled' | 'onClear'>

export type ListInputProps<AutocompleteValue = string> = {
    defaultValue?: string[]
    value?: string[]
    onChange?: (newValue: string[]) => void
    /**
     * Разделитель значений, используется для разделения строки ввода на значения.
     * При обработке ввода, компонент заменяет переносы строк на разделитель,
     * и уже потом разбивает строку по разделителю.
     * @default "," запятая
     **/
    delimiter?: string
    /** Регулярное выражение, которое фильтрует введенные значения */
    entryRegExp?: RegExp
    /** Отключить обрезку пробелов с краёв введенных значений */
    entryTrimDisabled?: boolean
    /**
     * Асинхронная функция валидации введенных значений.
     * @param entries массив введенных значений
     * @param progress контроллер лоадером, позволяет задать режим и величину прогресса
     * @param signal браузерный сигнал сброса, который можно, например, использовать в fetch или реализовать свою логику
     */
    validator?: (entries: string[], progress: ListInputProgressParams, signal: AbortSignal) => Promise<ListInputValidationResult>
    showAutocomplete?: boolean
    AutocompleteProps?: ListInputAutocompleteProps<AutocompleteValue>
    /**
     * Функция, возвращающая параметры для поля ввода списка значений в зависимости от текущего режима окна.
     * @param dialogMode "list" - ввод списка значений, "postProcessing" - постобработка не добавленных значений
     **/
    getListTextInputProps?: (dialogMode: 'list' | 'postProcessing') => ListInputListTextInputProps
    /**
     * Очищать внутреннее состояние после завершения работы с компонентом.
     * Полезен для неконтролируемого варианта использования.
     **/
    clearAfterApply?: boolean
    /** Применять введенное значение в корневое поле ввода по блюру */
    applyFromRootOnBlur?: boolean
    /** Функция получения значения из опции Autocomplete для поля ввода списка значений */
    getEntryFromOption?: (autocompleteValue: AutocompleteValue) => string
    /** Отключить постобработку не добавленных значений после валидации */
    postProcessingDisabled?: boolean
    /** Реф на корневой TextInput */
    rootRef?: React.Ref<HTMLDivElement>
    /** Пользовательский рендер корневого элемента */
    children?: (customRootParams: ListInputCustomRootParams) => React.ReactNode
    /**
     * Функция получения локализованного названия типа сущности для отображения в элементах.
     * Пример: Список {{ type }} (Список штрихкодов)
     **/
    getEntryTypeText?: (entriesCount: number) => string
    /** Переопределение текстовых элементов */
    textOverrides?: ListInputTextOverrides
} & ListInputRootTextInputProps

export type ListInputValidationResult = {
    correct: string[]
    incorrect: string[]
}

export type ListInputDialogMode = 'list' | 'validation' | 'postProcessing' | null

export type ListInputProgressParams = {
    setVariant: (variant: 'determinate' | 'indeterminate') => void
    setValue: (value: number) => void
}

export type ListInputCustomRootParams = {
    id?: string
    /** Открыть окно ввода значений */
    open: () => void
    readOnly?: boolean
    disabled?: boolean
}

export type ListInputTextOverrides = {
    selected?: (addedCount: number) => string
    list?: {
        title?: (type: string) => string
        textInputHelperText?: string
        clearButtonTooltipTitle?: string
        nowOnListText?: (onListCount: number) => string
        duplicatesText?: (duplicatesCount: number) => string
        cancelButtonText?: string
        applyButtonText?: string
    }
    validation?: {
        title?: string
        errorText?: string
        progressText?: string
        addedText?: (addedCount: number, type: string) => string
        notAddedText?: (notAddedCount: number, type: string) => string
        showNotAddedButtonText?: string
        backButtonText?: string
        abortButtonText?: string
        closeButtonText?: string
    }
    postProcessing?: {
        title?: (type: string) => string
        alreadyAddedTitle?: (addedCount: number) => string
        notValidText?: (notAddedCount: number, type: string) => string
        nowOnListText?: (onListCount: number) => string
        duplicatesText?: (duplicatesCount: number) => string
        cancelButtonText?: string
        addButtonText?: string
    }
}

export type ListInputText = {
    selected: string
    list: {
        title: string
        textInputHelperText: string
        clearButtonTooltipTitle: string
        nowOnListText: string
        duplicatesText: string
        cancelButtonText: string
        applyButtonText: string
    }
    validation: {
        title: string
        errorText: string
        progressText: string
        addedText: string
        notAddedText: string
        showNotAddedButtonText: string
        backButtonText: string
        abortButtonText: string
        closeButtonText: string
    }
    postProcessing: {
        title: string
        alreadyAddedTitle: string
        notValidText: string
        nowOnListText: string
        duplicatesText: string
        cancelButtonText: string
        addButtonText: string
    }
}

export type UseListInputTextParams = {
    value: string[]
    validationResult: ListInputValidationResult
    listInputEntries: string[]
    listInputDuplicates: string[]
    getEntryTypeText: (entriesCount: number) => string
    textOverrides: ListInputTextOverrides
}
