import React, { FC } from 'react'
import { Box } from '../Box'
import { SvgIconProps } from '../SvgIcon'
import { Button, ButtonProps } from '../Button'
import { DialogTitle } from '../DialogTitle'
import { DialogActions } from '../DialogActions'
import { DialogContent } from '../DialogContent'
import { Dialog } from '../Dialog'

export type DialogVariant = 'error' | 'success' | 'info' | undefined

export interface DialogActionsButtons extends ButtonProps {
    label: string,
}

export type DialogConfirmProps = React.HTMLAttributes<HTMLDivElement> & {
    open: boolean
    title: string
    content?: React.ReactNode
    buttons: DialogActionsButtons[]
    variant?: DialogVariant
    icon?: React.ReactElement<SvgIconProps>
    showIcon?: boolean
}

const DialogConfirm: FC<DialogConfirmProps> = (props): JSX.Element => {
    const {
        open,
        title,
        content,
        buttons,
        variant,
        icon,
        showIcon,
        ...restProps
    } = props

    return (
        <Dialog open={open} {...restProps}>
            <DialogTitle
                icon={icon}
                showIcon={showIcon}
                variant={variant}
            >
                { title }
            </DialogTitle>

            { content ? (
                <DialogContent>
                    { content }
                </DialogContent>
            ) : (
                <Box py={1} />
            ) }

            <DialogActions>
                { buttons?.map((item, index) => {
                    const { label, ...restProps } = item
                    return (
                        <Button color="secondary" key={label + index} {...restProps}>
                            { item.label }
                        </Button>
                    )
                }) }
            </DialogActions>
        </Dialog>
    )
}

export default DialogConfirm
