import React, { FC } from 'react'
import styled from 'styled-components'
import {
    FormControl as MuiFormControl,
    InputLabel as MuiInputLabel,
    Input as MuiInput,
    InputProps as MuiInputProps,
    InputLabelProps as MuiInputLabelProps,
    FormHelperText as MuiFormHelperText,
    TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core'

export type TextFieldProps = MuiTextFieldProps

export type StyledInputProps = MuiInputProps

const StyledInput = styled(MuiInput)<StyledInputProps>`
    background-color: ${(props) => props.theme.palette.overlay.type2};
    border-radius: ${(props) => props.theme.shape.borderRadius}px;
    padding: 12px 12px;

    &.MuiInputBase-marginDense {
        padding: 6px 12px;
    }

    &.MuiInput-formControl {
        margin-top: 0;
    }
    & .MuiInputBase-input {
        padding: 0;
        font-size: ${(props) => props.theme.typography.inputText.fontSize}px;
        line-height: ${(props) => props.theme.typography.inputText.lineHeight};
    }
`

const StyledLabel = styled(MuiInputLabel)<MuiInputLabelProps>`
    &.MuiInputLabel-filled.MuiInputLabel-marginDense {
        transform: translate(12px, 9px) scale(1);
    }
    &.MuiInputLabel-filled {
        transform: translate(12px, 16px) scale(1);
    }
    &.MuiInputLabel-filled.MuiInputLabel-shrink.MuiInputLabel-marginDense {
        transform: translate(12px, 0px) scale(0.75);
    }
    &.MuiInputLabel-filled.MuiInputLabel-shrink {
        transform: translate(12px, 4px) scale(0.75);
    }
`
/**
 * @deprecated
 */
const TextField: FC<TextFieldProps> = (props) => {
    const {
        variant = 'filled',
        color = 'primary',
        disabled,
        fullWidth,
        error,
        label,
        helperText,
        autoComplete,
        autoFocus,
        FormHelperTextProps,
        InputLabelProps,
        defaultValue,
        id,
        inputProps,
        InputProps,
        inputRef,
        multiline = false,
        name,
        onBlur,
        onChange,
        onFocus,
        placeholder,
        required = false,
        rows,
        rowsMax,
        maxRows,
        type,
        value,
        size = 'small',
        ...otherProps
    } = props

    const helperTextId = helperText && id ? `${id}-helper-text` : undefined
    const inputLabelId = label && id ? `${id}-label` : undefined

    return (
        <MuiFormControl
            disabled={disabled}
            error={error}
            fullWidth={fullWidth}
            required={required}
            color={color}
            variant={variant}
            size={size}
            {...otherProps}
        >
            {label && (
                <StyledLabel variant={variant} htmlFor={id} id={inputLabelId} {...InputLabelProps}>
                    {label}
                </StyledLabel>
            )}
            <StyledInput
                aria-describedby={helperTextId}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                defaultValue={defaultValue}
                fullWidth={fullWidth}
                multiline={multiline}
                name={name}
                rows={rows}
                rowsMax={rowsMax}
                maxRows={maxRows}
                type={type}
                value={value}
                id={id}
                inputRef={inputRef}
                onBlur={onBlur}
                onChange={onChange}
                onFocus={onFocus}
                placeholder={placeholder}
                inputProps={inputProps}
                disableUnderline={true}
                {...InputProps}
            />
            {helperText && (
                <MuiFormHelperText variant={variant} {...FormHelperTextProps}>
                    {helperText}
                </MuiFormHelperText>
            )}
        </MuiFormControl>
    )
}

export default TextField
