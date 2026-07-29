import React, { FC } from 'react'
import { Box } from '../Box'
import { Typography } from '../Typography'
import { useConditionWrapperProps } from '../ConditionWrapper/hooks'
import { ConditionWrapperProps } from '../ConditionWrapper'

export type ConditionRowProps = {
    title?: string
    subtitle?: string
}

const ConditionRow: FC<ConditionRowProps & React.HTMLAttributes<HTMLDivElement>> = (props): JSX.Element => {
    const { title, subtitle, id, ...restProps } = props

    const rootProps = useConditionWrapperProps() as ConditionWrapperProps

    const { error } = rootProps

    return (
        <div id={id} {...restProps}>
            <Typography color={!error ? 'textPrimary' : 'error'}>
                {title}
            </Typography>
            <Box ml={4} mb={1}>
                <Typography
                    color={!error ? 'textPrimary' : 'textSecondary'}
                    variant={!error ? 'body1' : 'caption'}
                >
                    {subtitle}
                </Typography>
            </Box>
        </div>
    )
}

export default ConditionRow
