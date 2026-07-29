import React, { useEffect, useRef, useState } from 'react'

export interface UseAutosizerProps {
    ref: React.RefObject<HTMLElement>
    onResize?: (size: UseAutosizerSize, entry?: ResizeObserverEntry) => void
}

export interface UseAutosizerSize {
    height: number | null
    width: number | null
}

export default function useResizeObserver ({ ref, onResize }: UseAutosizerProps): UseAutosizerSize {
    const [size, setSize] = useState<UseAutosizerSize>({ width: null, height: null })

    useEffect(() => {
        if (ref?.current) {
            resizeObserverRef.current.observe(ref.current)
        }

        return () => {
            resizeObserverRef.current.disconnect()
        }
    }, [ref?.current])

    const resizeObserverRef = useRef<ResizeObserver>(new ResizeObserver(entries => {
        for (const entry of entries) {
            if (entry.target === ref?.current) {
                const newSize = {
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                }

                setSize(newSize)
                onResize?.(newSize, entry)
            }
        }
    }))

    return size
}
