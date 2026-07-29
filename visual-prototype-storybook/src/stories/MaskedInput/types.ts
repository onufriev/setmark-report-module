import React from 'react'
import { TextInputProps } from '../TextInput'

export type MaskedInputProps<
    Opts extends IMask.AnyMaskedOptions = IMask.AnyMaskedOptions,
    Unmask extends ('typed' | boolean) = false,
    Value = Unmask extends 'typed' ?
        IMask.InputMask<Opts>['typedValue'] :
        Unmask extends Falsy ?
            IMask.InputMask<Opts>['value'] :
            IMask.InputMask<Opts>['unmaskedValue'],
> = Omit<TextInputProps, 'value' | 'onValueChange' | 'onChange' | 'children'> & {
    options: Opts
    unmask?: Unmask
    value?: Value
    onValueChange?: (value: Value) => void
    onAccept?: (value: Value, maskRef: IMask.InputMask<Opts>, e?: InputEvent) => void
    onComplete?: (value: Value, maskRef: IMask.InputMask<Opts>, e?: InputEvent) => void
    /** Реф TextInput */
    ref?: React.Ref<HTMLDivElement>
}

export type Falsy = false | 0 | "" | null | undefined

export type MaskedInputElement = IMask.MaskElement | HTMLTextAreaElement | HTMLInputElement
