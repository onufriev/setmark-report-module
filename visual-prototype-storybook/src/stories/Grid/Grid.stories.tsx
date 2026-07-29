import React, { ComponentProps } from 'react'
import Grid from './Grid'
import { Meta, Story } from '@storybook/react'
import { Box } from '../Box'

export default {
    title: 'Grid',
    component: Grid,
} as Meta

export const Example: Story<ComponentProps<typeof Grid>> = (args) => (
    <Grid container spacing={3}>
        <Grid item xs={args.xs}>
            <Box
                width={1}
                height={50}
                border={1}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                xs = {args.xs}
            </Box>
        </Grid>
        <Grid item xs={args.xs}>
            <Box
                width={1}
                height={50}
                border={1}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                xs = {args.xs}
            </Box>
        </Grid>
        <Grid item xs={args.xs}>
            <Box
                width={1}
                height={50}
                border={1}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                xs = {args.xs}
            </Box>
        </Grid>
        <Grid item xs={args.xs}>
            <Box
                width={1}
                height={50}
                border={1}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                xs = {args.xs}
            </Box>
        </Grid>
    </Grid>
)

Example.args = {
    xs: 3,
}
