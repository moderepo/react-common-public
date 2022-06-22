/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import {
    Theme,
} from '@material-ui/core';
import {
    Palette,
} from '@material-ui/core/styles/createPalette';


export const getModeDefaultDrawerMenuStyle = (baseTheme: Theme, palette: Palette) => {
    return {
        root: {
            width: 250,
        },
        drawerPaper: {
            color      : '#ffffff',
            width      : 250,
            '&::before': {
                background: 'rgba(0, 0, 0, 0.8)',
            },
        },
        appLogo: {
            color: '#ffffff',
        },
        menuItem: {
            color                 : '#ffffff',
            '& .menu-item-wrapper': {
                '& .icon': {
                    color: '#ffffff',
                },
            },
            '&.Mui-selected': {
                '& .menu-item-wrapper': {
                    background: '#00acc1',
                    color     : '#ffffff',
                },
            },
        },
        divider: {
            backgroundColor: '#ffffff',
            opacity        : 0.3,
        },
    };
};
