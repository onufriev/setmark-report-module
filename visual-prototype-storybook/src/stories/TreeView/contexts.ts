import { createContext } from 'react'
import { TreeViewState } from './types'

export const TreeViewRootStateContext = createContext<Partial<TreeViewState<any>>>({})
