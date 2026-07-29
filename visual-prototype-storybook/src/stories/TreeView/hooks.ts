import { useContext, useRef } from 'react'
import { TreeViewRootStateContext } from './contexts'
import { TreeViewApiRef, TreeViewState, TreeViewValue } from './types'

export const useTreeViewRootState = <T extends TreeViewValue>() => {
    const contextValue = useContext(TreeViewRootStateContext) as TreeViewState<T>

    if (!contextValue) {
        throw new Error(
            'CSI UI: useTreeViewRootState should only be used inside the TreeView component.',
        );
    }

    return contextValue
}

export const useTreeViewApiRef = <T extends TreeViewValue>() => useRef({}) as React.MutableRefObject<TreeViewApiRef<T>>
