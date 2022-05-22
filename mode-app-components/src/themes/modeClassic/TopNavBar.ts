/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
    Palette,
} from '@material-ui/core/styles/createPalette';
import {
    Theme,
} from '@material-ui/core';

export const getModeClassicTopNavBarStyle = (baseTheme: Theme, palette: Palette) => {
    return {
        root: {
            background: '#ffffff',
            color     : palette.text.primary,
        },
        toolBar: {
            borderBottom: '1px solid #E6E7E9',
        },
        profileMenuRole: {
            color: palette.secondary.light,
        },
    };
};
