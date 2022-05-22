import React, {
    CSSProperties,
    ReactNode,
} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import {
    Menu, MenuItem, Button, ListItemIcon, IconButton, makeStyles, Theme,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import {
    useDropdown,
} from '../../utils/customHooks';


const useStyle = makeStyles((theme: Theme) => {
    return {
        root: {
            overflow: 'hidden',
            position: 'relative',
        },

        toolBar: {
        },

        drawerMenuToggler: {
            marginRight                 : theme.spacing(2),
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },

        title: {
            overflow    : 'hidden',
            whiteSpace  : 'nowrap',
            textOverflow: 'ellipsis',
            textShadow  : '2px 2px 1px rgba(0, 0, 0, 0.3)',
            display     : 'none',
            marginRight : theme.spacing(1),

            '& button': {
                color        : 'unset',
                textTransform: 'none',
                fontSize     : 'unset',
                fontWeight   : 'unset',
                padding      : 0,
            },
            [theme.breakpoints.up('sm')]: {
                display    : 'block',
                marginRight: theme.spacing(2),
            },
        },

        languageSelector: {
        },

        leftContent: {
            display       : 'flex',
            alignItems    : 'center',
            flex          : 1,
            justifyContent: 'flex-end',
        },

        loginButton: {
            marginLeft: theme.spacing(1),
        },

        profileMenu: {
            marginLeft: theme.spacing(1),
        },

        profileMenuNameAndRole: {
            display       : 'flex',
            flexDirection : 'column',
            alignItems    : 'flex-start',
            justifyContent: 'center',
            textAlign     : 'right',
            position      : 'relative',
        },

        profileMenuName: {
            lineHeight   : '1em',
            textTransform: 'none',
        },

        profileMenuRole: {
            lineHeight: '1em',
            fontSize  : '0.7em',
            paddingTop: 2,
            flex      : 1,
            width     : '100%',
            position  : 'absolute',
            top       : -12,
            right     : 0,
            fontStyle : 'italic',
        },

        profileMenuIconAvatar: {
            width       : '1.5em',
            height      : '1.5em',
            borderRadius: '50%',
            border      : '1px solid #ffffff',
        },

        profileMenuIconDefault: {
            textShadow: '2px 2px 1px rgba(0, 0, 0, 0.3)',
        },

        profileMenuItemIcon: {
            minWidth   : 'unset',
            marginRight: theme.spacing(1),
        },
    };
}, {
    name: 'TopNavBar',
});


export interface ProfileMenuItem {
    readonly id: string;
    readonly label: string;
    readonly icon: string;
    readonly disabled?: boolean;
    readonly hidden?: boolean;
}

export interface ProfileMenu {
    readonly name: string | undefined;
    readonly role?: string | undefined;
    readonly avatar: string | undefined;
    readonly menuItems: readonly ProfileMenuItem[];
    readonly onProfileMenuItemClicked: (id: string)=> void;
}

export interface TopNavBarProps {
    readonly className?: string;
    readonly style?: CSSProperties | undefined;
    readonly title: string;
    readonly profileMenu?: ProfileMenu;
    readonly loginLabel: string;
    readonly languageSelectorComp?: React.ReactNode;
    readonly breadcrumbsBarComp?: React.ReactNode
    readonly subRouteNavBarComp?: React.ReactNode
    readonly controlBarComp?: React.ReactNode
    readonly onDrawerMenuTogglerClicked?: ()=> void;
    readonly onGoHomeClicked: ()=> void;
    readonly onLoginClicked: ()=> void;
}


export const TopNavBar: React.FC<TopNavBarProps> = (props: TopNavBarProps) => {
    const [profileMenuAnchorEl, isProfileMenuOpened, onProfileMenuAnchorClicked, onProfileMenuClosed] = useDropdown();
    const classes = useStyle();


    /**
     * Create the dropdown menu for the agent's profile.
     */
    const renderProfileMenu = (profileMenu: ProfileMenu): ReactNode => {

        const avatar = profileMenu.avatar
            ? (
                <img className={classes.profileMenuIconAvatar} src={profileMenu.avatar} alt={profileMenu.avatar} />
            )
            : <Icon className={classes.profileMenuIconDefault} fontSize="large">account_circle</Icon>;

        return (
            <div className={classes.profileMenu}>
                <Button
                    onClick={onProfileMenuAnchorClicked}
                    color="inherit"
                    startIcon={avatar}
                    endIcon={<Icon>arrow_drop_down</Icon>}
                >
                    <div className={classes.profileMenuNameAndRole}>
                        {profileMenu.role && (
                            <div className={classes.profileMenuRole}>
                                {profileMenu.role}
                            </div>
                        )}
                        <div className={classes.profileMenuName}>
                            {profileMenu.name ? profileMenu.name : ''}
                        </div>
                    </div>
                </Button>
                <Menu
                    getContentAnchorEl={null}
                    anchorEl={profileMenuAnchorEl}
                    keepMounted
                    anchorOrigin={{
                        vertical  : 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical  : 'top',
                        horizontal: 'right',
                    }}
                    open={isProfileMenuOpened}
                    onClose={onProfileMenuClosed}
                >
                    {profileMenu.menuItems.filter((item: ProfileMenuItem) => {
                        return !item.hidden;
                    }).map((item: ProfileMenuItem) => {
                        return (
                            <MenuItem
                                key={item.id}
                                onClick={() => {
                                    onProfileMenuClosed();
                                    profileMenu.onProfileMenuItemClicked(item.id);
                                }}
                            >
                                <ListItemIcon className={classes.profileMenuItemIcon}>
                                    <Icon>{item.icon}</Icon>
                                </ListItemIcon>
                                {item.label}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </div>
        );
    };


    return (
        <AppBar className={clsx(classes.root, props.className)} style={props.style}>
            <Toolbar className={classes.toolBar}>
                {props.onDrawerMenuTogglerClicked && (
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={props.onDrawerMenuTogglerClicked}
                        className={classes.drawerMenuToggler}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography variant="h6" className={classes.title}>
                    <Button variant="text" onClick={props.onGoHomeClicked}>{props.title}</Button>
                </Typography>

                <div className={classes.leftContent}>
                    {props.languageSelectorComp}
                    {props.profileMenu
                        ? (
                            renderProfileMenu(props.profileMenu)
                        )
                        : (
                            <Button
                                variant="contained"
                                className={classes.loginButton}
                                onClick={props.onLoginClicked}
                            >
                                {props.loginLabel}
                            </Button>
                        )}
                </div>
            </Toolbar>
            {props.breadcrumbsBarComp}
            {props.subRouteNavBarComp}
            {props.controlBarComp}
        </AppBar>
    );
};
