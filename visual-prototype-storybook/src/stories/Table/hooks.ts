import { useContext } from 'react'
import { TableRootPropsContext, TableStateContext } from './contexts'

export const useTableRootProps = () => {
    const contextValue = useContext(TableRootPropsContext)

    if (!contextValue) {
        throw new Error(
            'CSI UI: useGridRootProps should only be used inside the Table component.',
        );
    }

    return contextValue
}

export const useTableRootState = () => {
    const contextValue = useContext(TableStateContext)

    if (!contextValue) {
        throw new Error(
            'CSI UI: useTableRootState should only be used inside the Table component.',
        );
    }

    return contextValue
}
