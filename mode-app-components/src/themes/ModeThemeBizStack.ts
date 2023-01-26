import deepmerge from 'deepmerge';
import createTypography, {
    Typography,
} from '@material-ui/core/styles/createTypography';
import {
    darken,
    lighten,
} from '@material-ui/core';
import {
    createModePalette,
    createModeTheme, modeThemeBase,
} from './ModeThemeBase';
import {
    modeThemeDefault,
} from './ModeThemeDefault';


const FONTS_URL_BASE = 'https://assets.tinkermode.com/fonts/';

const proximaNova300 = {
    fontFamily: 'ProximaNova',
    fontStyle : 'normal',
    fontWeight: 300,
    src       : `
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_0_0.eot"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_0_0.eot?#iefix") format("embedded-opentype"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_0_0.woff2") format("woff2"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_0_0.woff") format("woff"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_0_0.ttf") format("truetype")
  `,
};

const proximaNovaItalic300 = {
    fontFamily: 'ProximaNova',
    fontStyle : 'italic',
    fontWeight: 300,
    src       : `
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_1_0.eot"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_1_0.eot?#iefix") format("embedded-opentype"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_1_0.woff2") format("woff2"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_1_0.woff") format("woff"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_1_0.ttf") format("truetype")
  `,
};

const proximaNova400 = {
    fontFamily: 'ProximaNova',
    fontStyle : 'normal',
    fontWeight: 400,
    src       : `
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_2_0.eot"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_2_0.eot?#iefix") format("embedded-opentype"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_2_0.woff2") format("woff2"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_2_0.woff") format("woff"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_2_0.ttf") format("truetype")
  `,
};

const proximaNovaItalic400 = {
    fontFamily: 'ProximaNova',
    fontStyle : 'italic',
    fontWeight: 300,
    src       : `
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_3_0.eot"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_3_0.eot?#iefix") format("embedded-opentype"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_3_0.woff2") format("woff2"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_3_0.woff") format("woff"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_3_0.ttf") format("truetype")
  `,
};

const proximaNova600 = {
    fontFamily: 'ProximaNova',
    fontStyle : 'normal',
    fontWeight: 600,
    src       : `
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_4_0.eot"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_4_0.eot?#iefix") format("embedded-opentype"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_4_0.woff2") format("woff2"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_4_0.woff") format("woff"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_4_0.ttf") format("truetype")
  `,
};

const proximaNovaItalic600 = {
    fontFamily: 'ProximaNova',
    fontStyle : 'italic',
    fontWeight: 600,
    src       : `
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_5_0.eot"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_5_0.eot?#iefix") format("embedded-opentype"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_5_0.woff2") format("woff2"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_5_0.woff") format("woff"),
    url("${FONTS_URL_BASE}proxima_nova/32CCDB_5_0.ttf") format("truetype")
  `,
};

/**
 * The typography of MODE BizStack themes
 */
const typography: Typography = createTypography(modeThemeDefault.palette, {
    fontFamily: [
        'ProximaNova',
        'Helvetica Neue',
        'Helvetica',
        'Arial',
        'sans-serif',
    ].join(','),
    fontWeightLight  : 300,
    fontWeightRegular: 400,
    fontWeightMedium : 400,
    fontWeightBold   : 600,
    h1               : {
        fontWeight: 600,
    },
    h2: {
        fontWeight: 600,
    },
    h3: {
        fontWeight: 600,
    },
    h4: {
        fontWeight: 600,
    },
    h5: {
        fontWeight: 600,
    },
    h6: {
        fontWeight: 600,
    },
    body1: {
        fontSize: '1rem',
    },
    body2: {
        fontSize: '0.9rem',
    },
    caption: {
        fontSize: '0.9rem',
    },
    overline: {
        fontSize: '0.9rem',
    },
    button: {
        fontWeight: 600,
    },
    fontSize: 14,
});

/**
 * The base theme of MODE BizStack theme
 */
const modeThemeBizStackBase = createModeTheme(deepmerge(modeThemeBase, {
    spacing: 8,
}));

/**
 * The "default" of MODE BizStack theme
 */
