import { useEffect, useCallback, useState, useRef, Dispatch } from 'react'
import type { MutableRefObject } from 'react'
import IMask from 'imask'
import { Falsy, MaskedInputProps, MaskedInputElement } from './types'

export default
    function useMaskedInput<
        Opts extends IMask.AnyMaskedOptions = IMask.AnyMaskedOptions,
        Unmask extends ('typed' | boolean) = false,
        Value = Unmask extends 'typed' ?
            IMask.InputMask<Opts>['typedValue'] :
            Unmask extends Falsy ?
                IMask.InputMask<Opts>['value'] :
                IMask.InputMask<Opts>['unmaskedValue'],
        MaskElement extends MaskedInputElement = MaskedInputElement
    > (
        opts: Opts,
        { onAccept, onComplete }: Pick<MaskedInputProps<Opts, Unmask, Value>, 'onAccept' | 'onComplete'> = {}
    ): {
        ref: MutableRefObject<MaskElement>,
        maskRef: MutableRefObject<IMask.InputMask<Opts>>,
        value: IMask.InputMask<Opts>['value'],
        changeValue: Dispatch<IMask.InputMask<Opts>['value']>,
        unmaskedValue: IMask.InputMask<Opts>['unmaskedValue'],
        changeUnmaskedValue: Dispatch<IMask.InputMask<Opts>['unmaskedValue']>,
        typedValue: IMask.InputMask<Opts>['typedValue'],
        changeTypedValue: Dispatch<IMask.InputMask<Opts>['typedValue']>,
    } {

    const ref = useRef<any>(null)
    const maskRef = useRef<any>(null)
    const [value, setValue] = useState<IMask.InputMask<Opts>['value']>('')
    const [unmaskedValue, setUnmaskedValue] = useState<IMask.InputMask<Opts>['unmaskedValue']>('')
    const [typedValue, setTypedValue] = useState<IMask.InputMask<Opts>['typedValue']>()

    const _destroyMask = useCallback(() => {
        maskRef.current?.destroy()
        maskRef.current = null
    }, [])

    const _onAccept = useCallback(
        (evt?: InputEvent) => {
            if (!maskRef.current) return

            setValue(maskRef.current.value)
            setUnmaskedValue(maskRef.current.unmaskedValue)
            setTypedValue(maskRef.current.typedValue)
            onAccept?.(maskRef.current.value, maskRef.current, evt)
        },
        [onAccept],
    )

    const _onComplete = useCallback(
        (evt?: InputEvent) => {
            if (!maskRef.current) return

            onComplete?.(maskRef.current.value, maskRef.current, evt)
        },
        [onComplete],
    )

    useEffect(() => {
        const el = ref.current

        if (!el || !opts?.mask) return _destroyMask()

        const mask = maskRef.current

        if (!mask) {
            if (el && opts?.mask) {
                maskRef.current = IMask(el, opts)

                if (el.defaultValue !== maskRef.current.value) _onAccept()
            }
        } else {
            mask?.updateOptions(opts)
        }
    }, [opts, _destroyMask, _onAccept])

    useEffect(() => {
        if (!maskRef.current) return

        const mask = maskRef.current

        mask.on('accept', _onAccept)
        mask.on('complete', _onComplete)

        return () => {
            mask.off('accept', _onAccept)
            mask.off('complete', _onComplete)
        }
    }, [_onAccept, _onComplete])

    const changeValue = useCallback((value) => {
        const mask = maskRef.current
        if (mask && mask.value !== value) mask.value = value
    }, [maskRef.current])

    const changeUnmaskedValue = useCallback((value) => {
        const mask = maskRef.current
        if (mask && mask.unmaskedValue !== value) mask.unmaskedValue = value
    }, [maskRef.current])

    const changeTypedValue = useCallback((value) => {
        const mask = maskRef.current
        if (mask && mask.typedValue !== value) mask.typedValue = value
    }, [maskRef.current])

    useEffect(() => _destroyMask, [_destroyMask])

    return {
        ref,
        maskRef,
        value, changeValue,
        unmaskedValue, changeUnmaskedValue,
        // @ts-ignore
        typedValue, changeTypedValue,
    }
}
