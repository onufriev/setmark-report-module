import React, { useCallback, useEffect, useRef } from 'react'
import { useForkRef } from '../../utils/useForkRef'
import TextInput from '../TextInput/TextInput'
import { Falsy, MaskedInputProps } from './types'
import IMask from 'imask'
import { isEqual } from 'lodash'

const MaskedInput = function <
    Opts extends IMask.AnyMaskedOptions = IMask.AnyMaskedOptions,
    Unmask extends ('typed' | boolean) = false,
    Value = Unmask extends 'typed'
        ? IMask.InputMask<Opts>['typedValue']
        : Unmask extends Falsy
            ? IMask.InputMask<Opts>['value']
            : IMask.InputMask<Opts>['unmaskedValue'],
> (props: MaskedInputProps<Opts, Unmask, Value>) {
    const {
        options,
        unmask = false,
        value: valueProps,
        onValueChange,
        onAccept,
        onComplete,
        ref: refProps,

        inputRef: inputRefProps,
        InputLabelProps,
        ...restProps
    } = props

    const prevOptions = useRef<Opts>(options)
    const textInputRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const maskRef = useRef<IMask.InputMask<Opts>>()

    const handleTextInputRef = useForkRef(textInputRef, refProps)
    const handleInputRef = useForkRef(inputRef, inputRefProps)

    useEffect(() => {
        if (!options.mask) {
            console.error('CSI UI: prop "mask" in "options" must be defined!')
            return
        }
        initMask()
        return () => {
            destroyMask()
        }
    }, [])

    const initMask = () => {
        if (!inputRef.current) return

        maskRef.current = IMask(inputRef.current, options)
    }

    const destroyMask = () => {
        if (!maskRef.current) return

        maskRef.current.destroy()
        maskRef.current = undefined
    }

    useEffect(() => {
        if (!maskRef.current || isEqual(options, prevOptions.current)) return

        if (options.mask) {
            maskRef.current.updateOptions(options)
        }

        prevOptions.current = options
    }, [options])

    useEffect(() => {
        if (valueProps === undefined || valueProps === getMaskValue()) return

        setMaskValue(valueProps)
    }, [valueProps])

    const getMaskValue = (): Value | null => {
        if (!maskRef.current) return null

        if (unmask === 'typed') return maskRef.current.typedValue as unknown as Value
        if (unmask) return maskRef.current.unmaskedValue as unknown as Value
        return maskRef.current.value as unknown as Value
    }

    const setMaskValue = (value: Value) => {
        if (!maskRef.current) return

        const newValue = value == null ? '' : value

        if (unmask === 'typed') maskRef.current.typedValue = newValue as unknown as IMask.MaskedTypedValue<Opts['mask']>
        else if (unmask) maskRef.current.unmaskedValue = newValue as unknown as string
        else maskRef.current.value = newValue as unknown as string
    }

    const _onAccept = useCallback((evt?: InputEvent) => {
        if (!maskRef.current) return

        const value = getMaskValue()!
        if (value === valueProps) return
        onValueChange?.(value)
        onAccept?.(value, maskRef.current, evt)
    }, [maskRef.current, valueProps, onValueChange, onAccept])

    const _onComplete = useCallback((evt?: InputEvent) => {
        if (!maskRef.current) return

        const value = getMaskValue()!
        if (value === valueProps) return
        onComplete?.(value, maskRef.current, evt)
    }, [maskRef.current, valueProps, onComplete])

    useEffect(() => {
        if (!maskRef.current) return

        const mask = maskRef.current
        mask.on('accept', _onAccept)
        return () => {
            mask.off('accept', _onAccept)
        }
    }, [_onAccept])

    useEffect(() => {
        if (!maskRef.current) return

        const mask = maskRef.current
        mask.on('complete', _onComplete)
        return () => {
            mask.off('complete', _onComplete)
        }
    }, [_onComplete])

    return (
        <TextInput
            {...restProps}
            ref={handleTextInputRef}
            inputRef={handleInputRef}
            data-testid="MaskedInput"
            InputLabelProps={{
                ...InputLabelProps,
                ...('lazy' in options && options.lazy === false ? { shrink: true } : {})
            }}
        />
    )
}

export default MaskedInput
