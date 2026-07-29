import React from 'react'
import styled from 'styled-components'
import { Box, BoxProps } from '../Box'
import { useLocale } from '../LocaleProvider'
import { Stack } from '../Stack'
import { Typography } from '../Typography'

export type EmptyProps = {
    /** Текстовое сообщение, либо свой компонент. Основной параметр */
    message?: string | React.ReactNode
    /** Слот для изображения, уместно передать иконку */
    imgSlot?: string | React.ReactNode
    /** Источник для изображения */
    imgSrc?: string
} & BoxProps

const Empty = (props: EmptyProps) => {
    const { t } = useLocale()

    const {
        message = t('empty.message'),
        imgSlot,
        imgSrc,
        children,
        ...restProps
    } = props

    return (
        <Box height={1} width={1} flexGrow={1} display="flex" alignItems="center" justifyContent="center" {...restProps}>
            <Stack
                spacing={2}
                direction="column"
                alignItems="center"
            >
                { imgSlot ? imgSlot : null }
                { imgSrc ? (
                    <EmptyImage src={imgSrc} />
                ) : null }
                { typeof message === 'string' ? (
                    <Typography color="textSecondary">{ message }</Typography>
                ) : message }
                { children }
            </Stack>
        </Box>
    )
}

export default Empty

const EmptyImage = styled.img`
    width: 150px;
`