const modeThemeBizStack = createModeTheme(deepmerge(modeThemeBizStackBase, {
    typography,
    shape: {
        borderRadius: 0,
    },
    props: {
        MuiCheckbox: {
            color: 'primary',
        },
        MuiRadio: {
            color: 'primary',
        },
        MuiSwitch: {
            color: 'primary',
        },
        MuiLink: {
            color: 'primary',
        },
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [
                    proximaNova300,
                    proximaNovaItalic300,
                    proximaNova400,
                    proximaNovaItalic400,
                    proximaNova600,
                    proximaNovaItalic600,
                ],
            },
        },
        MuiFormLabel: {
            root: {
                '&.Mui-focused': {
                    color: 'unset',
                },
            },
        },
        MuiBackdrop: {
            root: {
                backgroundColor: 'rgba(0,0,0,0.2)',
            },
        },
        MuiListItemIcon: {
            root: {
                marginRight: modeThemeBizStackBase.spacing(1),
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
            panelHeaderIconContainer: {
                width                                       : '2.0rem',
                height                                      : '2.0rem',
                marginRight                                 : modeThemeBizStackBase.spacing(1),
                [modeThemeBizStackBase.breakpoints.up('sm')]: {
                    width      : '2.0rem',
                    height     : '2.0rem',
                    marginRight: modeThemeBizStackBase.spacing(1),
                },
            },
            panelHeaderIcon: {
                fontSize                            : '1.2rem',
                width                               : '1.2rem',
                height                              : '1.2rem',
                [modeThemeBase.breakpoints.up('sm')]: {
                    fontSize: '1.2rem',
                    width   : '1.2rem',
                    height  : '1.2rem',
                },
            },
            panelHeaderTitle: {
                fontWeight: modeThemeBizStackBase.typography.fontWeightBold,
            },
        },
        DrawerMenu: {
            menuItem: {
                padding               : modeThemeBizStackBase.spacing(0, 2),
                '& .menu-item-wrapper': {
                    padding  : modeThemeBizStackBase.spacing(0.5, 1),
                    minHeight: 60,
                    '& .icon': {
                        marginRight: modeThemeBizStackBase.spacing(1.5),
                        fontSize   : '1.2rem',
                        width      : '1.2rem',
                        height     : '1.2rem',
                    },
                },
            },
            subMenuItem: {
                '& .menu-item-wrapper': {
                    minHeight: 45,
                },
            },
        },
    },
}));

/**
 * The color palette for the ModeLightTheme
 */
const lightPalette = createModePalette({
    background: {
        default: '#f5f5f5',
        paper  : '#fefefe',
    },
    primary: {
        light: '#52fdde',
        main : '#2EFFD9',
        dark : '#6DB6B9', // 1 level darker MODE Blue
    },
    secondary: {
        light: '#E6E7E8', // MODE Light Gray
        main : '#dd00ff', // As of now, this color is used in destructive action. Red will be suitable.
        dark : '#727477', // MODE Dark Gray
    },
    text: {
        primary  : '#2C2E30', // MODE Black
        secondary: '#4e5053',
        disabled : '#53565A', // 1 level lighter MODE Black
    },
    error: {
        main        : '#de0082',
        light       : '#fc19e2',
        dark        : '#b9026d',
        contrastText: '#ffffff',
    },
    warning: {
        main        : '#F2BB06',
        light       : '#f9cb34',
        dark        : '#F2BB06',
        contrastText: '#000000',
    },
    info: {
        main        : '#00ddff',
        dark        : '#00A9ED',
        contrastText: '#000000',
    },
    success: {
        main        : '#24d3bd',
        light       : '#24e1c9',
        dark        : '#1dbda9',
        contrastText: '#000000',
    },
    divider: 'rgba(0,0,0,0.1)',
    action : {
        hoverOpacity: 0.4,
    },
    contrastThreshold: 5,
    chart            : {
        series: [
            {
                color: '#13D3BD',
            }, {
                color: '#F6AA00',
            }, {
                color: '#FF96E1',
            }, {
                color       : '#FFF100',
                contrastText: '#000000',
            }, {
                color: '#008D62',
            }, {
                color: '#4DC4FF',
            }, {
                color: '#84919E',
            }, {
                color: '#FF4B00',
            }, {
                color: '#005AFF',
            }, {
                color: '#000000',
            }, {
                color: '#71E4D7',
            }, {
                color: '#F9CC66',
            }, {
                color: '#FFC0ED',
            }, {
                color: '#FF9366',
            }, {
                color: '#66BAA0',
            }, {
                color: '#94DBDD',
            }, {
                color: '#B5BDC4',
            }, {
                color: '#C166C1',
            }, {
                color: '#669CFF',
            }, {
                color: '#666666',
            },
        ],
    },
});

