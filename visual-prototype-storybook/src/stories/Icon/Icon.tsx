import React from 'react'
import { makeStyles, SvgIconProps as MuiSvgIconProps } from '@material-ui/core'
import MuiMenuIcon from '@material-ui/icons/Menu'
import MuiNotificationsIcon from '@material-ui/icons/Notifications'
import MuiAnnouncementIcon from '@material-ui/icons/Announcement'
import MuiAccountCircleIcon from '@material-ui/icons/AccountCircle'
import MuiSearchIcon from '@material-ui/icons/Search'
import MuiWarningIcon from '@material-ui/icons/Warning'
import MuiCloseIcon from '@material-ui/icons/Close'
import MuiCheckCircle from '@material-ui/icons/CheckCircle'
import MuiInfo from '@material-ui/icons/Info'
import MuiError from '@material-ui/icons/Error'

import { CsiTheme } from '../../typings/Theme'

export type SvgIconProps = Omit<MuiSvgIconProps, 'htmlColor' | 'viewBox' | 'ref'>

const useStyles = makeStyles<CsiTheme>((theme) => {
    return {
        colorSecondary: {
            color: theme.palette.text.secondary,
        },
    }
})

export const CheckCircleIcon = (props: SvgIconProps): JSX.Element => {
    const classes = useStyles()

    return (
        <MuiCheckCircle
            {...props}
            classes={{
                colorSecondary: classes.colorSecondary,
            }}
        />
    )
}

export const InfoIcon = (props: SvgIconProps): JSX.Element => {
    const classes = useStyles()

    return (
        <MuiInfo
            {...props}
            classes={{
                colorSecondary: classes.colorSecondary,
            }}
        />
    )
}

export const ErrorIcon = (props: SvgIconProps): JSX.Element => {
    const classes = useStyles()

    return (
        <MuiError
            {...props}
            classes={{
                colorSecondary: classes.colorSecondary,
            }}
        />
    )
}

export const MenuIcon = (props: SvgIconProps): JSX.Element => {
    const classes = useStyles()

    return (
        <MuiMenuIcon
            {...props}
            classes={{
                colorSecondary: classes.colorSecondary,
            }}
        />
    )
}

export const NotificationsIcon = (props: SvgIconProps): JSX.Element => {
    const classes = useStyles()

    return (
        <MuiNotificationsIcon
            {...props}
            classes={{
                colorSecondary: classes.colorSecondary,
            }}
        />
    )
}

export const AnnouncementIcon = (props: SvgIconProps): JSX.Element => {
    const classes = useStyles()

    return (
        <MuiAnnouncementIcon
            {...props}
            classes={{
                colorSecondary: classes.colorSecondary,
            }}
        />
    )
}

export const AccountCircleIcon = (props: SvgIconProps): JSX.Element => {
    const classes = useStyles()

    return (
        <MuiAccountCircleIcon
            {...props}
            classes={{
                colorSecondary: classes.colorSecondary,
            }}
        />
    )
}

export const SearchIcon = (props: SvgIconProps): JSX.Element => {
    const classes = useStyles()

    return (
        <MuiSearchIcon
            {...props}
            classes={{
                colorSecondary: classes.colorSecondary,
            }}
        />
    )
}

export const WarningIcon = (props: SvgIconProps): JSX.Element => {
    const classes = useStyles()

    return (
        <MuiWarningIcon
            {...props}
            classes={{
                colorSecondary: classes.colorSecondary,
            }}
        />
    )
}

export const CloseIcon = (props: SvgIconProps): JSX.Element => {
    const classes = useStyles()

    return (
        <MuiCloseIcon
            {...props}
            classes={{
                colorSecondary: classes.colorSecondary,
            }}
        />
    )
}
