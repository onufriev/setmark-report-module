import React, { ComponentProps } from 'react'
import Breadcrumbs from './Breadcrumbs'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { useTheme } from '@material-ui/core'
import { Box } from '../Box'
import { Typography } from '../Typography'
import { Link } from '../Link'

export default {
    title: 'Breadcrumbs',
    component: Breadcrumbs,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=1837%3A4995',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof Breadcrumbs>> = (args) => {
    const theme = useTheme()

    return (
        <Box
            bgcolor={'primary.main'}
            color="palette.primary.contrastText"
            height={50}
            width={1}
            alignItems={'center'}
            display={'flex'}
            p={1}
        >
            <Breadcrumbs color="inherit" {...args}>
                <Link
                    variant={'h5'}
                    color={'inherit'}
                    underline={'none'}
                    onClick={action('click Товары')}
                >
                    Товары
                </Link>
                <Link
                    variant={'h5'}
                    color={'inherit'}
                    underline={'none'}
                    onClick={action('Водка Nemiroff 0.5л')}
                >
                    Водка Nemiroff 0.5л
                </Link>
            </Breadcrumbs>
        </Box>
    )
}

export const Default = Template.bind({})
Default.args = {
    separator: <Typography variant={'h5'}>/</Typography>,
}
