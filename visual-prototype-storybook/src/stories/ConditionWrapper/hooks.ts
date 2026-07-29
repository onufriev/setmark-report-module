import { useContext } from 'react'
import { ConditionWrapperRootPropsContext } from './contexts';

export const useConditionWrapperProps = () => {
    const contextValue = useContext(ConditionWrapperRootPropsContext)

    if (!contextValue) {
        throw new Error(
            'CSI UI: useConditionWrapperProps should only be used inside the ConditionWrapper component.',
        );
    }

    return contextValue
}