/**
 * ModeLightTheme by extending the base MODE BizStack theme
 */
export const modeThemeLight = createModeTheme(deepmerge(modeThemeBizStack, {
    palette: lightPalette,
    props  : {
        MuiLink: {
            color: lightPalette.primary.dark,
        },
    },
    overrides: {
        MuiListItemIcon: {
            root: {
                color: lightPalette.text.secondary,
            },
        },
        MuiButton: {
            textPrimary: {
                color: lightPalette.primary.dark,
            },
            contained: {
                color          : lightPalette.text.primary,
                backgroundColor: lightPalette.background.paper,
                '&:hover'      : {
                    backgroundColor       : darken(lightPalette.background.paper, 0.05),
                    // Reset on touch devices, it doesn't add specificity
                    '@media (hover: none)': {
                        backgroundColor: lightPalette.background.paper,
                    },
                },
            },
        },
        MuiTab: {
            textColorPrimary: {
                '&.Mui-selected': {
                    color: lightPalette.text.primary,
                },
            },
        },
        ModePanel: {
            panelHeaderIcon: {
                color: lightPalette.text.secondary,
            },
        },
        TopNavBar: {
            root: {
                background: lightPalette.background.paper,
                color     : lightPalette.text.primary,
            },
        },
        PageInfoBarContainer: {
            infoItem: {
                '&:last-child': {
                    '& $infoItemIcon': {
                        color: lightPalette.primary.dark,
                    },
                    '& $infoItemName': {
                        color: lightPalette.primary.dark,
                    },
                    '& $infoItemId': {
                        color: lightPalette.primary.dark,
                    },
                },
            },
        },
        DrawerMenu: {
            drawerPaper: {
                backgroundImage: 'none !important',
                '&::before'    : {
                    background: lightPalette.background.paper,
                },
            },
            menuItem: {
                color           : lightPalette.text.primary,
                '&.Mui-selected': {
                    background: lightPalette.primary.main,
                    color     : lightPalette.primary.contrastText,
                },
            },
        },
    },
}));

/**
 * The color palette for the ModeDarkTheme
 */
const darkPalette = createModePalette({
    background: {
        default: '#1C1E20',
        paper  : '#2C2E30',
    },
    primary: {
        light: '#52fdde',
        main : '#2EFFD9',
        dark : '#6DB6B9', // 1 level darker MODE Blue
    },
    secondary: {
        light: '#ff159e',
        main : '#de0082',
        dark : '#b7006b', // 1 level darker MODE Blue
    },
    text: {
        primary  : '#DFDFDF',
        secondary: '#E6E7E9',
        disabled : '#979797',
    },
    error: {
        main        : '#de0082',
        contrastText: '#000000',
    },
    warning: {
        main        : '#f9cb34',
        contrastText: '#000000',
    },
    info: {
        main        : '#00ddff',
        contrastText: '#000000',
    },
    success: {
        main        : '#24d3bd',
        contrastText: '#000000',
    },
    divider: '#53565A',
    action : {
        hover       : '#727477',
        hoverOpacity: 0.4,
    },
    contrastThreshold: 5,
    chart            : {
        series: [
            {
                color: '#13D3BD',
            }, {
                color: '#F6AA00',
            }, {
                color: '#FF96E1',
            }, {
                color       : '#FFF100',
                contrastText: '#000000',
            }, {
                color: '#008D62',
            }, {
                color: '#4DC4FF',
            }, {
                color: '#84919E',
            }, {
                color: '#FF4B00',
            }, {
                color: '#005AFF',
            }, {
                color       : '#FFFFFF',
                contrastText: '#000000',
            }, {
                color: '#71E4D7',
            }, {
                color: '#F9CC66',
            }, {
                color: '#FFC0ED',
            }, {
                color: '#FF9366',
            }, {
                color: '#66BAA0',
            }, {
                color: '#94DBFF',
            }, {
                color: '#B2B2B2',
            }, {
                color: '#C166C1',
            }, {
                color: '#669CFF',
            }, {
                color: '#E5E5E5',
            },
        ],
        gridStroke  : '#444444',
        cursorStroke: '#ffffff',
    },
});

/**
 * ModeDarkTheme by extending the base Mode BizStack theme
 */
