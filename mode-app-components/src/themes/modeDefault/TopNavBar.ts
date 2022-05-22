/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
    Palette,
} from '@material-ui/core/styles/createPalette';
import {
    Theme,
} from '@material-ui/core';


export const getModeDefaultTopNavBarStyle = (baseTheme: Theme, palette: Palette) => {
    return {
        root: {
            background: '#007584',
        },
    };
};
