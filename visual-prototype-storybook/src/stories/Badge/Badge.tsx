import React from 'react'

import { Badge as MuiBadge, BadgeProps as MuiBadgeProps } from '@material-ui/core'

export type BadgeProps = MuiBadgeProps

const Badge = (props: BadgeProps): JSX.Element => {
    return <MuiBadge {...props} />
}

export default Badge
