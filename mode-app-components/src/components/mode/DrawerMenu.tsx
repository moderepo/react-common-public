import React, {
    useCallback, Fragment, CSSProperties, useState,
} from 'react';
import {
    Hidden, Drawer, Divider, List, ListItem, ListItemText, Box, makeStyles, Theme, Icon, Collapse,
} from '@material-ui/core';
import clsx from 'clsx';
import produce, {
    Draft,
} from 'immer';
import {
    FontIcon,
} from '.';



const useStyles = (optimizeForMediumScreen: boolean) => {
    return makeStyles((theme: Theme) => {

        const mediumScreenStyle = {
            root: {
                width: 65,
            },

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
                    justifyContent: 'center',
                    '& .icon'     : {
                        marginRight: theme.spacing(0),
                    },
                    '& .label-container': {
                        display: 'none',
                    },
                    '& .toggle-icon': {
                        display: 'none',
                    },
                },
            },

            subMenuItem: {
                '& .menu-item-wrapper': {
                    padding  : theme.spacing(0.3, 1),
                    '& .icon': {
                        marginRight: theme.spacing(0),
                    },
                },
            },
        };

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
                    '& .label-container': {
                        display: 'block',
                    },
                },

                '&.disabled': {
                    pointerEvents: 'none',
                    opacity      : 0.2,
                },
            },

            subMenuItemsContainer: {
                marginBottom: theme.spacing(1),
            },

            subMenuItem: {
                '& .menu-item-wrapper': {
                    minHeight  : 30,
                    padding    : theme.spacing(0.3, 1),
                    paddingLeft: theme.spacing(6),
                    '& .icon'  : {
                        marginRight: theme.spacing(1),
                        fontSize   : 20,
                        width      : 20,
                        height     : 20,
                    },
                    '& .label': {
                        fontSize: '0.95em',
                    },
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

            [theme.breakpoints.only('md')]: optimizeForMediumScreen ? mediumScreenStyle : {
                root: {
                    width: 0,
                },
            },
        };
    }, {
        name: 'DrawerMenu',
    });
};



export interface DrawerSubMenuItem {
    readonly label: string;
    readonly icon?: string | JSX.Element | undefined;
    readonly link: string;
    readonly selected: boolean;
    readonly hidden?: boolean | undefined;
    readonly disabled?: boolean | undefined;
}



export interface DrawerMenuItem extends DrawerSubMenuItem {
    readonly subMenuItems?: DrawerSubMenuItem[] | undefined;

    // By default, if a main menu item has submenu, it will not be selectable. Clicking on the item will only expand/collapse the menu,
    // but won't trigger the 'onMenuItemClicked' handler. Set this to true to make it selectable. If this is set to true, the DrawerMenu's
    // "collapsible" should be set to false so that clicking on the menu doesn't collapse it. Or else it will do both select the menu item
    /// and collapse it would be weird behavior.
    // If a main menu DOES NOT have submenu then it will automatically be selectable, this attribute is ignored.
    readonly selectable?: boolean | undefined;
}


/**
 * Custom hook to mark the menu items expanded when menuItems, expandAllOnLoad, or collapsible state changed.
 */
const useInitializeExpandedMenu = (
    menuGroups: readonly DrawerMenuItem[][],
    expandAllOnLoad: boolean | undefined,
    collapsible: boolean | undefined,
): readonly boolean[][] => {
    // Mark the menu as "expanded" if expandAllOnLoad or if collapsible is set to "false" because if "collapsible" is false then
    // there is no other way to expand the menus so we have to make the menus expanded.
    const expanded = expandAllOnLoad !== false || collapsible === false;
    return menuGroups.map((itemGroup) => {
        return itemGroup.map(() => {
            return expanded;
        });
    });
};



export interface DrawerMenuProps {
    readonly className?: string | undefined;
    readonly style?: CSSProperties | undefined;
    readonly appName: string;
    readonly appLogo?: string | JSX.Element | undefined;
    readonly projectName?: string | undefined;
    readonly open: boolean;
    readonly menuItems: DrawerMenuItem[][];
    readonly backgroundImage?: string | undefined;

    // Whether or not to automatically expand all menu items that has submenu. The default is TRUE unless this is specifically set to false
    readonly expandAllOnLoad?: boolean | undefined;

    // Whether or not to allow the user to collapse menu items that has submenu. The default is TRUE unless this is specifically set to false
    readonly collapsible?: boolean | undefined;

    readonly optimizeForMediumScreen?: boolean | undefined;

    readonly onClose: ()=> void;
    readonly onMenuItemClicked: (link: string)=> void;
}



