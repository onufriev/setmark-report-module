import React, { FC } from 'react'
import { Box } from '../Box'

export type SpacerProps = unknown

const Spacer: FC<SpacerProps> = (): JSX.Element => {
    return <Box flexGrow={1} data-testid="Spacer" />
}

export default Spacer
