import React from 'react'

import {
    Breadcrumbs as MuiBreadcrumbs,
    BreadcrumbsProps as MuiBreadcrumbsProps,
    TypographyProps as MuiTypographyProps,
} from '@material-ui/core'

/**
 * Корневым компонентом Breadcrumbs является Typography,
 * которому передаются соответствующие параметры.
 *
 * Смотри реализацию: {@link https://github.com/mui/material-ui/blob/v4.x/packages/material-ui/src/Breadcrumbs/Breadcrumbs.js}
 */
export type BreadcrumbsProps = MuiBreadcrumbsProps & MuiTypographyProps

const Breadcrumbs = (props: BreadcrumbsProps): JSX.Element => {
    return <MuiBreadcrumbs {...props} />
}

export default Breadcrumbs
