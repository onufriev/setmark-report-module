import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import { Meta, Story } from '@storybook/react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core'
import { CsiTheme } from '../../../typings/Theme'
import {
    Menu,
    Announcement,
    Notifications,
    AccountCircle,
    Autorenew,
    Inbox,
    Mail,
    FilterMenu,
    StarBorder,
} from '../../icons'
import { AppBar } from '../../AppBar'
import { IconButton } from '../../IconButton'
import { Breadcrumbs } from '../../Breadcrumbs'
import { Typography } from '../../Typography'
import { Badge } from '../../Badge'
import { Link } from '../../Link'
import { Toolbar } from '../../Toolbar'
import { Spacer } from '../../Spacer'
import { ContentBox } from '../../ContentBox'
import { TextInput } from '../../TextInput'
import { Drawer } from '../../Drawer'
import { Divider } from '../../Divider'
import { List } from '../../List'
import { ListItem } from '../../ListItem'
import { ListItemIcon } from '../../ListItemIcon'
import { ListItemText } from '../../ListItemText'
import { ActionsBar } from '../../ActionsBar'
import { Button } from '../../Button'
import { Card } from '../../Card'
import { CardActions } from '../../CardActions'
import { CardContent } from '../../CardContent'
import { CardHeader } from '../../CardHeader'
import { Grid } from '../../Grid'

export default {
    title: 'Examples/AppLayout',
    parameters: {
        design: {
            type: 'figma',
            url: '',
        },
        layout: 'fullscreen',
    },
} as Meta

const drawerWidth = 240

const useStyles = makeStyles((theme: CsiTheme) => ({
    root: {
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaper: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    contentContainer: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    contentContainerShift: {
        marginLeft: drawerWidth,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    content: {
        maxWidth: '1280px',
        margin: '0 auto',
    },
}))

export const BasicLayout: Story = () => {
    const classes = useStyles()

    const [navMenuOpened, setNavMenuOpened] = useState(false)
    const [filterOpened, setFilterOpened] = useState(false)

    return (
        <div className={classes.root}>
            <AppBar
                position="static"
                className={classNames(classes.appBar, navMenuOpened && classes.appBarShift)}
            >
                <Toolbar variant="dense">
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => setNavMenuOpened(!navMenuOpened)}
                    >
                        <Menu />
                    </IconButton>

                    <Breadcrumbs
                        color="inherit"
                        variant="h5"
                    >
                        <Link
                            color="inherit"
                            underline="none"
                            onClick={action('click Товары')}
                        >
                            Товары
                        </Link>
                        <Link
                            color="inherit"
                            underline="none"
                            onClick={action('click Шоколад Ritter Sport')}
                        >
                            Шоколад Ritter Sport
                        </Link>
                    </Breadcrumbs>

                    <Spacer />

                    <IconButton aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={4} color="error" overlap="circular">
                            <Announcement />
                        </Badge>
                    </IconButton>

                    <IconButton aria-label="show 17 new notifications" color="inherit">
                        <Badge badgeContent={17} color="error" overlap="circular">
                            <Notifications />
                        </Badge>
                    </IconButton>

                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        color="inherit"
                        size={'medium'}
                    >
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                classes={{
                    paper: classes.drawerPaper,
                }}
                variant="persistent"
                anchor="left"
                open={navMenuOpened}
                onClose={() => setNavMenuOpened(false)}
            >
                <Toolbar variant="dense" />
                <Divider />
                <div className={classes.drawerContainer}>
                    <List disablePadding>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <Inbox /> : <Mail />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List disablePadding>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <Inbox /> : <Mail />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>

            <ContentBox
                className={classNames(
                    classes.contentContainer,
                    navMenuOpened && classes.contentContainerShift,
                )}
                component="main"
                p={1}
                flexChildStretched
                flexContainerVertical
            >
                <ContentBox
                    component="div"
                    p={0}
                    className={classes.content}
                    flexChildStretched
                    flexContainerVertical
                >
                    <ContentBox
                        mb={1.5}
                    >
                        <TextInput label="Название или код сегмента" />
                    </ContentBox>

                    <ContentBox
                        component="div"
                        p={0}
                        flexChildStretched
                        flexContainer
                    >
                        <ContentBox
                            p={0}
                            flexChildStretched
                            flexContainerVertical
                        >
                            <ContentBox
                                component="div"
                                display="flex"
                            >
                                <TextInput label="Какое-то поле ввода" />
                                <IconButton
                                    style={{ marginLeft: '8px' }}
                                    color={filterOpened ? 'primary' : 'default'}
                                    onClick={() => setFilterOpened(!filterOpened)}
                                >
                                    <FilterMenu />
                                </IconButton>
                            </ContentBox>

                            <Divider />

                            <ContentBox
                                component="div"
                                bgcolor="background.default"
                                flexChildStretched
                                flexScrollContainer
                            >
                                {[...new Array(20)].map((_, index) => (
                                    <Card key={index} style={{ marginTop: index ? '16px' : '' }}>
                                        <CardHeader title={`Карточка ${index}`} />
                                        <CardContent>
                                            <Typography>
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                Neque rerum incidunt animi. Eligendi adipisci
                                                accusantium dolor porro dolorem illo delectus rem
                                                recusandae, et aperiam in consequuntur saepe facere qui
                                                ut.
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button color="primary">Открыть</Button>
                                        </CardActions>
                                    </Card>
                                ))}
                            </ContentBox>

                            <Divider />

                            <ActionsBar
                                left={[
                                    <Button color="primary">Удалить</Button>,
                                    <Button color="primary">Сделать копию</Button>
                                ]}
                                center={[
                                    <Typography>Критериям соответствуют: 15 678 покупателей</Typography>,
                                    <IconButton color="primary" size="small"><Autorenew /></IconButton>
                                ]}
                                right={[
                                    <Button color="primary">Отмена</Button>,
                                    <Button color="primary" variant="contained">Пересчитать и сохранить</Button>
                                ]}
                            />
                        </ContentBox>

                        {filterOpened && (
                            <ContentBox width={320} ml={1}>
                                <Grid container direction="column" spacing={2}>
                                    <Grid item container spacing={1} wrap="nowrap">
                                        <Grid item><TextInput label="Фильтр 1" /></Grid>
                                        <Grid item><IconButton><StarBorder /></IconButton></Grid>
                                    </Grid>
                                    <Grid item container spacing={1} wrap="nowrap">
                                        <Grid item><TextInput label="Фильтр 2" /></Grid>
                                        <Grid item><IconButton><StarBorder /></IconButton></Grid>
                                    </Grid>
                                    <Grid item container spacing={1} wrap="nowrap">
                                        <Grid item><TextInput label="Фильтр 3" /></Grid>
                                        <Grid item><IconButton><StarBorder /></IconButton></Grid>
                                    </Grid>
                                    <Grid item container spacing={1} wrap="nowrap">
                                        <Grid item><TextInput label="Фильтр 4" /></Grid>
                                        <Grid item><IconButton><StarBorder /></IconButton></Grid>
                                    </Grid>
                                </Grid>
                            </ContentBox>
                        )}
                    </ContentBox>
                </ContentBox>
            </ContentBox>
        </div>
    )
}
