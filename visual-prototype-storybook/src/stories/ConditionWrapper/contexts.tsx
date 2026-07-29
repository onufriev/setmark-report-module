import React, { createContext } from 'react'

export const ConditionWrapperRootPropsContext = createContext<unknown>(undefined)

type ConditionWrapperContextProviderProps = {
    props: {}
    children: React.ReactNode
}

export function ConditionWrapperContextProvider ({ props, children }: ConditionWrapperContextProviderProps) {
    return (
        <ConditionWrapperRootPropsContext.Provider value={props}>
            { children }
        </ConditionWrapperRootPropsContext.Provider>
    )
}
