/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import {
    Theme,
} from '@material-ui/core';
import {
    Palette,
} from '@material-ui/core/styles/createPalette';


export const getModeClassicDrawerMenuStyle = (baseTheme: Theme, palette: Palette) => {
    return {
        root: {
            width: 220,
        },
        drawerPaper: {
            width          : 220,
            background     : palette.text.primary,
            backgroundImage: 'none !important',
            '&::before'    : {
                background: '#393A3A',
            },
        },
        appLogo: {
            color         : '#ffffff',
            '& .logo-icon': {
                color   : '#78c4c2',
                '& path': {
                    fill: '#78c4c2',
                },
            },
            '& .app-title': {
                fontSize                        : 14,
                [baseTheme.breakpoints.up('sm')]: {
                    fontSize: 14,
                },
            },
        },
        menuItem: {
            color                 : 'rgba(255,255,255,0.6)',
            '& .menu-item-wrapper': {
                '& .icon': {
                    color: 'rgba(255, 255, 255, 0.2)',
                },
            },
            '&.Mui-selected': {
                '& .menu-item-wrapper': {
                    background: '#2C2E30',
                    color     : '#ffffff',
                    '& .icon' : {
                        color: '#ffffff',
                    },
                },
            },
            '& .MuiListItemText-primary': {
                fontSize: 14,
            },
        },
        divider: {
            backgroundColor: '#ffffff',
            opacity        : 0.3,
        },
    };
};
