import React, { FC } from 'react'
import { Collapse as MuiCollapse, CollapseProps as MuiCollapseProps } from '@material-ui/core'

export type CollapseProps = MuiCollapseProps

const Collapse: FC<CollapseProps> = (props): JSX.Element => (
    <MuiCollapse data-testid="Collapse" {...props} />
)

export default Collapse
