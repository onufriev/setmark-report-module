import Typography from './Typography'
import { Meta, Story } from '@storybook/react'
import React, { ComponentProps } from 'react'

export default {
    title: 'Typography',
    component: Typography,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail-and-Centrum-design-system?node-id=3000%3A6500',
        },
    },
} as Meta

export const h4: Story<ComponentProps<typeof Typography>> = (args) => (
    <Typography {...args}>h4. Heading</Typography>
)
h4.args = {
    variant: 'h4',
    color: 'textPrimary',
}

export const h5: Story<ComponentProps<typeof Typography>> = (args) => (
    <Typography {...args}>h5. Heading</Typography>
)
h5.args = {
    variant: 'h5',
    color: 'textPrimary',
}

export const h6: Story<ComponentProps<typeof Typography>> = (args) => (
    <Typography {...args}>h6. Heading</Typography>
)
h6.args = {
    variant: 'h6',
    color: 'textPrimary',
}

export const subtitle1: Story<ComponentProps<typeof Typography>> = (args) => (
    <Typography {...args}>
        subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
    </Typography>
)
subtitle1.args = {
    variant: 'subtitle1',
    color: 'textPrimary',
}

export const button: Story<ComponentProps<typeof Typography>> = (args) => (
    <Typography {...args}>button text</Typography>
)
button.args = {
    variant: 'button',
    color: 'textPrimary',
}

export const body1: Story<ComponentProps<typeof Typography>> = (args) => (
    <Typography {...args}>
        body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
        unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
        dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
    </Typography>
)
body1.args = {
    variant: 'body1',
    color: 'textPrimary',
}

export const caption: Story<ComponentProps<typeof Typography>> = (args) => (
    <Typography {...args}>caption text</Typography>
)
caption.args = {
    variant: 'caption',
    color: 'textPrimary',
}

export const Examples: Story<ComponentProps<typeof Typography>> = () => {
    return (
        <>
            <div>
                <Typography variant="h4" gutterBottom color={'textPrimary'}>
                    h4. Heading
                </Typography>
                <Typography variant="h5" gutterBottom color={'textPrimary'}>
                    h5. Heading
                </Typography>
                <Typography variant="h6" gutterBottom color={'textPrimary'}>
                    h6. Heading
                </Typography>
                <Typography variant="subtitle1" gutterBottom color={'textPrimary'}>
                    subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                    blanditiis tenetur
                </Typography>
                <Typography variant="button" display="block" gutterBottom color={'textPrimary'}>
                    button text
                </Typography>
                <Typography variant="body1" gutterBottom color={'textPrimary'}>
                    body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
                    tenetur unde suscipit, quam beatae rerum inventore consectetur, neque doloribus,
                    cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
                    quibusdam.
                </Typography>
                <Typography variant="caption" display="block" gutterBottom color={'textPrimary'}>
                    caption text
                </Typography>
            </div>
        </>
    )
}

export const Colors: Story<ComponentProps<typeof Typography>> = () => {
    return (
        <>
            <div>
                <Typography color="inherit">
                    <b>inherit:</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit labore, quod at, aliquam perspiciatis distinctio amet exercitationem incidunt quibusdam...
                </Typography>
                <Typography color="initial">
                    <b>initial:</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit labore, quod at, aliquam perspiciatis distinctio amet exercitationem incidunt quibusdam...
                </Typography>
                <Typography color="primary">
                    <b>primary:</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit labore, quod at, aliquam perspiciatis distinctio amet exercitationem incidunt quibusdam...
                </Typography>
                <Typography color="secondary">
                    <b>secondary:</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit labore, quod at, aliquam perspiciatis distinctio amet exercitationem incidunt quibusdam...
                </Typography>
                <Typography color="error">
                    <b>error:</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit labore, quod at, aliquam perspiciatis distinctio amet exercitationem incidunt quibusdam...
                </Typography>
                <Typography color="success">
                    <b>success:</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit labore, quod at, aliquam perspiciatis distinctio amet exercitationem incidunt quibusdam...
                </Typography>
                <Typography color="warning">
                    <b>warning:</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit labore, quod at, aliquam perspiciatis distinctio amet exercitationem incidunt quibusdam...
                </Typography>
                <Typography color="textPrimary">
                    <b>textPrimary:</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit labore, quod at, aliquam perspiciatis distinctio amet exercitationem incidunt quibusdam...
                </Typography>
                <Typography color="textSecondary">
                    <b>textSecondary:</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit labore, quod at, aliquam perspiciatis distinctio amet exercitationem incidunt quibusdam...
                </Typography>
            </div>
        </>
    )
}
