import React, {
    useCallback, Fragment, CSSProperties,
} from 'react';
import {
    Hidden, Drawer, Divider, List, ListItem, ListItemText, Box, makeStyles, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    FontIcon,
} from '..';



const useStyles = makeStyles((theme: Theme) => {
    return {
        root: {
            flexShrink: 0,
            width     : 250,
        },

        divider: {
            margin           : theme.spacing(0, 2),
            '&.items-divider': {
                margin: theme.spacing(1, 2),
            },
        },

        drawerContentContainer: {
            flex         : 1,
            position     : 'relative',
            zIndex       : 2,
            display      : 'flex',
            flexDirection: 'column',
            overflow     : 'hidden',
        },

        toolbar: theme.mixins.toolbar,

        appLogo: {
            padding       : theme.spacing(2, 1),
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
            position      : 'absolute',
            top           : 0,
            left          : 0,
            width         : '100%',
            height        : '100%',

            '& .logo-icon': {
                flexShrink                  : 0,
                height                      : 30,
                fontSize                    : 30,
                marginRight                 : theme.spacing(1),
                [theme.breakpoints.up('sm')]: {
                    height  : 35,
                    fontSize: 35,
                },
                [theme.breakpoints.only('md')]: {
                    marginRight: 0,
                },
                '&.wrapper': {
                    display       : 'flex',
                    alignItems    : 'center',
                    justifyContent: 'center',
                    '& > *'       : {
                        height  : '100%',
                        fontSize: '1em',
                    },
                },
            },
            '& .app-title': {
                fontWeight  : 'bold',
                fontSize    : '16px',
                maxWidth    : '100%',
                textOverflow: 'ellipsis',
                overflow    : 'hidden',
                whiteSpace  : 'nowrap',
            },
        },

        drawerPaper: {
            width             : 250,
            backgroundPosition: 'center center',
            backgroundSize    : 'cover',
            '&::before'       : {
                content   : '""',
                width     : '100%',
                height    : '100%',
                position  : 'absolute',
                zIndex    : 1,
                top       : 0,
                left      : 0,
                background: 'rgba(255, 255, 255, 0.8)',
            },
        },

        content: {
            flexGrow: 1,
        },

        menuItemList: {
            overflow: 'hidden auto',
            flex    : 1,
        },

        menuItem: {
            padding               : theme.spacing(0, 1),
            '& .menu-item-wrapper': {
                width       : '100%',
                borderRadius: 3,
                padding     : theme.spacing(0.5, 1),
                display     : 'flex',
                alignItems  : 'center',
                minHeight   : 40,
                '& .icon'   : {
                    marginRight: theme.spacing(2),
                    fontSize   : 24,
                    width      : 24,
                    height     : 24,
                    '&.wrapper': {
                        display       : 'flex',
                        alignItems    : 'center',
                        justifyContent: 'center',
                        '& > *'       : {
                            height  : '100%',
                            fontSize: '1em',
                        },
                    },
                },
                '& .label': {
                    display: 'block',
                },
            },

            '&.disabled': {
                pointerEvents: 'none',
                opacity      : 0.2,
            },
        },

        projectNameSection: {
            display                     : 'block',
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },

        projectName: {
            fontWeight                  : 'bold',
            padding                     : theme.spacing(1),
            fontSize                    : '18px',
            width                       : '100%',
            textAlign                   : 'center',
            [theme.breakpoints.up('sm')]: {
                fontSize: '20px',
            },
        },


        [theme.breakpoints.only('md')]: {
            width: 65,

            drawerPaper: {
                width: 65,
            },

            divider: {
                margin           : theme.spacing(0),
                '&.items-divider': {
                    margin: theme.spacing(1, 0),
                },
            },

            appLogo: {
                '& .app-title': {
                    display: 'none',
                },
            },

            menuItem: {
                '& .menu-item-wrapper': {
                    '& .label': {
                        display: 'none',
                    },
                },
            },
        },
    };
}, {
    name: 'DrawerMenu',
});



export interface DrawerMenuItem {
    readonly label: string;
    readonly icon?: string | JSX.Element | undefined;
    readonly link: string;
    readonly selected: boolean;
    readonly hidden?: boolean;
    readonly disabled?: boolean;
}


export interface DrawerMenuProps {
    readonly className?: string;
    readonly style?: CSSProperties | undefined;
    readonly appName: string;
    readonly appLogo?: string | JSX.Element | undefined;
    readonly projectName?: string | undefined;
    readonly open: boolean;
    readonly menuItems: DrawerMenuItem[][];
    readonly backgroundImage?: string;
    readonly onClose: ()=> void;
    readonly onMenuItemClicked: (link: string)=> void;
}



export const DrawerMenu: React.FC<DrawerMenuProps> = (props: DrawerMenuProps) => {
    const classes = useStyles();

    const renderDrawerContent = useCallback(() => {
        return (
            <div className={classes.drawerContentContainer}>
                <Box className={classes.toolbar} position="relative">
                    <div className={classes.appLogo}>
                        {props.appLogo && typeof props.appLogo === 'string' && <FontIcon className="logo-icon" iconName={props.appLogo} />}
                        {props.appLogo && typeof props.appLogo !== 'string' && <div className="logo-icon wrapper">{props.appLogo}</div>}
                        <span className="app-title">{props.appName}</span>
                    </div>
                </Box>
                <Divider className={classes.divider} />
                <List className={classes.menuItemList}>
                    {props.menuItems.map((itemGroup: DrawerMenuItem[], groupIndex: number) => {
                        return (
                            <Fragment
                                key={`group-${groupIndex.toString()}`}
                            >
                                {groupIndex > 0 && <Divider className={clsx(classes.divider, 'items-divider')} />}
                                {itemGroup.filter((item: DrawerMenuItem) => {
                                    return !item.hidden;
                                }).map((item: DrawerMenuItem, itemIndex: number) => {
                                    return (
                                        <ListItem
                                            key={`${item.link}-${itemIndex.toString()}`}
                                            className={clsx(classes.menuItem, item.disabled && 'disabled')}
                                            selected={item.selected}
                                            button
                                            onClick={() => {
                                                props.onMenuItemClicked(item.link);
                                            }}
                                        >
                                            <div className="menu-item-wrapper">
                                                {item.icon && typeof item.icon === 'string' && (<FontIcon className="icon" iconName={item.icon} />)}
                                                {item.icon && typeof item.icon !== 'string' && (<div className="icon wrapper">{item.icon}</div>)}
                                                <ListItemText className="label" primary={item.label} />
                                            </div>
                                        </ListItem>
                                    );
                                })}
                            </Fragment>
                        );
                    })}
                </List>
                {props.projectName && (
                    <div className={classes.projectNameSection}>
                        <Divider className={classes.divider} />
                        <div className={classes.projectName}>
                            {props.projectName}
                        </div>
                    </div>
                )}
            </div>
        );
    }, [classes, props]);



    return (
        <nav className={clsx(props.className, classes.root)} style={props.style}>
            <Hidden mdUp implementation="css">
                <Drawer
                    variant="temporary"
                    anchor="left"
                    open={props.open}
                    onClose={props.onClose}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    PaperProps={{
                        style: {
                            backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : 'none',
                        },
                    }}
                >
                    {renderDrawerContent()}
                </Drawer>
            </Hidden>
            <Hidden smDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                    PaperProps={{
                        style: {
                            backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : 'none',
                        },
                    }}
                >
                    {renderDrawerContent()}
                </Drawer>
            </Hidden>
        </nav>
    );
};
