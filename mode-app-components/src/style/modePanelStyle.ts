import {
    makeStyles, Theme,
} from '@material-ui/core';


/**
 * Style for generic Panel.
 */
export const useModePanelStyle = makeStyles((theme: Theme) => {
    return {

        root: {
            position     : 'relative',
            display      : 'flex',
            flexDirection: 'column',

            '&.match-height': {
                height: '100%',

                '& $panelContent': {
                    height: '100%',
                },
            },

            /**
             * Panels that are displayed on the side panel will usually have 'transparent' style to make them look better. However, we will
             * only apply these style if the panel is not in editing mode
             */
            '&.transparent': {
                '&:not(.editing)': {
                    boxShadow : 'none',
                    border    : 'none',
                    background: 'none',

                    '& > $panelHeader': {
                        paddingLeft      : 0,
                        paddingRight     : 0,
                        borderBottomWidth: 3,
                        borderBottomColor: theme.palette.divider,
                    },
                    '& > $panelContent': {
                        paddingLeft : 0,
                        paddingRight: 0,
                        background  : 'none',
                    },
                },
            },

            '&.show-custom-action-on-hover': {
                '& > $panelHeader': {
                    '& $panelHeaderCustomPrimaryAction': {
                        visibility: 'hidden',
                    },

                    '& $panelHeaderCustomActionToggler': {
                        visibility: 'hidden',
                    },
                },
            },
            '&.show-custom-action-on-hover:hover': {
                '& > $panelHeader': {
                    '& $panelHeaderCustomPrimaryAction': {
                        visibility: 'visible',
                    },

                    '& $panelHeaderCustomActionToggler': {
                        visibility: 'visible',
                    },
                },
            },
        },

        panelHeader: {
            display                     : 'flex',
            alignItems                  : 'center',
            justifyContent              : 'flex-end',
            padding                     : theme.spacing(0.5),
            borderBottom                : `1px solid ${theme.palette.divider}`,
            overflow                    : 'hidden',
            flexShrink                  : 0,
            [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(1),
            },
            flexDirection : 'row',
            flexWrap      : 'wrap',
            '&.borderless': {
                borderBottom: 'none',
            },
        },

        panelHeaderLeft: {
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'flex-start',
            flex          : 1,
            width         : '100%',
            flexWrap      : 'wrap',
        },

        panelHeaderRight: {
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'flex-end',
            flexWrap      : 'wrap',
            '& > *'       : {
                marginLeft                  : theme.spacing(1),
                [theme.breakpoints.up('sm')]: {
                    marginLeft: theme.spacing(1.5),
                },
            },
        },

        panelHeaderIconContainer: {
            width         : 25,
            height        : 25,
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
            borderRadius  : '50%',
            flexShrink    : 0,
            marginRight   : theme.spacing(1),

            [theme.breakpoints.up('sm')]: {
                width      : 30,
                height     : 30,
                marginRight: theme.spacing(1.5),
            },
        },

        panelHeaderIcon: {
            fontSize                    : 25,
            width                       : 25,
            height                      : 25,
            color                       : theme.palette.primary.main,
            [theme.breakpoints.up('sm')]: {
                fontSize: 30,
                width   : 30,
                height  : 30,
            },
        },

        panelHeaderTitle: {
            fontSize  : 16,
            color     : theme.palette.text.primary,
            fontWeight: 500,
            flex      : 1,

            '& .title': {
            },

            '& .subtitle': {
                color   : theme.palette.text.secondary,
                fontSize: 'smaller',
            },
        },

        panelHeaderCustomPrimaryAction: {
            visibility: 'visible',
        },

        panelHeaderCustomActionToggler: {
            visibility: 'visible',
        },

        panelContent: {
            padding                     : theme.spacing(1.5),
            [theme.breakpoints.up('sm')]: {
                padding: theme.spacing(2),
            },
        },

    };
}, {
    name: 'ModePanel',
});
