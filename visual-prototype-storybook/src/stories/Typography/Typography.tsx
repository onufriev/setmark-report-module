import React, { FC } from 'react'
import {
    Typography as MuiTypography,
    TypographyProps as MuiTypographyProps,
} from '@material-ui/core'
import styled, { css } from 'styled-components'
import { TypographyClasses } from '../../core/classes'
import { mergeClasses } from '../../utils/classes-util'
import { MakeStyled } from '../../typings/utils'

type TypographyVariant = 'h4' | 'h5' | 'h6' | 'subtitle1' | 'body1' | 'caption' | 'button'
type TypographyDefaultProps = Omit<MuiTypographyProps, 'variant' | 'variantMapping' | 'color'>
type TypographyColors = MuiTypographyProps['color'] | 'success' | 'warning'

export type TypographyProps = TypographyDefaultProps & {
    variant?: TypographyVariant | 'inherit'
    variantMapping?: Partial<Record<TypographyVariant, string>>
    color?: TypographyColors
}

const Typography: FC<TypographyProps> = (props) => {
    const { color, classes, ...restProps } = props

    if (color === 'success' || color === 'warning') {
        return <StyledTypography classes={mergeClasses(TypographyClasses, classes)} $color={color} {...restProps} />
    } else {
        return <MuiTypography classes={mergeClasses(TypographyClasses, classes)} {...restProps} color={color} />
    }
}

export default Typography

const StyledTypography = styled(MuiTypography)<MakeStyled<{ color?: TypographyProps['color'] }>>`
    color: ${props => {
        switch (props.$color) {
            case 'success':
                return props.theme.palette.success.main
            case 'warning':
                return props.theme.palette.warning.main
        }
    }};
`
