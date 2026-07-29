import { createContext } from 'react'
import { DialogProps } from './Dialog'

export const DialogPropsContext = createContext<Partial<DialogProps>>({})
