import classNames from 'classnames'
import React, { FC, useLayoutEffect } from 'react'
import styled from 'styled-components'
import { ButtonBaseClasses } from '../../../core/classes'
import ButtonBase, { ButtonBaseProps } from '../../ButtonBase/ButtonBase'
import { useUtils } from '../hooks'

export type DayButtonProps = ButtonBaseProps & {
    day: Date
    outsideCurrentMonth: boolean
    today?: boolean
    selected?: boolean
    disabled?: boolean
    focused?: boolean
    onDaySelect: (day: Date) => void
    onDayFocus?: (day: Date) => void
}

const DayButton: FC<DayButtonProps> = (props) => {
    const {
        day,
        outsideCurrentMonth,
        today,
        selected,
        disabled,
        children,
        onDaySelect,
        onDayFocus = () => {},
        onFocus,
        onClick,
        onKeyDown,
        autoFocus,
        ...restProps
    } = props

    const utils = useUtils()

    const ref = React.useRef<HTMLButtonElement>(null)

    useLayoutEffect(() => {
        if (autoFocus && !disabled && !outsideCurrentMonth) {
            ref.current!.focus()
        }
    }, [autoFocus, disabled, outsideCurrentMonth])

    const handleFocus = (event: React.FocusEvent<HTMLButtonElement>) => {
        if (onDayFocus) {
            onDayFocus(day)
        }

        if (onFocus) {
            onFocus(event)
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (selected) {
            return
        }

        if (!disabled) {
            onDaySelect(day)
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
                onDayFocus(utils.addDays(day, -7))
                event.preventDefault()
                break
            case 'ArrowDown':
                onDayFocus(utils.addDays(day, 7))
                event.preventDefault()
                break
            case 'ArrowLeft':
                onDayFocus(utils.addDays(day, -1))
                event.preventDefault()
                break
            case 'ArrowRight':
                onDayFocus(utils.addDays(day, 1))
                event.preventDefault()
                break
            case 'Home':
                onDayFocus(utils.startOfWeek(day))
                event.preventDefault()
                break
            case 'End':
                onDayFocus(utils.endOfWeek(day))
                event.preventDefault()
                break
            case 'PageUp':
                onDayFocus(utils.getNextMonth(day))
                event.preventDefault()
                break
            case 'PageDown':
                onDayFocus(utils.getPreviousMonth(day))
                event.preventDefault()
                break
            default:
                break
        }
    }

    return (
        <StyledDayButton
            data-testid="DayButton"
            ref={ref}
            className={classNames(
                'day-button',
                today && !selected && 'day-button--today',
                selected && 'day-button--selected',
                disabled && 'day-button--disabled',
                outsideCurrentMonth && 'day-button--outsideCurrentMonth',
            )}
            tabIndex={selected ? 0 : -1}
            onFocus={handleFocus}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            centerRipple
            {...restProps}
        >
            {!children ? utils.format(day, 'd') : children}
        </StyledDayButton>
    )
}

const StyledDayButton = styled(ButtonBase)<ButtonBaseProps>`
    &.${ButtonBaseClasses.root} {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        color: ${(props) => props.theme.palette.text.primary};
    }

    &:hover {
        background-color: ${(props) => props.theme.palette.action.hover};
    }

    &:focus {
        background-color: ${(props) => props.theme.palette.action.focus};
    }

    &.day-button--today {
        /* color: ${(props) => props.theme.palette.primary.main}; */
        border: solid 1px ${(props) => props.theme.palette.action.active};
    }

    &.day-button--selected {
        color: ${(props) => props.theme.palette.primary.contrastText};
        background-color: ${(props) => props.theme.palette.primary.main};
        font-weight: ${(props) => props.theme.typography.fontWeightBold};
    }

    &.day-button--disabled {
        color: ${(props) => props.theme.palette.text.disabled};
    }

    &.day-button--outsideCurrentMonth {
        visibility: hidden;
        /* color: ${(props) => props.theme.palette.text.secondary}; */
    }
`

export default DayButton
