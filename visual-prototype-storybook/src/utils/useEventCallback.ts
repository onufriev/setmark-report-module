import { useRef, useCallback, useLayoutEffect } from 'react'

/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 */
export default function useEventCallback<Args extends unknown[], Return> (
    fn: (...args: Args) => Return,
): (...args: Args) => Return {
    const ref = useRef(fn)
    useLayoutEffect(() => {
        ref.current = fn
    })
    return useCallback(
        (...args: Args) =>
            // @ts-expect-error hide `this`
            // tslint:disable-next-line:ban-comma-operator
            (0, ref.current!)(...args),
        [],
    )
}
