import deepmerge from 'deepmerge';
import {
    createModePalette,
    createModeTheme,
    modeDefaultChartColorPalette,
    ModePalette,
    modeThemeBase,
} from './ModeThemeBase';
import {
    getModeClassicDrawerMenuStyle, getModeClassicTopNavBarStyle,
} from './modeClassic';


const palette: ModePalette = createModePalette({
    primary: {
        main        : '#7fc8cf',
        light       : '#90e6ef',
        dark        : '#69a7ad',
        contrastText: '#ffffff',
    },
    secondary: {
        main : '#B52428',
        light: '#da2a2f',
        dark : '#961c1f',
    },
    text: {
        primary  : '#393A3A',
        secondary: '#919191',
    },
    background: {
        default: '#f5f5f5',
    },
    chart: modeDefaultChartColorPalette,
});



/**
 * This is where we define the theme for Mode by extending the BASE theme and overriding the default
 * Material UI theme.
 */
export const modeThemeClassic = createModeTheme(deepmerge(modeThemeBase, {
    palette,
    overrides: {
        ModePanel: {
            root: {
                minHeight      : 250,
                '&.transparent': {
                    '& $panelHeader': {
                        background: 'none',
                    },
                },
            },
            panelHeader: {
                background: '#f8f8f8',
            },
            panelHeaderTitle: {
                textTransform: 'uppercase',
                color        : '#53565A',
                fontSize     : 14,
            },
        },
        MuiListItemIcon: {
            root: {
                minWidth   : 'unset',
                marginRight: modeThemeBase.spacing(1),
                '& .icon'  : {
                    width   : 20,
                    fontSize: 20,
                },
            },
        },
        MuiInputLabel: {
            root: {
                whiteSpace: 'nowrap',
            },
        },
        TopNavBar : getModeClassicTopNavBarStyle(modeThemeBase, palette),
        DrawerMenu: getModeClassicDrawerMenuStyle(modeThemeBase, palette),
        FabMenu   : {
            root: {
                background: palette.text.primary,
            },
            menuItem: {
                background: palette.text.primary,
                '& .icon' : {
                    color: palette.text.secondary,
                },
            },
        },
        AgentsTable: {
            agentTableCustomAvatar: {
                color: palette.text.secondary,
            },
            agentTableAvatarBadge: {
                '& .MuiBadge-badge': {
                    background: palette.text.primary,
                },
            },
            tableCol: {
                '&.verified-col': {
                    fontSize    : 'smaller',
                    '&.verified': {
                        '& .value': {
                            background: palette.success.main,
                        },
                    },
                },
            },
        },
        UsersTable: {
            tableCol: {
                '&.status-col': {
                    fontSize    : 'smaller',
                    '&.verified': {
                        '& .value': {
                            background: palette.success.main,
                        },
                    },
                    '&.not-verified': {
                        '& .value': {
                            background: palette.success.main,
                        },
                    },
                },
            },
        },
        UserInfo: {
        },
        HomeInfo: {
        },
        HomesTable: {
        },
        HomeDevicesTable: {
            tableCol: {
                '&.status-col': {
                    fontSize     : 'smaller',
                    '&.connected': {
                        '& .value': {
                            background: palette.success.main,
                        },
                    },
                    '&.disconnected': {
                        '& .value': {
                            background: palette.success.main,
                        },
                    },
                },
            },
        },
        DeviceBasicInfo: {
        },
        DeviceDevInfo: {
        },
        SensorModuleInfoCard: {
            mediaContainer: {
            },
        },
        ProjectDetailsPage: {
            dashboardIssues: {
                '& .icon-container': {
                },
            },
            dashboardUsers: {
                '& .icon-container': {
                },
            },
            dashboardHomes: {
                '& .icon-container': {
                },
            },
            dashboardDevices: {
                '& .icon-container': {
                },
            },
        },
    },
}));
