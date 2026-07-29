// @ts-nocheck
import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'

export function mergeClasses<ClassKey extends string = string>(
    libClasses: Partial<ClassNameMap<ClassKey>> = {},
    userClasses: Partial<ClassNameMap<ClassKey>> = {}
) {
    const classes: Partial<ClassNameMap<ClassKey>> = { ...libClasses }

    Object.keys(userClasses).forEach(key => {
        if (classes[key]) {
            classes[key] = classNames(classes[key], userClasses[key])
        } else {
            classes[key] = userClasses[key]
        }
    })

    return classes
}
