import classNames from 'classnames'
import React, { FC, useLayoutEffect } from 'react'
import styled from 'styled-components'
import { ButtonBaseClasses } from '../../../core/classes'
import ButtonBase, { ButtonBaseProps } from '../../ButtonBase/ButtonBase'
import { MONTHS_IN_ROW } from '../constants'
import { useUtils } from '../hooks'

export type MonthButtonProps = ButtonBaseProps & {
    month: number
    today?: boolean
    selected?: boolean
    disabled?: boolean
    focused?: boolean
    onMonthSelect: (month: number) => void
    onMonthFocus?: (month: number) => void
}

const MonthButton: FC<MonthButtonProps> = (props) => {
    const {
        month,
        today,
        selected,
        disabled,
        children,
        onMonthSelect,
        onMonthFocus = () => {},
        onFocus,
        onClick,
        onKeyDown,
        autoFocus,
        ...restProps
    } = props

    const utils = useUtils()

    const ref = React.useRef<HTMLButtonElement>(null)

    useLayoutEffect(() => {
        if (autoFocus && !disabled) {
            ref.current!.focus()
        }
    }, [autoFocus, disabled])

    const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
        if (onMonthFocus) {
            onMonthFocus(month)
        }

        if (onFocus) {
            onFocus(event)
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        // if (selected) {
        //     return
        // }

        if (!disabled) {
            onMonthSelect(month)
        }

        if (onClick) {
            onClick(event)
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
        if (onKeyDown) {
            onKeyDown(event)
        }

        switch (event.key) {
            case 'ArrowUp':
                onMonthFocus(month - MONTHS_IN_ROW)
                event.preventDefault()
                break
            case 'ArrowDown':
                onMonthFocus(month + MONTHS_IN_ROW)
                event.preventDefault()
                break
            case 'ArrowLeft':
                onMonthFocus(month - 1)
                event.preventDefault()
                break
            case 'ArrowRight':
                onMonthFocus(month + 1)
                event.preventDefault()
                break
            default:
                break
        }
    }

    return (
        <StyledMonthButton
            data-testid="MonthButton"
            ref={ref}
            className={classNames(
                'month-button',
                today && !selected && 'month-button--today',
                selected && 'month-button--selected',
                disabled && 'month-button--disabled',
            )}
            tabIndex={selected ? 0 : -1}
            onFocus={handleFocus}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            centerRipple
            {...restProps}
        >
            {!children ? month : children}
        </StyledMonthButton>
    )
}

const StyledMonthButton = styled(ButtonBase)<ButtonBaseProps>`
    &.${ButtonBaseClasses.root} {
        flex-basis: calc(100% / ${MONTHS_IN_ROW});
        height: 36px;
        border-radius: 16px;
        color: ${(props) => props.theme.palette.text.primary};
    }

    &:hover {
        background-color: ${(props) => props.theme.palette.action.hover};
    }

    &:focus {
        background-color: ${(props) => props.theme.palette.action.focus};
    }

    &.month-button--today {
        border: solid 1px ${(props) => props.theme.palette.action.active};
    }

    &.month-button--selected {
        color: ${(props) => props.theme.palette.primary.contrastText};
        background-color: ${(props) => props.theme.palette.primary.main};
        font-weight: ${(props) => props.theme.typography.fontWeightBold};
    }

    &.month-button--disabled {
        color: ${(props) => props.theme.palette.text.disabled};
    }

    &.month-button--outsideCurrentMonth {
        opacity: 0.25;
    }
`

export default MonthButton
