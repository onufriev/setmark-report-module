import React, { forwardRef, useRef, useState } from 'react'
import { FormControl } from '../FormControl'
import { FormHelperText } from '../FormHelperText'
import { InputLabel } from '../InputLabel'
import { Input, InputProps } from '../Input'
import { InputLabelProps } from '../InputLabel/InputLabel'
import { InputAdornment } from '../InputAdornment'
import { IconButton } from '../IconButton'
import { Clear } from '../icons'
import { useForkRef } from '../../utils/useForkRef'

export type TextInputProps = {
    label?: string
    helperText?: string
    /**
     * Текст ошибки.
     * Имеет более высокий приоритет, чем helperText.
     */
    errorText?: string
    onValueChange?: (value: string) => void
    maxLength?: number
    InputLabelProps?: InputLabelProps
    clearable?: boolean
    /**
     * Управление видимостью кнопки очистки.
     * По-дефолту видимость управляется наличием введенного значения.
     */
    clearVisibled?: boolean
    /**
     * Коллбэк нажатия на кнопку очистки.
     * Использовать только в случае контролируемости введенного значения.
     */
    onClear?: () => void
} & Omit<InputProps, 'rowsMax' | 'ref' | 'rowsMin'>

export const TextInput = forwardRef<HTMLDivElement, TextInputProps>(
    function (props, forwardedRef) {
        const {
            id,
            label,
            error,
            errorText: errorTextProps,
            helperText: helperTextProps,
            onValueChange,
            maxLength,
            multiline,
            clearable,
            clearVisibled: clearVisibledProps,
            onClear,
            onChange,

            defaultValue,

            fullWidth = true,
            required,
            disabled,
            inputProps,
            inputRef: inputRefProps,

            endAdornment: endAdornmentProps,

            InputLabelProps,

            style,

            ...restProps
        } = props

        const [innerValue, setInnerValue] = useState<unknown>(defaultValue ?? props.value ?? '')

        const controlledClearable = typeof clearVisibledProps === 'boolean'

        const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

        const handleInputRef = useForkRef(inputRef, inputRefProps)

        const helperText = errorTextProps || helperTextProps

        const handleClear = () => {
            if (inputRef.current) {
                const prototype = multiline ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype

                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')!.set!
                nativeInputValueSetter.call(inputRef.current, '')

                const event = new Event('input', { bubbles: true })
                inputRef.current.dispatchEvent(event)
            }

            if (onClear) {
                onClear()
            }
        }

        const clearVisibled = clearable && (controlledClearable ? clearVisibledProps : Boolean(innerValue))

        const endAdornment = clearVisibled ? (
            <InputAdornment position="end">
                <IconButton
                    edge={React.isValidElement(endAdornmentProps) ? false : 'end'}
                    onClick={() => handleClear()}
                >
                    <Clear />
                </IconButton>

                { endAdornmentProps && React.isValidElement(endAdornmentProps) ? (endAdornmentProps as React.ReactElement).props.children : null }
            </InputAdornment>
        ) : endAdornmentProps

        return (
            <FormControl
                id={id && `${id}FormControl`}
                data-testid="TextInput"
                fullWidth={fullWidth}
                variant="filled"
                error={error || Boolean(errorTextProps)}
                required={required}
                disabled={disabled}
                style={style}
                hiddenLabel={!label}
            >
                { label && <InputLabel id={id && `${id}Label`} {...InputLabelProps}>{label}</InputLabel> }

                <Input
                    id={id}
                    ref={forwardedRef}
                    inputRef={handleInputRef}
                    defaultValue={defaultValue}
                    onChange={(event) => {
                        setInnerValue(event.target.value)
                        onChange?.(event)
                        onValueChange?.(event.target.value)
                    }}
                    inputProps={{
                        maxLength,
                        ...inputProps,
                    }}
                    endAdornment={endAdornment}
                    multiline={multiline}
                    {...restProps}
                />

                { helperText && <FormHelperText id={id && `${id}HelperText`}>{helperText}</FormHelperText> }
            </FormControl>
        )
    }
)

export default TextInput