export const DrawerMenu: React.FC<DrawerMenuProps> = (props: DrawerMenuProps) => {
    const classes = useStyles(props.optimizeForMediumScreen !== false)();

    // The state to keep track of the expanded main menu. By default, all the main menu will automatically be expanded UNLESS
    // "expandAllOnLoad" is specifically set to false
    const [expandedMenus, setExpandedMenus] = useState<readonly boolean[][]>(
        useInitializeExpandedMenu(props.menuItems, props.expandAllOnLoad, props.collapsible),
    );


    const renderItemGroup = useCallback((itemGroup: readonly DrawerMenuItem[], groupIndex: number, isMainMenus: boolean, parentDisabled: boolean) => {
        return (
            <Fragment
                key={`group-${groupIndex.toString()}`}
            >
                {groupIndex > 0 && <Divider className={clsx(classes.divider, 'items-divider')} />}
                {itemGroup.filter((item: DrawerMenuItem) => {
                    return !item.hidden;
                }).map((item: DrawerMenuItem, itemIndex: number) => {
                    const hasSubmenu = item.subMenuItems && item.subMenuItems.length > 0;

                    return (
                        <Fragment
                            key={`${item.link}-${itemIndex.toString()}`}
                        >
                            <ListItem
                                key={`${item.link}-${itemIndex.toString()}`}
                                className={clsx(
                                    classes.menuItem, !isMainMenus && classes.subMenuItem, (item.disabled || parentDisabled) && 'disabled',
                                )}
                                selected={item.selected && !item.disabled && (!hasSubmenu || item.selectable === true)}
                                button
                                onClick={() => {

                                    // If this item DOES NOT have submenu OR it has submenu AND props.selectable is true then trigger
                                    // onMenuItemClicked.
                                    if (!hasSubmenu || item.selectable === true) {
                                        props.onMenuItemClicked(item.link);
                                    }

                                    // Only main menu will have toggler
                                    if (isMainMenus && props.collapsible !== false) {
                                        setExpandedMenus((currentState) => {
                                            return produce(currentState, (draft: Draft<typeof currentState>) => {
                                                if (!draft[groupIndex]) {
                                                    draft[groupIndex] = [];
                                                }
                                                draft[groupIndex][itemIndex] = !draft[groupIndex][itemIndex];
                                            });
                                        });
                                    }
                                }}
                            >
                                <div className="menu-item-wrapper">
                                    {item.icon && typeof item.icon === 'string' && (<FontIcon className="icon" iconName={item.icon} />)}
                                    {item.icon && typeof item.icon !== 'string' && (<div className="icon wrapper">{item.icon}</div>)}
                                    <ListItemText
                                        className="label-container"
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            className: 'label',
                                        }}
                                    />
                                    {item.subMenuItems && item.subMenuItems.length > 0 && props.collapsible !== false && (
                                        <Icon className="toggle-icon">{expandedMenus[groupIndex][itemIndex] ? 'expand_less' : 'expand_more'}</Icon>
                                    )}
                                </div>
                            </ListItem>
                            {item.subMenuItems && isMainMenus && (
                                <Collapse
                                    className={classes.subMenuItemsContainer}
                                    in={expandedMenus[groupIndex][itemIndex]}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    {renderItemGroup(item.subMenuItems, 0, false, Boolean(item.disabled))}
                                </Collapse>
                            )}
                        </Fragment>
                    );
                })}
            </Fragment>
        );
    }, [classes.divider, classes.menuItem, classes.subMenuItem, classes.subMenuItemsContainer, expandedMenus, props]);


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
                        return renderItemGroup(itemGroup, groupIndex, true, false);
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
    }, [classes.appLogo, classes.divider, classes.drawerContentContainer, classes.menuItemList, classes.projectName, classes.projectNameSection,
        classes.toolbar, props.appLogo, props.appName, props.menuItems, props.projectName, renderItemGroup]);



    return (
        <nav
            className={clsx(props.className, classes.root, props.optimizeForMediumScreen !== false && classes.optimizeForMDScreen)}
            style={props.style}
        >
            {/*
                This is the permanent menu variant. This will be hidden from SMALL screen size and smaller. We will show this menu
                for MEDIUM screen and larger.
                HOWEVER, if optimizeForMediumScreen === false, which mean the menu will be full menu in Medium screen, we will also
                hide this menu in Medium screen size
            */}
            <Hidden
                smDown={props.optimizeForMediumScreen !== false ? true : undefined}
                mdDown={props.optimizeForMediumScreen === false ? true : undefined}
                implementation="css"
            >
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

            {/*
                Show this SLIDE OUT menu which is hidden until props.open is et to true. It will be shown over the main content area.
                We will hide this menu variant on MEDIUM screen or larger. HOWEVER, is optimizeForMediumScreen === false mean the menu
                will be full size then we will show this menu in MEDIUM screen and only hide it on LARGE screen or larger.
            */}
            <Hidden
                mdUp={props.optimizeForMediumScreen !== false ? true : undefined}
                lgUp={props.optimizeForMediumScreen === false ? true : undefined}
                implementation="css"
            >
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
        </nav>
    );
};
