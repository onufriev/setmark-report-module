import React, { forwardRef } from 'react'
import {
    Dialog as MuiDialog,
    DialogProps as MuiDialogProps,
} from '@material-ui/core'
import { DialogPropsContext } from './contexts'
import { Paper } from '../Paper'

export type DialogProps = Omit<MuiDialogProps, 'onClose'> & {
    onClose?: {
        bivarianceHack(event: {}, reason: 'backdropClick' | 'escapeKeyDown' | 'titleCloseClick'): void
    }['bivarianceHack']
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
    function (props, forwardedRef) {
        return (
            <DialogPropsContext.Provider value={props}>
                <MuiDialog
                    ref={forwardedRef}
                    data-testid="Dialog"
                    {...props}
                    PaperComponent={Paper}
                    PaperProps={{
                        ...props.PaperProps,
                        elevation: 2,
                    }}
                />
            </DialogPropsContext.Provider>
        )
    }
) as React.FC<DialogProps>

export default Dialog