export const modeThemeDark = createModeTheme(deepmerge(modeThemeBizStack, {
    palette    : darkPalette,
    mapTilesURL: 'https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/256/{z}/{x}/{y}.png',
    overrides  : {
        MuiCssBaseline: {
            '@global': {
                '*::-webkit-scrollbar': {
                    width: '1em',
                },
                
                '*::-webkit-scrollbar-track': {
                    backgroundColor: darkPalette.background.paper,
                    outline        : `1px solid ${darkPalette.divider}`,
                },
                   
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: lighten(darkPalette.background.paper, 0.2),
                    outline        : `1px solid ${darkPalette.divider}`,
                },

                '*::-webkit-scrollbar-corner': {
                    backgroundColor: darkPalette.background.paper,
                    outline        : `1px solid ${darkPalette.divider}`,
                },

                '*::-webkit-resizer': {
                    // eslint-disable-next-line max-len
                    backgroundImage: 'url(data:image/png;base64,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)',
                    backgroundSize : 'contain',
                },
            },
        },
        MuiListItemIcon: {
            root: {
                color: darkPalette.text.secondary,
            },
        },
        MuiButton: {
            root: {
                '&.Mui-disabled': {
                    color: '#666666',
                },
            },
            contained: {
                color          : darkPalette.text.primary,
                backgroundColor: darkPalette.background.paper,
                '&:hover'      : {
                    backgroundColor       : lighten(darkPalette.background.paper, 0.05),
                    // Reset on touch devices, it doesn't add specificity
                    '@media (hover: none)': {
                        backgroundColor: darkPalette.background.paper,
                    },
                },
                '&.Mui-disabled': {
                    color: '#666666',
                },
            },
            containedPrimary: {
                '&:hover': {
                    backgroundColor: darkPalette.primary.dark,
                },
            },
            containedSecondary: {
                '&:hover': {
                    backgroundColor: darkPalette.secondary.dark,
                },
            },
        },
        MuiIconButton: {
            root: {
                color           : darkPalette.text.primary,
                '&.Mui-disabled': {
                    color: '#666666',
                },
            },
        },
        MuiTab: {
            textColorPrimary: {
                '&.Mui-selected': {
                    color: darkPalette.text.primary,
                },
            },
            root: {
                background: 'transparent',
            },
        },
        MuiInput: {
            underline: {
                '&:before': {
                    borderBottomColor: darkPalette.divider,
                },
            },
        },
        MuiSelect: {
            icon: {
                color           : darkPalette.text.primary,
                '&.Mui-disabled': {
                    color  : darkPalette.text.primary,
                    opacity: 0.7,
                },
            },
        },
        MuiOutlinedInput: {
            notchedOutline: {
                borderColor: darkPalette.divider,
            },
        },
        ModePanel: {
            panelHeader: {
                borderBottomColor: darkPalette.divider,
            },
            panelHeaderIcon: {
                color: darkPalette.text.secondary,
            },
        },
        ModeTable: {
            tableHeaderRow: {
                background: '#353535',
            },
            tableBodyRow: {
                borderTopColor: darkPalette.divider,
            },
        },
        TopNavBar: {
            root: {
                background: darkPalette.background.paper,
                color     : darkPalette.text.primary,
            },
        },
        SubNavBar: {
            root: {
                background: '#232528',
            },
        },
        PageInfoBarContainer: {
            infoItem: {
                '&:last-child': {
                    '& $infoItemIcon': {
                        color: darkPalette.primary,
                    },
                    '& $infoItemName': {
                        color: darkPalette.primary,
                    },
                    '& $infoItemId': {
                        color: darkPalette.primary,
                    },
                },
            },
        },
        Pagination: {
            root: {
                borderTopColor: darkPalette.divider,
            },
        },
        DrawerMenu: {
            drawerPaper: {
                backgroundImage: 'none !important',
                '&::before'    : {
                    background: darkPalette.background.paper,
                },
            },
            menuItem: {
                color           : darkPalette.text.primary,
                '&.Mui-selected': {
                    background: darkPalette.primary.main,
                    color     : darkPalette.primary.contrastText,
                    '&:hover' : {
                        background: darkPalette.primary.main,
                        color     : darkPalette.primary.contrastText,
                    },
                },
            },
        },
        GenericPage: {
            pageContent: {
                '&.editing-form': {
                    '& .editing': {
                        boxShadow: '0px 0px 20px 10px rgb(46 255 217 / 52%)',
                    },
                },
            },
        },
        MuiPickersCalendarHeader: {
            dayLabel: {
                color: darkPalette.text.primary,
            },
        },
    },
}));
