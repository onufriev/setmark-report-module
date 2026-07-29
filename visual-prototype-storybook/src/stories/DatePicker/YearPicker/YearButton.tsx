import classNames from 'classnames'
import React, { FC, useLayoutEffect } from 'react'
import styled from 'styled-components'
import { ButtonBaseClasses } from '../../../core/classes'
import ButtonBase, { ButtonBaseProps } from '../../ButtonBase/ButtonBase'
import { YEARS_IN_ROW } from '../constants'
import { useUtils } from '../hooks'

export type YearButtonProps = ButtonBaseProps & {
    year: number
    today?: boolean
    selected?: boolean
    disabled?: boolean
    focused?: boolean
    onYearSelect: (year: number) => void
    onYearFocus?: (year: number) => void
}

const YearButton: FC<YearButtonProps> = (props) => {
    const {
        year,
        today,
        selected,
        disabled,
        children,
        onYearSelect,
        onYearFocus = () => {},
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
        if (onYearFocus) {
            onYearFocus(year)
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
            onYearSelect(year)
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
                onYearFocus(year - YEARS_IN_ROW)
                event.preventDefault()
                break
            case 'ArrowDown':
                onYearFocus(year + YEARS_IN_ROW)
                event.preventDefault()
                break
            case 'ArrowLeft':
                onYearFocus(year - 1)
                event.preventDefault()
                break
            case 'ArrowRight':
                onYearFocus(year + 1)
                event.preventDefault()
                break
            default:
                break
        }
    }

    return (
        <StyledYearButton
            data-testid="YearButton"
            ref={ref}
            className={classNames(
                'year-button',
                today && !selected && 'year-button--today',
                selected && 'year-button--selected',
                disabled && 'year-button--disabled',
            )}
            tabIndex={selected ? 0 : -1}
            onFocus={handleFocus}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            centerRipple
            {...restProps}
        >
            {!children ? year : children}
        </StyledYearButton>
    )
}

const StyledYearButton = styled(ButtonBase)<ButtonBaseProps>`
    &.${ButtonBaseClasses.root} {
        flex-basis: calc(100% / ${YEARS_IN_ROW});
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

    &.year-button--today {
        border: solid 1px ${(props) => props.theme.palette.action.active};
    }

    &.year-button--selected {
        color: ${(props) => props.theme.palette.primary.contrastText};
        background-color: ${(props) => props.theme.palette.primary.main};
        font-weight: ${(props) => props.theme.typography.fontWeightBold};
    }

    &.year-button--disabled {
        color: ${(props) => props.theme.palette.text.disabled};
    }

    &.year-button--outsideCurrentMonth {
        opacity: 0.25;
    }
`

export default YearButton
