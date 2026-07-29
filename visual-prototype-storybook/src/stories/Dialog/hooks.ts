import { useContext } from 'react'
import { DialogPropsContext } from './contexts'

export const useDialogProps = () => {
    const contextValue = useContext(DialogPropsContext)

    if (!contextValue) {
        throw new Error(
            'CSI UI: useDialogProps should only be used inside the Dialog component.',
        );
    }

    return contextValue
}
