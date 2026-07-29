import React, { forwardRef } from 'react'
import {
    DialogTitle as MuiDialogTitle,
    DialogTitleProps as MuiDialogTitleProps
} from '@material-ui/core'
import styled from 'styled-components'
import { Typography } from '../Typography'
import { IconButton } from '../IconButton'
import { Warning, CheckCircle, Info, Close } from '../icons'
import { DialogVariant } from '../DialogConfirm'
import { SvgIconProps } from '../SvgIcon'
import { MakeStyled } from '../../typings/utils'
import { useDialogProps } from '../Dialog/hooks'
import { DialogTitleClasses, IconButtonClasses, TypographyClasses } from '../../core/classes'
import { Box } from '../Box'
import { mergeClasses } from '../../utils/classes-util'

export type DialogTitleProps = Omit<MuiDialogTitleProps, 'disableTypography'> & {
    /**
     * Определяет вариант отображения заголовка диалогового окна
    */
    variant?: DialogVariant,
    /**
     * Передает иконку для отображения в заголовке диалогового окна
     * Приоритет больше, чем у иконок по умлочанию при применении пропса variant
    */
    icon?: React.ReactElement<SvgIconProps>,
    /**
     * Определяет, отображать иконку или нет
    */
    showIcon?: boolean,
    /**
     * Событие для закрытия окна, при передаче события рендерится кнопка-Крестик
    */
    onClose?: React.ReactEventHandler<{}>
}

const PreDialogTitle: React.FC<MuiDialogTitleProps> = props => {
    const { classes, ...restProps } = props
    return <MuiDialogTitle classes={mergeClasses(DialogTitleClasses, classes)} {...restProps} />
}

const StyledDialogTitle = styled(PreDialogTitle)<MuiDialogTitleProps>`
    &.${DialogTitleClasses.root} {
        display: flex;
        align-items: flex-start;

        padding: ${props => props.theme.spacing(2)}px ${props => props.theme.spacing(2)}px 0;

        .${TypographyClasses.root} {
            flex-grow: 1;
        }

        .${IconButtonClasses.root} {
            margin-left: ${props => props.theme.spacing(2)}px;
            margin-top: -6px;
            margin-right: -6px;
        }
    }
`

const StyledCheckCircle = styled(CheckCircle)<MakeStyled<{}>>`
    color: ${props => props.theme.palette.success.main};
`

const StyledInfo = styled(Info)<MakeStyled<{}>>`
    color: ${props => props.theme.palette.text.secondary};
`

function getVariantIcon (variant: DialogVariant): any {
    switch (variant) {
        case 'error':
            return <Warning fontSize='large' color='error' />
        case 'success':
            return <StyledCheckCircle fontSize='large' />
        case 'info':
            return <StyledInfo fontSize='large' />
        default:
            return undefined
    }
}

function getTypographyVariant (variant: DialogVariant, children: any): any {
    switch (variant) {
        case 'error':
            return <Typography variant='h5' color='error' children={children} />
        case 'success':
            return <Typography variant='h5' color='success' children={children} />
        case 'info':
            return <Typography variant='h5' color='textSecondary' children={children} />
        default:
            return <Typography variant='h5' children={children} />
    }
}


const DialogTitle = forwardRef<HTMLDivElement, DialogTitleProps>(
    function (props, forwardedRef) {
        const {
            id,
            showIcon,
            icon,
            variant,
            children,
            onClose,
            ...restProps
        } = props

        const rootProps = useDialogProps()

        const handleOnClose = (evt: React.MouseEvent) => {
            rootProps.onClose?.(evt, 'titleCloseClick')
            onClose?.(evt)
        }

        return (
            <StyledDialogTitle
                ref={forwardedRef}
                id={id}
                {...restProps}
                disableTypography
            >
                {(showIcon && (icon || variant)) && (
                    <Box display="inline-flex" mr={2}>{ icon ? icon : getVariantIcon(variant) }</Box>
                )}
                {getTypographyVariant(variant, children)}
                {(rootProps.onClose || onClose) && (
                    <IconButton
                        id={id && `${id}CloseButton`}
                        onClick={handleOnClose}
                    >
                        <Close />
                    </IconButton>
                )}
            </StyledDialogTitle>
        )
    }
) as React.FC<DialogTitleProps>

export default DialogTitle
