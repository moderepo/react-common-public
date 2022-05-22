import deepmerge from 'deepmerge';
import {
    createModePalette,
    createModeTheme,
    modeDefaultChartColorPalette,
    ModePalette,
    modeThemeBase,
} from './ModeThemeBase';
import {
    getModeDefaultDrawerMenuStyle, getModeDefaultTopNavBarStyle,
} from './modeDefault';


/**
 * The color palette for the ModeDefaultTheme
 */
const palette: ModePalette = createModePalette({
    background: {
        default: '#f5f5f5',
        paper  : '#ffffff',
    },
    chart: modeDefaultChartColorPalette,
});



/**
 * This is where we define the theme for Mode by extending the BASE theme and overriding the default
 * Material UI theme.
 */

export const modeThemeDefault = createModeTheme(deepmerge(modeThemeBase, {
    palette,
    modeThemeSettings: {
    },
    overrides: {
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
        ModePanel: {
            root: {
                minHeight: 250,
            },
        },
        TopNavBar : getModeDefaultTopNavBarStyle(modeThemeBase, palette),
        DrawerMenu: getModeDefaultDrawerMenuStyle(modeThemeBase, palette),
    },
}));
