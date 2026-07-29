import React, { FC } from 'react'
import { Box } from '../Box'

export type FormLineProps = unknown

export const FormLine: FC<FormLineProps> = (props): JSX.Element => {
    const { children } = props

    return (
        <Box mb={2} data-testid="FormLine" {...props}>
            {children}
        </Box>
    )
}

export default FormLine
