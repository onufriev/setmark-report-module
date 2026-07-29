import React, { ComponentProps } from 'react'
import AppBar from './AppBar'
import { Meta, Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { useTheme } from '@material-ui/core'
import { IconButton } from '../IconButton'
import { Breadcrumbs } from '../Breadcrumbs'
import { Typography } from '../Typography'
import { Badge } from '../Badge'
import { Link } from '../Link'
import { Toolbar } from '../Toolbar'
import { Grid } from '../Grid'
import { Box } from '../Box'
import {
    Menu,
    Announcement,
    Notifications,
    AccountCircle,
} from '../icons'

export default {
    title: 'AppBar',
    component: AppBar,
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/LplBkqt8LIDNtaBL63WJpG1o/Retail%26Centrum-design-system?node-id=1837%3A4995',
        },
    },
} as Meta

const Template: Story<ComponentProps<typeof AppBar>> = (args) => {
    const theme = useTheme()

    return (
        <AppBar {...args}>
            <Toolbar variant={'dense'}>
                <Grid container>
                    <Grid item container xs={8}>
                        <Box display={'flex'} mr={1}>
                            <IconButton color="inherit">
                                <Menu />
                            </IconButton>
                        </Box>
                        <Box display={'flex'} flexGrow={1} alignItems={'center'}>
                            <Breadcrumbs
                                style={{ color: theme.palette.primary.contrastText }}
                                separator={<Typography variant={'h5'}>/</Typography>}
                            >
                                <Link
                                    color={'inherit'}
                                    underline={'none'}
                                    variant={'h5'}
                                    onClick={action('click Товары')}
                                >
                                    Товары
                                </Link>
                                <Link
                                    color={'inherit'}
                                    underline={'none'}
                                    variant={'h5'}
                                    onClick={action('click Водка Nemiroff 0.5л')}
                                >
                                    Водка Nemiroff 0.5л
                                </Link>
                            </Breadcrumbs>
                        </Box>
                    </Grid>

                    <Grid item container xs={4} justifyContent={'flex-end'}>
                        <IconButton aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error" overlap={'circular'}>
                                <Announcement />
                            </Badge>
                        </IconButton>
                        <IconButton aria-label="show 17 new notifications" color="inherit">
                            <Badge badgeContent={17} color="error" overlap={'circular'}>
                                <Notifications />
                            </Badge>
                        </IconButton>
                        <IconButton
                            aria-label="account of current user"
                            aria-haspopup="true"
                            color="inherit"
                            size={'medium'}
                        >
                            <AccountCircle />
                        </IconButton>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export const Example = Template.bind({})
Example.args = {
    position: 'static',
}
