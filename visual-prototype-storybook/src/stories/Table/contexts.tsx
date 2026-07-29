import React, { createContext } from 'react'

export const TableRootPropsContext = createContext<unknown>(undefined)
export const TableStateContext = createContext<unknown>(undefined)

type TableContextProviderProps = {
    state: {}
    props: {}
    children: React.ReactNode
}

export function TableContextProvider ({ state, props, children }: TableContextProviderProps) {
    return (
        <TableRootPropsContext.Provider value={props}>
            <TableStateContext.Provider value={state}>{ children }</TableStateContext.Provider>
        </TableRootPropsContext.Provider>
    )
}
